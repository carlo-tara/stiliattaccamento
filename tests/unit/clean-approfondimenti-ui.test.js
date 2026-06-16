// clean-approfondimenti-ui.test.js

import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const {
  humanizeStyleTitle,
  stripWikiListInlineStyles,
  cleanApprofondimentiUi,
} = require('../../scripts/clean-approfondimenti-ui.js');

describe('clean-approfondimenti-ui.js', () => {
  describe('humanizeStyleTitle', () => {
    it('should format style titles in sentence case', () => {
      expect(humanizeStyleTitle('SECURE - Finanze Trasparenti e Autonome')).toBe(
        'Secure — finanze trasparenti e autonome'
      );
    });
  });

  describe('stripWikiListInlineStyles', () => {
    it('should remove list inline styles', () => {
      const input =
        '<ul style="margin-left: var(--spacing-6); margin-top: var(--spacing-4);"><li style="margin-bottom: var(--spacing-2);">item</li></ul>';
      const output = stripWikiListInlineStyles(input);
      expect(output).toBe('<ul><li>item</li></ul>');
    });
  });

  describe('cleanApprofondimentiUi', () => {
    it('should replace navigation card with content-nav', () => {
      const input = `
        <!-- Navigazione -->
        <div class="card mt-8">
          <h3>Altri Approfondimenti</h3>
          <p><a href="../approfondimenti.html">← Torna all'indice degli Approfondimenti</a></p>
        </div>
      `;
      const { html, changed } = cleanApprofondimentiUi(input);
      expect(changed).toBe(true);
      expect(html).toContain('content-nav');
      expect(html).not.toContain('Altri Approfondimenti');
    });
  });
});
