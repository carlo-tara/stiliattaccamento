// fix-approfondimenti-nesting.test.js

import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const {
  detectStyleModifier,
  fixApprofondimentiNesting,
} = require('../../scripts/fix-approfondimenti-nesting.js');

describe('fix-approfondimenti-nesting.js', () => {
  describe('detectStyleModifier', () => {
    it('should map style prefixes to modifiers', () => {
      expect(detectStyleModifier('SECURE - Finanze')).toBe('secure');
      expect(detectStyleModifier('ANSIOSO - Test')).toBe('anxious');
      expect(detectStyleModifier('EVITANTE - Test')).toBe('avoidant');
      expect(detectStyleModifier('OSCILLANTE - Test')).toBe('disorganized');
    });
  });

  describe('fixApprofondimentiNesting', () => {
    it('should flatten nested style cards into articles', () => {
      const input = `
        <div class="card mb-6"><p>Intro</p></div>
        <div class="card mb-6"><h3>SECURE - A</h3><ul><li>one</li></ul>
        <div class="card mb-6"><h3>ANSIOSO - B</h3><ul><li>two</li></ul>
        </div>
        <!-- Navigazione -->
        <div class="card mt-8">nav</div>
      `;

      const { html, fixed, sectionCount } = fixApprofondimentiNesting(input);
      expect(fixed).toBe(true);
      expect(sectionCount).toBe(2);
      expect(html).toContain('style-section--secure');
      expect(html).toContain('style-section--anxious');
      expect(html).toContain('</article>');
      expect(html).not.toMatch(/<article[^>]*>[\s\S]*<div class="card mb-6"><h3>/);
    });

    it('should leave pages without style h3 cards unchanged', () => {
      const input = '<div class="card mb-6"><h2>Title</h2></div>';
      const { html, fixed } = fixApprofondimentiNesting(input);
      expect(fixed).toBe(false);
      expect(html).toBe(input);
    });
  });
});
