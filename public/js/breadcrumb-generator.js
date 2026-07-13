// breadcrumb-generator.js
// Genera dinamicamente i breadcrumb basati sull'URL della pagina

const SITE_URL = 'https://stiliattaccamento.com';

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Mappatura delle pagine per i breadcrumb
 * Definisce titoli e percorsi per le pagine principali
 */
const BREADCRUMB_MAP = {
  // Root pages
  'index.html': { title: 'Home', path: 'index.html' },
  'fondamenti.html': { title: 'Fondamenti', path: 'fondamenti.html' },
  'modello-gradienti.html': { title: 'Modello a gradienti', path: 'modello-gradienti.html' },
  'archetipi.html': { title: 'Archetipi', path: 'archetipi.html' },
  'stili-base.html': { title: 'I 4 stili base', path: 'stili-base.html' },
  'test.html': { title: 'Test', path: 'test.html' },
  'da-dove-inizi.html': { title: 'Da dove inizi', path: 'da-dove-inizi.html' },
  'il-tuo-percorso.html': { title: 'Il tuo percorso', path: 'il-tuo-percorso.html' },
  'mappa-personale.html': { title: 'Mappa personale', path: 'mappa-personale.html' },
  'approfondimenti.html': { title: 'Approfondimenti', path: 'approfondimenti.html' },
  'libri.html': { title: 'Libri', path: 'libri.html' },
  'storie-reali.html': { title: 'Storie reali', path: 'storie-reali.html' },
  'dinamiche-coppia.html': { title: 'Dinamiche di coppia', path: 'dinamiche-coppia.html' },
  'come-supportare-partner.html': { title: 'Come supportare il partner', path: 'come-supportare-partner.html' },
  'quando-cercare-aiuto.html': { title: 'Quando cercare aiuto', path: 'quando-cercare-aiuto.html' },
  'risorse.html': { title: 'Risorse', path: 'risorse.html' },
  'mazzo-tarocchi.html': { title: 'Mazzo dei tarocchi', path: 'mazzo-tarocchi.html', parent: { title: 'Archetipi', path: 'archetipi.html' } },
  
  // Sottocategorie Approfondimenti
  'approfondimenti/sessualita.html': { 
    title: 'Sessualità', 
    path: 'approfondimenti/sessualita.html',
    parent: { title: 'Approfondimenti', path: 'approfondimenti.html' }
  },
  'approfondimenti/finanze.html': { 
    title: 'Denaro ed economia personale', 
    path: 'approfondimenti/finanze.html',
    parent: { title: 'Approfondimenti', path: 'approfondimenti.html' }
  },
  'approfondimenti/lavoro.html': { 
    title: 'Lavoro', 
    path: 'approfondimenti/lavoro.html',
    parent: { title: 'Approfondimenti', path: 'approfondimenti.html' }
  },
  'approfondimenti/genitorialita.html': { 
    title: 'Genitorialità', 
    path: 'approfondimenti/genitorialita.html',
    parent: { title: 'Approfondimenti', path: 'approfondimenti.html' }
  },
  'approfondimenti/famiglia.html': { 
    title: 'Famiglia', 
    path: 'approfondimenti/famiglia.html',
    parent: { title: 'Approfondimenti', path: 'approfondimenti.html' }
  },
  'approfondimenti/amicizie.html': { 
    title: 'Amicizie', 
    path: 'approfondimenti/amicizie.html',
    parent: { title: 'Approfondimenti', path: 'approfondimenti.html' }
  },
  'approfondimenti/crescita.html': { 
    title: 'Crescita personale', 
    path: 'approfondimenti/crescita.html',
    parent: { title: 'Approfondimenti', path: 'approfondimenti.html' }
  },
  'approfondimenti/lutto.html': { 
    title: 'Lutto', 
    path: 'approfondimenti/lutto.html',
    parent: { title: 'Approfondimenti', path: 'approfondimenti.html' }
  },
  'approfondimenti/separazione.html': { 
    title: 'Separazione', 
    path: 'approfondimenti/separazione.html',
    parent: { title: 'Approfondimenti', path: 'approfondimenti.html' }
  },
  'approfondimenti/tradimento.html': { 
    title: 'Tradimento', 
    path: 'approfondimenti/tradimento.html',
    parent: { title: 'Approfondimenti', path: 'approfondimenti.html' }
  },
  'approfondimenti/focusing.html': { 
    title: 'Focusing', 
    path: 'approfondimenti/focusing.html',
    parent: { title: 'Approfondimenti', path: 'approfondimenti.html' }
  },
  
  // Profili
  'profili/ansioso-alto.html': { 
    title: 'Ansioso Alto', 
    path: 'profili/ansioso-alto.html',
    parent: { title: 'Ansioso', path: 'stili-base.html#ansioso' },
    grandParent: { title: '4 Stili Base', path: 'stili-base.html' }
  },
  'profili/ansioso-medio.html': { 
    title: 'Ansioso Medio', 
    path: 'profili/ansioso-medio.html',
    parent: { title: 'Ansioso', path: 'stili-base.html#ansioso' },
    grandParent: { title: '4 Stili Base', path: 'stili-base.html' }
  },
  'profili/ansioso-basso.html': { 
    title: 'Ansioso Basso', 
    path: 'profili/ansioso-basso.html',
    parent: { title: 'Ansioso', path: 'stili-base.html#ansioso' },
    grandParent: { title: '4 Stili Base', path: 'stili-base.html' }
  },
  'profili/evitante-alto.html': { 
    title: 'Evitante Alto', 
    path: 'profili/evitante-alto.html',
    parent: { title: 'Evitante', path: 'stili-base.html#evitante' },
    grandParent: { title: '4 Stili Base', path: 'stili-base.html' }
  },
  'profili/evitante-medio.html': { 
    title: 'Evitante Medio', 
    path: 'profili/evitante-medio.html',
    parent: { title: 'Evitante', path: 'stili-base.html#evitante' },
    grandParent: { title: '4 Stili Base', path: 'stili-base.html' }
  },
  'profili/evitante-basso.html': { 
    title: 'Evitante Basso', 
    path: 'profili/evitante-basso.html',
    parent: { title: 'Evitante', path: 'stili-base.html#evitante' },
    grandParent: { title: '4 Stili Base', path: 'stili-base.html' }
  },
  'profili/secure-alto.html': { 
    title: 'Secure Alto', 
    path: 'profili/secure-alto.html',
    parent: { title: 'Secure', path: 'stili-base.html#secure' },
    grandParent: { title: '4 Stili Base', path: 'stili-base.html' }
  },
  'profili/secure-medio.html': { 
    title: 'Secure Medio', 
    path: 'profili/secure-medio.html',
    parent: { title: 'Secure', path: 'stili-base.html#secure' },
    grandParent: { title: '4 Stili Base', path: 'stili-base.html' }
  },
  'profili/secure-basso.html': { 
    title: 'Secure Basso', 
    path: 'profili/secure-basso.html',
    parent: { title: 'Secure', path: 'stili-base.html#secure' },
    grandParent: { title: '4 Stili Base', path: 'stili-base.html' }
  },
  'profili/disorganizzato-alto.html': { 
    title: 'Oscillante Alto', 
    path: 'profili/disorganizzato-alto.html',
    parent: { title: 'Oscillante', path: 'stili-base.html#oscillante' },
    grandParent: { title: '4 Stili Base', path: 'stili-base.html' }
  },
  'profili/disorganizzato-medio.html': { 
    title: 'Oscillante Medio', 
    path: 'profili/disorganizzato-medio.html',
    parent: { title: 'Oscillante', path: 'stili-base.html#oscillante' },
    grandParent: { title: '4 Stili Base', path: 'stili-base.html' }
  },
  'profili/disorganizzato-basso.html': { 
    title: 'Oscillante Basso', 
    path: 'profili/disorganizzato-basso.html',
    parent: { title: 'Oscillante', path: 'stili-base.html#oscillante' },
    grandParent: { title: '4 Stili Base', path: 'stili-base.html' }
  },
  
  // Storie Reali
  'storie-reali/andrea.html': { 
    title: 'Andrea', 
    path: 'storie-reali/andrea.html',
    parent: { title: 'Storie Reali', path: 'storie-reali.html' }
  },
  'storie-reali/giulia.html': { 
    title: 'Giulia', 
    path: 'storie-reali/giulia.html',
    parent: { title: 'Storie Reali', path: 'storie-reali.html' }
  },
  'storie-reali/lorenzo.html': { 
    title: 'Lorenzo', 
    path: 'storie-reali/lorenzo.html',
    parent: { title: 'Storie Reali', path: 'storie-reali.html' }
  },
  'storie-reali/marco.html': { 
    title: 'Marco', 
    path: 'storie-reali/marco.html',
    parent: { title: 'Storie Reali', path: 'storie-reali.html' }
  },
  'storie-reali/nina.html': { 
    title: 'Nina', 
    path: 'storie-reali/nina.html',
    parent: { title: 'Storie Reali', path: 'storie-reali.html' }
  },
  
  // Libri
  'libri/attached.html': { 
    title: 'Attached', 
    path: 'libri/attached.html',
    parent: { title: 'Libri', path: 'libri.html' }
  },
  'libri/polysecure.html': { 
    title: 'Polysecure', 
    path: 'libri/polysecure.html',
    parent: { title: 'Libri', path: 'libri.html' }
  },
  'libri/secure-base.html': { 
    title: 'A Secure Base', 
    path: 'libri/secure-base.html',
    parent: { title: 'Libri', path: 'libri.html' }
  },
  'libri/the-body-keeps-the-score.html': { 
    title: 'The Body Keeps the Score', 
    path: 'libri/the-body-keeps-the-score.html',
    parent: { title: 'Libri', path: 'libri.html' }
  },
  'libri/the-body-remembers.html': { 
    title: 'The Body Remembers', 
    path: 'libri/the-body-remembers.html',
    parent: { title: 'Libri', path: 'libri.html' }
  },
  'libri/the-gifts-of-imperfection.html': { 
    title: 'The Gifts of Imperfection', 
    path: 'libri/the-gifts-of-imperfection.html',
    parent: { title: 'Libri', path: 'libri.html' }
  },
  'libri/hold-me-tight.html': { 
    title: 'Hold Me Tight', 
    path: 'libri/hold-me-tight.html',
    parent: { title: 'Libri', path: 'libri.html' }
  },
  'libri/emotional-intelligence.html': { 
    title: 'Emotional Intelligence', 
    path: 'libri/emotional-intelligence.html',
    parent: { title: 'Libri', path: 'libri.html' }
  },
  'libri/come-stai.html': { 
    title: 'Come stai', 
    path: 'libri/come-stai.html',
    parent: { title: 'Libri', path: 'libri.html' }
  },
  'libri/adult-attachment-interview.html': { 
    title: 'Adult Attachment Interview', 
    path: 'libri/adult-attachment-interview.html',
    parent: { title: 'Libri', path: 'libri.html' }
  },
};

