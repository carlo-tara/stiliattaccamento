// gtm.js
// Google Analytics 4 + Google Tag Manager — caricamento solo dopo consenso cookie

const GTM_CONTAINER_ID = 'GTM-NGNWRJBN';
const GA_MEASUREMENT_ID = 'G-6CQ4VFK8SJ';
const COOKIE_CONSENT_KEY = 'cookie_consent';

/**
 * @returns {boolean}
 */
function hasAnalyticsConsent() {
  return localStorage.getItem(COOKIE_CONSENT_KEY) === 'accepted';
}

/**
 * Inietta gtag.js e configura GA4
 */
function loadGoogleAnalytics() {
  if (window.googleAnalyticsLoaded || !GA_MEASUREMENT_ID) {
    return;
  }

  if (!hasAnalyticsConsent()) {
    return;
  }

  window.googleAnalyticsLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);

  if (!document.getElementById('ga-gtag-script')) {
    const script = document.createElement('script');
    script.id = 'ga-gtag-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }
}

/**
 * Inietta lo snippet GTM in head e noscript in body
 */
function loadGoogleTagManager() {
  if (window.googleTagManagerLoaded || !GTM_CONTAINER_ID) {
    return;
  }

  if (!hasAnalyticsConsent()) {
    return;
  }

  window.googleTagManagerLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`;
  document.head.appendChild(script);

  if (!document.getElementById('gtm-noscript')) {
    const noscript = document.createElement('noscript');
    noscript.id = 'gtm-noscript';
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    noscript.appendChild(iframe);
    document.body.insertBefore(noscript, document.body.firstChild);
  }
}

/**
 * Avvia GA4 e GTM se il consenso è già stato salvato
 */
function loadAnalytics() {
  loadGoogleAnalytics();
  loadGoogleTagManager();
}

function initAnalyticsIfConsented() {
  if (hasAnalyticsConsent()) {
    loadAnalytics();
  }
}

document.addEventListener('cookie-consent-accepted', loadAnalytics);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnalyticsIfConsented);
} else {
  initAnalyticsIfConsented();
}

if (typeof window !== 'undefined') {
  window.initAnalyticsIfConsented = initAnalyticsIfConsented;
  window.loadAnalytics = loadAnalytics;
  window.loadGoogleAnalytics = loadGoogleAnalytics;
  window.loadGoogleTagManager = loadGoogleTagManager;
  window.hasAnalyticsConsent = hasAnalyticsConsent;
}
