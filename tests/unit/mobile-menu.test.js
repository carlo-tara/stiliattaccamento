// mobile-menu.test.js
// Unit tests per public/js/mobile-menu.js

import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { cleanupDOM } from '../helpers/test-utils.js';

// Carica mobile-menu.js
const mobileMenuPath = resolve(__dirname, '../../public/js/mobile-menu.js');
const mobileMenuCode = readFileSync(mobileMenuPath, 'utf-8');

// Rimuovi event listeners per i test
const codeToEval = mobileMenuCode.replace(/document\.addEventListener\([^)]+\)/g, '// Event listener removed for tests');

// Esegui il codice una volta sola
eval(codeToEval);

describe('mobile-menu.js', () => {
  beforeEach(() => {
    cleanupDOM();
    
    // Crea HTML minimo necessario
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
      
      // Menu inizialmente chiuso
      expect(navLinks.classList.contains('active')).toBe(false);
      expect(hamburger.getAttribute('aria-expanded')).toBe('false');
      
      toggleMobileMenu();
      
      // Menu dovrebbe essere aperto
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
      
      // Apri menu prima
      navLinks.classList.add('active');
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      toggleMobileMenu();
      
      // Menu dovrebbe essere chiuso
      expect(navLinks.classList.contains('active')).toBe(false);
      expect(hamburger.classList.contains('active')).toBe(false);
      expect(hamburger.getAttribute('aria-expanded')).toBe('false');
      expect(overlay.classList.contains('active')).toBe(false);
      expect(document.body.style.overflow).toBe('');
    });

    it('should handle missing elements gracefully', () => {
      // Rimuovi elementi
      const navLinks = document.getElementById('navLinks');
      navLinks.remove();
      
      // Non dovrebbe lanciare errore
      expect(() => toggleMobileMenu()).not.toThrow();
    });

    it('should toggle multiple times correctly', () => {
      const navLinks = document.getElementById('navLinks');
      
      // Apri
      toggleMobileMenu();
      expect(navLinks.classList.contains('active')).toBe(true);
      
      // Chiudi
      toggleMobileMenu();
      expect(navLinks.classList.contains('active')).toBe(false);
      
      // Apri di nuovo
      toggleMobileMenu();
      expect(navLinks.classList.contains('active')).toBe(true);
    });

    it('should restore body overflow when closing', () => {
      // Imposta overflow originale
      document.body.style.overflow = 'auto';
      
      // Apri menu
      toggleMobileMenu();
      expect(document.body.style.overflow).toBe('hidden');
      
      // Chiudi menu
      toggleMobileMenu();
      expect(document.body.style.overflow).toBe('');
    });
  });
});
