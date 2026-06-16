// breadcrumb-generator.test.js

import { describe, it, expect, beforeEach } from 'vitest';
import { resolve } from 'path';
import { cleanupDOM, loadPublicScript } from '../helpers/test-utils.js';

loadPublicScript(resolve(__dirname, '../../public/js/breadcrumb-generator.js'));

describe('breadcrumb-generator.js', () => {
  beforeEach(() => {
    cleanupDOM();
    document.body.innerHTML = `
      <div class="topbar">
        <div class="container">
          <nav class="breadcrumb" id="breadcrumb-nav"></nav>
        </div>
      </div>
    `;
  });

  it('should hide breadcrumb on homepage', () => {
    window.history.pushState({}, '', '/index.html');
    generateBreadcrumb();

    const topbar = document.querySelector('.topbar');
    expect(topbar.classList.contains('topbar--hidden')).toBe(true);
    expect(document.getElementById('breadcrumb-nav').innerHTML).toBe('');
  });

  it('should hide breadcrumb on root path', () => {
    window.history.pushState({}, '', '/');
    generateBreadcrumb();

    expect(document.querySelector('.topbar--hidden')).toBeTruthy();
  });

  it('should render a single trail for inner pages', () => {
    window.history.pushState({}, '', '/test.html');
    generateBreadcrumb();

    const nav = document.getElementById('breadcrumb-nav');
    expect(nav.querySelector('.breadcrumb__list')).toBeTruthy();
    expect(nav.textContent).toContain('Home');
    expect(nav.textContent).toContain('Test');
    expect(nav.textContent.match(/Home/g)?.length).toBe(1);
    expect(nav.querySelector('[aria-current="page"]')?.textContent).toBe('Test');
  });

  it('should render nested paths', () => {
    window.history.pushState({}, '', '/approfondimenti/finanze.html');
    generateBreadcrumb();

    const nav = document.getElementById('breadcrumb-nav');
    expect(nav.textContent).toContain('Approfondimenti');
    expect(nav.textContent).toContain('Denaro ed economia personale');
  });
});
