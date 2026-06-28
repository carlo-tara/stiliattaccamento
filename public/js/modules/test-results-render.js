// test-results-render.js
// Costruzione DOM per i risultati del test di attaccamento

const TEST_STYLE_NAMES = {
  secure: 'Secure',
  ansioso: 'Ansioso',
  evitante: 'Evitante',
  disorganizzato: 'Oscillante',
};

const TEST_LEVEL_NAMES = {
  basso: 'basso',
  medio: 'medio',
  alto: 'alto',
};

const TEST_MEANING_DESCRIPTIONS = {
  secure:
    'Hai sviluppato un modo sano di relazionarti con gli altri. Riesci a bilanciare indipendenza e intimità, e generalmente ti senti a tuo agio nelle relazioni.',
  ansioso:
    'Tendi a cercare rassicurazione e vicinanza nelle relazioni. Potresti preoccuparti dell\'abbandono e avere bisogno di conferme frequenti. Questo non significa che sei "troppo" - significa semplicemente che hai bisogno di più sicurezza nelle relazioni.',
  evitante:
    'Tendi a valorizzare l\'indipendenza e potresti sentirti a disagio con troppa vicinanza. Non significa che non ami o non ti importi - significa che hai imparato a proteggerti mantenendo una certa distanza.',
  disorganizzato:
    'Potresti oscillare tra desiderio di vicinanza e bisogno di distanza. Le relazioni possono sembrare confuse o contraddittorie. Non sei "rotto" - hai semplicemente imparato pattern complessi che ora puoi osservare e comprendere meglio.',
};

const TEST_MAX_POSSIBLE_SCORES = {
  anxious: 36,
  secure: 12,
  avoidant: 24,
  disorganized: 36,
};

/**
 * @param {string} primaryStyle
 * @param {string} level
 * @returns {HTMLElement}
 */
function buildTestIntroCard(primaryStyle, level) {
  const introCard = createSafeElement('div', {
    style: {
      background:
        'linear-gradient(135deg, rgba(168, 213, 186, 0.1) 0%, rgba(168, 213, 186, 0.05) 100%)',
      borderLeft: '4px solid var(--color-accent-secure)',
      padding: 'var(--spacing-6)',
      borderRadius: 'var(--radius-md)',
      marginBottom: 'var(--spacing-6)',
    },
  });

  introCard.appendChild(
    createSafeElement(
      'h3',
      { style: { color: 'var(--color-accent-secure)', marginTop: '0' } },
      `Il tuo profilo: ${sanitizeHTML(TEST_STYLE_NAMES[primaryStyle])} ${sanitizeHTML(TEST_LEVEL_NAMES[level])}`
    )
  );

  introCard.appendChild(
    createSafeElement(
      'p',
      { style: { fontSize: 'var(--font-size-lg)' } },
      'Non c\'è nulla di sbagliato in te. Questo profilo descrive semplicemente come hai imparato a relazionarti con gli altri. Non è un\'etichetta o un giudizio - è un punto di partenza per acquisire consapevolezza.'
    )
  );

  return introCard;
}

/**
 * @param {string} primaryStyle
 * @returns {HTMLElement}
 */
function buildTestMeaningCard(primaryStyle) {
  const meaningCard = createSafeElement('div', {
    style: {
      backgroundColor: 'var(--color-surface-elevated)',
      padding: 'var(--spacing-6)',
      borderRadius: 'var(--radius-md)',
      marginBottom: 'var(--spacing-6)',
    },
  });

  meaningCard.appendChild(createSafeElement('h3', {}, 'Cosa significa questo per te?'));
  meaningCard.appendChild(
    createSafeElement(
      'p',
      {},
      TEST_MEANING_DESCRIPTIONS[primaryStyle] ||
        'Ogni stile di attaccamento ha le sue caratteristiche. Il tuo profilo ti aiuta a capire meglio i tuoi pattern e come lavorare con loro, non contro di loro.'
    )
  );

  return meaningCard;
}

/**
 * @param {string} primaryStyle
 * @param {string} level
 * @returns {HTMLElement}
 */
function buildTestInfoBadges(primaryStyle, level) {
  const infoDiv = createSafeElement('div', {
    style: {
      display: 'flex',
      gap: 'var(--spacing-4)',
      flexWrap: 'wrap',
      marginBottom: 'var(--spacing-6)',
    },
  });

  const styleBadge = createSafeElement('div', {
    style: {
      padding: 'var(--spacing-2) var(--spacing-4)',
      backgroundColor: 'var(--color-accent)',
      color: 'white',
      borderRadius: 'var(--radius-md)',
      fontSize: 'var(--font-size-sm)',
    },
  });
  styleBadge.appendChild(
    document.createTextNode(`Stile: ${sanitizeHTML(TEST_STYLE_NAMES[primaryStyle])}`)
  );
  infoDiv.appendChild(styleBadge);

  const levelBadge = createSafeElement('div', {
    style: {
      padding: 'var(--spacing-2) var(--spacing-4)',
      backgroundColor: 'var(--color-surface-elevated)',
      borderRadius: 'var(--radius-md)',
      fontSize: 'var(--font-size-sm)',
    },
  });
  levelBadge.appendChild(
    document.createTextNode(`Livello: ${sanitizeHTML(TEST_LEVEL_NAMES[level])}`)
  );
  infoDiv.appendChild(levelBadge);

  return infoDiv;
}

