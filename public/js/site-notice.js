/**
 * Site notice — informativa consenso cookie/analytics (bundled in site.min.js)
 */

(function() {
  'use strict';

  const CONSENT_KEY = 'cookie_consent';
  const CONSENT_DATE_KEY = 'cookie_consent_date';
  const EXPIRY_DAYS = 365;
  const VISIBILITY_MS = 100;
  const IDLE_TIMEOUT_MS = 2000;
  const IDLE_FALLBACK_MS = 1500;

  function readStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }

  function clearConsent() {
    try {
      localStorage.removeItem(CONSENT_KEY);
      localStorage.removeItem(CONSENT_DATE_KEY);
    } catch {
      /* storage non disponibile */
    }
  }

  function hasConsent() {
    if (readStorage(CONSENT_KEY) !== 'accepted') {
      return false;
    }

    const expiresAt = readStorage(CONSENT_DATE_KEY);
    if (expiresAt && Date.now() > new Date(expiresAt).getTime()) {
      clearConsent();
      return false;
    }

    return true;
  }

  function saveConsent() {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + EXPIRY_DAYS);
    writeStorage(CONSENT_KEY, 'accepted');
    writeStorage(CONSENT_DATE_KEY, expiryDate.toISOString());
  }

  function hideBanner(banner) {
    if (!banner) {
      return;
    }
    banner.classList.remove('site-notice--visible');
    setTimeout(() => banner.remove(), 300);
  }

  function onConsentGranted(banner) {
    saveConsent();
    hideBanner(banner);
    document.dispatchEvent(new CustomEvent('cookie-consent-accepted'));
    if (typeof window.initAnalyticsIfConsented === 'function') {
      window.initAnalyticsIfConsented();
    }
  }

  function trapFocus(banner, e) {
    const focusable = banner.querySelectorAll('button, a[href]');
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

  function createBanner() {
    const banner = document.createElement('div');
    banner.id = 'site-notice';
    banner.className = 'site-notice';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'true');
    banner.setAttribute('aria-label', 'Informativa sui cookie');
    banner.setAttribute('aria-describedby', 'site-notice-text');

    const policyHref = `${window.location.origin}/cookie-policy.html`;

    banner.innerHTML = `
      <div class="site-notice__content">
        <p class="site-notice__text" id="site-notice-text">
          Questo sito usa cookie tecnici necessari al funzionamento e, se acconsenti,
          cookie analitici (Google Analytics) per capire come viene usato il sito.
          Continuando a navigare, accetti entrambi.
          <a href="${policyHref}" class="site-notice__link">Maggiori informazioni</a>
        </p>
        <div class="site-notice__actions">
          <button type="button" class="site-notice__button site-notice__button--accept" id="site-notice-accept">
            Accetta
          </button>
          <button type="button" class="site-notice__button site-notice__button--close" id="site-notice-close" aria-label="Chiudi informativa cookie">
            <span aria-hidden="true">✕</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    const acceptButton = banner.querySelector('#site-notice-accept');
    const closeButton = banner.querySelector('#site-notice-close');

    acceptButton.addEventListener('click', () => onConsentGranted(banner));
    closeButton.addEventListener('click', () => onConsentGranted(banner));
    banner.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        onConsentGranted(banner);
        return;
      }
      trapFocus(banner, e);
    });

    setTimeout(() => {
      banner.classList.add('site-notice--visible');
      acceptButton.focus();
    }, VISIBILITY_MS);
  }

  function scheduleInit() {
    const run = () => {
      if (hasConsent()) {
        return;
      }
      createBanner();
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(run, { timeout: IDLE_TIMEOUT_MS });
    } else {
      setTimeout(run, IDLE_FALLBACK_MS);
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
