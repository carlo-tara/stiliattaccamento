// utils.test.js
// Unit tests per public/js/utils.js

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Carica il file utils.js come stringa e lo esegue nel contesto del test
const utilsPath = resolve(__dirname, '../../public/js/utils.js');
const utilsCode = readFileSync(utilsPath, 'utf-8');

// Esegui il codice - le funzioni sono dichiarate come function quindi sono disponibili globalmente
// utils.js non ha event listeners, quindi possiamo eseguirlo direttamente
eval(utilsCode);

describe('utils.js', () => {
  describe('sanitizeHTML', () => {
    it('should sanitize HTML special characters', () => {
      const input = '<script>alert("XSS")</script>';
      const result = sanitizeHTML(input);
      expect(result).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    });

    it('should handle plain text', () => {
      const input = 'Hello World';
      const result = sanitizeHTML(input);
      expect(result).toBe('Hello World');
    });

    it('should handle empty string', () => {
      const result = sanitizeHTML('');
      expect(result).toBe('');
    });

    it('should convert non-string to string', () => {
      expect(sanitizeHTML(123)).toBe('123');
      expect(sanitizeHTML(null)).toBe('null');
      expect(sanitizeHTML(undefined)).toBe('undefined');
    });

    it('should handle ampersands and quotes', () => {
      const input = 'Text & "quotes"';
      const result = sanitizeHTML(input);
      expect(result).toContain('&amp;');
      expect(result).toContain('&quot;');
    });
  });

  describe('isValidAttachmentStyle', () => {
    it('should return true for valid styles', () => {
      expect(isValidAttachmentStyle('secure')).toBe(true);
      expect(isValidAttachmentStyle('ansioso')).toBe(true);
      expect(isValidAttachmentStyle('evitante')).toBe(true);
      expect(isValidAttachmentStyle('disorganizzato')).toBe(true);
      expect(isValidAttachmentStyle('oscillante')).toBe(true);
    });

    it('should return false for invalid styles', () => {
      expect(isValidAttachmentStyle('invalid')).toBe(false);
      expect(isValidAttachmentStyle('')).toBe(false);
      expect(isValidAttachmentStyle(null)).toBe(false);
      expect(isValidAttachmentStyle(undefined)).toBe(false);
      expect(isValidAttachmentStyle('Secure')).toBe(false); // case sensitive
    });
  });

  describe('isValidLevel', () => {
    it('should return true for valid levels', () => {
      expect(isValidLevel('basso')).toBe(true);
      expect(isValidLevel('medio')).toBe(true);
      expect(isValidLevel('alto')).toBe(true);
    });

    it('should return false for invalid levels', () => {
      expect(isValidLevel('invalid')).toBe(false);
      expect(isValidLevel('')).toBe(false);
      expect(isValidLevel(null)).toBe(false);
      expect(isValidLevel(undefined)).toBe(false);
      expect(isValidLevel('Alto')).toBe(false); // case sensitive
    });
  });

  describe('validateTestResults', () => {
    beforeEach(() => {
      // Reset TEST_SCORES if defined
      if (typeof global.TEST_SCORES !== 'undefined') {
        delete global.TEST_SCORES;
      }
    });

    it('should validate correct test results', () => {
      const validResult = {
        scores: {
          anxious: 10,
          secure: 5,
          avoidant: 3,
          disorganized: 2,
        },
        primaryStyle: 'ansioso',
        level: 'alto',
      };

      const result = validateTestResults(validResult);
      expect(result).toEqual(validResult);
    });

    it('should return null for missing data', () => {
      expect(validateTestResults(null)).toBe(null);
      expect(validateTestResults(undefined)).toBe(null);
      expect(validateTestResults({})).toBe(null);
    });

    it('should return null for missing scores', () => {
      const invalid = {
        primaryStyle: 'ansioso',
        level: 'alto',
      };
      expect(validateTestResults(invalid)).toBe(null);
    });

    it('should return null for non-numeric scores', () => {
      const invalid = {
        scores: {
          anxious: 'not-a-number',
          secure: 5,
          avoidant: 3,
          disorganized: 2,
        },
        primaryStyle: 'ansioso',
        level: 'alto',
      };
      expect(validateTestResults(invalid)).toBe(null);
    });

    it('should return null for scores out of range', () => {
      const invalid = {
        scores: {
          anxious: 100, // > max (36)
          secure: 5,
          avoidant: 3,
          disorganized: 2,
        },
        primaryStyle: 'ansioso',
        level: 'alto',
      };
      expect(validateTestResults(invalid)).toBe(null);
    });

    it('should return null for negative scores', () => {
      const invalid = {
        scores: {
          anxious: -1,
          secure: 5,
          avoidant: 3,
          disorganized: 2,
        },
        primaryStyle: 'ansioso',
        level: 'alto',
      };
      expect(validateTestResults(invalid)).toBe(null);
    });

    it('should return null for invalid primaryStyle', () => {
      const invalid = {
        scores: {
          anxious: 10,
          secure: 5,
          avoidant: 3,
          disorganized: 2,
        },
        primaryStyle: 'invalid',
        level: 'alto',
      };
      expect(validateTestResults(invalid)).toBe(null);
    });

    it('should return null for invalid level', () => {
      const invalid = {
        scores: {
          anxious: 10,
          secure: 5,
          avoidant: 3,
          disorganized: 2,
        },
        primaryStyle: 'ansioso',
        level: 'invalid',
      };
      expect(validateTestResults(invalid)).toBe(null);
    });

    it('should validate edge case scores at maximum', () => {
      const validResult = {
        scores: {
          anxious: 36, // max
          secure: 12, // max
          avoidant: 24, // max
          disorganized: 36, // max
        },
        primaryStyle: 'ansioso',
        level: 'alto',
      };
      const result = validateTestResults(validResult);
      expect(result).toEqual(validResult);
    });

    it('should validate edge case scores at zero', () => {
      const validResult = {
        scores: {
          anxious: 0,
          secure: 0,
          avoidant: 0,
          disorganized: 0,
        },
        primaryStyle: 'secure',
        level: 'basso',
      };
      const result = validateTestResults(validResult);
      expect(result).toEqual(validResult);
    });
  });

  describe('createSafeElement', () => {
    it('should create a simple element', () => {
      const el = createSafeElement('div', {}, 'Hello');
      expect(el.tagName).toBe('DIV');
      expect(el.textContent).toBe('Hello');
    });

    it('should apply attributes', () => {
      const el = createSafeElement('div', { class: 'test', id: 'test-id' }, '');
      expect(el.getAttribute('class')).toBe('test');
      expect(el.getAttribute('id')).toBe('test-id');
    });

    it('should apply style object', () => {
      const el = createSafeElement('div', {
        style: { color: 'red', backgroundColor: 'blue' },
      }, '');
      expect(el.style.color).toBe('red');
      expect(el.style.backgroundColor).toBe('blue');
    });

    it('should apply href attribute', () => {
      const el = createSafeElement('a', { href: '/test' }, 'Link');
      expect(el.getAttribute('href')).toBe('/test');
    });

    it('should apply data-* attributes', () => {
      const el = createSafeElement('div', { 'data-test': 'value' }, '');
      expect(el.getAttribute('data-test')).toBe('value');
    });

    it('should append Node as content', () => {
      const child = document.createElement('span');
      child.textContent = 'Child';
      const el = createSafeElement('div', {}, child);
      expect(el.firstChild).toBe(child);
      expect(el.textContent).toBe('Child');
    });

    it('should handle empty attributes', () => {
      const el = createSafeElement('div', {}, '');
      expect(el.tagName).toBe('DIV');
      expect(el.textContent).toBe('');
    });

    it('should not apply unsafe attributes', () => {
      const el = createSafeElement('div', { onclick: 'alert(1)' }, '');
      // onclick non dovrebbe essere applicato come attributo sicuro
      // (dipende dall'implementazione, questo test verifica il comportamento atteso)
      expect(el.getAttribute('onclick')).toBe(null);
    });
  });

  describe('isChartJSLoaded', () => {
    it('should return false when Chart is undefined', () => {
      const originalChart = global.Chart;
      delete global.Chart;
      expect(isChartJSLoaded()).toBe(false);
      global.Chart = originalChart;
    });

    it('should return true when Chart is defined', () => {
      global.Chart = {};
      expect(isChartJSLoaded()).toBe(true);
    });
  });

  describe('isSurveyJSLoaded', () => {
    it('should return false when Survey is undefined', () => {
      const originalSurvey = global.Survey;
      delete global.Survey;
      expect(isSurveyJSLoaded()).toBe(false);
      global.Survey = originalSurvey;
    });

    it('should return false when Survey.Survey is undefined', () => {
      global.Survey = {};
      expect(isSurveyJSLoaded()).toBe(false);
    });

    it('should return true when Survey.Survey is defined', () => {
      global.Survey = { Survey: {} };
      expect(isSurveyJSLoaded()).toBe(true);
    });
  });
});

