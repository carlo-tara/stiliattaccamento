// analytics.js
// Layer di astrazione per eventi analytics (GA4 / GTM, solo post-consenso)

const ANALYTICS_CONSENT_KEY = 'cookie_consent';

/**
 * @returns {boolean}
 */
function hasAnalyticsConsent() {
  if (typeof window.hasAnalyticsConsent === 'function') {
    return window.hasAnalyticsConsent();
  }
  return localStorage.getItem(ANALYTICS_CONSENT_KEY) === 'accepted';
}

/**
 * Invia un evento al dataLayer se l'utente ha dato consenso analytics.
 * Non inviare dati personali o risposte grezze del test.
 * @param {string} interactionType - Nome dell'interazione (es. test_completed)
 * @param {Record<string, string|number|boolean>} [params={}]
 */
function trackEvent(interactionType, params = {}) {
  if (!interactionType || !hasAnalyticsConsent()) {
    return;
  }

  const eventParams = {
    interaction_type: interactionType,
    page_path: window.location.pathname,
    ...params,
  };

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'site_interaction', eventParams);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'site_interaction',
    ...eventParams,
  });
}
