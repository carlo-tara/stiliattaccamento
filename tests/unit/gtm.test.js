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
    delete window.dataLayer;
    localStorage.clear();
  });

  it('should not load GTM without consent', () => {
    loadGoogleTagManager();
    expect(window.googleTagManagerLoaded).toBeUndefined();
    expect(document.querySelector('script[src*="googletagmanager"]')).toBeNull();
  });

  it('should load GTM after consent', () => {
    localStorage.setItem('cookie_consent', 'accepted');
    loadGoogleTagManager();

    expect(window.googleTagManagerLoaded).toBe(true);
    expect(window.dataLayer.length).toBeGreaterThan(0);
    expect(document.querySelector('script[src*="GTM-WC24D33D"]')).toBeTruthy();
    expect(document.getElementById('gtm-noscript')).toBeTruthy();
  });

  it('should init only when consent exists', () => {
    initAnalyticsIfConsented();
    expect(window.googleTagManagerLoaded).toBeUndefined();

    localStorage.setItem('cookie_consent', 'accepted');
    initAnalyticsIfConsented();
    expect(window.googleTagManagerLoaded).toBe(true);
  });
});
