// utils.test.js
// Unit tests per public/js/utils.js

import { describe, it, expect } from 'vitest';
import { resolve } from 'path';
import { loadPublicScript } from '../helpers/test-utils.js';

loadPublicScript(resolve(__dirname, '../../public/js/utils.js'));

describe('utils.js', () => {
  describe('sanitizeHTML', () => {
    it('should sanitize HTML special characters', () => {
      const input = '<script>alert("XSS")</script>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;script&gt;');
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
      const result = sanitizeHTML(123);
      expect(result).toBe('123');
    });

    it('should handle ampersands and quotes', () => {
      const result = sanitizeHTML('Tom & Jerry say "hi"');
      expect(result).toContain('&amp;');
      expect(result).not.toContain('<');
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
    });
  });

  describe('isValidLevel', () => {
    it('should return true for valid levels', () => {
      expect(isValidLevel('basso')).toBe(true);
      expect(isValidLevel('medio')).toBe(true);
      expect(isValidLevel('alto')).toBe(true);
    });

    it('should return false for invalid levels', () => {
      expect(isValidLevel('high')).toBe(false);
      expect(isValidLevel('')).toBe(false);
    });
  });

  describe('validateTestResults', () => {
    const validData = {
      scores: { anxious: 10, secure: 5, avoidant: 3, disorganized: 2 },
      primaryStyle: 'ansioso',
      level: 'medio',
    };

    it('should validate correct test results', () => {
      expect(validateTestResults(validData)).toEqual(validData);
    });

    it('should return null for missing data', () => {
      expect(validateTestResults(null)).toBeNull();
      expect(validateTestResults(undefined)).toBeNull();
    });

    it('should return null for missing scores', () => {
      expect(validateTestResults({ primaryStyle: 'secure', level: 'basso' })).toBeNull();
    });

    it('should return null for non-numeric scores', () => {
      const data = {
        ...validData,
        scores: { anxious: '10', secure: 5, avoidant: 3, disorganized: 2 },
      };
      expect(validateTestResults(data)).toBeNull();
    });

    it('should return null for scores out of range', () => {
      const data = {
        ...validData,
        scores: { anxious: 100, secure: 5, avoidant: 3, disorganized: 2 },
      };
      expect(validateTestResults(data)).toBeNull();
    });

    it('should return null for negative scores', () => {
      const data = {
        ...validData,
        scores: { anxious: -1, secure: 5, avoidant: 3, disorganized: 2 },
      };
      expect(validateTestResults(data)).toBeNull();
    });

    it('should return null for invalid primaryStyle', () => {
      const data = { ...validData, primaryStyle: 'unknown' };
      expect(validateTestResults(data)).toBeNull();
    });

    it('should return null for invalid level', () => {
      const data = { ...validData, level: 'extreme' };
      expect(validateTestResults(data)).toBeNull();
    });

    it('should validate edge case scores at maximum', () => {
      const data = {
        scores: { anxious: 36, secure: 12, avoidant: 24, disorganized: 36 },
        primaryStyle: 'oscillante',
        level: 'alto',
      };
      expect(validateTestResults(data)).toEqual(data);
    });

    it('should validate edge case scores at zero', () => {
      const data = {
        scores: { anxious: 0, secure: 0, avoidant: 0, disorganized: 0 },
        primaryStyle: 'secure',
        level: 'basso',
      };
      expect(validateTestResults(data)).toEqual(data);
    });
  });

  describe('createSafeElement', () => {
    it('should create a simple element', () => {
      const el = createSafeElement('p', {}, 'Hello');
      expect(el.tagName).toBe('P');
      expect(el.textContent).toBe('Hello');
    });

    it('should apply attributes', () => {
      const el = createSafeElement('div', { class: 'test-class', id: 'test-id' });
      expect(el.className).toBe('test-class');
      expect(el.id).toBe('test-id');
    });

    it('should apply style object', () => {
      const el = createSafeElement('div', { style: { color: 'red', marginTop: '10px' } });
      expect(el.style.color).toBe('red');
      expect(el.style.marginTop).toBe('10px');
    });

    it('should apply href attribute', () => {
      const el = createSafeElement('a', { href: 'https://example.com' });
      expect(el.getAttribute('href')).toBe('https://example.com');
    });

    it('should apply data-* attributes', () => {
      const el = createSafeElement('div', { 'data-test': 'value' });
      expect(el.getAttribute('data-test')).toBe('value');
    });

    it('should append Node as content', () => {
      const span = document.createElement('span');
      span.textContent = 'child';
      const el = createSafeElement('div', {}, span);
      expect(el.firstChild).toBe(span);
    });

    it('should handle empty attributes', () => {
      const el = createSafeElement('span');
      expect(el.tagName).toBe('SPAN');
    });

    it('should not apply unsafe attributes', () => {
      const el = createSafeElement('div', { onclick: 'alert(1)' });
      expect(el.getAttribute('onclick')).toBeNull();
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

    it('should return false when Survey.Model is undefined', () => {
      global.Survey = {};
      expect(isSurveyJSLoaded()).toBe(false);
    });

    it('should return true when Survey.Model is defined', () => {
      global.Survey = { Model: function Model() {} };
      expect(isSurveyJSLoaded()).toBe(true);
    });
  });
});
