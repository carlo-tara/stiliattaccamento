// config-chartjs.js
// Configurazione per Chart.js radar chart

/**
 * Ottiene i colori dal tema corrente
 * @returns {Object} Oggetto con colori del tema
 */
function getChartColors() {
  return {
    accent: getComputedStyle(document.documentElement).getPropertyValue('--color-accent-secure') || '#a8d5ba',
    border: getComputedStyle(document.documentElement).getPropertyValue('--color-border') || 'rgba(184, 169, 212, 0.2)',
    text: getComputedStyle(document.documentElement).getPropertyValue('--color-text-primary') || '#e8e8e8',
    textSecondary: getComputedStyle(document.documentElement).getPropertyValue('--color-text-secondary') || '#b8b8b8'
  };
}

/**
 * Crea la configurazione del dataset per il radar chart
 * @param {Array<number>} punteggi - Array di 5 punteggi
 * @param {string} accentColor - Colore accent
 * @returns {Object} Configurazione dataset
 */
function createRadarDataset(punteggi, accentColor) {
  return {
    label: 'Il Tuo Profilo',
    data: punteggi,
    backgroundColor: accentColor + '40', // 40 = 25% opacity in hex
    borderColor: accentColor,
    borderWidth: 2,
    pointBackgroundColor: accentColor,
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: accentColor,
    pointRadius: 5,
    pointHoverRadius: 7
  };
}

/**
 * Crea la configurazione delle scale per il radar chart
 * @param {string} textSecondary - Colore testo secondario
 * @param {string} borderColor - Colore bordo
 * @param {string} textColor - Colore testo
 * @returns {Object} Configurazione scale
 */
function createRadarScales(textSecondary, borderColor, textColor) {
  return {
    r: {
      beginAtZero: true,
      max: MAP_CONSTANTS.MAX_SCORE,
      min: MAP_CONSTANTS.MIN_SCORE,
      ticks: {
        stepSize: 2,
        color: textSecondary,
        font: {
          size: 12
        },
        backdropColor: 'transparent'
      },
      grid: {
        color: borderColor
      },
      pointLabels: {
        color: textColor,
        font: {
          size: 13,
          weight: '500'
        }
      },
      angleLines: {
        color: borderColor
      }
    }
  };
}

/**
 * Crea la configurazione dei plugin per il radar chart
 * @param {string} accentColor - Colore accent
 * @param {string} textColor - Colore testo
 * @returns {Object} Configurazione plugin
 */
function createRadarPlugins(accentColor, textColor) {
  return {
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: textColor,
        font: {
          size: 14
        },
        padding: 15
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: accentColor,
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: function(context) {
          return context.dataset.label + ': ' + context.parsed.r.toFixed(1) + '/10';
        }
      }
    }
  };
}

/**
 * Crea la configurazione completa per il radar chart
 * @param {Array<number>} punteggi - Array di 5 punteggi
 * @returns {Object} Configurazione completa Chart.js
 */
function createRadarChartConfig(punteggi) {
  const colors = getChartColors();
  const dataset = createRadarDataset(punteggi, colors.accent);
  const scales = createRadarScales(colors.textSecondary, colors.border, colors.text);
  const plugins = createRadarPlugins(colors.accent, colors.text);
  
  return {
    type: 'radar',
    data: {
      labels: MAP_DIMENSIONS,
      datasets: [dataset]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: scales,
      plugins: plugins
    }
  };
}