/**
 * @param {Object} scores
 * @returns {HTMLElement}
 */
function buildTestScoresList(scores) {
  const scoresTitle = createSafeElement('h4', {
    style: { marginTop: 'var(--spacing-6)' },
  }, 'I Tuoi Punteggi:');

  const scoresList = createSafeElement('ul', {
    style: { marginLeft: 'var(--spacing-6)', marginTop: 'var(--spacing-4)' },
  });

  [
    `Ansioso: ${scores.anxious}/${TEST_MAX_POSSIBLE_SCORES.anxious}`,
    `Secure: ${scores.secure}/${TEST_MAX_POSSIBLE_SCORES.secure}`,
    `Evitante: ${scores.avoidant}/${TEST_MAX_POSSIBLE_SCORES.avoidant}`,
    `Oscillante: ${scores.disorganized}/${TEST_MAX_POSSIBLE_SCORES.disorganized}`,
  ].forEach((text) => {
    scoresList.appendChild(createSafeElement('li', {}, text));
  });

  const wrapper = document.createDocumentFragment();
  wrapper.appendChild(scoresTitle);
  wrapper.appendChild(scoresList);
  return /** @type {HTMLElement} */ (wrapper);
}

/**
 * @param {string} primaryStyle
 * @param {string} level
 * @returns {HTMLElement}
 */
function buildTestActionsLinks(primaryStyle, level) {
  const actionsDiv = createSafeElement('div', {
    style: {
      marginTop: 'var(--spacing-6)',
      display: 'flex',
      gap: 'var(--spacing-4)',
      flexWrap: 'wrap',
    },
  });

  const profileUrl =
    isValidAttachmentStyle(primaryStyle) && isValidLevel(level)
      ? `profili/${primaryStyle}-${level}.html`
      : 'stili-base.html';

  actionsDiv.appendChild(
    createSafeElement('a', { href: 'il-tuo-percorso.html', class: 'btn btn-primary' }, 'Vai al tuo percorso')
  );
  actionsDiv.appendChild(
    createSafeElement('a', { href: profileUrl, class: 'btn btn-secondary' }, 'Vedi profilo completo')
  );
  actionsDiv.appendChild(
    createSafeElement('a', { href: 'mappa-personale.html', class: 'btn btn-secondary' }, 'Crea mappa personale')
  );
  actionsDiv.appendChild(
    createSafeElement('a', { href: 'storie-reali.html', class: 'btn btn-secondary' }, 'Leggi storie simili')
  );

  return actionsDiv;
}

/**
 * @returns {HTMLElement}
 */
function buildTestHelpCard() {
  const helpCard = createSafeElement('div', {
    style: {
      marginTop: 'var(--spacing-6)',
      padding: 'var(--spacing-6)',
      backgroundColor: 'rgba(244, 165, 174, 0.1)',
      borderLeft: '4px solid var(--color-accent)',
      borderRadius: 'var(--radius-md)',
    },
  });

  helpCard.appendChild(createSafeElement('h4', {}, 'Supporto professionale'));
  helpCard.appendChild(
    createSafeElement(
      'p',
      {},
      'Con un livello Alto, potrebbe essere utile considerare il supporto di un professionista. Non c\'è vergogna nel cercare aiuto - è un atto di coraggio e cura di sé.'
    )
  );
  helpCard.appendChild(
    createSafeElement(
      'a',
      {
        href: 'quando-cercare-aiuto.html',
        class: 'btn btn-primary',
        style: { marginTop: 'var(--spacing-4)', display: 'inline-block' },
      },
      'Quando cercare aiuto'
    )
  );

  return helpCard;
}

/**
 * @param {string} primaryStyle
 * @param {string} level
 * @returns {HTMLElement}
 */
function buildTestJourneyStepsHost(primaryStyle, level) {
  const journeyStepsHost = createSafeElement('div', {
    id: 'test-journey-steps',
    style: { marginTop: 'var(--spacing-6)' },
  });

  if (typeof renderJourneyNextSteps === 'function') {
    renderJourneyNextSteps(journeyStepsHost, {
      stile: primaryStyle,
      livello: level,
      basePath: '',
    });
  }

  return journeyStepsHost;
}

/**
 * Mostra i risultati del test nel DOM
 * @param {Object} scores
 * @param {string} primaryStyle
 * @param {string} level
 */
function showTestResults(scores, primaryStyle, level) {
  const resultsDiv = document.getElementById('results');
  const resultsContent = document.getElementById('results-content');

  if (!resultsDiv || !resultsContent) {
    return;
  }

  resultsContent.replaceChildren();
  resultsContent.appendChild(buildTestIntroCard(primaryStyle, level));
  resultsContent.appendChild(buildTestMeaningCard(primaryStyle));
  resultsContent.appendChild(buildTestInfoBadges(primaryStyle, level));
  resultsContent.appendChild(buildTestScoresList(scores));
  resultsContent.appendChild(buildTestActionsLinks(primaryStyle, level));

  if (level === 'alto') {
    resultsContent.appendChild(buildTestHelpCard());
  }

  resultsContent.appendChild(buildTestJourneyStepsHost(primaryStyle, level));

  if (typeof trackEvent === 'function') {
    trackEvent('test_results_viewed', {
      attachment_style: primaryStyle,
      attachment_level: level,
    });
  }

  resultsDiv.style.display = 'block';
  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
