// inject-seo.test.js
// Unit tests per scripts/inject-seo.js

import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const {
  sanitizeMetaText,
  escapeAttr,
  stripAllSeoTags,
  findInsertPoint,
  buildSeoBlock,
} = require('../../scripts/inject-seo.js');

describe('inject-seo.js', () => {
  describe('sanitizeMetaText', () => {
    it('should collapse whitespace and trim', () => {
      expect(sanitizeMetaText('  hello   world  ')).toBe('hello world');
    });

    it('should truncate to max length', () => {
      const long = 'a'.repeat(200);
      expect(sanitizeMetaText(long, 160)).toHaveLength(160);
    });

    it('should truncate at word boundary', () => {
      const text =
        'Perché certe relazioni ti stancano? Test gratuito, 12 profili e guide sugli stili di attaccamento. Linguaggio chiaro, senza giudizio — consapevolezza, non guarigione.';
      const result = sanitizeMetaText(text, 100);
      expect(result).not.toMatch(/guari$/);
      expect(result.endsWith('guarigione.')).toBe(false);
      expect(result.length).toBeLessThanOrEqual(100);
    });

    it('should strip newlines from storie-reali style content', () => {
      const messy = 'Line one.\n\nLine two with more text.';
      expect(messy).toBe(messy);
      expect(sanitizeMetaText(messy)).not.toContain('\n');
    });
  });

  describe('escapeAttr', () => {
    it('should escape quotes and ampersands', () => {
      expect(escapeAttr('Tom & "Jerry"')).toBe('Tom &amp; &quot;Jerry&quot;');
    });
  });

  describe('stripAllSeoTags', () => {
    it('should remove SEO block with twitter:image:alt', () => {
      const html = `<head>
  <!-- SEO: canonical, Open Graph, Twitter Card -->
  <link rel="canonical" href="https://example.com/">
  <meta name="twitter:image:alt" content="alt">
  <link rel="stylesheet" href="css/main.css">
</head>`;
      const result = stripAllSeoTags(html);
      expect(result).not.toContain('canonical');
      expect(result).toContain('stylesheet');
    });

    it('should remove legacy block without comment', () => {
      const html = `<head>
  <link rel="canonical" href="https://example.com/">
  <meta property="og:title" content="Title">
  <meta name="twitter:image" content="https://example.com/img.webp">
  <!-- Performance: resource hints -->
</head>`;
      const result = stripAllSeoTags(html);
      expect(result).not.toContain('og:title');
      expect(result).toContain('Performance');
    });
  });

  describe('findInsertPoint', () => {
    it('should prefer performance marker over google fonts stylesheet', () => {
      const html = `  <!-- Performance: resource hints -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css">
  <link rel="stylesheet" href="../css/main.css">`;
      expect(findInsertPoint(html)).toBe(html.indexOf('<!-- Performance'));
    });

    it('should find main.css when no performance block', () => {
      const html = '<link rel="stylesheet" href="css/main.css">';
      expect(findInsertPoint(html)).toBe(0);
    });
  });

  describe('buildSeoBlock', () => {
    it('should produce valid single-line meta attributes', () => {
      const block = buildSeoBlock({
        title: 'Test',
        description: 'Short description',
        canonical: 'https://stiliattaccamento.com/test.html',
        ogType: 'website',
        image: 'https://stiliattaccamento.com/images/index-hero.webp',
        imageAlt: 'Alt text',
        keywords: 'stili di attaccamento, test attaccamento',
      });
      expect(block).toContain('hreflang="it"');
      expect(block).toContain('hreflang="x-default"');
      expect(block).toContain('name="keywords"');
      expect(block).toContain('og:image:width');
      expect(block).toContain('twitter:image:alt');
      expect(block.split('\n').every((line) => !line.includes('\n\n'))).toBe(true);
    });
  });
});
