// analytics.test.js

import { describe, it, expect, beforeEach } from 'vitest';
import { resolve } from 'path';
import { cleanupDOM, loadPublicScript } from '../helpers/test-utils.js';

loadPublicScript(resolve(__dirname, '../../public/js/gtm.js'));
loadPublicScript(resolve(__dirname, '../../public/js/modules/analytics.js'));

describe('analytics.js', () => {
  beforeEach(() => {
    cleanupDOM();
    delete window.dataLayer;
    delete window.googleTagManagerLoaded;
    localStorage.clear();
  });

  it('should not push events without consent', () => {
    trackEvent('test_completed', { attachment_style: 'ansioso', attachment_level: 'medio' });

    expect(window.dataLayer).toBeUndefined();
  });

  it('should push events after consent', () => {
    localStorage.setItem('cookie_consent', 'accepted');

    trackEvent('test_completed', {
      attachment_style: 'secure',
      attachment_level: 'basso',
    });

    expect(window.dataLayer).toHaveLength(1);
    expect(window.dataLayer[0]).toMatchObject({
      event: 'site_interaction',
      interaction_type: 'test_completed',
      attachment_style: 'secure',
      attachment_level: 'basso',
      page_path: '/',
    });
  });

  it('should ignore empty interaction type', () => {
    localStorage.setItem('cookie_consent', 'accepted');

    trackEvent('', { attachment_style: 'ansioso' });

    expect(window.dataLayer).toBeUndefined();
  });
});
