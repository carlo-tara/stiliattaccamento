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
    'disorganizzato': 'Disorganizzato'
  };
  
  const levelNames = {
    'basso': 'Basso',
    'medio': 'Medio',
    'alto': 'Alto'
  };
  
  const maxScore = Math.max(scores.anxious, scores.secure, scores.avoidant, scores.disorganized);
  const totalQuestions = 12; // Assumendo 12 domande
  
  resultsContent.innerHTML = `
    <h3>Il Tuo Profilo: ${styleNames[primaryStyle]} ${levelNames[level]}</h3>
    <p><strong>Stile prevalente:</strong> ${styleNames[primaryStyle]}</p>
    <p><strong>Livello:</strong> ${levelNames[level]}</p>
    
    <h4 style="margin-top: var(--spacing-6);">I Tuoi Punteggi:</h4>
    <ul style="margin-left: var(--spacing-6); margin-top: var(--spacing-4);">
      <li>Ansioso: ${scores.anxious}/${totalQuestions * 3}</li>
      <li>Secure: ${scores.secure}/${totalQuestions * 1}</li>
      <li>Evitante: ${scores.avoidant}/${totalQuestions * 2}</li>
      <li>Disorganizzato: ${scores.disorganized}/${totalQuestions * 3}</li>
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

