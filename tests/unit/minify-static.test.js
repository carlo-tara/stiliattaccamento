import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, expect, it } from 'vitest';
import { minify } from 'html-minifier-terser';
import { HTML_MINIFY_OPTIONS, INJECT_COMMENT_PATTERNS } from '../../scripts/lib/minify-options.js';

const SAMPLE = `<!DOCTYPE html>
<html lang="it">
<head>
  <!-- Site analytics (auto-injected) -->
  <script>window.test = true;</script>
  <!-- End site analytics -->
  <!-- SEO: canonical, Open Graph, Twitter Card -->
  <title>Test</title>
  <!-- Performance: resource hints -->
  <link rel="stylesheet" href="css/site.min.css">
</head>
<body>
  <!-- Site shell: header (auto-injected) -->
  <header><h1>Titolo</h1></header>
  <!-- /Site shell: header -->
  <main>
    <p>Testo   con   spazi</p>
  </main>
</body>
</html>`;

describe('minify-static options', () => {
  it('preserva i marker HTML usati dagli script inject', async () => {
    const minified = await minify(SAMPLE, HTML_MINIFY_OPTIONS);

    INJECT_COMMENT_PATTERNS.forEach((pattern) => {
      expect(minified).toMatch(pattern);
    });
    expect(minified).toContain('Site shell: header (auto-injected)');
    expect(minified).toContain('End site analytics');
  });

  it('riduce whitespace significativo', async () => {
    const minified = await minify(SAMPLE, HTML_MINIFY_OPTIONS);
    expect(minified.length).toBeLessThan(SAMPLE.length);
    expect(minified).toContain('<p>Testo con spazi</p>');
  });

  it('minify-static.js esiste ed è eseguibile', () => {
    const scriptPath = resolve(process.cwd(), 'scripts/minify-static.js');
    const content = readFileSync(scriptPath, 'utf-8');
    expect(content).toContain('html-minifier-terser');
    expect(content).toContain('HTML_MINIFY_OPTIONS');
  });
});
