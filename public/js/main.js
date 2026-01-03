// Main JavaScript - Stili di Attaccamento Wiki

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initTest();
});

// Theme initialization
function initTheme() {
  const theme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
}

// Navigation
function initNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
}

// Test functionality
function initTest() {
  const testForm = document.getElementById('test-form');
  if (!testForm) return;
  
  testForm.addEventListener('submit', (e) => {
    e.preventDefault();
    calculateTestResults();
  });
}

function calculateTestResults() {
  const form = document.getElementById('test-form');
  const formData = new FormData(form);
  
  let scores = {
    anxious: 0,
    secure: 0,
    avoidant: 0,
    disorganized: 0
  };
  
  // Calculate scores from form data
  for (const [key, value] of formData.entries()) {
    if (value === 'A') scores.anxious += 3;
    if (value === 'B') scores.secure += 1;
    if (value === 'C') scores.avoidant += 2;
    if (value === 'D') scores.disorganized += 3;
  }
  
  // Determine primary style
  const maxScore = Math.max(scores.anxious, scores.secure, scores.avoidant, scores.disorganized);
  let primaryStyle = 'secure';
  let level = 'basso';
  
  if (scores.anxious === maxScore) {
    primaryStyle = 'ansioso';
    if (scores.anxious >= 10) level = 'alto';
    else if (scores.anxious >= 7) level = 'medio';
  } else if (scores.avoidant === maxScore) {
    primaryStyle = 'evitante';
    if (scores.avoidant >= 10) level = 'alto';
    else if (scores.avoidant >= 7) level = 'medio';
  } else if (scores.disorganized === maxScore) {
    primaryStyle = 'disorganizzato';
    if (scores.disorganized >= 10) level = 'alto';
    else if (scores.disorganized >= 7) level = 'medio';
  } else {
    if (scores.secure >= 7) level = 'medio';
    if (scores.secure >= 10) level = 'alto';
  }
  
  // Store results
  const testResults = {
    scores,
    primaryStyle,
    level,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem('testResults', JSON.stringify(testResults));
  
  // Show results
  showTestResults(scores, primaryStyle, level);
}

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
  
  const maxScore = Math.max(scores.anxious, scores.secure, scores.avoidant, scores.disorganized);
  const totalQuestions = 12; // Assumendo 12 domande
  
  // Usa DOM API sicure invece di innerHTML (se utils.js è disponibile)
  // Fallback a innerHTML con sanitizzazione se utils.js non è caricato
  if (typeof createSafeElement === 'function' && typeof sanitizeHTML === 'function') {
    resultsContent.innerHTML = '';
    
    const title = createSafeElement('h3', {}, `Il Tuo Profilo: ${sanitizeHTML(styleNames[primaryStyle])} ${sanitizeHTML(levelNames[level])}`);
    resultsContent.appendChild(title);
    
    const styleP = createSafeElement('p', {});
    styleP.appendChild(createSafeElement('strong', {}, 'Stile prevalente: '));
    styleP.appendChild(document.createTextNode(sanitizeHTML(styleNames[primaryStyle])));
    resultsContent.appendChild(styleP);
    
    const levelP = createSafeElement('p', {});
    levelP.appendChild(createSafeElement('strong', {}, 'Livello: '));
    levelP.appendChild(document.createTextNode(sanitizeHTML(levelNames[level])));
    resultsContent.appendChild(levelP);
    
    const scoresTitle = createSafeElement('h4', {
      style: { marginTop: 'var(--spacing-6)' }
    }, 'I Tuoi Punteggi:');
    resultsContent.appendChild(scoresTitle);
    
    const scoresList = createSafeElement('ul', {
      style: { marginLeft: 'var(--spacing-6)', marginTop: 'var(--spacing-4)' }
    });
    
    const scoreItems = [
      `Ansioso: ${scores.anxious}/${totalQuestions * 3}`,
      `Secure: ${scores.secure}/${totalQuestions * 1}`,
      `Evitante: ${scores.avoidant}/${totalQuestions * 2}`,
      `Oscillante: ${scores.disorganized}/${totalQuestions * 3}`
    ];
    
    scoreItems.forEach(text => {
      const li = createSafeElement('li', {}, text);
      scoresList.appendChild(li);
    });
    resultsContent.appendChild(scoresList);
    
    const actionsDiv = createSafeElement('div', {
      style: {
        marginTop: 'var(--spacing-6)',
        display: 'flex',
        gap: 'var(--spacing-4)',
        flexWrap: 'wrap'
      }
    });
    
    // Valida URL prima di creare link
    const profileUrl = (typeof isValidAttachmentStyle === 'function' && isValidAttachmentStyle(primaryStyle) &&
                       typeof isValidLevel === 'function' && isValidLevel(level))
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
    
    resultsContent.appendChild(actionsDiv);
    
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
      'Consulta gli esercizi specifici per il tuo stile e livello'
    ];
    
    nextSteps.forEach(text => {
      const li = createSafeElement('li', {}, text);
      nextStepsList.appendChild(li);
    });
    nextStepsDiv.appendChild(nextStepsList);
    resultsContent.appendChild(nextStepsDiv);
  } else {
    // Fallback: usa innerHTML con escape manuale (meno sicuro ma funziona)
    const escapeHTML = (str) => {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    };
    
    const validStyle = ['secure', 'ansioso', 'evitante', 'disorganizzato'].includes(primaryStyle) ? primaryStyle : 'secure';
    const validLevel = ['basso', 'medio', 'alto'].includes(level) ? level : 'basso';
    const profileUrl = `profili/${validStyle}-${validLevel}.html`;
    
    resultsContent.innerHTML = `
      <h3>Il Tuo Profilo: ${escapeHTML(styleNames[primaryStyle])} ${escapeHTML(levelNames[level])}</h3>
      <p><strong>Stile prevalente:</strong> ${escapeHTML(styleNames[primaryStyle])}</p>
      <p><strong>Livello:</strong> ${escapeHTML(levelNames[level])}</p>
      
      <h4 style="margin-top: var(--spacing-6);">I Tuoi Punteggi:</h4>
      <ul style="margin-left: var(--spacing-6); margin-top: var(--spacing-4);">
        <li>Ansioso: ${scores.anxious}/${totalQuestions * 3}</li>
        <li>Secure: ${scores.secure}/${totalQuestions * 1}</li>
        <li>Evitante: ${scores.avoidant}/${totalQuestions * 2}</li>
        <li>Oscillante: ${scores.disorganized}/${totalQuestions * 3}</li>
      </ul>
      
      <div style="margin-top: var(--spacing-6); display: flex; gap: var(--spacing-4); flex-wrap: wrap;">
        <a href="${profileUrl}" class="btn btn-primary">Vedi Profilo Completo</a>
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
  }
  
  resultsDiv.style.display = 'block';
  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

