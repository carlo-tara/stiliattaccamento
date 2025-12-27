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
  
  // Se siamo nella root, ritorna "./"
  if (segments.length === 0) {
    return './';
  }
  
  // Altrimenti ritorna "../" per ogni livello di profondità
  return '../'.repeat(segments.length);
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
  }
}

/**
 * Carica e inserisce un template
 */
async function loadTemplate(elementId, templateName) {
  const basePath = getBasePath();
  const templatePath = `${basePath}${TEMPLATE_BASE}${templateName}`;
  
  try {
    const response = await fetch(templatePath);
    
    if (!response.ok) {
      throw new Error(`Failed to load ${templateName}: ${response.status}`);
    }
    
    const html = await response.text();
    const element = document.getElementById(elementId);
    
    if (!element) {
      console.warn(`Element #${elementId} not found`);
      return;
    }
    
    // Crea un elemento temporaneo per parsare l'HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const templateContent = tempDiv.firstElementChild;
    
    // Sostituisci l'elemento placeholder con il contenuto del template
    element.parentNode.replaceChild(templateContent, element);
    
    // Aggiusta i percorsi relativi se necessario
    const currentDepth = getCurrentDepth ? getCurrentDepth() : 0;
    adjustTemplatePaths(templateContent, currentDepth);
    
    // Inizializza contenuti dinamici dopo il caricamento
    initializeDynamicContent(templateName, templateContent);
    
  } catch (error) {
    console.error(`Error loading template ${templateName}:`, error);
    // Fallback: mostra un messaggio di errore se necessario
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = `<!-- Error loading ${templateName} -->`;
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
  if (templateName === 'header.html' && typeof toggleMobileMenu !== 'undefined') {
    // Il menu mobile dovrebbe essere già inizializzato da mobile-menu.js
    // Ma possiamo aggiungere qui eventuali inizializzazioni aggiuntive
  }
}

/**
 * Calcola la profondità della pagina corrente (helper per template-loader)
 */
function getCurrentDepth() {
  const path = window.location.pathname;
  const segments = path.split('/').filter(s => s && !s.endsWith('.html'));
  return segments.length;
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

// Carica i template
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAllTemplates);
} else {
  loadAllTemplates();
}

