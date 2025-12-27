// breadcrumb-generator.js
// Genera dinamicamente i breadcrumb basati sull'URL della pagina

/**
 * Mappatura delle pagine per i breadcrumb
 * Definisce titoli e percorsi per le pagine principali
 */
const BREADCRUMB_MAP = {
  // Root pages
  'index.html': { title: 'Home', path: 'index.html' },
  'fondamenti.html': { title: 'Fondamenti', path: 'fondamenti.html' },
  'modello-gradienti.html': { title: 'Modello a Gradienti', path: 'modello-gradienti.html' },
  'archetipi.html': { title: 'Archetipi', path: 'archetipi.html' },
  'stili-base.html': { title: '4 Stili Base', path: 'stili-base.html' },
  'test.html': { title: 'Test', path: 'test.html' },
  'mappa-personale.html': { title: 'Mappa personale', path: 'mappa-personale.html' },
  'approfondimenti.html': { title: 'Approfondimenti', path: 'approfondimenti.html' },
  'libri.html': { title: 'Libri', path: 'libri.html' },
  'storie-reali.html': { title: 'Storie Reali', path: 'storie-reali.html' },
  'dinamiche-coppia.html': { title: 'Dinamiche di Coppia', path: 'dinamiche-coppia.html' },
  'come-supportare-partner.html': { title: 'Come Supportare il Partner', path: 'come-supportare-partner.html' },
  'quando-cercare-aiuto.html': { title: 'Quando Cercare Aiuto', path: 'quando-cercare-aiuto.html' },
  'risorse.html': { title: 'Risorse', path: 'risorse.html' },
  'mazzo-tarocchi.html': { title: 'Mazzo dei Tarocchi', path: 'mazzo-tarocchi.html', parent: { title: 'Archetipi', path: 'archetipi.html' } },
  
  // Sottocategorie Approfondimenti
  'approfondimenti/sessualita.html': { 
    title: 'SESSUALITÀ', 
    path: 'approfondimenti/sessualita.html',
    parent: { title: 'Approfondimenti', path: 'approfondimenti.html' }
  },
  'approfondimenti/finanze.html': { 
    title: 'DENARO/ECONOMIA PERSONALE', 
    path: 'approfondimenti/finanze.html',
    parent: { title: 'Approfondimenti', path: 'approfondimenti.html' }
  },
  'approfondimenti/lavoro.html': { 
    title: 'LAVORO', 
    path: 'approfondimenti/lavoro.html',
    parent: { title: 'Approfondimenti', path: 'approfondimenti.html' }
  },
  'approfondimenti/genitorialita.html': { 
    title: 'GENITORIALITÀ', 
    path: 'approfondimenti/genitorialita.html',
    parent: { title: 'Approfondimenti', path: 'approfondimenti.html' }
  },
  'approfondimenti/famiglia.html': { 
    title: 'FAMIGLIA', 
    path: 'approfondimenti/famiglia.html',
    parent: { title: 'Approfondimenti', path: 'approfondimenti.html' }
  },
  'approfondimenti/amicizie.html': { 
    title: 'AMICIZIE', 
    path: 'approfondimenti/amicizie.html',
    parent: { title: 'Approfondimenti', path: 'approfondimenti.html' }
  },
  'approfondimenti/crescita.html': { 
    title: 'CRESCITA PERSONALE', 
    path: 'approfondimenti/crescita.html',
    parent: { title: 'Approfondimenti', path: 'approfondimenti.html' }
  },
  'approfondimenti/lutto.html': { 
    title: 'LUTTO', 
    path: 'approfondimenti/lutto.html',
    parent: { title: 'Approfondimenti', path: 'approfondimenti.html' }
  },
  'approfondimenti/separazione.html': { 
    title: 'SEPARAZIONE', 
    path: 'approfondimenti/separazione.html',
    parent: { title: 'Approfondimenti', path: 'approfondimenti.html' }
  },
  'approfondimenti/tradimento.html': { 
    title: 'TRADIMENTO', 
    path: 'approfondimenti/tradimento.html',
    parent: { title: 'Approfondimenti', path: 'approfondimenti.html' }
  },
  'approfondimenti/focusing.html': { 
    title: 'FOCUSING', 
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
    title: 'ANDREA', 
    path: 'storie-reali/andrea.html',
    parent: { title: 'Storie Reali', path: 'storie-reali.html' }
  },
  'storie-reali/giulia.html': { 
    title: 'GIULIA', 
    path: 'storie-reali/giulia.html',
    parent: { title: 'Storie Reali', path: 'storie-reali.html' }
  },
  'storie-reali/lorenzo.html': { 
    title: 'LORENZO', 
    path: 'storie-reali/lorenzo.html',
    parent: { title: 'Storie Reali', path: 'storie-reali.html' }
  },
  'storie-reali/marco.html': { 
    title: 'MARCO', 
    path: 'storie-reali/marco.html',
    parent: { title: 'Storie Reali', path: 'storie-reali.html' }
  },
  'storie-reali/nina.html': { 
    title: 'NINA', 
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
 * Genera i breadcrumb per la pagina corrente
 */
function generateBreadcrumb() {
  const breadcrumbNav = document.getElementById('breadcrumb-nav');
  if (!breadcrumbNav) {
    return;
  }
  
  // Ottieni il percorso relativo della pagina corrente
  const pathname = window.location.pathname;
  const segments = pathname.split('/').filter(s => s);
  const filename = segments[segments.length - 1] || 'index.html';
  const relativePath = segments.length > 1 
    ? segments.slice(-2).join('/')  // Per sottodirectory: "directory/file.html"
    : filename;                      // Per root: "file.html"
  
  // Cerca nella mappatura
  const pageInfo = BREADCRUMB_MAP[relativePath] || BREADCRUMB_MAP[filename];
  
  if (!pageInfo) {
    // Se non trovato, usa il titolo della pagina o il nome del file
    const pageTitle = document.querySelector('h1')?.textContent?.trim() || filename.replace('.html', '').replace(/-/g, ' ');
    const currentDepth = getCurrentDepth();
    breadcrumbNav.innerHTML = `
      <a href="${getRelativePath('index.html', currentDepth)}">Home</a>
      <span>›</span>
      <span>${pageTitle}</span>
    `;
    return;
  }
  
  // Costruisci i breadcrumb
  const currentDepth = getCurrentDepth();
  const breadcrumbItems = [];
  
  // Home sempre presente
  breadcrumbItems.push(`<a href="${getRelativePath('index.html', currentDepth)}">Home</a>`);
  
  // Grandparent (se presente, es. per profili)
  if (pageInfo.grandParent) {
    breadcrumbItems.push(`<span>›</span>`);
    breadcrumbItems.push(`<a href="${getRelativePath(pageInfo.grandParent.path, currentDepth)}">${pageInfo.grandParent.title}</a>`);
  }
  
  // Parent (se presente)
  if (pageInfo.parent) {
    breadcrumbItems.push(`<span>›</span>`);
    breadcrumbItems.push(`<a href="${getRelativePath(pageInfo.parent.path, currentDepth)}">${pageInfo.parent.title}</a>`);
  }
  
  // Pagina corrente (non cliccabile)
  breadcrumbItems.push(`<span>›</span>`);
  breadcrumbItems.push(`<span>${pageInfo.title}</span>`);
  
  breadcrumbNav.innerHTML = breadcrumbItems.join('');
}

// Genera i breadcrumb quando il DOM è pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', generateBreadcrumb);
} else {
  generateBreadcrumb();
}

