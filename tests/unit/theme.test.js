// theme.test.js
// Unit tests per public/js/theme.js

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { cleanupDOM } from '../helpers/test-utils.js';

// Carica il file theme.js come stringa e prepara il codice (rimuovi event listeners)
const themePath = resolve(__dirname, '../../public/js/theme.js');
const themeCode = readFileSync(themePath, 'utf-8');

// Rimuovi event listeners e fix module.exports per i test
const codeToEval = themeCode
  .replace(/document\.addEventListener\([^)]+\)/g, '// Event listener removed for tests')
  .replace(/module\.exports = \{ [^}]+\};/, '// module.exports removed for tests');

// Esegui il codice una volta sola
eval(codeToEval);

describe('theme.js', () => {
  beforeEach(() => {
    // Reset DOM
    cleanupDOM();
    // Reset document.documentElement
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
    // Chiama setTheme
    setTheme('dark'); // Anche se passiamo 'dark', dovrebbe forzare 'light'
    
    // Verifica che il tema sia sempre 'light'
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should set light theme on documentElement', () => {
    // Il codice imposta il tema immediatamente quando viene caricato
    // Verifica che data-theme sia impostato
    const theme = document.documentElement.getAttribute('data-theme');
    // Potrebbe essere già impostato dal codice iniziale, o potrebbe non esserlo se non eseguito
    // Chiamiamo setTheme direttamente per verificare
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
    
    // Reset per test
    document.documentElement.removeAttribute('data-theme');
    
    toggleTheme();
    
    // Dovrebbe sempre impostare light
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should have toggleHighContrast function that does nothing but sets light theme', () => {
    expect(typeof toggleHighContrast).toBe('function');
    
    // Reset per test
    document.documentElement.removeAttribute('data-theme');
    
    toggleHighContrast();
    
    // Dovrebbe sempre impostare light
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should hide theme toggle button if present', () => {
    // Crea un elemento con classe theme-toggle
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle';
    document.body.appendChild(toggleBtn);
    
    // Chiama setTheme
    setTheme('dark');
    
    // Verifica che il bottone sia nascosto
    expect(toggleBtn.style.display).toBe('none');
  });
});
