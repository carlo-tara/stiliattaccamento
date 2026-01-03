// logger.js
// Utility centralizzata per logging

/**
 * Logger centralizzato
 * Gestisce il logging in modo consistente, rispettando DEBUG_MODE
 */
const Logger = {
  /**
   * Verifica se il debug è abilitato
   * @returns {boolean} True se DEBUG_MODE è attivo
   */
  isDebugEnabled() {
    return typeof window !== 'undefined' && window.DEBUG_MODE === true;
  },
  
  /**
   * Log di errore
   * @param {string} message - Messaggio di errore
   * @param {Error|Object} error - Oggetto errore opzionale
   */
  error(message, error = null) {
    if (this.isDebugEnabled()) {
      if (error) {
        console.error(message, error);
      } else {
        console.error(message);
      }
    }
  },
  
  /**
   * Log di warning
   * @param {string} message - Messaggio di warning
   * @param {Object} data - Dati opzionali
   */
  warn(message, data = null) {
    if (this.isDebugEnabled()) {
      if (data) {
        console.warn(message, data);
      } else {
        console.warn(message);
      }
    }
  },
  
  /**
   * Log informativo
   * @param {string} message - Messaggio informativo
   * @param {Object} data - Dati opzionali
   */
  info(message, data = null) {
    if (this.isDebugEnabled()) {
      if (data) {
        console.log(message, data);
      } else {
        console.log(message);
      }
    }
  },
  
  /**
   * Log di debug
   * @param {string} message - Messaggio di debug
   * @param {Object} data - Dati opzionali
   */
  debug(message, data = null) {
    if (this.isDebugEnabled()) {
      if (data) {
        console.debug(message, data);
      } else {
        console.debug(message);
      }
    }
  }
};