const HOME_HREF = '/';

/**
 * Ottiene il percorso relativo corretto basato sulla profondità della pagina
 */
function getRelativePath(targetPath, currentDepth) {
  // Se la pagina corrente è nella root, usa percorsi relativi normali
  if (currentDepth === 0) {
    return targetPath;
  }
  
  // Altrimenti, aggiungi "../" per ogni livello di profondità
  const prefix = '../'.repeat(currentDepth);
  
  // Se il target inizia con "../", non aggiungere altro
  if (targetPath.startsWith('../')) {
    return targetPath;
  }
  
  return prefix + targetPath;
}

/**
 * Calcola la profondità della pagina corrente (0 = root, 1 = sottodirectory, etc.)
 */
function getCurrentDepth() {
  const path = window.location.pathname;
  const segments = path.split('/').filter(s => s && !s.endsWith('.html'));
  return segments.length;
}

/**
 * Inietta Schema.org BreadcrumbList per SEO
 */
function injectBreadcrumbSchema(pageInfo) {
  const schemaItems = [{ name: 'Home', path: 'index.html' }];

  if (pageInfo.grandParent) {
    schemaItems.push({ name: pageInfo.grandParent.title, path: pageInfo.grandParent.path });
  }
  if (pageInfo.parent) {
    schemaItems.push({ name: pageInfo.parent.title, path: pageInfo.parent.path });
  }
  schemaItems.push({ name: pageInfo.title, path: pageInfo.path });

  const itemListElement = schemaItems.map((item, index) => {
    const isLast = index === schemaItems.length - 1;
    const entry = {
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
    };
    if (!isLast) {
      const cleanPath = item.path.split('#')[0];
      entry.item = cleanPath === 'index.html'
        ? `${SITE_URL}/`
        : `${SITE_URL}/${cleanPath}`;
    }
    return entry;
  });

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };

  let script = document.getElementById('breadcrumb-schema');
  if (!script) {
    script = document.createElement('script');
    script.id = 'breadcrumb-schema';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schema);
}

