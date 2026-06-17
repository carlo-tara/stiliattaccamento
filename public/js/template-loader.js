// template-loader.js
// Carica e inserisce template HTML comuni (header, topbar, footer, etc.)

const TEMPLATE_BASE = 'templates/';

/**
 * Calcola il percorso base relativo per i template
 */
function getBasePath() {
  const path = window.location.pathname;
  const segments = path.split('/').filter(s => s);
  
  // Rimuovi il nome del file HTML
  if (segments.length > 0 && segments[segments.length - 1].endsWith('.html')) {
    segments.pop();
  }
  
  // Se siamo nella root (nessun segmento) o in public/ (directory di base del sito), ritorna "./"
  // VS Code Live Preview serve da public/, quindi "public" non conta come livello di profondità
  if (segments.length === 0 || (segments.length === 1 && segments[0] === 'public')) {
    return './';
  }
  
  // Rimuovi "public" se presente (è la directory base, non un livello)
  const filteredSegments = segments.filter(s => s !== 'public');
  
  // Se dopo il filtro non ci sono segmenti, siamo nella root
  if (filteredSegments.length === 0) {
    return './';
  }
  
  // Altrimenti ritorna "../" per ogni livello di profondità
  return '../'.repeat(filteredSegments.length);
}

/**
 * Calcola la profondità della pagina corrente
 */
function calculateDepth() {
  const path = window.location.pathname;
  const segments = path.split('/').filter(s => s && !s.endsWith('.html'));
  // Rimuovi "public" se presente (è la directory base, non un livello)
  const filteredSegments = segments.filter(s => s !== 'public');
  return filteredSegments.length;
}

/**
 * Corregge i percorsi relativi nei link del template in base alla profondità
 */
function adjustTemplatePaths(element, currentDepth) {
  // Se siamo in una sottodirectory, aggiusta i link
  if (currentDepth > 0) {
    const links = element.querySelectorAll('a[href]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      // Solo per link che non iniziano con http/https/# e non sono già relativi
      if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('../') && !href.startsWith('/')) {
        link.setAttribute('href', '../' + href);
      }
    });
    
    // Aggiusta anche il logo se presente
    const logo = element.querySelector('.logo a[href]');
    if (logo) {
      const logoHref = logo.getAttribute('href');
      if (logoHref && !logoHref.startsWith('../')) {
        logo.setAttribute('href', '../' + logoHref);
      }
    }
  }
}

/**
 * Carica e inserisce un template
 */
async function loadTemplate(elementId, templateName) {
  const basePath = getBasePath();
  const templatePath = `${basePath}${TEMPLATE_BASE}${templateName}`;
  const element = document.getElementById(elementId);

  if (!element) {
    console.warn(`Element #${elementId} not found`);
    return;
  }

  const placeholderClass = templateName.replace('.html', '');
  element.classList.add('template-placeholder', `template-placeholder--${placeholderClass}`);
  element.setAttribute('aria-busy', 'true');

  try {
    const response = await fetch(templatePath);
    
    if (!response.ok) {
      throw new Error(`Failed to load ${templateName}: ${response.status}`);
    }
    
    const html = await response.text();
    // Crea un elemento temporaneo per parsare l'HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html.trim();
    
    // Per header e footer, cerca l'elemento specifico invece di firstElementChild
    // (per evitare problemi con script iniettati da VS Code Live Preview)
    let templateContent;
    if (templateName === 'header.html') {
      templateContent = tempDiv.querySelector('header');
    } else if (templateName === 'footer.html') {
      templateContent = tempDiv.querySelector('footer');
    } else {
      templateContent = tempDiv.firstElementChild;
    }
    
    if (!templateContent) {
      console.error(`Failed to parse template ${templateName}: no element found`);
      return;
    }
    
    if (!element.parentNode) {
      console.warn(`Element #${elementId} has no parent node`);
      return;
    }
    
    // Aggiusta i percorsi relativi PRIMA di inserire nel DOM
    const currentDepth = calculateDepth();
    adjustTemplatePaths(templateContent, currentDepth);
    
    // Sostituisci l'elemento placeholder con il contenuto del template
    element.parentNode.replaceChild(templateContent, element);
    
    // Inizializza contenuti dinamici dopo il caricamento
    initializeDynamicContent(templateName, templateContent);
    
  } catch (error) {
    console.error(`Error loading template ${templateName}:`, error);
    const failedElement = document.getElementById(elementId);
    if (failedElement) {
      failedElement.classList.remove('template-placeholder', `template-placeholder--${placeholderClass}`);
      failedElement.removeAttribute('aria-busy');
      failedElement.innerHTML =
        `<p class="template-error" role="alert">Contenuto temporaneamente non disponibile.</p>`;
    }
  }
}

