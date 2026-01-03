// mappa-personale.js
// Gestisce la logica della Mappa Personale interattiva

document.addEventListener('DOMContentLoaded', () => {
  // Inizializza la mappa
  initMappaPersonale();
  
  // Aggiungi event listeners ai 5 slider
  for (let i = 1; i <= 5; i++) {
    const slider = document.getElementById(`dim${i}`);
    if (slider) {
      slider.addEventListener('input', () => aggiornaMappa());
    }
  }
});

/**
 * Inizializza la Mappa Personale
 * - Legge risultati dal test (localStorage) se disponibili
 * - Pre-compila i slider
 * - Aggiorna la visualizzazione
 */
function initMappaPersonale() {
  // Prova a leggere risultati dal test
  const testResults = localStorage.getItem('testResults');
  
  if (testResults) {
    try {
      const parsed = JSON.parse(testResults);
      // Valida i dati prima di usarli
      const validated = typeof validateTestResults === 'function' 
        ? validateTestResults(parsed)
        : parsed;
      
      if (validated) {
        calcolaDaTest(validated);
      } else {
        // Dati non validi, usa valori di default
        if (typeof Logger !== 'undefined' && Logger.warn) {
          Logger.warn('Dati test non validi, uso valori di default');
        } else if (window.DEBUG_MODE) {
          console.warn('Dati test non validi, uso valori di default');
        }
      }
    } catch (e) {
      // Errore nel parsing, usa valori di default
      if (typeof Logger !== 'undefined' && Logger.warn) {
        Logger.warn('Errore nel parsing risultati test:', e);
      } else if (window.DEBUG_MODE) {
        console.warn('Errore nel parsing risultati test:', e);
      }
    }
  }
  
  // Aggiorna la mappa con i valori iniziali
  aggiornaMappa();
}

/**
 * Calcola i punteggi delle 5 dimensioni dai risultati del test
 * @param {Object} risultatiTest - Risultati del test con punteggi per stile
 */
function calcolaDaTest(risultatiTest) {
  // Estrai punteggi dal test (struttura: { scores: { anxious, secure, avoidant, disorganized }, primaryStyle, level })
  const scores = risultatiTest.scores || risultatiTest;
  const { anxious = 0, avoidant = 0, secure = 0, disorganized = 0 } = scores;
  
  // DIMENSIONE 1: Ansia ↔ Evitamento
  // Se Ansia > Evitante: sei SINISTRA (Ansioso) - valore basso (0-4)
  // Se Evitante > Ansia: sei DESTRA (Evitante) - valore alto (6-10)
  // Se uguali o Secure alto: sei CENTRO (5)
  let dim1 = 5;
  if (anxious > avoidant) {
    // Ansioso: più ansia = valore più basso (0-4)
    dim1 = Math.max(0, 4 - (anxious / 3));
  } else if (avoidant > anxious) {
    // Evitante: più evitamento = valore più alto (6-10)
    dim1 = Math.min(10, 6 + (avoidant / 3));
  } else if (secure > 6) {
    // Secure: centro (5)
    dim1 = 5;
  }
  
  // DIMENSIONE 2: Finestra di Tolleranza
  // Ansioso = Iper-attivato (alto, 6-10)
  // Evitante = Sottoattivato (basso, 0-4)
  // Secure = Centro (4-6)
  // Oscillante = Oscilla (medio, 3-7)
  let dim2 = 5;
  if (anxious > 6) {
    dim2 = Math.min(10, 6 + (anxious / 4));
  } else if (avoidant > 6) {
    dim2 = Math.max(0, 4 - (avoidant / 4));
  } else if (disorganized > 6) {
    dim2 = 3 + (disorganized / 5); // Oscilla
  } else if (secure > 6) {
    dim2 = 5; // Centro
  }
  
  // DIMENSIONE 3: Coscienza dell'Attaccamento
  // Se hai fatto il test, sei già consapevole (almeno 4)
  // Più Secure = più consapevole
  let dim3 = 4; // Minimo se hai fatto il test
  if (secure > 6) {
    dim3 = 7;
  } else if (anxious > 6 || avoidant > 6) {
    dim3 = 4; // Inconsapevole se pattern dominante
  }
  
  // DIMENSIONE 4: Capacità di Integrazione
  // Secure alto = integrato (7-8)
  // Altri stili = frammentato (1-4) o semi-integrato (4-6)
  let dim4 = 3;
  if (secure > 6) {
    dim4 = 7;
  } else if (anxious > 6 || avoidant > 6) {
    dim4 = 3;
  } else {
    dim4 = 5; // Semi-integrato
  }
  
  // DIMENSIONE 5: Resilienza Relazionale
  // Secure = robusta (7-8)
  // Altri = fragile (1-4) o stabile (4-6)
  let dim5 = 3;
  if (secure > 6) {
    dim5 = 7;
  } else if (anxious > 6 || avoidant > 6 || disorganized > 6) {
    dim5 = 3;
  } else {
    dim5 = 5; // Stabile
  }
  
  // Imposta i valori sui slider
  document.getElementById('dim1').value = dim1.toFixed(1);
  document.getElementById('dim2').value = dim2.toFixed(1);
  document.getElementById('dim3').value = dim3.toFixed(1);
  document.getElementById('dim4').value = dim4.toFixed(1);
  document.getElementById('dim5').value = dim5.toFixed(1);
  
  // Aggiorna i display
  aggiornaMappa();
}

