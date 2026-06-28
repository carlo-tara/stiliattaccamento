// test-results-render.test.js

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { resolve } from 'path';
import { cleanupDOM, loadPublicScript } from '../helpers/test-utils.js';

loadPublicScript(resolve(__dirname, '../../public/js/utils.js'));
loadPublicScript(resolve(__dirname, '../../public/js/modules/test-results-render.js'));

describe('test-results-render.js', () => {
  beforeEach(() => {
    cleanupDOM();
    global.trackEvent = vi.fn();
    Element.prototype.scrollIntoView = vi.fn();
  });

  describe('buildTestIntroCard', () => {
    it('should include profile style and level', () => {
      const card = buildTestIntroCard('ansioso', 'medio');

      expect(card.textContent).toContain('Ansioso');
      expect(card.textContent).toContain('medio');
    });
  });

  describe('buildTestActionsLinks', () => {
    it('should link to the matching profile page', () => {
      const actions = buildTestActionsLinks('evitante', 'basso');
      const profileLink = actions.querySelector('a[href="profili/evitante-basso.html"]');

      expect(profileLink).toBeTruthy();
      expect(actions.querySelector('a[href="il-tuo-percorso.html"]')).toBeTruthy();
    });

    it('should fallback to stili-base for invalid style', () => {
      const actions = buildTestActionsLinks('invalid', 'basso');
      const profileLink = actions.querySelector('a[href="stili-base.html"]');

      expect(profileLink).toBeTruthy();
    });
  });

  describe('showTestResults', () => {
    it('should render results and track analytics', () => {
      document.body.innerHTML = `
        <div id="results" style="display: none;">
          <div id="results-content"></div>
        </div>
      `;

      const scores = { anxious: 10, secure: 5, avoidant: 3, disorganized: 2 };
      showTestResults(scores, 'ansioso', 'alto');

      const resultsDiv = document.getElementById('results');
      const content = document.getElementById('results-content');

      expect(resultsDiv.style.display).toBe('block');
      expect(content.textContent).toContain('Ansioso');
      expect(content.textContent).toContain('Supporto professionale');
      expect(content.querySelector('a[href="quando-cercare-aiuto.html"]')).toBeTruthy();
      expect(trackEvent).toHaveBeenCalledWith('test_results_viewed', {
        attachment_style: 'ansioso',
        attachment_level: 'alto',
      });
    });

    it('should not render help card for basso level', () => {
      document.body.innerHTML = `
        <div id="results" style="display: none;">
          <div id="results-content"></div>
        </div>
      `;

      showTestResults(
        { anxious: 3, secure: 8, avoidant: 2, disorganized: 1 },
        'secure',
        'basso'
      );

      expect(document.getElementById('results-content').textContent).not.toContain(
        'Supporto professionale'
      );
    });
  });
});
