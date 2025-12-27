/**
 * Cookie Banner - Gestione semplice del consenso cookie
 * Mostra un banner informativo sui cookie tecnici
 */

(function() {
  'use strict';

  const COOKIE_CONSENT_KEY = 'cookie_consent';
  const COOKIE_CONSENT_EXPIRY_DAYS = 365;

  /**
   * Verifica se l'utente ha già dato il consenso
   */
  function hasConsent() {
    return localStorage.getItem(COOKIE_CONSENT_KEY) === 'accepted';
  }

  /**
   * Salva il consenso dell'utente
   */
  function saveConsent() {
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + (COOKIE_CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000));
    
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    localStorage.setItem(COOKIE_CONSENT_KEY + '_date', expiryDate.toISOString());
  }

  /**
   * Crea e mostra il banner
   */
  function createBanner() {
    // Crea il container del banner
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Informativa sui cookie');

    // Contenuto del banner
    banner.innerHTML = `
      <div class="cookie-banner__content">
        <p class="cookie-banner__text">
          Questo sito utilizza cookie tecnici necessari per il funzionamento. 
          Continuando a navigare, accetti l'utilizzo di questi cookie. 
          <a href="cookie-policy.html" class="cookie-banner__link">Maggiori informazioni</a>
        </p>
        <div class="cookie-banner__actions">
          <button class="cookie-banner__button cookie-banner__button--accept" id="cookie-accept">
            Accetta
          </button>
          <button class="cookie-banner__button cookie-banner__button--close" id="cookie-close" aria-label="Chiudi">
            ✕
          </button>
        </div>
      </div>
    `;

    // Aggiungi il banner al body
    document.body.appendChild(banner);

    // Event listeners
    const acceptButton = document.getElementById('cookie-accept');
    const closeButton = document.getElementById('cookie-close');

    acceptButton.addEventListener('click', handleAccept);
    closeButton.addEventListener('click', handleClose);

    // Mostra il banner con animazione
    setTimeout(() => {
      banner.classList.add('cookie-banner--visible');
    }, 100);
  }

  /**
   * Gestisce l'accettazione
   */
  function handleAccept() {
    saveConsent();
    hideBanner();
  }

  /**
   * Gestisce la chiusura
   */
  function handleClose() {
    hideBanner();
  }

  /**
   * Nasconde il banner
   */
  function hideBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.classList.remove('cookie-banner--visible');
      setTimeout(() => {
        banner.remove();
      }, 300);
    }
  }

  /**
   * Inizializza il banner quando il DOM è pronto
   */
  function init() {
    // Non mostrare il banner se l'utente ha già dato il consenso
    if (hasConsent()) {
      return;
    }

    // Aspetta che il DOM sia caricato
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createBanner);
    } else {
      createBanner();
    }
  }

  // Avvia l'inizializzazione
  init();

})();

