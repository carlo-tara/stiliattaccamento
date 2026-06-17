// journey-hub.js
// Hub percorso guidato: legge testResults e renderizza i 3 prossimi passi

const JOURNEY_STORAGE_KEY = 'testResults';

/**
 * @param {string} [basePath]
 * @returns {string}
 */
function getJourneyBasePath(basePath) {
  if (basePath) {
    return basePath;
  }
  if (typeof getBasePath === 'function') {
    return getBasePath();
  }
  const segments = window.location.pathname.split('/').filter((s) => s && !s.endsWith('.html'));
  const filtered = segments.filter((s) => s !== 'public');
  if (filtered.length === 0) {
    return './';
  }
  return '../'.repeat(filtered.length);
}

/**
 * @returns {Object|null}
 */
function readTestResults() {
  try {
    const raw = localStorage.getItem(JOURNEY_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (typeof validateTestResults === 'function') {
      return validateTestResults(parsed);
    }
    if (parsed && parsed.primaryStyle && parsed.level) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * @returns {{ stile: string, livello: string }|null}
 */
function resolveJourneyProfile() {
  const fromTest = readTestResults();
  if (fromTest) {
    return {
      stile: fromTest.primaryStyle,
      livello: fromTest.level,
    };
  }
  return null;
}

/**
 * @param {string} tag
 * @param {Object} [attrs]
 * @param {string} [text]
 * @returns {HTMLElement}
 */
function journeyEl(tag, attrs = {}, text = '') {
  if (typeof createSafeElement === 'function') {
    return createSafeElement(tag, attrs, text);
  }
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'class') {
      el.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(el.style, value);
    } else {
      el.setAttribute(key, value);
    }
  });
  if (text) {
    el.textContent = text;
  }
  return el;
}

/**
 * @param {JourneyStep} step
 * @param {number} index
 * @param {string} basePath
 * @returns {HTMLElement}
 */
function renderJourneyStepCard(step, index, basePath) {
  const card = journeyEl('article', { class: 'card journey-step' });
  const num = journeyEl('span', { class: 'journey-step__number' }, String(index + 1));
  const title = journeyEl('h3', { class: 'journey-step__title' }, step.label);
  card.append(num, title);

  if (step.description) {
    card.appendChild(journeyEl('p', { class: 'journey-step__desc' }, step.description));
  }
  if (step.eftFrame) {
    card.appendChild(journeyEl('p', { class: 'journey-step__eft' }, step.eftFrame));
  }
  if (step.duration) {
    const dur = journeyEl('p', { class: 'journey-step__duration' });
    dur.appendChild(journeyEl('strong', {}, 'Tempo: '));
    dur.appendChild(document.createTextNode(step.duration));
    card.appendChild(dur);
  }

  const href = typeof buildStepHref === 'function' ? buildStepHref(step, basePath) : step.href;
  card.appendChild(
    journeyEl('a', { href, class: 'btn btn-secondary journey-step__cta' }, 'Vai')
  );

  return card;
}

/**
 * @param {HTMLElement} container
 * @param {Object} [options]
 * @param {string} [options.basePath]
 * @param {string} [options.stile]
 * @param {string} [options.livello]
 * @param {boolean} [options.compact]
 */
