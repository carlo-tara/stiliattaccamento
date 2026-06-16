// theme.test.js
// Unit tests per public/js/theme.js

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { resolve } from 'path';
import { cleanupDOM, loadPublicScript } from '../helpers/test-utils.js';

loadPublicScript(resolve(__dirname, '../../public/js/theme.js'));

describe('theme.js', () => {
  beforeEach(() => {
    cleanupDOM();
    if (document.documentElement) {
      document.documentElement.removeAttribute('data-theme');
    }
    if (document.body) {
      document.body.removeAttribute('data-theme');
    }
  });

  afterEach(() => {
    cleanupDOM();
  });

  it('should have setTheme function defined', () => {
    expect(typeof setTheme).toBe('function');
  });

  it('should force light theme when setTheme is called', () => {
    setTheme('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should set light theme on documentElement', () => {
    setTheme('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should set light theme on body if present', () => {
    setTheme('dark');

    if (document.body) {
      expect(document.body.getAttribute('data-theme')).toBe('light');
    }
  });

  it('should have toggleTheme function that does nothing but sets light theme', () => {
    expect(typeof toggleTheme).toBe('function');
    document.documentElement.removeAttribute('data-theme');
    toggleTheme();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should have toggleHighContrast function that does nothing but sets light theme', () => {
    expect(typeof toggleHighContrast).toBe('function');
    document.documentElement.removeAttribute('data-theme');
    toggleHighContrast();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should hide theme toggle button if present', () => {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle';
    document.body.appendChild(toggleBtn);

    setTheme('dark');
    expect(toggleBtn.style.display).toBe('none');
  });
});
