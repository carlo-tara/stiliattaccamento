// site-notice.test.js

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { runInContext, createContext } from 'vm';
import { cleanupDOM } from '../helpers/test-utils.js';

const SITE_NOTICE_PATH = resolve(__dirname, '../../public/js/site-notice.js');

function loadSiteNotice() {
  runInContext(readFileSync(SITE_NOTICE_PATH, 'utf-8'), createContext(globalThis));
}

describe('site-notice.js (bundled in site.min.js)', () => {
  beforeEach(() => {
    cleanupDOM();
    localStorage.clear();
    vi.useFakeTimers();
    global.requestIdleCallback = (cb) => {
      cb();
      return 1;
    };
  });

  afterEach(() => {
    vi.useRealTimers();
    delete global.requestIdleCallback;
    delete window.initAnalyticsIfConsented;
  });

  it('shows notice when consent is missing', () => {
    loadSiteNotice();
    vi.runAllTimers();

    const banner = document.getElementById('site-notice');
    expect(banner).toBeTruthy();
    expect(banner.classList.contains('site-notice--visible')).toBe(true);
  });

  it('does not show notice when consent exists', () => {
    localStorage.setItem('cookie_consent', 'accepted');
    localStorage.setItem('cookie_consent_date', new Date(Date.now() + 86400000).toISOString());
    loadSiteNotice();
    vi.runAllTimers();

    expect(document.getElementById('site-notice')).toBeNull();
  });

  it('treats expired consent as missing', () => {
    localStorage.setItem('cookie_consent', 'accepted');
    localStorage.setItem('cookie_consent_date', new Date(Date.now() - 86400000).toISOString());
    loadSiteNotice();
    vi.runAllTimers();

    expect(document.getElementById('site-notice')).toBeTruthy();
    expect(localStorage.getItem('cookie_consent')).toBeNull();
  });

  it('saves consent and dispatches event on accept', () => {
    loadSiteNotice();
    vi.runAllTimers();

    const eventSpy = vi.fn();
    document.addEventListener('cookie-consent-accepted', eventSpy);

    document.getElementById('site-notice-accept').click();
    vi.advanceTimersByTime(300);

    expect(localStorage.getItem('cookie_consent')).toBe('accepted');
    expect(localStorage.getItem('cookie_consent_date')).toBeTruthy();
    expect(eventSpy).toHaveBeenCalledOnce();
    expect(document.getElementById('site-notice')).toBeNull();
  });

  it('calls initAnalyticsIfConsented after accept', () => {
    const analyticsSpy = vi.fn();
    window.initAnalyticsIfConsented = analyticsSpy;

    loadSiteNotice();
    vi.runAllTimers();
    document.getElementById('site-notice-accept').click();

    expect(analyticsSpy).toHaveBeenCalledOnce();
    delete window.initAnalyticsIfConsented;
  });
});