/**
 * Inizializza contenuti dinamici dopo il caricamento dei template
 */
function initializeDynamicContent(templateName, templateElement) {
  // Se abbiamo caricato la topbar, genera i breadcrumb
  if (templateName === 'topbar.html' && typeof generateBreadcrumb === 'function') {
    // Aspetta un frame per assicurarsi che il DOM sia aggiornato
    setTimeout(() => {
      generateBreadcrumb();
    }, 0);
  }
  
  // Re-inizializza menu mobile se necessario (dopo che header è caricato)
  if (templateName === 'header.html') {
    if (typeof initializeSubmenus === 'function') {
      setTimeout(() => {
        initializeSubmenus();
      }, 0);
    }
    if (typeof highlightCurrentNav === 'function') {
      setTimeout(() => {
        highlightCurrentNav(templateElement);
        if (typeof highlightJourneyNav === 'function') {
          highlightJourneyNav(templateElement);
        }
      }, 0);
    }
    loadJourneyBannerIfNeeded();
  }
}

/**
 * Carica moduli journey e mostra banner se profilo salvato
 */
async function loadJourneyBannerIfNeeded() {
  const skipBannerPages = ['test.html', 'il-tuo-percorso.html', 'da-dove-inizi.html'];
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (skipBannerPages.includes(currentPage)) {
    return;
  }

  if (window.__journeyBannerInit) {
    if (typeof initJourneyBanner === 'function') {
      initJourneyBanner();
    }
    return;
  }

  const basePath = getBasePath();

  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      if (document.querySelector(`script[src*="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = `${basePath}js/${src}`;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });

  try {
    if (typeof sanitizeHTML !== 'function') {
      await loadScript('utils.js');
    }
    await loadScript('modules/journey-config.js');
    await loadScript('modules/journey-hub.js');
    window.__journeyBannerInit = true;
    if (typeof initJourneyBanner === 'function') {
      initJourneyBanner();
    }
  } catch (err) {
    if (window.DEBUG_MODE) {
      console.warn('Journey banner non caricato:', err);
    }
  }
}

/**
 * Carica tutti i template comuni
 */
async function loadAllTemplates() {
  const templates = [
    { id: 'header-placeholder', file: 'header.html' },
    { id: 'topbar-placeholder', file: 'topbar.html' },
    { id: 'footer-placeholder', file: 'footer.html' }
  ];
  
  // Carica tutti i template in parallelo
  await Promise.all(
    templates
      .filter(t => document.getElementById(t.id))
      .map(t => loadTemplate(t.id, t.file))
  );
}

// Carica i template quando i placeholder sono nel DOM
function scheduleTemplateLoad() {
  const hasPlaceholders = ['header-placeholder', 'topbar-placeholder', 'footer-placeholder'].some(
    (id) => document.getElementById(id)
  );

  if (hasPlaceholders) {
    loadAllTemplates();
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllTemplates);
  } else {
    loadAllTemplates();
  }
}

if (typeof window !== 'undefined') {
  window.getBasePath = getBasePath;
  window.calculateDepth = calculateDepth;
}

scheduleTemplateLoad();
