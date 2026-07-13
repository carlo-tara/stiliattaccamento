// ga4.js
// Google Analytics 4 — caricamento solo dopo consenso cookie

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

function initAnalyticsIfConsented() {
  if (hasAnalyticsConsent()) {
    loadGoogleAnalytics();
  }
}

document.addEventListener('cookie-consent-accepted', loadGoogleAnalytics);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnalyticsIfConsented);
} else {
  initAnalyticsIfConsented();
}

if (typeof window !== 'undefined') {
  window.initAnalyticsIfConsented = initAnalyticsIfConsented;
  window.loadAnalytics = loadGoogleAnalytics;
  window.loadGoogleAnalytics = loadGoogleAnalytics;
  window.hasAnalyticsConsent = hasAnalyticsConsent;
}
