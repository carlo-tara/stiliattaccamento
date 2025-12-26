// test-surveyjs.js
// Integrazione SurveyJS per il test di auto-valutazione

document.addEventListener('DOMContentLoaded', () => {
  initSurvey();
});

/**
 * Inizializza SurveyJS con il JSON schema
 */
async function initSurvey() {
  try {
    // Carica il JSON schema
    const response = await fetch('js/test-survey.json');
    const surveyJson = await response.json();
    
    // Crea l'istanza Survey
    const survey = new Survey.Survey(surveyJson);
    
    // Personalizza il tema per adattarlo al design system
    survey.applyTheme({
      colorPalette: 'light',
      isPanelless: false,
      font: {
        family: 'var(--font-family-base)',
        size: 'var(--font-size-base)'
      },
      color: {
        primary: 'var(--color-accent-secure)',
        primaryLight: 'var(--color-accent-secure)',
        primaryForeground: 'var(--color-bg-primary)',
        background: 'var(--color-surface)',
        backgroundDim: 'var(--color-surface-elevated)',
        foreground: 'var(--color-text-primary)',
        foregroundLight: 'var(--color-text-secondary)',
        border: 'var(--color-border)',
        borderLight: 'rgba(184, 169, 212, 0.1)',
        error: '#f4a5ae',
        headerBackground: 'var(--color-surface)',
        headerForeground: 'var(--color-text-primary)',
        headerTitle: 'var(--color-text-primary)',
        headerDescription: 'var(--color-text-secondary)',
        shadows: 'none'
      },
      font: {
        family: 'var(--font-family-base)',
        size: 'var(--font-size-base)',
        weight: '400',
        lineHeight: 'var(--line-height-normal)'
      },
      spacing: {
        baseUnit: 4,
        small: 'var(--spacing-2)',
        medium: 'var(--spacing-4)',
        large: 'var(--spacing-6)'
      },
      borderRadius: {
        small: 'var(--radius-sm)',
        medium: 'var(--radius-md)',
        large: 'var(--radius-lg)'
      }
    });
    
    // Event handler per il completamento
    survey.onComplete.add((sender) => {
      calculateTestResults(sender.data);
    });
    
    // Renderizza il survey
    survey.render('surveyContainer');
    
  } catch (error) {
    console.error('Errore nel caricamento del survey:', error);
    document.getElementById('surveyContainer').innerHTML = 
      '<div class="card" style="background-color: rgba(244, 165, 174, 0.1); padding: var(--spacing-6);">' +
      '<p><strong>Errore:</strong> Impossibile caricare il test. Ricarica la pagina.</p>' +
      '</div>';
  }
}

/**
 * Calcola i risultati del test dai dati SurveyJS
 * @param {Object} data - Dati del survey completato
 */
function calculateTestResults(data) {
  let scores = {
    anxious: 0,
    secure: 0,
    avoidant: 0,
    disorganized: 0
  };
  
  // Mappa delle risposte ai punteggi
  // A = Ansioso (3 punti), B = Secure (1 punto), C = Evitante (2 punti), D = Disorganizzato (3 punti)
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (value === 'A') scores.anxious += 3;
    if (value === 'B') scores.secure += 1;
    if (value === 'C') scores.avoidant += 2;
    if (value === 'D') scores.disorganized += 3;
  });
  
  // Determina stile primario e livello
  const maxScore = Math.max(scores.anxious, scores.secure, scores.avoidant, scores.disorganized);
  let primaryStyle = 'secure';
  let level = 'basso';
  
  if (scores.anxious === maxScore) {
    primaryStyle = 'ansioso';
    if (scores.anxious >= 10) level = 'alto';
    else if (scores.anxious >= 7) level = 'medio';
    else level = 'basso';
  } else if (scores.avoidant === maxScore) {
    primaryStyle = 'evitante';
    if (scores.avoidant >= 10) level = 'alto';
    else if (scores.avoidant >= 7) level = 'medio';
    else level = 'basso';
  } else if (scores.disorganized === maxScore) {
    primaryStyle = 'disorganizzato';
    if (scores.disorganized >= 10) level = 'alto';
    else if (scores.disorganized >= 7) level = 'medio';
    else level = 'basso';
  } else {
    // Secure
    if (scores.secure >= 10) level = 'alto';
    else if (scores.secure >= 7) level = 'medio';
    else level = 'basso';
  }
  
  // Salva risultati
  const testResults = {
    scores,
    primaryStyle,
    level,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem('testResults', JSON.stringify(testResults));
  
  // Mostra risultati
  showTestResults(scores, primaryStyle, level);
}

/**
 * Mostra i risultati del test
 */
function showTestResults(scores, primaryStyle, level) {
  const resultsDiv = document.getElementById('results');
  const resultsContent = document.getElementById('results-content');
  
  if (!resultsDiv || !resultsContent) return;
  
  const styleNames = {
    'secure': 'Secure',
    'ansioso': 'Ansioso',
    'evitante': 'Evitante',
    'disorganizzato': 'Disorganizzato'
  };
  
  const levelNames = {
    'basso': 'Basso',
    'medio': 'Medio',
    'alto': 'Alto'
  };
  
  const totalQuestions = 12;
  const maxPossible = {
    anxious: totalQuestions * 3,
    secure: totalQuestions * 1,
    avoidant: totalQuestions * 2,
    disorganized: totalQuestions * 3
  };
  
  resultsContent.innerHTML = `
    <h3>Il Tuo Profilo: ${styleNames[primaryStyle]} ${levelNames[level]}</h3>
    <p><strong>Stile prevalente:</strong> ${styleNames[primaryStyle]}</p>
    <p><strong>Livello:</strong> ${levelNames[level]}</p>
    
    <h4 style="margin-top: var(--spacing-6);">I Tuoi Punteggi:</h4>
    <ul style="margin-left: var(--spacing-6); margin-top: var(--spacing-4);">
      <li>Ansioso: ${scores.anxious}/${maxPossible.anxious}</li>
      <li>Secure: ${scores.secure}/${maxPossible.secure}</li>
      <li>Evitante: ${scores.avoidant}/${maxPossible.avoidant}</li>
      <li>Disorganizzato: ${scores.disorganized}/${maxPossible.disorganized}</li>
    </ul>
    
    <div style="margin-top: var(--spacing-6); display: flex; gap: var(--spacing-4); flex-wrap: wrap;">
      <a href="profili/${primaryStyle}-${level}.html" class="btn btn-primary">Vedi Profilo Completo</a>
      <a href="mappa-personale.html" class="btn btn-secondary">Crea Mappa Personale</a>
    </div>
    
    <div style="margin-top: var(--spacing-6); padding: var(--spacing-4); background-color: var(--color-surface-elevated); border-radius: var(--radius-md);">
      <p><strong>Prossimi Passi:</strong></p>
      <ul style="margin-left: var(--spacing-6); margin-top: var(--spacing-2);">
        <li>Esplora il tuo profilo completo per capire meglio le tue caratteristiche</li>
        <li>Crea la tua Mappa Personale per visualizzare il tuo profilo su 5 dimensioni</li>
        <li>Consulta gli esercizi specifici per il tuo stile e livello</li>
      </ul>
    </div>
  `;
  
  resultsDiv.style.display = 'block';
  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

