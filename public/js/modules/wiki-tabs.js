// wiki-tabs.js — schede per pagine wiki lunghe (progressive enhancement)

(function () {
  'use strict';

  const DEFAULT_SECTION = 'article.card.mb-8';
  const DEFAULT_MIN = 5;
  const MAX_LABEL = 28;

  /**
   * @param {string} text
   * @returns {string}
   */
  function slugify(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48);
  }

  /**
   * @param {HTMLElement} section
   * @returns {string}
   */
  function getSectionLabel(section) {
    const heading = section.querySelector('h2, h3');
    const raw = heading ? heading.textContent.trim() : 'Sezione';
    if (raw.length <= MAX_LABEL) {
      return raw;
    }
    return `${raw.slice(0, MAX_LABEL - 1).trim()}…`;
  }

  /**
   * @param {HTMLElement} section
   * @returns {string}
   */
  function getSectionSlug(section) {
    const heading = section.querySelector('h2[id], h3[id]');
    if (heading && heading.id) {
      return heading.id;
    }
    const label = section.querySelector('h2, h3');
    return slugify(label ? label.textContent : 'sezione');
  }

  /**
   * @param {HTMLElement} container
   * @param {string} selectors
   * @returns {HTMLElement[]}
   */
  function queryDirectSections(container, selectors) {
    const selectorList = selectors.split(',').map((s) => s.trim()).filter(Boolean);
    const children = Array.from(container.children);
    return children.filter((child) =>
      selectorList.some((selector) => child.matches(selector))
    );
  }

  /**
   * @param {HTMLElement} container
   * @param {HTMLElement} tabsRoot
   * @param {string} selectors
   */
  function movePinned(container, tabsRoot, selectors) {
    if (!selectors) {
      return;
    }
    selectors.split(',').map((s) => s.trim()).filter(Boolean).forEach((selector) => {
      container.querySelectorAll(`:scope > ${selector}`).forEach((node) => {
        if (!tabsRoot.contains(node)) {
          container.insertBefore(node, tabsRoot);
        }
      });
    });
  }

  /**
   * @param {HTMLElement} container
   * @param {HTMLElement} tabsRoot
   * @param {string} selectors
   */
  function movePinnedAfter(container, tabsRoot, selectors) {
    if (!selectors) {
      return;
    }
    const selectorList = selectors.split(',').map((s) => s.trim()).filter(Boolean);
    Array.from(container.children).forEach((node) => {
      if (
        node !== tabsRoot &&
        !tabsRoot.contains(node) &&
        selectorList.some((selector) => node.matches(selector))
      ) {
        container.appendChild(node);
      }
    });
  }

  /**
   * @param {HTMLElement} container
   */
  function initWikiTabs(container) {
    if (container.dataset.wikiTabsReady === 'true') {
      return;
    }

    const sectionSelector = container.dataset.wikiTabsSection || DEFAULT_SECTION;
    const minSections = Number(container.dataset.wikiTabsMin || DEFAULT_MIN);
    const sections = queryDirectSections(container, sectionSelector);

    if (sections.length < minSections) {
      return;
    }

    const tabsRoot = document.createElement('div');
    tabsRoot.className = 'wiki-tabs';
    tabsRoot.setAttribute('data-wiki-tabs-root', '');

    const nav = document.createElement('div');
    nav.className = 'wiki-tabs__nav';
    nav.setAttribute('role', 'tablist');
    nav.setAttribute('aria-label', 'Sezioni della pagina');

    const panels = document.createElement('div');
    panels.className = 'wiki-tabs__panels';

    const tabButtons = [];

    const firstSection = sections[0];
    container.insertBefore(tabsRoot, firstSection);

    sections.forEach((section, index) => {
      const slug = getSectionSlug(section);
      const label = getSectionLabel(section);
      const tabId = `wiki-tab-${slug}`;
      const panelId = `wiki-panel-${slug}`;

      const heading = section.querySelector('h2, h3');
      if (heading && !heading.id) {
        heading.id = slug;
      }

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'wiki-tabs__tab';
      button.id = tabId;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', panelId);
      button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      button.setAttribute('tabindex', index === 0 ? '0' : '-1');
      button.dataset.wikiTabSlug = slug;
      button.textContent = label;

      const panel = document.createElement('div');
      panel.className = 'wiki-tabs__panel';
      panel.id = panelId;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tabId);
      panel.hidden = index !== 0;
      if (index === 0) {
        panel.classList.add('wiki-tabs__panel--active');
      }

      panel.appendChild(section);
      nav.appendChild(button);
      panels.appendChild(panel);
      tabButtons.push({ button, panel, slug });
    });

    tabsRoot.appendChild(nav);
    tabsRoot.appendChild(panels);

    movePinned(container, tabsRoot, container.dataset.wikiTabsPinStart);
    movePinnedAfter(container, tabsRoot, container.dataset.wikiTabsPinEnd);

    /**
     * @param {number} index
     */
    function activateTab(index) {
      tabButtons.forEach((entry, i) => {
        const isActive = i === index;
        entry.button.setAttribute('aria-selected', isActive ? 'true' : 'false');
        entry.button.setAttribute('tabindex', isActive ? '0' : '-1');
        entry.panel.hidden = !isActive;
        entry.panel.classList.toggle('wiki-tabs__panel--active', isActive);
      });

      const active = tabButtons[index];
      if (active) {
        container.dataset.wikiTabsActive = active.slug;
        if (history.replaceState) {
          history.replaceState(null, '', `#${active.slug}`);
        } else {
          window.location.hash = active.slug;
        }
      }
    }

    tabButtons.forEach((entry, index) => {
      entry.button.addEventListener('click', () => activateTab(index));
      entry.button.addEventListener('keydown', (event) => {
        let next = index;
        if (event.key === 'ArrowRight') {
          next = (index + 1) % tabButtons.length;
        } else if (event.key === 'ArrowLeft') {
          next = (index - 1 + tabButtons.length) % tabButtons.length;
        } else if (event.key === 'Home') {
          next = 0;
        } else if (event.key === 'End') {
          next = tabButtons.length - 1;
        } else {
          return;
        }
        event.preventDefault();
        activateTab(next);
        tabButtons[next].button.focus();
      });
    });

    const hash = window.location.hash.replace(/^#/, '');
    if (hash) {
      const hashIndex = tabButtons.findIndex((entry) => entry.slug === hash);
      if (hashIndex >= 0) {
        activateTab(hashIndex);
      }
    }

    window.addEventListener('hashchange', () => {
      const slug = window.location.hash.replace(/^#/, '');
      const idx = tabButtons.findIndex((entry) => entry.slug === slug);
      if (idx >= 0) {
        activateTab(idx);
      }
    });

    container.dataset.wikiTabsReady = 'true';
    tabsRoot.classList.add('wiki-tabs--ready');
  }

  function initAll() {
    document.querySelectorAll('[data-wiki-tabs]').forEach(initWikiTabs);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
