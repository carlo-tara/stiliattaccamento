// gtm.test.js

import { describe, it, expect, beforeEach } from 'vitest';
import { resolve } from 'path';
import { cleanupDOM, loadPublicScript } from '../helpers/test-utils.js';

loadPublicScript(resolve(__dirname, '../../public/js/gtm.js'));

describe('gtm.js', () => {
  beforeEach(() => {
    cleanupDOM();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    delete window.googleTagManagerLoaded;
    delete window.googleAnalyticsLoaded;
    delete window.gtag;
    delete window.dataLayer;
    localStorage.clear();
  });

  it('should not load analytics without consent', () => {
    loadAnalytics();

    expect(window.googleTagManagerLoaded).toBeUndefined();
    expect(window.googleAnalyticsLoaded).toBeUndefined();
    expect(document.querySelector('script[src*="googletagmanager"]')).toBeNull();
  });

  it('should load GA4 after consent', () => {
    localStorage.setItem('cookie_consent', 'accepted');
    loadGoogleAnalytics();

    expect(window.googleAnalyticsLoaded).toBe(true);
    expect(typeof window.gtag).toBe('function');
    expect(document.querySelector('script[src*="G-6CQ4VFK8SJ"]')).toBeTruthy();
  });

  it('should load GTM after consent', () => {
    localStorage.setItem('cookie_consent', 'accepted');
    loadGoogleTagManager();

    expect(window.googleTagManagerLoaded).toBe(true);
    expect(window.dataLayer.length).toBeGreaterThan(0);
    expect(document.querySelector('script[src*="GTM-NGNWRJBN"]')).toBeTruthy();
    expect(document.getElementById('gtm-noscript')).toBeTruthy();
  });

  it('should init only when consent exists', () => {
    initAnalyticsIfConsented();
    expect(window.googleAnalyticsLoaded).toBeUndefined();
    expect(window.googleTagManagerLoaded).toBeUndefined();

    localStorage.setItem('cookie_consent', 'accepted');
    initAnalyticsIfConsented();
    expect(window.googleAnalyticsLoaded).toBe(true);
    expect(window.googleTagManagerLoaded).toBe(true);
  });
});
