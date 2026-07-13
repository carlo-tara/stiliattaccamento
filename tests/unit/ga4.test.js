// ga4.test.js

import { describe, it, expect, beforeEach } from 'vitest';
import { resolve } from 'path';
import { cleanupDOM, loadPublicScript } from '../helpers/test-utils.js';

loadPublicScript(resolve(__dirname, '../../public/js/ga4.js'));

describe('ga4.js', () => {
  beforeEach(() => {
    cleanupDOM();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    delete window.googleAnalyticsLoaded;
    delete window.gtag;
    delete window.dataLayer;
    localStorage.clear();
  });

  it('should not load analytics without consent', () => {
    loadGoogleAnalytics();

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

  it('should init only when consent exists', () => {
    initAnalyticsIfConsented();
    expect(window.googleAnalyticsLoaded).toBeUndefined();

    localStorage.setItem('cookie_consent', 'accepted');
    initAnalyticsIfConsented();
    expect(window.googleAnalyticsLoaded).toBe(true);
  });
});
