// analytics.test.js

import { describe, it, expect, beforeEach } from 'vitest';
import { resolve } from 'path';
import { cleanupDOM, loadPublicScript } from '../helpers/test-utils.js';

loadPublicScript(resolve(__dirname, '../../public/js/ga4.js'));
loadPublicScript(resolve(__dirname, '../../public/js/modules/analytics.js'));

describe('analytics.js', () => {
  beforeEach(() => {
    cleanupDOM();
    delete window.dataLayer;
    delete window.gtag;
    delete window.googleAnalyticsLoaded;
    localStorage.clear();
  });

  it('should not push events without consent', () => {
    trackEvent('test_completed', { attachment_style: 'ansioso', attachment_level: 'medio' });

    expect(window.dataLayer).toBeUndefined();
  });

  it('should send events via gtag after consent', () => {
    localStorage.setItem('cookie_consent', 'accepted');
    loadGoogleAnalytics();

    trackEvent('test_completed', {
      attachment_style: 'secure',
      attachment_level: 'basso',
    });

    const eventEntry = window.dataLayer.find(
      (entry) => entry && entry[0] === 'event' && entry[1] === 'site_interaction',
    );

    expect(eventEntry).toBeTruthy();
    expect(eventEntry[2]).toMatchObject({
      interaction_type: 'test_completed',
      attachment_style: 'secure',
      attachment_level: 'basso',
      page_path: '/',
    });
  });

  it('should ignore empty interaction type', () => {
    localStorage.setItem('cookie_consent', 'accepted');
    loadGoogleAnalytics();

    trackEvent('', { attachment_style: 'ansioso' });

    const eventEntry = window.dataLayer.find(
      (entry) => entry && entry[0] === 'event' && entry[1] === 'site_interaction',
    );
    expect(eventEntry).toBeUndefined();
  });
});
