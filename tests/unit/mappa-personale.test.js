// mappa-personale.test.js
// Unit tests per public/js/mappa-personale.js

import { describe, it, expect, beforeEach } from 'vitest';
import { resolve } from 'path';
import { cleanupDOM, loadPublicScript } from '../helpers/test-utils.js';

loadPublicScript(resolve(__dirname, '../../public/js/utils.js'));
loadPublicScript(resolve(__dirname, '../../public/js/modules/mappa-dimensions.js'));
loadPublicScript(resolve(__dirname, '../../public/js/mappa-personale.js'));

describe('mappa-personale.js', () => {
  beforeEach(() => {
    cleanupDOM();

    const html = `
      <input type="range" id="dim1" min="0" max="10" value="5" step="0.1">
      <input type="range" id="dim2" min="0" max="10" value="5" step="0.1">
      <input type="range" id="dim3" min="0" max="10" value="5" step="0.1">
      <input type="range" id="dim4" min="0" max="10" value="5" step="0.1">
      <input type="range" id="dim5" min="0" max="10" value="5" step="0.1">
      <span id="dim1-value"></span>
      <span id="dim2-value"></span>
      <span id="dim3-value"></span>
      <span id="dim4-value"></span>
      <span id="dim5-value"></span>
      <span id="average-score"></span>
      <span id="average-interpretation"></span>
      <div id="level-badges"></div>
    `;
    document.body.innerHTML = html;
  });

  describe('calcolaDaTest', () => {
    it('should calculate dimensions for anxious-high profile', () => {
      const testResults = {
        scores: {
          anxious: 15,
          secure: 3,
          avoidant: 2,
          disorganized: 1,
        },
      };

      calcolaDaTest(testResults);

      const dim1 = parseFloat(document.getElementById('dim1').value);
      expect(dim1).toBeLessThan(5);

      const dim2 = parseFloat(document.getElementById('dim2').value);
      expect(dim2).toBeGreaterThan(5);
    });

    it('should calculate dimensions for avoidant-high profile', () => {
      const testResults = {
        scores: {
          anxious: 1,
          secure: 2,
          avoidant: 14,
          disorganized: 0,
        },
      };

      calcolaDaTest(testResults);

      const dim1 = parseFloat(document.getElementById('dim1').value);
      expect(dim1).toBeGreaterThan(5);

      const dim2 = parseFloat(document.getElementById('dim2').value);
      expect(dim2).toBeLessThan(5);
    });

    it('should calculate dimensions for secure-high profile', () => {
      const testResults = {
        scores: {
          anxious: 2,
          secure: 11,
          avoidant: 2,
          disorganized: 0,
        },
      };

      calcolaDaTest(testResults);

      const dim1 = parseFloat(document.getElementById('dim1').value);
      expect(dim1).toBeCloseTo(5, 1);

      const dim3 = parseFloat(document.getElementById('dim3').value);
      const dim4 = parseFloat(document.getElementById('dim4').value);
      const dim5 = parseFloat(document.getElementById('dim5').value);
      expect(dim3).toBeGreaterThan(5);
      expect(dim4).toBeGreaterThan(5);
      expect(dim5).toBeGreaterThan(5);
    });

    it('should handle edge case with equal anxious and avoidant scores', () => {
      const testResults = {
        scores: {
          anxious: 5,
          secure: 10,
          avoidant: 5,
          disorganized: 1,
        },
      };

      calcolaDaTest(testResults);

      const dim1 = parseFloat(document.getElementById('dim1').value);
      expect(dim1).toBeCloseTo(5, 1);
    });
  });

  describe('aggiornaMappa', () => {
    it('should update value displays when called', () => {
      document.getElementById('dim1').value = '7.5';
      document.getElementById('dim2').value = '6.0';

      aggiornaMappa();

      const dim1Value = document.getElementById('dim1-value');
      const dim2Value = document.getElementById('dim2-value');

      if (dim1Value) {
        expect(parseFloat(dim1Value.textContent)).toBeCloseTo(7.5, 1);
      }
      if (dim2Value) {
        expect(parseFloat(dim2Value.textContent)).toBeCloseTo(6.0, 1);
      }
    });

    it('should calculate average correctly', () => {
      document.getElementById('dim1').value = '5';
      document.getElementById('dim2').value = '5';
      document.getElementById('dim3').value = '5';
      document.getElementById('dim4').value = '5';
      document.getElementById('dim5').value = '5';

      aggiornaMappa();

      const averageScore = document.getElementById('average-score');
      if (averageScore) {
        expect(parseFloat(averageScore.textContent)).toBeCloseTo(5.0, 1);
      }
    });
  });

  describe('readMapScores', () => {
    it('should read slider values and compute average', () => {
      document.getElementById('dim1').value = '8';
      document.getElementById('dim2').value = '6';
      document.getElementById('dim3').value = '4';
      document.getElementById('dim4').value = '6';
      document.getElementById('dim5').value = '6';

      const { punteggi, media } = readMapScores();

      expect(punteggi).toEqual([8, 6, 4, 6, 6]);
      expect(media).toBeCloseTo(6, 1);
    });
  });

  describe('buildMapToolResponse', () => {
    it('should return JSON payload for WebMCP agents', () => {
      document.getElementById('dim1').value = '5';
      document.getElementById('dim2').value = '5';
      document.getElementById('dim3').value = '5';
      document.getElementById('dim4').value = '5';
      document.getElementById('dim5').value = '5';

      const payload = JSON.parse(buildMapToolResponse());

      expect(payload.punteggi).toEqual([5, 5, 5, 5, 5]);
      expect(payload.media).toBe('5.0');
      expect(payload.message).toContain('aggiornata');
    });
  });
});
