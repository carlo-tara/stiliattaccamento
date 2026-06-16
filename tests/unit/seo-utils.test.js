// seo-utils.test.js

import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { sanitizeMetaText, truncateAtWord, toIsoDate } = require('../../scripts/lib/seo-utils.js');

describe('seo-utils.js', () => {
  describe('truncateAtWord', () => {
    it('should not cut mid-word when space is available', () => {
      const text = 'consapevolezza, non guarigione.';
      expect(truncateAtWord(text, 20)).toBe('consapevolezza, non');
    });
  });

  describe('toIsoDate', () => {
    it('should format date as YYYY-MM-DD', () => {
      expect(toIsoDate(new Date('2026-06-16T12:00:00Z'))).toBe('2026-06-16');
    });
  });

  describe('sanitizeMetaText', () => {
    it('should preserve full homepage description within 160 chars', () => {
      const text =
        'Perché certe relazioni ti stancano? Test gratuito, 12 profili e guide sugli stili di attaccamento. Chiaro, senza giudizio — consapevolezza, non guarigione.';
      const result = sanitizeMetaText(text, 160);
      expect(result).toContain('guarigione');
      expect(result.length).toBeLessThanOrEqual(160);
    });
  });
});
