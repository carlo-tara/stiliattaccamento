/**
 * Cookie Banner - Gestione semplice del consenso cookie
 * Mostra un banner informativo sui cookie tecnici
 */

(function() {
  'use strict';

  const COOKIE_CONSENT_KEY = 'cookie_consent';
  const COOKIE_CONSENT_EXPIRY_DAYS = 365;

  function hasConsent() {
    return localStorage.getItem(COOKIE_CONSENT_KEY) === 'accepted';
  }

  function saveConsent() {
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + (COOKIE_CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000));

    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    localStorage.setItem(COOKIE_CONSENT_KEY + '_date', expiryDate.toISOString());
  }

  function hideBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.classList.remove('cookie-banner--visible');
      setTimeout(() => {
        banner.remove();
      }, 300);
    }
  }

  function onConsentGranted() {
    saveConsent();
    hideBanner();
    document.dispatchEvent(new CustomEvent('cookie-consent-accepted'));
    if (typeof window.initAnalyticsIfConsented === 'function') {
      window.initAnalyticsIfConsented();
    }
  }

  function handleAccept() {
    onConsentGranted();
  }

  function handleClose() {
    onConsentGranted();
  }

  function trapFocus(e) {
    const banner = document.getElementById('cookie-banner');
    if (!banner) {
      return;
    }

    const focusable = banner.querySelectorAll(
      'button, a[href]'
    );
    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      handleAccept();
      return;
    }
    trapFocus(e);
  }

  function createBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'true');
    banner.setAttribute('aria-label', 'Informativa sui cookie');
    banner.setAttribute('aria-describedby', 'cookie-banner-text');

    const policyHref = `${window.location.origin}/cookie-policy.html`;

    banner.innerHTML = `
      <div class="cookie-banner__content">
        <p class="cookie-banner__text" id="cookie-banner-text">
          Questo sito usa cookie tecnici necessari al funzionamento e, se acconsenti,
          cookie analitici (Google Analytics) per capire come viene usato il sito.
          Continuando a navigare, accetti entrambi.
          <a href="${policyHref}" class="cookie-banner__link">Maggiori informazioni</a>
        </p>
        <div class="cookie-banner__actions">
          <button type="button" class="cookie-banner__button cookie-banner__button--accept" id="cookie-accept">
            Accetta
          </button>
          <button type="button" class="cookie-banner__button cookie-banner__button--close" id="cookie-close" aria-label="Chiudi informativa cookie">
            <span aria-hidden="true">✕</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    const acceptButton = document.getElementById('cookie-accept');
    const closeButton = document.getElementById('cookie-close');

    acceptButton.addEventListener('click', handleAccept);
    closeButton.addEventListener('click', handleClose);
    banner.addEventListener('keydown', handleKeydown);

    setTimeout(() => {
      banner.classList.add('cookie-banner--visible');
      acceptButton.focus();
    }, 100);
  }

  function scheduleInit() {
    const run = () => {
      if (hasConsent()) {
        return;
      }
      createBanner();
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(run, { timeout: 2000 });
    } else {
      setTimeout(run, 1500);
    }
  }

  function init() {
    if (hasConsent()) {
      return;
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', scheduleInit);
    } else {
      scheduleInit();
    }
  }

  init();
})();
