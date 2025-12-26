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
      const results = JSON.parse(testResults);
      calcolaDaTest(results);
    } catch (e) {
      console.log('Nessun risultato test disponibile, usa valori di default');
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
  // Disorganizzato = Oscilla (medio, 3-7)
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
    levelBadges.innerHTML = `<span class="level-badge ${level.toLowerCase()}">LIVELLO ${level.toUpperCase()}</span>`;
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
    // Disorganizzato (oscillazione + frammentato)
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
      'disorganizzato': 'Disorganizzato'
    };
    
    const livelloNome = livello.toLowerCase();
    const profiloUrl = `profili/${stile}-${livelloNome}.html`;
    
    profileContent.innerHTML = `
      <h3>${stileNome[stile]} ${livello}</h3>
      <p><strong>Media complessiva:</strong> ${media.toFixed(1)}/10</p>
      <p><strong>I tuoi punteggi:</strong></p>
      <ul style="margin-left: var(--spacing-6); margin-top: var(--spacing-4);">
        <li>Ansia ↔ Evitamento: ${dim1.toFixed(1)}/10</li>
        <li>Finestra di Tolleranza: ${dim2.toFixed(1)}/10</li>
        <li>Coscienza dell'Attaccamento: ${dim3.toFixed(1)}/10</li>
        <li>Capacità di Integrazione: ${dim4.toFixed(1)}/10</li>
        <li>Resilienza Relazionale: ${dim5.toFixed(1)}/10</li>
      </ul>
      <p style="margin-top: var(--spacing-4);">
        <a href="${profiloUrl}" class="btn btn-primary">Vedi il Profilo Completo: ${stileNome[stile]} ${livello}</a>
      </p>
      <p style="margin-top: var(--spacing-4);">
        <a href="esercizi.html" class="btn btn-secondary">Vedi Esercizi Specifici</a>
      </p>
    `;
    
    profileResult.style.display = 'block';
  }
}

/**
 * Disegna il grafico radar usando Canvas
 * @param {Array<number>} punteggi - Array di 5 punteggi (0-10)
 */
function disegnaGraficoRadar(punteggi) {
  const canvas = document.getElementById('radar-chart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 40;
  
  // Pulisci canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Nomi delle dimensioni
  const dimensioni = [
    'Ansia↔Evitamento',
    'Finestra Tolleranza',
    'Coscienza',
    'Integrazione',
    'Resilienza'
  ];
  
  // Colore pastello basato sul tema
  const color = getComputedStyle(document.documentElement).getPropertyValue('--color-accent-secure') || '#a8d5ba';
  
  // Disegna griglia (cerchi concentrici)
  ctx.strokeStyle = 'rgba(128, 128, 128, 0.2)';
  ctx.lineWidth = 1;
  for (let i = 1; i <= 5; i++) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, (radius * i) / 5, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // Disegna assi (linee radiali)
  ctx.strokeStyle = 'rgba(128, 128, 128, 0.3)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Etichette
    ctx.fillStyle = 'var(--color-text-primary)';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    const labelX = centerX + Math.cos(angle) * (radius + 20);
    const labelY = centerY + Math.sin(angle) * (radius + 20);
    ctx.fillText(dimensioni[i], labelX, labelY);
  }
  
  // Disegna area dati
  ctx.fillStyle = color + '80'; // 50% opacity
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const value = punteggi[i] / 10; // Normalizza a 0-1
    const r = radius * value;
    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Disegna punti
  ctx.fillStyle = color;
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const value = punteggi[i] / 10;
    const r = radius * value;
    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
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

