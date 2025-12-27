// utils.js
// Utility functions per sicurezza e validazione

/**
 * Sanitizza una stringa per uso sicuro in HTML
 * Rimuove caratteri pericolosi e escape HTML entities
 * @param {string} str - Stringa da sanitizzare
 * @returns {string} Stringa sanitizzata
 */
function sanitizeHTML(str) {
  if (typeof str !== 'string') {
    return String(str);
  }
  
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Valida che un valore sia uno stile di attaccamento valido
 * @param {string} style - Stile da validare
 * @returns {boolean} True se valido
 */
function isValidAttachmentStyle(style) {
  const validStyles = ['secure', 'ansioso', 'evitante', 'disorganizzato', 'oscillante'];
  return validStyles.includes(style);
}

/**
 * Valida che un valore sia un livello valido
 * @param {string} level - Livello da validare
 * @returns {boolean} True se valido
 */
function isValidLevel(level) {
  const validLevels = ['basso', 'medio', 'alto'];
  return validLevels.includes(level);
}

/**
 * Valida i risultati del test da localStorage
 * @param {Object} data - Dati da validare
 * @returns {Object|null} Dati validati o null se invalidi
 */
function validateTestResults(data) {
  if (!data || typeof data !== 'object') {
    return null;
  }
  
  // Valida scores
  if (!data.scores || typeof data.scores !== 'object') {
    return null;
  }
  
  const { anxious, secure, avoidant, disorganized } = data.scores;
  
  // Valida che i punteggi siano numeri validi
  if (typeof anxious !== 'number' || typeof secure !== 'number' ||
      typeof avoidant !== 'number' || typeof disorganized !== 'number') {
    return null;
  }
  
  // Valida che i punteggi siano nel range atteso usando costanti se disponibili
  const maxAnxious = typeof TEST_SCORES !== 'undefined' ? TEST_SCORES.MAX_ANXIOUS : 36;
  const maxSecure = typeof TEST_SCORES !== 'undefined' ? TEST_SCORES.MAX_SECURE : 12;
  const maxAvoidant = typeof TEST_SCORES !== 'undefined' ? TEST_SCORES.MAX_AVOIDANT : 24;
  const maxDisorganized = typeof TEST_SCORES !== 'undefined' ? TEST_SCORES.MAX_DISORGANIZED : 36;
  
  if (anxious < 0 || anxious > maxAnxious || secure < 0 || secure > maxSecure ||
      avoidant < 0 || avoidant > maxAvoidant || disorganized < 0 || disorganized > maxDisorganized) {
    return null;
  }
  
  // Valida primaryStyle
  if (!data.primaryStyle || !isValidAttachmentStyle(data.primaryStyle)) {
    return null;
  }
  
  // Valida level
  if (!data.level || !isValidLevel(data.level)) {
    return null;
  }
  
  return data;
}

/**
 * Crea un elemento DOM in modo sicuro
 * @param {string} tag - Tag HTML
 * @param {Object} attributes - Attributi da applicare
 * @param {string|Node} content - Contenuto (testo o nodo)
 * @returns {HTMLElement} Elemento creato
 */
function createSafeElement(tag, attributes = {}, content = '') {
  const element = document.createElement(tag);
  
  // Applica attributi
  Object.keys(attributes).forEach(key => {
    if (key === 'style' && typeof attributes[key] === 'object') {
      // Se style è un oggetto, applica le proprietà CSS
      Object.keys(attributes[key]).forEach(prop => {
        element.style[prop] = attributes[key][prop];
      });
    } else if (key.startsWith('data-') || key === 'class' || key === 'id' || key === 'href') {
      // Attributi sicuri
      element.setAttribute(key, attributes[key]);
    }
  });
  
  // Aggiungi contenuto
  if (typeof content === 'string') {
    element.textContent = content;
  } else if (content instanceof Node) {
    element.appendChild(content);
  }
  
  return element;
}

/**
 * Verifica se Chart.js è disponibile
 * @returns {boolean} True se Chart.js è caricato
 */
function isChartJSLoaded() {
  return typeof Chart !== 'undefined';
}

/**
 * Verifica se SurveyJS è disponibile
 * @returns {boolean} True se SurveyJS è caricato
 */
function isSurveyJSLoaded() {
  return typeof Survey !== 'undefined' && typeof Survey.Survey !== 'undefined';
}

