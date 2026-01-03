// test-surveyjs.js
// Integrazione SurveyJS per il test di auto-valutazione

document.addEventListener('DOMContentLoaded', () => {
  // Verifica che SurveyJS sia caricato
  if (typeof isSurveyJSLoaded === 'function' && !isSurveyJSLoaded()) {
    showSurveyJSError();
    return;
  } else if (typeof Survey === 'undefined' || typeof Survey.Survey === 'undefined') {
    showSurveyJSError();
    return;
  }
  initSurvey();
});

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
    
    // Crea l'istanza Survey
    const survey = new Survey.Survey(surveyJson);
    
    // Personalizza il tema per adattarlo al design system
    const theme = typeof getSurveyJSTheme === 'function' 
      ? getSurveyJSTheme() 
      : getSurveyJSTheme(); // Fallback se non disponibile
    survey.applyTheme(theme);
    
    // Event handler per il completamento
    survey.onComplete.add((sender) => {
      calculateTestResults(sender.data);
    });
    
    // Renderizza il survey
    survey.render('surveyContainer');
    
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
    'disorganizzato': 'Oscillante'
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
  
  // Usa DOM API sicure invece di innerHTML
  resultsContent.innerHTML = ''; // Pulisci contenuto esistente
  
  // Messaggio Empatico Introduttivo
  const introCard = createSafeElement('div', {
    style: {
      background: 'linear-gradient(135deg, rgba(168, 213, 186, 0.1) 0%, rgba(168, 213, 186, 0.05) 100%)',
      borderLeft: '4px solid var(--color-accent-secure)',
      padding: 'var(--spacing-6)',
      borderRadius: 'var(--radius-md)',
      marginBottom: 'var(--spacing-6)'
    }
  });
  
  const introTitle = createSafeElement('h3', {
    style: { color: 'var(--color-accent-secure)', marginTop: '0' }
  }, 'Il Tuo Profilo: ' + sanitizeHTML(styleNames[primaryStyle]) + ' ' + sanitizeHTML(levelNames[level]));
  introCard.appendChild(introTitle);
  
  const introText = createSafeElement('p', {
    style: { fontSize: 'var(--font-size-lg)' }
  }, 'Non c\'è nulla di sbagliato in te. Questo profilo descrive semplicemente come hai imparato a relazionarti con gli altri. Non è un\'etichetta o un giudizio - è un punto di partenza per acquisire consapevolezza.');
  introCard.appendChild(introText);
  
  resultsContent.appendChild(introCard);
  
  // Sezione "Cosa significa questo per te?"
  const meaningCard = createSafeElement('div', {
    style: {
      backgroundColor: 'var(--color-surface-elevated)',
      padding: 'var(--spacing-6)',
      borderRadius: 'var(--radius-md)',
      marginBottom: 'var(--spacing-6)'
    }
  });
  
  const meaningTitle = createSafeElement('h3', {}, 'Cosa significa questo per te?');
  meaningCard.appendChild(meaningTitle);
  
  const meaningText = createSafeElement('p', {}, '');
  const meaningDescriptions = {
    'secure': 'Hai sviluppato un modo sano di relazionarti con gli altri. Riesci a bilanciare indipendenza e intimità, e generalmente ti senti a tuo agio nelle relazioni.',
    'ansioso': 'Tendi a cercare rassicurazione e vicinanza nelle relazioni. Potresti preoccuparti dell\'abbandono e avere bisogno di conferme frequenti. Questo non significa che sei "troppo" - significa semplicemente che hai bisogno di più sicurezza nelle relazioni.',
    'evitante': 'Tendi a valorizzare l\'indipendenza e potresti sentirti a disagio con troppa vicinanza. Non significa che non ami o non ti importi - significa che hai imparato a proteggerti mantenendo una certa distanza.',
    'disorganizzato': 'Potresti oscillare tra desiderio di vicinanza e bisogno di distanza. Le relazioni possono sembrare confuse o contraddittorie. Non sei "rotto" - hai semplicemente imparato pattern complessi che ora puoi osservare e comprendere meglio.'
  };
  
  meaningText.appendChild(document.createTextNode(meaningDescriptions[primaryStyle] || 'Ogni stile di attaccamento ha le sue caratteristiche. Il tuo profilo ti aiuta a capire meglio i tuoi pattern e come lavorare con loro, non contro di loro.'));
  meaningCard.appendChild(meaningText);
  
  resultsContent.appendChild(meaningCard);
  
  // Stile prevalente e livello (in formato più compatto)
  const infoDiv = createSafeElement('div', {
    style: {
      display: 'flex',
      gap: 'var(--spacing-4)',
      flexWrap: 'wrap',
      marginBottom: 'var(--spacing-6)'
    }
  });
  
  const styleBadge = createSafeElement('div', {
    style: {
      padding: 'var(--spacing-2) var(--spacing-4)',
      backgroundColor: 'var(--color-accent)',
      color: 'white',
      borderRadius: 'var(--radius-md)',
      fontSize: 'var(--font-size-sm)'
    }
  });
  styleBadge.appendChild(document.createTextNode('Stile: ' + sanitizeHTML(styleNames[primaryStyle])));
  infoDiv.appendChild(styleBadge);
  
  const levelBadge = createSafeElement('div', {
    style: {
      padding: 'var(--spacing-2) var(--spacing-4)',
      backgroundColor: 'var(--color-surface-elevated)',
      borderRadius: 'var(--radius-md)',
      fontSize: 'var(--font-size-sm)'
    }
  });
  levelBadge.appendChild(document.createTextNode('Livello: ' + sanitizeHTML(levelNames[level])));
  infoDiv.appendChild(levelBadge);
  
  resultsContent.appendChild(infoDiv);
  
  // Punteggi
  const scoresTitle = createSafeElement('h4', {
    style: { marginTop: 'var(--spacing-6)' }
  }, 'I Tuoi Punteggi:');
  resultsContent.appendChild(scoresTitle);
  
  const scoresList = createSafeElement('ul', {
    style: { marginLeft: 'var(--spacing-6)', marginTop: 'var(--spacing-4)' }
  });
  
  const scoreItems = [
    `Ansioso: ${scores.anxious}/${maxPossible.anxious}`,
    `Secure: ${scores.secure}/${maxPossible.secure}`,
    `Evitante: ${scores.avoidant}/${maxPossible.avoidant}`,
    `Oscillante: ${scores.disorganized}/${maxPossible.disorganized}`
  ];
  
  scoreItems.forEach(text => {
    const li = createSafeElement('li', {}, text);
    scoresList.appendChild(li);
  });
  resultsContent.appendChild(scoresList);
  
  // Link azioni
  const actionsDiv = createSafeElement('div', {
    style: {
      marginTop: 'var(--spacing-6)',
      display: 'flex',
      gap: 'var(--spacing-4)',
      flexWrap: 'wrap'
    }
  });
  
  // Valida URL prima di creare link
  const profileUrl = isValidAttachmentStyle(primaryStyle) && isValidLevel(level) 
    ? `profili/${primaryStyle}-${level}.html` 
    : 'stili-base.html';
  
  const profileLink = createSafeElement('a', {
    href: profileUrl,
    class: 'btn btn-primary'
  }, 'Vedi Profilo Completo');
  actionsDiv.appendChild(profileLink);
  
  const mapLink = createSafeElement('a', {
    href: 'mappa-personale.html',
    class: 'btn btn-secondary'
  }, 'Crea Mappa Personale');
  actionsDiv.appendChild(mapLink);
  
  // Link a storie reali simili
  const storiesLink = createSafeElement('a', {
    href: 'storie-reali.html',
    class: 'btn btn-secondary'
  }, 'Leggi Storie Simili');
  actionsDiv.appendChild(storiesLink);
  
  resultsContent.appendChild(actionsDiv);
  
  // Link a "Quando cercare aiuto" se livello Alto
  if (level === 'alto') {
    const helpCard = createSafeElement('div', {
      style: {
        marginTop: 'var(--spacing-6)',
        padding: 'var(--spacing-6)',
        backgroundColor: 'rgba(244, 165, 174, 0.1)',
        borderLeft: '4px solid var(--color-accent)',
        borderRadius: 'var(--radius-md)'
      }
    });
    
    const helpTitle = createSafeElement('h4', {}, 'Supporto Professionale');
    helpCard.appendChild(helpTitle);
    
    const helpText = createSafeElement('p', {}, 'Con un livello Alto, potrebbe essere utile considerare il supporto di un professionista. Non c\'è vergogna nel cercare aiuto - è un atto di coraggio e cura di sé.');
    helpCard.appendChild(helpText);
    
    const helpLink = createSafeElement('a', {
      href: 'quando-cercare-aiuto.html',
      class: 'btn btn-primary',
      style: { marginTop: 'var(--spacing-4)', display: 'inline-block' }
    }, 'Scopri Quando Cercare Aiuto');
    helpCard.appendChild(helpLink);
    
    resultsContent.appendChild(helpCard);
  }
  
  // Prossimi passi
  const nextStepsDiv = createSafeElement('div', {
    style: {
      marginTop: 'var(--spacing-6)',
      padding: 'var(--spacing-4)',
      backgroundColor: 'var(--color-surface-elevated)',
      borderRadius: 'var(--radius-md)'
    }
  });
  
  const nextStepsTitle = createSafeElement('p', {});
  nextStepsTitle.appendChild(createSafeElement('strong', {}, 'Prossimi Passi:'));
  nextStepsDiv.appendChild(nextStepsTitle);
  
  const nextStepsList = createSafeElement('ul', {
    style: { marginLeft: 'var(--spacing-6)', marginTop: 'var(--spacing-2)' }
  });
  
  const nextSteps = [
    'Esplora il tuo profilo completo per capire meglio le tue caratteristiche',
    'Crea la tua Mappa Personale per visualizzare il tuo profilo su 5 dimensioni',
    'Consulta gli esercizi specifici per il tuo stile e livello',
    'Leggi storie di persone con un profilo simile al tuo'
  ];
  
  nextSteps.forEach(text => {
    const li = createSafeElement('li', {}, text);
    nextStepsList.appendChild(li);
  });
  nextStepsDiv.appendChild(nextStepsList);
  resultsContent.appendChild(nextStepsDiv);
  
  resultsDiv.style.display = 'block';
  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

