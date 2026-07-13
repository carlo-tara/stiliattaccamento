import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, expect, it } from 'vitest';

const INDEX_HTML = resolve(import.meta.dirname, '../../public/index.html');

describe('Pagefind search integration', () => {
  it('index.html includes search UI assets and modal', () => {
    const html = readFileSync(INDEX_HTML, 'utf-8');
    expect(html).toContain('pagefind-component-ui.css');
    expect(html).toContain('pagefind-component-ui.js');
    expect(html).toContain('<pagefind-modal');
    expect(html).toContain('site-search-trigger');
    expect(html).toContain('data-pagefind-body');
  });

  it('pagefind index exists after build', () => {
    const indexPath = resolve(import.meta.dirname, '../../public/pagefind/pagefind.js');
    expect(readFileSync(indexPath, 'utf-8').length).toBeGreaterThan(0);
  });
});
