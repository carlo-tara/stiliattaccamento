// journey-hub.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { resolve } from 'path';
import { loadPublicScript } from '../helpers/test-utils.js';

loadPublicScript(resolve(__dirname, '../../public/js/constants.js'));
loadPublicScript(resolve(__dirname, '../../public/js/modules/journey-config.js'));
loadPublicScript(resolve(__dirname, '../../public/js/modules/journey-hub.js'));

describe('journey-config.js', () => {
  it('returns config for all 12 style-level keys', () => {
    const styles = ['secure', 'ansioso', 'evitante', 'disorganizzato'];
    const levels = ['basso', 'medio', 'alto'];
    styles.forEach((stile) => {
      levels.forEach((livello) => {
        const config = getJourneyConfig(stile, livello);
        expect(config.immediate).toBeDefined();
        expect(config.understand).toBeDefined();
        expect(config.connect).toBeDefined();
        expect(config.immediate.href).toBeTruthy();
      });
    });
  });

  it('builds href with anchor', () => {
    const href = buildStepHref(
      { href: 'profili/ansioso-alto.html', anchor: 'strategie-pratiche' },
      '../'
    );
    expect(href).toBe('../profili/ansioso-alto.html#strategie-pratiche');
  });

  it('normalizes invalid style to secure-basso', () => {
    const key = getJourneyKey('invalid', 'invalid');
    expect(key).toBe('secure-basso');
  });
});

describe('journey-hub.js', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('readTestResults returns null when empty', () => {
    expect(readTestResults()).toBeNull();
  });

  it('readTestResults parses valid test data', () => {
    localStorage.setItem(
      'testResults',
      JSON.stringify({
        primaryStyle: 'ansioso',
        level: 'medio',
        scores: {},
      })
    );
    const result = readTestResults();
    expect(result.primaryStyle).toBe('ansioso');
    expect(result.level).toBe('medio');
  });

  it('renderJourneyHub shows fallback without test data', () => {
    const container = document.createElement('div');
    renderJourneyHub(container);
    expect(container.textContent).toMatch(/test/i);
    expect(container.querySelector('a[href*="test.html"]')).toBeTruthy();
  });

  it('renderJourneyHub renders three steps with profile', () => {
    const container = document.createElement('div');
    renderJourneyHub(container, { stile: 'ansioso', livello: 'alto', basePath: '' });
    expect(container.querySelectorAll('.journey-step').length).toBe(3);
    expect(container.textContent).toMatch(/Ansioso alto/i);
    expect(container.querySelector('.journey-disclaimer')).toBeTruthy();
  });
});