/**
 * Percorso pagina normalizzato (es. index.html, test.html, approfondimenti/finanze.html)
 * @returns {string}
 */
function getNormalizedPagePath() {
  const pathname = window.location.pathname;
  const segments = pathname.split('/').filter(Boolean).filter((s) => s !== 'public');
  const filename = segments[segments.length - 1] || '';

  if (pathname === '/' || pathname.endsWith('/') || filename === '') {
    return 'index.html';
  }

  return segments.length > 1 ? segments.slice(-2).join('/') : filename;
}

/**
 * Verifica se la pagina corrente è la homepage
 * @returns {boolean}
 */
function isHomePage() {
  const normalized = getNormalizedPagePath();
  return normalized === 'index.html';
}

/**
 * Genera i breadcrumb per la pagina corrente
 */
function generateBreadcrumb() {
  const breadcrumbNav = document.getElementById('breadcrumb-nav');
  if (!breadcrumbNav) {
    return;
  }

  const topbar = breadcrumbNav.closest('.topbar');

  if (isHomePage()) {
    breadcrumbNav.replaceChildren();
    if (topbar) {
      topbar.classList.add('topbar--hidden');
    }
    return;
  }

  if (topbar) {
    topbar.classList.remove('topbar--hidden');
  }

  const relativePath = getNormalizedPagePath();
  const filename = relativePath.includes('/')
    ? relativePath.split('/').pop()
    : relativePath;

  const pageInfo = BREADCRUMB_MAP[relativePath] || BREADCRUMB_MAP[filename];

  if (pageInfo?.path === 'index.html') {
    breadcrumbNav.replaceChildren();
    if (topbar) {
      topbar.classList.add('topbar--hidden');
    }
    return;
  }
  
  if (!pageInfo) {
    const pageTitle = document.querySelector('h1')?.textContent?.trim() || filename.replace('.html', '').replace(/-/g, ' ');
    const currentDepth = getCurrentDepth();
    breadcrumbNav.innerHTML = `
      <ol class="breadcrumb__list">
        <li class="breadcrumb__item"><a href="${HOME_HREF}">Home</a></li>
        <li class="breadcrumb__item" aria-current="page">${escapeHtml(pageTitle)}</li>
      </ol>
    `;
    injectBreadcrumbSchema({
      title: pageTitle,
      path: relativePath,
    });
    return;
  }
  
  const currentDepth = getCurrentDepth();
  const breadcrumbItems = [];

  breadcrumbItems.push(
    `<li class="breadcrumb__item"><a href="${HOME_HREF}">Home</a></li>`
  );

  if (pageInfo.grandParent) {
    breadcrumbItems.push(
      `<li class="breadcrumb__item"><a href="${getRelativePath(pageInfo.grandParent.path, currentDepth)}">${escapeHtml(pageInfo.grandParent.title)}</a></li>`
    );
  }

  if (pageInfo.parent) {
    breadcrumbItems.push(
      `<li class="breadcrumb__item"><a href="${getRelativePath(pageInfo.parent.path, currentDepth)}">${escapeHtml(pageInfo.parent.title)}</a></li>`
    );
  }

  breadcrumbItems.push(
    `<li class="breadcrumb__item" aria-current="page">${escapeHtml(pageInfo.title)}</li>`
  );

  breadcrumbNav.innerHTML = `<ol class="breadcrumb__list">${breadcrumbItems.join('')}</ol>`;
  injectBreadcrumbSchema(pageInfo);
}

if (typeof window !== 'undefined') {
  window.generateBreadcrumb = generateBreadcrumb;
  window.getNormalizedPagePath = getNormalizedPagePath;
  window.isHomePage = isHomePage;
}
