// journey-constants.test.js
// Verifica che nav-highlight e journey-hub condividano JOURNEY_STORAGE_KEY senza conflitti

import { describe, it, expect } from 'vitest';
import { resolve } from 'path';
import { loadPublicScript } from '../helpers/test-utils.js';

describe('JOURNEY_STORAGE_KEY condivisa', () => {
  it('should load nav-highlight and journey-hub without duplicate declaration error', () => {
    loadPublicScript(resolve(__dirname, '../../public/js/constants.js'));

    expect(() => {
      loadPublicScript(resolve(__dirname, '../../public/js/nav-highlight.js'));
      loadPublicScript(resolve(__dirname, '../../public/js/modules/journey-config.js'));
      loadPublicScript(resolve(__dirname, '../../public/js/modules/journey-hub.js'));
    }).not.toThrow();

    expect(typeof readTestResults).toBe('function');
    expect(typeof highlightJourneyNav).toBe('function');
  });
});