function renderJourneyHub(container, options = {}) {
  if (!container) {
    return;
  }

  const basePath = options.basePath || getJourneyBasePath();
  let stile = options.stile;
  let livello = options.livello;

  if (!stile || !livello) {
    const profile = resolveJourneyProfile();
    if (profile) {
      stile = profile.stile;
      livello = profile.livello;
    }
  }

  container.replaceChildren();

  if (!stile || !livello) {
    const fallback = journeyEl('div', { class: 'card journey-fallback' });
    fallback.appendChild(
      journeyEl(
        'p',
        {},
        'Non abbiamo ancora un profilo salvato. Fai il test (5-10 minuti) e torna qui: ti mostreremo tre passi concreti.'
      )
    );
    const actions = journeyEl('div', { class: 'btn-group', style: { marginTop: 'var(--spacing-4)' } });
    actions.appendChild(
      journeyEl('a', { href: `${basePath}test.html`, class: 'btn btn-primary' }, 'Fai il test')
    );
    actions.appendChild(
      journeyEl(
        'a',
        { href: `${basePath}da-dove-inizi.html`, class: 'btn btn-secondary' },
        'Da dove inizi'
      )
    );
    fallback.appendChild(actions);
    container.appendChild(fallback);
    return;
  }

  const config = typeof getJourneyConfig === 'function'
    ? getJourneyConfig(stile, livello)
    : null;

  if (!config) {
    return;
  }

  const styleLabel = typeof getStyleLabel === 'function' ? getStyleLabel(stile) : stile;
  const levelLabel = typeof getLevelLabel === 'function' ? getLevelLabel(livello) : livello;
  const profiloUrl = `${basePath}profili/${stile}-${livello}.html`;

  const intro = journeyEl('div', { class: 'card journey-intro mb-6' });
  intro.appendChild(journeyEl('h2', {}, `Il tuo profilo: ${styleLabel} ${levelLabel}`));
  if (config.greeting) {
    intro.appendChild(journeyEl('p', { class: 'wiki-lead' }, config.greeting));
  }
  intro.appendChild(
    journeyEl('a', { href: profiloUrl, class: 'btn btn-primary' }, 'Vedi il profilo completo')
  );
  container.appendChild(intro);

  if (config.disclaimer) {
    const disc = journeyEl('div', { class: 'card journey-disclaimer mb-6' });
    disc.appendChild(journeyEl('h3', {}, '⚠️ Un appunto importante'));
    disc.appendChild(
      journeyEl(
        'p',
        {},
        'Con un livello alto, ha senso parlarne con qualcuno che conosce l\'attaccamento. Il test e queste pagine servono all\'auto-osservazione, non alla diagnosi.'
      )
    );
    disc.appendChild(
      journeyEl(
        'a',
        { href: `${basePath}quando-cercare-aiuto.html`, class: 'btn btn-secondary' },
        'Quando cercare aiuto'
      )
    );
    container.appendChild(disc);
  }

  const stepsTitle = journeyEl('h2', { class: 'section-title' }, 'I tuoi tre prossimi passi');
  container.appendChild(stepsTitle);

  const grid = journeyEl('div', { class: 'grid grid-3 journey-steps-grid' });
  const steps = [config.immediate, config.understand, config.connect];
  steps.forEach((step, i) => {
    grid.appendChild(renderJourneyStepCard(step, i, basePath));
  });
  container.appendChild(grid);

  if (!options.compact) {
    const wiki = journeyEl('div', { class: 'card mt-8' });
    wiki.appendChild(journeyEl('h3', {}, 'Vuoi approfondire?'));
    wiki.appendChild(
      journeyEl(
        'p',
        {},
        'Il wiki resta qui per quando hai tempo: fondamenti, archetipi, approfondimenti tematici.'
      )
    );
    const links = journeyEl('div', { class: 'btn-group' });
    links.appendChild(
      journeyEl('a', { href: `${basePath}fondamenti.html`, class: 'btn btn-secondary' }, 'Le basi')
    );
    links.appendChild(
      journeyEl('a', { href: `${basePath}mappa-personale.html`, class: 'btn btn-secondary' }, 'Mappa personale')
    );
    wiki.appendChild(links);
    container.appendChild(wiki);
  }
}

/**
 * @param {HTMLElement} container
 * @param {Object} [options]
 */
function renderJourneyNextSteps(container, options = {}) {
  renderJourneyHub(container, { ...options, compact: true });
}

/**
 * @param {string} stile
 * @param {string} livello
 * @param {string} [basePath]
 * @returns {HTMLElement}
 */
function buildJourneyCta(stile, livello, basePath = '') {
  const bp = basePath || getJourneyBasePath();
  const wrap = journeyEl('div', { class: 'journey-cta btn-group' });
  wrap.appendChild(
    journeyEl(
      'a',
      { href: `${bp}il-tuo-percorso.html`, class: 'btn btn-primary' },
      'Vai al tuo percorso'
    )
  );
  if (stile && livello) {
    wrap.appendChild(
      journeyEl(
        'a',
        { href: `${bp}profili/${stile}-${livello}.html`, class: 'btn btn-secondary' },
        'Profilo completo'
      )
    );
  }
  return wrap;
}

/**
 * Inserisce banner "Continua il tuo percorso" se testResults presente
 */
function initJourneyBanner() {
  const results = readTestResults();
  if (!results) {
    return;
  }

  const existing = document.getElementById('journey-banner');
  if (existing) {
    return;
  }

  const basePath = getJourneyBasePath();
  const banner = journeyEl('div', {
    id: 'journey-banner',
    class: 'journey-banner',
    role: 'region',
    'aria-label': 'Continua il tuo percorso',
  });

  const inner = journeyEl('div', { class: 'container journey-banner__inner' });
  inner.appendChild(
    journeyEl('p', { class: 'journey-banner__text' }, 'Hai un profilo salvato — continua da dove eri rimasto.')
  );
  inner.appendChild(
    journeyEl(
      'a',
      { href: `${basePath}il-tuo-percorso.html`, class: 'btn btn-primary journey-banner__cta' },
      'Il tuo percorso'
    )
  );
  banner.appendChild(inner);

  const main = document.getElementById('main-content') || document.querySelector('main');
  if (main) {
    main.insertBefore(banner, main.firstChild);
  }
}

if (typeof window !== 'undefined') {
  window.readTestResults = readTestResults;
  window.resolveJourneyProfile = resolveJourneyProfile;
  window.renderJourneyHub = renderJourneyHub;
  window.renderJourneyNextSteps = renderJourneyNextSteps;
  window.buildJourneyCta = buildJourneyCta;
  window.initJourneyBanner = initJourneyBanner;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    JOURNEY_STORAGE_KEY,
    readTestResults,
    resolveJourneyProfile,
    getJourneyBasePath,
    renderJourneyHub,
    renderJourneyNextSteps,
    buildJourneyCta,
    initJourneyBanner,
  };
}
