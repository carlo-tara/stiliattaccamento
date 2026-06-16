// template-loader.test.js

import { describe, it, expect, beforeEach } from 'vitest';
import { resolve } from 'path';
import { cleanupDOM, loadPublicScript } from '../helpers/test-utils.js';

loadPublicScript(resolve(__dirname, '../../public/js/template-loader.js'));

describe('template-loader.js path helpers', () => {
  beforeEach(() => {
    cleanupDOM();
  });

  it('should return ./ for root pages', () => {
    window.history.pushState({}, '', '/index.html');
    expect(getBasePath()).toBe('./');
    expect(calculateDepth()).toBe(0);
  });

  it('should return ../ for one-level nested pages', () => {
    window.history.pushState({}, '', '/approfondimenti/finanze.html');
    expect(getBasePath()).toBe('../');
    expect(calculateDepth()).toBe(1);
  });

  it('should return ../../ for two-level nested pages', () => {
    window.history.pushState({}, '', '/profili/ansioso-alto.html');
    expect(getBasePath()).toBe('../');
    expect(calculateDepth()).toBe(1);
  });

  it('should ignore public/ segment in Live Preview paths', () => {
    window.history.pushState({}, '', '/public/approfondimenti/finanze.html');
    expect(getBasePath()).toBe('../');
    expect(calculateDepth()).toBe(1);
  });

  it('should handle deeply nested paths', () => {
    window.history.pushState({}, '', '/storie-reali/nina.html');
    expect(getBasePath()).toBe('../');
    expect(calculateDepth()).toBe(1);
  });
});
