// mappa-personale.js
// Gestisce la logica della Mappa Personale interattiva

document.addEventListener('DOMContentLoaded', () => {
  initMappaPersonale();

  for (let i = 1; i <= 5; i++) {
    const slider = document.getElementById(`dim${i}`);
    if (slider) {
      slider.addEventListener('input', () => aggiornaMappa());
    }
  }
});

/**
 * Inizializza la Mappa Personale
 */
function initMappaPersonale() {
  const testResults = localStorage.getItem('testResults');

  if (testResults) {
    try {
      const parsed = JSON.parse(testResults);
      const validated =
        typeof validateTestResults === 'function' ? validateTestResults(parsed) : parsed;

      if (validated) {
        calcolaDaTest(validated);
      } else if (window.DEBUG_MODE) {
        console.warn('Dati test non validi, uso valori di default');
      }
    } catch (e) {
      if (window.DEBUG_MODE) {
        console.warn('Errore nel parsing risultati test:', e);
      }
    }
  }

  aggiornaMappa();
}

/**
 * @param {Object} risultatiTest
 */
function calcolaDaTest(risultatiTest) {
  const scores = risultatiTest.scores || risultatiTest;
  const dims =
    typeof computeDimensionsFromTest === 'function'
      ? computeDimensionsFromTest(scores)
      : { dim1: 5, dim2: 5, dim3: 5, dim4: 5, dim5: 5 };

  ['dim1', 'dim2', 'dim3', 'dim4', 'dim5'].forEach((key, index) => {
    const slider = document.getElementById(`dim${index + 1}`);
    if (slider) {
      slider.value = dims[key].toFixed(1);
    }
  });

  aggiornaMappa();
}

/**
 * Aggiorna slider, media, grafico e profilo
 */
function aggiornaMappa() {
  const punteggi = [];
  for (let i = 1; i <= 5; i++) {
    const slider = document.getElementById(`dim${i}`);
    const value = parseFloat(slider.value);
    punteggi.push(value);
    slider.setAttribute('aria-valuenow', value.toFixed(1));

    const valueDisplay = document.getElementById(`dim${i}-value`);
    if (valueDisplay) {
      valueDisplay.textContent = value.toFixed(1);
    }
  }

  const media = punteggi.reduce((a, b) => a + b, 0) / punteggi.length;
  updateAverageDisplay(media);
  updateLevelBadge(media);
  disegnaGraficoRadar(punteggi);

  if (typeof identificaProfilo === 'function') {
    identificaProfilo(punteggi, media);
  }

  salvaMappa(punteggi, media);
}

/**
 * @param {number} media
 */
function updateAverageDisplay(media) {
  const averageScore = document.getElementById('average-score');
  const averageInterpretation = document.getElementById('average-interpretation');

  if (averageScore) {
    averageScore.textContent = media.toFixed(1);
  }

  if (!averageInterpretation) {
    return;
  }

  if (media <= 3) {
    averageInterpretation.textContent = 'Lavoro serio necessario (ma è possibile!)';
    averageInterpretation.style.color = 'var(--color-accent-anxious)';
  } else if (media <= 6) {
    averageInterpretation.textContent = 'Sei nel viaggio di consapevolezza';
    averageInterpretation.style.color = 'var(--color-accent-disorganized)';
  } else {
    averageInterpretation.textContent = 'Secure! Ora coltiva e insegna';
    averageInterpretation.style.color = 'var(--color-accent-secure)';
  }
}

/**
 * @param {number} media
 */
function updateLevelBadge(media) {
  const levelBadges = document.getElementById('level-badges');
  if (!levelBadges) {
    return;
  }

  const level = identificaLivello(media);
  const levelLower = level.toLowerCase();
  const validLevel =
    typeof isValidLevel === 'function' && isValidLevel(levelLower) ? levelLower : 'basso';

  levelBadges.replaceChildren();
  const badge =
    typeof createSafeElement === 'function'
      ? createSafeElement('span', { class: `level-badge ${validLevel}` }, `LIVELLO ${level}`)
      : (() => {
          const span = document.createElement('span');
          span.className = `level-badge ${validLevel}`;
          span.textContent = `LIVELLO ${level}`;
          return span;
        })();
  levelBadges.appendChild(badge);
}

/**
 * @param {number} media
 * @returns {string}
 */
function identificaLivello(media) {
  if (media >= 5 && media <= 6) {
    return 'BASSO';
  }
  if (media >= 3.5 && media < 5) {
    return 'MEDIO';
  }
  return 'ALTO';
}

let radarChart = null;

function setChartLoading(isLoading) {
  const container = document.querySelector('.radar-chart-container');
  if (!container) {
    return;
  }
  container.classList.toggle('radar-chart-container--loading', isLoading);
  container.setAttribute('aria-busy', isLoading ? 'true' : 'false');
}

function showChartJSError() {
  setChartLoading(false);
  const plot = document.querySelector('.radar-chart__plot');
  if (!plot) {
    return;
  }

  plot.replaceChildren();
  const msg = document.createElement('p');
  msg.className = 'chart-error';
  msg.textContent =
    'Il grafico non è disponibile al momento. Ricarica la pagina o riprova più tardi.';
  plot.appendChild(msg);
}

/**
 * @param {Array<number>} punteggi
 * @returns {Array<number>|null}
 */
function normalizeRadarScores(punteggi) {
  const expectedDimensions =
    typeof MAP_CONSTANTS !== 'undefined' ? MAP_CONSTANTS.DIMENSIONS_COUNT : 5;
  const minScore = typeof MAP_CONSTANTS !== 'undefined' ? MAP_CONSTANTS.MIN_SCORE : 0;
  const maxScore = typeof MAP_CONSTANTS !== 'undefined' ? MAP_CONSTANTS.MAX_SCORE : 10;

  if (!Array.isArray(punteggi) || punteggi.length !== expectedDimensions) {
    return null;
  }

  const normalized = [];
  for (let i = 0; i < punteggi.length; i++) {
    const score = parseFloat(punteggi[i]);
    if (isNaN(score) || score < minScore || score > maxScore) {
      return null;
    }
    normalized.push(score);
  }
  return normalized;
}

/**
 * @param {Array<number>} punteggi
 */
function disegnaGraficoRadar(punteggi) {
  const canvas = document.getElementById('radar-chart');
  if (!canvas) {
    return;
  }

  setChartLoading(true);

  if (
    (typeof isChartJSLoaded === 'function' && !isChartJSLoaded()) ||
    typeof Chart === 'undefined'
  ) {
    showChartJSError();
    return;
  }

  const normalized = normalizeRadarScores(punteggi);
  if (!normalized) {
    setChartLoading(false);
    if (window.DEBUG_MODE) {
      console.error('Punteggi non validi per radar chart:', punteggi);
    }
    return;
  }

  try {
    if (radarChart) {
      radarChart.destroy();
    }
    const config =
      typeof createRadarChartConfig === 'function'
        ? createRadarChartConfig(normalized)
        : null;
    if (!config) {
      showChartJSError();
      return;
    }
    radarChart = new Chart(canvas.getContext('2d'), config);
    setChartLoading(false);
  } catch (error) {
    if (window.DEBUG_MODE) {
      console.error('Errore inizializzazione radar chart:', error);
    }
    showChartJSError();
  }
}

/**
 * @param {Array<number>} punteggi
 * @param {number} media
 */
function salvaMappa(punteggi, media) {
  localStorage.setItem(
    'mappaPersonale',
    JSON.stringify({
      punteggi,
      media,
      timestamp: new Date().toISOString(),
    })
  );
}
