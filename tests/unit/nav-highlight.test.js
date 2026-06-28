// nav-highlight.test.js

import { describe, it, expect, beforeEach } from 'vitest';
import { resolve } from 'path';
import { cleanupDOM, loadPublicScript } from '../helpers/test-utils.js';

loadPublicScript(resolve(__dirname, '../../public/js/constants.js'));
loadPublicScript(resolve(__dirname, '../../public/js/nav-highlight.js'));

describe('nav-highlight.js', () => {
  beforeEach(() => {
    cleanupDOM();
    window.history.pushState({}, '', '/approfondimenti/finanze.html');
  });

  it('should resolve current page path', () => {
    expect(getCurrentPagePath()).toBe('approfondimenti/finanze.html');
  });

  it('should highlight the matching nav link', () => {
    document.body.innerHTML = `
      <header>
        <ul class="nav-links">
          <li><a href="../approfondimenti.html">Panoramica</a></li>
          <li><a href="../approfondimenti/finanze.html">Finanze</a></li>
        </ul>
      </header>
    `;

    highlightCurrentNav();

    const finanze = document.querySelector('a[href="../approfondimenti/finanze.html"]');
    expect(finanze.classList.contains('nav-link--active')).toBe(true);
    expect(finanze.getAttribute('aria-current')).toBe('page');
  });

  it('should open parent submenu for nested links', () => {
    document.body.innerHTML = `
      <header>
        <ul class="nav-links">
          <li class="nav-item nav-item--has-submenu">
            <ul class="nav-submenu">
              <li><a href="../approfondimenti/finanze.html">Finanze</a></li>
            </ul>
            <button class="nav-submenu-toggle" aria-expanded="false"></button>
          </li>
        </ul>
      </header>
    `;

    highlightCurrentNav();

    const item = document.querySelector('.nav-item--has-submenu');
    expect(item.classList.contains('open')).toBe(true);
    expect(item.querySelector('.nav-submenu-toggle').getAttribute('aria-expanded')).toBe('true');
    expect(item.querySelector('.nav-submenu').getAttribute('aria-hidden')).toBe('false');
  });

  it('should highlight journey nav when test results exist', () => {
    localStorage.setItem(
      'testResults',
      JSON.stringify({ primaryStyle: 'ansioso', level: 'medio', scores: {} })
    );

    document.body.innerHTML = `
      <header>
        <ul class="nav-links">
          <li><a href="il-tuo-percorso.html" class="nav-link--journey">Il tuo percorso</a></li>
        </ul>
      </header>
    `;

    highlightJourneyNav();

    const journey = document.querySelector('.nav-link--journey');
    expect(journey.classList.contains('nav-link--journey-active')).toBe(true);
    expect(journey.getAttribute('aria-description')).toBeTruthy();

    localStorage.removeItem('testResults');
  });
});
