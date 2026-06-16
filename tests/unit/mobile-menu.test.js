// mobile-menu.test.js
// Unit tests per public/js/mobile-menu.js

import { describe, it, expect, beforeEach } from 'vitest';
import { resolve } from 'path';
import { cleanupDOM, loadPublicScript } from '../helpers/test-utils.js';

loadPublicScript(resolve(__dirname, '../../public/js/mobile-menu.js'));

describe('mobile-menu.js', () => {
  beforeEach(() => {
    cleanupDOM();

    const html = `
      <button class="hamburger" aria-expanded="false"></button>
      <nav id="navLinks"></nav>
      <div id="mobileMenuOverlay"></div>
    `;
    document.body.innerHTML = html;
    document.body.style.overflow = '';
  });

  describe('toggleMobileMenu', () => {
    it('should open menu when closed', () => {
      const navLinks = document.getElementById('navLinks');
      const hamburger = document.querySelector('.hamburger');
      const overlay = document.getElementById('mobileMenuOverlay');

      expect(navLinks.classList.contains('active')).toBe(false);
      expect(hamburger.getAttribute('aria-expanded')).toBe('false');

      toggleMobileMenu();

      expect(navLinks.classList.contains('active')).toBe(true);
      expect(hamburger.classList.contains('active')).toBe(true);
      expect(hamburger.getAttribute('aria-expanded')).toBe('true');
      expect(overlay.classList.contains('active')).toBe(true);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should close menu when open', () => {
      const navLinks = document.getElementById('navLinks');
      const hamburger = document.querySelector('.hamburger');
      const overlay = document.getElementById('mobileMenuOverlay');

      navLinks.classList.add('active');
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';

      toggleMobileMenu();

      expect(navLinks.classList.contains('active')).toBe(false);
      expect(hamburger.classList.contains('active')).toBe(false);
      expect(hamburger.getAttribute('aria-expanded')).toBe('false');
      expect(overlay.classList.contains('active')).toBe(false);
      expect(document.body.style.overflow).toBe('');
    });

    it('should handle missing elements gracefully', () => {
      document.getElementById('navLinks').remove();
      expect(() => toggleMobileMenu()).not.toThrow();
    });

    it('should toggle multiple times correctly', () => {
      const navLinks = document.getElementById('navLinks');

      toggleMobileMenu();
      expect(navLinks.classList.contains('active')).toBe(true);

      toggleMobileMenu();
      expect(navLinks.classList.contains('active')).toBe(false);

      toggleMobileMenu();
      expect(navLinks.classList.contains('active')).toBe(true);
    });

    it('should restore body overflow when closing', () => {
      document.body.style.overflow = 'auto';

      toggleMobileMenu();
      expect(document.body.style.overflow).toBe('hidden');

      toggleMobileMenu();
      expect(document.body.style.overflow).toBe('');
    });
  });
});