/**
 * Aggiorna la mappa quando i valori cambiano
 * - Legge i valori dai 5 slider
 * - Calcola la media
 * - Aggiorna il grafico radar
 * - Identifica il profilo
 * - Mostra il risultato
 */
function aggiornaMappa() {
  // Leggi valori dai slider
  const punteggi = [];
  for (let i = 1; i <= 5; i++) {
    const slider = document.getElementById(`dim${i}`);
    const value = parseFloat(slider.value);
    punteggi.push(value);
    
    // Aggiorna display valore
    const valueDisplay = document.getElementById(`dim${i}-value`);
    if (valueDisplay) {
      valueDisplay.textContent = value.toFixed(1);
    }
  }
  
  // Calcola media
  const media = punteggi.reduce((a, b) => a + b, 0) / punteggi.length;
  const averageScore = document.getElementById('average-score');
  const averageInterpretation = document.getElementById('average-interpretation');
  
  if (averageScore) {
    averageScore.textContent = media.toFixed(1);
  }
  
  // Interpretazione media
  if (averageInterpretation) {
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
  
  // Identifica livello
  const level = identificaLivello(media);
  const levelBadges = document.getElementById('level-badges');
  if (levelBadges) {
    const levelLower = level.toLowerCase();
    // Valida livello prima di usare
    const validLevel = typeof isValidLevel === 'function' && isValidLevel(levelLower) ? levelLower : 'basso';
    
    // Pulisci contenuto esistente
    levelBadges.innerHTML = '';
    
    if (typeof createSafeElement === 'function') {
      const badge = createSafeElement('span', {
        class: `level-badge ${validLevel}`
      }, `LIVELLO ${level.toUpperCase()}`);
      levelBadges.appendChild(badge);
    } else {
      // Fallback se utils.js non è caricato
      const badge = document.createElement('span');
      badge.className = `level-badge ${validLevel}`;
      badge.textContent = `LIVELLO ${level.toUpperCase()}`;
      levelBadges.appendChild(badge);
    }
  }
  
  // Aggiorna grafico radar
  disegnaGraficoRadar(punteggi);
  
  // Identifica profilo
  identificaProfilo(punteggi, media);
  
  // Salva in localStorage
  salvaMappa(punteggi, media);
}

/**
 * Identifica il livello basato sulla media
 * @param {number} media - Media complessiva
 * @returns {string} 'BASSO', 'MEDIO', o 'ALTO'
 */
function identificaLivello(media) {
  if (media >= 5 && media <= 6) {
    return 'BASSO';
  } else if (media >= 3.5 && media < 5) {
    return 'MEDIO';
  } else {
    return 'ALTO';
  }
}

/**
 * Identifica il profilo specifico basato sui punteggi
 * @param {Array<number>} punteggi - Array di 5 punteggi
 * @param {number} media - Media complessiva
 */
function identificaProfilo(punteggi, media) {
  const [dim1, dim2, dim3, dim4, dim5] = punteggi;
  
  // Determina stile prevalente dalla dimensione 1
  let stile = 'secure';
  let livello = identificaLivello(media);
  
  if (dim1 <= 4) {
    // Ansioso
    stile = 'ansioso';
  } else if (dim1 >= 6) {
    // Evitante
    stile = 'evitante';
  } else if (dim2 <= 3 && dim4 <= 3) {
    // Oscillante (oscillazione + frammentato)
    stile = 'disorganizzato';
  }
  
  // Mostra risultato
  const profileResult = document.getElementById('profile-result');
  const profileContent = document.getElementById('profile-content');
  
  if (profileResult && profileContent) {
    const stileNome = {
      'secure': 'Secure',
      'ansioso': 'Ansioso',
      'evitante': 'Evitante',
      'disorganizzato': 'Oscillante'
    };
    
    const livelloNome = livello.toLowerCase();
    
    // Valida stile e livello prima di creare URL
    const validStile = typeof isValidAttachmentStyle === 'function' && isValidAttachmentStyle(stile) ? stile : 'secure';
    const validLivello = typeof isValidLevel === 'function' && isValidLevel(livelloNome) ? livelloNome : 'basso';
    const profiloUrl = `profili/${validStile}-${validLivello}.html`;
    
    // Usa DOM API sicure invece di innerHTML
    profileContent.innerHTML = '';
    
    const title = typeof createSafeElement === 'function'
      ? createSafeElement('h3', {}, `${sanitizeHTML(stileNome[stile])} ${livello}`)
      : (() => {
          const h3 = document.createElement('h3');
          h3.textContent = `${stileNome[stile]} ${livello}`;
          return h3;
        })();
    profileContent.appendChild(title);
    
    const mediaP = typeof createSafeElement === 'function'
      ? createSafeElement('p', {})
      : document.createElement('p');
    mediaP.appendChild(typeof createSafeElement === 'function' ? createSafeElement('strong', {}, 'Media complessiva: ') : (() => {
      const strong = document.createElement('strong');
      strong.textContent = 'Media complessiva: ';
      return strong;
    })());
    mediaP.appendChild(document.createTextNode(`${media.toFixed(1)}/10`));
    profileContent.appendChild(mediaP);
    
    const punteggiP = typeof createSafeElement === 'function'
      ? createSafeElement('p', {})
      : document.createElement('p');
    punteggiP.appendChild(typeof createSafeElement === 'function' ? createSafeElement('strong', {}, 'I tuoi punteggi: ') : (() => {
      const strong = document.createElement('strong');
      strong.textContent = 'I tuoi punteggi: ';
      return strong;
    })());
    profileContent.appendChild(punteggiP);
    
    const punteggiList = typeof createSafeElement === 'function'
      ? createSafeElement('ul', {
          style: { marginLeft: 'var(--spacing-6)', marginTop: 'var(--spacing-4)' }
        })
      : (() => {
          const ul = document.createElement('ul');
          ul.style.marginLeft = 'var(--spacing-6)';
          ul.style.marginTop = 'var(--spacing-4)';
          return ul;
        })();
    
    const dimensioni = [
      'Ansia ↔ Evitamento',
      'Finestra di Tolleranza',
      'Coscienza dell\'Attaccamento',
      'Capacità di Integrazione',
      'Resilienza Relazionale'
    ];
    
    dimensioni.forEach((dim, index) => {
      const li = typeof createSafeElement === 'function'
        ? createSafeElement('li', {}, `${dim}: ${punteggi[index].toFixed(1)}/10`)
        : (() => {
            const li = document.createElement('li');
            li.textContent = `${dim}: ${punteggi[index].toFixed(1)}/10`;
            return li;
          })();
      punteggiList.appendChild(li);
    });
    profileContent.appendChild(punteggiList);
    
    const profileLinkP = typeof createSafeElement === 'function'
      ? createSafeElement('p', { style: { marginTop: 'var(--spacing-4)' } })
      : (() => {
          const p = document.createElement('p');
          p.style.marginTop = 'var(--spacing-4)';
          return p;
        })();
    
    const profileLink = typeof createSafeElement === 'function'
      ? createSafeElement('a', {
          href: profiloUrl,
          class: 'btn btn-primary'
        }, `Vedi il Profilo Completo: ${sanitizeHTML(stileNome[stile])} ${livello}`)
      : (() => {
          const a = document.createElement('a');
          a.href = profiloUrl;
          a.className = 'btn btn-primary';
          a.textContent = `Vedi il Profilo Completo: ${stileNome[stile]} ${livello}`;
          return a;
        })();
    profileLinkP.appendChild(profileLink);
    profileContent.appendChild(profileLinkP);
    
    const eserciziLinkP = typeof createSafeElement === 'function'
      ? createSafeElement('p', { style: { marginTop: 'var(--spacing-4)' } })
      : (() => {
          const p = document.createElement('p');
          p.style.marginTop = 'var(--spacing-4)';
          return p;
        })();
    
    const eserciziLink = typeof createSafeElement === 'function'
      ? createSafeElement('a', {
          href: 'esercizi.html',
          class: 'btn btn-secondary'
        }, 'Vedi Esercizi Specifici')
      : (() => {
          const a = document.createElement('a');
          a.href = 'esercizi.html';
          a.className = 'btn btn-secondary';
          a.textContent = 'Vedi Esercizi Specifici';
          return a;
        })();
    eserciziLinkP.appendChild(eserciziLink);
    profileContent.appendChild(eserciziLinkP);
    
    profileResult.style.display = 'block';
  }
}

// Variabile globale per il chart
let radarChart = null;

/**
 * Disegna il grafico radar usando Chart.js
 * @param {Array<number>} punteggi - Array di 5 punteggi (0-10)
 */
function disegnaGraficoRadar(punteggi) {
  const canvas = document.getElementById('radar-chart');
  if (!canvas) return;
  
  // Verifica che Chart.js sia caricato
  if (typeof isChartJSLoaded === 'function' && !isChartJSLoaded()) {
    showChartJSError();
    return;
  } else if (typeof Chart === 'undefined') {
    showChartJSError();
    return;
  }
  
  // Valida punteggi usando costanti
  const expectedDimensions = typeof MAP_CONSTANTS !== 'undefined' 
    ? MAP_CONSTANTS.DIMENSIONS_COUNT 
    : 5;
  const minScore = typeof MAP_CONSTANTS !== 'undefined' ? MAP_CONSTANTS.MIN_SCORE : 0;
  const maxScore = typeof MAP_CONSTANTS !== 'undefined' ? MAP_CONSTANTS.MAX_SCORE : 10;
  
  if (!Array.isArray(punteggi) || punteggi.length !== expectedDimensions) {
    if (typeof Logger !== 'undefined' && Logger.error) {
      Logger.error('Punteggi non validi per radar chart:', punteggi);
    } else if (window.DEBUG_MODE) {
      console.error('Punteggi non validi per radar chart:', punteggi);
    }
    return;
  }
  
  // Valida che tutti i punteggi siano numeri nel range valido
  for (let i = 0; i < punteggi.length; i++) {
    const score = parseFloat(punteggi[i]);
    if (isNaN(score) || score < minScore || score > maxScore) {
      if (typeof Logger !== 'undefined' && Logger.error) {
        Logger.error(`Punteggio non valido alla posizione ${i}:`, punteggi[i]);
      } else if (window.DEBUG_MODE) {
        console.error(`Punteggio non valido alla posizione ${i}:`, punteggi[i]);
      }
      return;
    }
    punteggi[i] = score; // Normalizza a numero
  }
  
  // Ottieni colori dal tema
  const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--color-accent-secure') || '#a8d5ba';
  const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--color-border') || 'rgba(184, 169, 212, 0.2)';
  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text-primary') || '#e8e8e8';
  const textSecondary = getComputedStyle(document.documentElement).getPropertyValue('--color-text-secondary') || '#b8b8b8';
  
  // Distruggi il chart esistente se presente
  if (radarChart) {
    radarChart.destroy();
  }
  
  // Crea nuovo chart con error handling
  try {
    const ctx = canvas.getContext('2d');
    radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: [
        'Ansia ↔ Evitamento',
        'Finestra di Tolleranza',
        'Coscienza dell\'Attaccamento',
        'Capacità di Integrazione',
        'Resilienza Relazionale'
      ],
      datasets: [{
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
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          max: 10,
          min: 0,
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
      },
      plugins: {
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
      }
    }
  });
}

/**
 * Salva la mappa in localStorage
 * @param {Array<number>} punteggi - Array di 5 punteggi
 * @param {number} media - Media complessiva
 */
function salvaMappa(punteggi, media) {
  const mappaData = {
    punteggi: punteggi,
    media: media,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('mappaPersonale', JSON.stringify(mappaData));
}

