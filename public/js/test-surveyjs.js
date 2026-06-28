// test-surveyjs.js
// Integrazione SurveyJS per il test di auto-valutazione

function isSurveyJSReady() {
  return typeof Survey !== 'undefined' && typeof Survey.Model === 'function';
}

function bootSurveyTest() {
  if (!isSurveyJSReady()) {
    showSurveyJSError();
    return;
  }
  initSurvey();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootSurveyTest);
} else {
  bootSurveyTest();
}

/**
 * Mostra errore se SurveyJS non è caricato
 */
function showSurveyJSError() {
  const container = document.getElementById('surveyContainer');
  if (!container) return;
  
  const errorDiv = createSafeElement('div', {
    class: 'card',
    style: {
      backgroundColor: 'rgba(244, 165, 174, 0.1)',
      padding: 'var(--spacing-6)'
    }
  });
  
  const errorMsg = createSafeElement('p', {}, '');
  errorMsg.appendChild(createSafeElement('strong', {}, 'Errore: '));
  errorMsg.appendChild(document.createTextNode('Impossibile caricare il test. Verifica la connessione internet e ricarica la pagina.'));
  errorDiv.appendChild(errorMsg);
  
  container.innerHTML = '';
  container.appendChild(errorDiv);
}

/**
 * Mostra un messaggio di errore generico
 * @param {string} message - Messaggio di errore
 */
function showError(message) {
  const resultsDiv = document.getElementById('results');
  const resultsContent = document.getElementById('results-content');
  
  if (!resultsDiv || !resultsContent) return;
  
  resultsContent.innerHTML = '';
  const errorP = createSafeElement('p', {
    style: {
      color: 'var(--color-accent-anxious)',
      padding: 'var(--spacing-4)'
    }
  }, message);
  resultsContent.appendChild(errorP);
  resultsDiv.style.display = 'block';
}

/**
 * Inizializza SurveyJS con il JSON schema
 */
async function initSurvey() {
  try {
    // Carica il JSON schema
    const response = await fetch('js/test-survey.json');
    const surveyJson = await response.json();

    const survey = new Survey.Model(surveyJson);

    const theme = typeof getSurveyJSTheme === 'function' ? getSurveyJSTheme() : null;
    if (theme && typeof survey.applyTheme === 'function') {
      survey.applyTheme(theme);
    }

    survey.onComplete.add((sender) => {
      calculateTestResults(sender.data);
    });

    const container = document.getElementById('surveyContainer');
    if (!container) {
      throw new Error('surveyContainer non trovato');
    }
    survey.render(container);
    registerWebMcpTestTools();
    
  } catch (error) {
    // Log error per debugging (solo se DEBUG_MODE è attivo)
    if (window.DEBUG_MODE) {
      console.error('Errore nel caricamento del survey:', error);
    }
    
    const container = document.getElementById('surveyContainer');
    if (container) {
      const errorDiv = createSafeElement('div', {
        class: 'card',
        style: {
          backgroundColor: 'rgba(244, 165, 174, 0.1)',
          padding: 'var(--spacing-6)'
        }
      });
      
      const errorMsg = createSafeElement('p', {}, 'Errore: Impossibile caricare il test. Ricarica la pagina.');
      const strong = createSafeElement('strong', {}, 'Errore: ');
      errorMsg.insertBefore(strong, errorMsg.firstChild);
      errorDiv.appendChild(errorMsg);
      
      container.innerHTML = '';
      container.appendChild(errorDiv);
    }
  }
}

/**
 * Calcola i risultati del test dai dati SurveyJS
 * @param {Object} data - Dati del survey completato
 */
function calculateTestResults(data) {
  // Valida input
  if (!data || typeof data !== 'object') {
    showError('Dati del test non validi');
    return;
  }
  
  let scores = {
    anxious: 0,
    secure: 0,
    avoidant: 0,
    disorganized: 0
  };
  
  // Mappa delle risposte ai punteggi
  // A = Ansioso (3 punti), B = Secure (1 punto), C = Evitante (2 punti), D = Oscillante (3 punti)
  Object.keys(data).forEach(key => {
    const value = data[key];
    // Valida che il valore sia una lettera valida
    if (value === 'A') scores.anxious += 3;
    else if (value === 'B') scores.secure += 1;
    else if (value === 'C') scores.avoidant += 2;
    else if (value === 'D') scores.disorganized += 3;
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

  if (typeof trackEvent === 'function') {
    trackEvent('test_completed', {
      attachment_style: primaryStyle,
      attachment_level: level,
    });
  }

  showTestResults(scores, primaryStyle, level);
}

const ATTACHMENT_TEST_QUESTION_COUNT = 12;
let webMcpTestToolsRegistered = false;

/**
 * Registra strumenti WebMCP imperativi per il test di attaccamento
 */
function registerWebMcpTestTools() {
  if (
    webMcpTestToolsRegistered ||
    typeof isWebMcpSupported !== 'function' ||
    !isWebMcpSupported()
  ) {
    return;
  }

  const answerProperties = buildAttachmentAnswerProperties(ATTACHMENT_TEST_QUESTION_COUNT);

  document.modelContext.registerTool({
    name: 'get_attachment_test_info',
    description:
      'Descrivi il test di auto-valutazione degli stili di attaccamento disponibile su questa pagina.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    execute: async () => JSON.stringify(getAttachmentTestInfoPayload()),
    annotations: {
      readOnlyHint: true,
    },
  });

  document.modelContext.registerTool({
    name: 'complete_attachment_test',
    description:
      'Completa il test di auto-valutazione con 12 risposte e mostra il profilo di attaccamento risultante.',
    inputSchema: {
      type: 'object',
      properties: answerProperties,
      required: Object.keys(answerProperties),
    },
    execute: async (answers) => {
      const validation = validateAttachmentAnswers(answers, ATTACHMENT_TEST_QUESTION_COUNT);
      if (!validation.valid) {
        return JSON.stringify({ status: 'error', message: validation.error });
      }

      calculateTestResults(validation.answers);
      return JSON.stringify({
        status: 'completed',
        message: 'Risultati del test calcolati e mostrati nella pagina.',
      });
    },
    annotations: {
      readOnlyHint: false,
      untrustedContentHint: true,
    },
  });

  webMcpTestToolsRegistered = true;
}

