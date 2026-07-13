import { readFileSync } from 'fs';
import { resolve } from 'path';
import { beforeEach, describe, expect, it } from 'vitest';

const PUBLIC = resolve(process.cwd(), 'public');
const WIKI_TABS_PATH = resolve(PUBLIC, 'js/modules/wiki-tabs.js');

function loadWikiTabs(document, window) {
  const code = readFileSync(WIKI_TABS_PATH, 'utf-8');
  window.eval(code);
  document.dispatchEvent(new window.Event('DOMContentLoaded'));
}

function buildLongWikiPage(document) {
  document.body.innerHTML = `
    <main>
      <div class="container" data-wiki-tabs data-wiki-tabs-min="3">
        <div class="card card--accent-primary mb-6"><h2>In pratica</h2></div>
        <article class="card mb-8"><h2>Prima sezione</h2><p>Contenuto uno.</p></article>
        <article class="card mb-8"><h2>Seconda sezione</h2><p>Contenuto due.</p></article>
        <article class="card mb-8"><h2>Terza sezione</h2><p>Contenuto tre.</p></article>
        <div class="card"><h3>Prossimi passi</h3></div>
        <section class="section section--compact"><h2>FAQ</h2></section>
      </div>
    </main>
  `;
}

describe('wiki-tabs.js', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('crea schede quando ci sono abbastanza sezioni', () => {
    buildLongWikiPage(document);
    loadWikiTabs(document, window);

    const container = document.querySelector('[data-wiki-tabs]');
    expect(container?.dataset.wikiTabsReady).toBe('true');
    expect(document.querySelectorAll('.wiki-tabs__tab')).toHaveLength(3);
    expect(document.querySelectorAll('.wiki-tabs__panel')).toHaveLength(3);
  });

  it('mantiene intro e footer fuori dalle schede', () => {
    buildLongWikiPage(document);
    loadWikiTabs(document, window);

    const container = document.querySelector('[data-wiki-tabs]');
    const tabsRoot = document.querySelector('[data-wiki-tabs-root]');
    const intro = container?.querySelector('.card--accent-primary');
    const footer = container?.querySelector('.section--compact');

    expect(intro?.compareDocumentPosition(tabsRoot)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(footer?.compareDocumentPosition(tabsRoot)).toBe(Node.DOCUMENT_POSITION_PRECEDING);
  });

  it('usa etichette complete senza troncamento', () => {
    document.body.innerHTML = `
      <div class="container" data-wiki-tabs data-wiki-tabs-min="2">
        <article class="card mb-8"><h2>I 4 bisogni fondamentali dell'attaccamento (Bowlby)</h2></article>
        <article class="card mb-8"><h2>Seconda sezione</h2></article>
      </div>
    `;
    loadWikiTabs(document, window);

    const tab = document.querySelector('.wiki-tabs__tab');
    expect(tab?.textContent).toBe("I 4 bisogni fondamentali dell'attaccamento (Bowlby)");
    expect(tab?.getAttribute('title')).toBe("I 4 bisogni fondamentali dell'attaccamento (Bowlby)");
    expect(document.querySelector('.wiki-tabs__heading')?.textContent).toBe('Sezioni in questa pagina');
  });

  it('non attiva le schede se le sezioni sono insufficienti', () => {
    document.body.innerHTML = `
      <div class="container" data-wiki-tabs data-wiki-tabs-min="5">
        <article class="card mb-8"><h2>Una sola</h2></article>
      </div>
    `;
    loadWikiTabs(document, window);

    expect(document.querySelector('[data-wiki-tabs-root]')).toBeNull();
    expect(document.querySelector('[data-wiki-tabs]')?.dataset.wikiTabsReady).toBeUndefined();
  });
});
