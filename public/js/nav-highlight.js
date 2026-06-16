// nav-highlight.js
// Evidenzia la voce di menu corrente e apre il sottomenu pertinente

/**
 * @returns {string}
 */
function getCurrentPagePath() {
  const segments = window.location.pathname.split('/').filter(Boolean);
  const filename = segments[segments.length - 1] || 'index.html';
  if (filename === 'public' || !filename.endsWith('.html')) {
    return 'index.html';
  }
  return segments.length > 1 ? segments.slice(-2).join('/') : filename;
}

/**
 * @param {string} href
 * @returns {string}
 */
function getLinkPagePath(href) {
  if (!href || href.startsWith('#')) {
    return '';
  }
  try {
    const url = new URL(href, window.location.href);
    const segments = url.pathname.split('/').filter(Boolean);
    const filename = segments[segments.length - 1] || 'index.html';
    return segments.length > 1 ? segments.slice(-2).join('/') : filename;
  } catch {
    return '';
  }
}

/**
 * @param {HTMLElement} [header]
 */
function highlightCurrentNav(header = document.querySelector('header')) {
  if (!header) {
    return;
  }

  const current = getCurrentPagePath();
  const links = header.querySelectorAll('.nav-links a[href]');
  let bestMatch = null;
  let bestLength = 0;

  links.forEach((link) => {
    const linkPath = getLinkPagePath(link.getAttribute('href'));
    if (!linkPath) {
      return;
    }

    const isMatch =
      current === linkPath ||
      current.endsWith(`/${linkPath}`) ||
      linkPath === current.split('/').pop();

    if (isMatch && linkPath.length >= bestLength) {
      bestMatch = link;
      bestLength = linkPath.length;
    }
  });

  links.forEach((link) => {
    link.classList.remove('nav-link--active');
    link.removeAttribute('aria-current');
  });

  if (!bestMatch) {
    return;
  }

  bestMatch.classList.add('nav-link--active');
  bestMatch.setAttribute('aria-current', 'page');

  const submenu = bestMatch.closest('.nav-submenu');
  if (!submenu) {
    return;
  }

  const parentItem = submenu.closest('.nav-item--has-submenu');
  if (!parentItem) {
    return;
  }

  parentItem.classList.add('open');
  const toggle = parentItem.querySelector('.nav-submenu-toggle');
  if (toggle) {
    toggle.setAttribute('aria-expanded', 'true');
  }
  submenu.setAttribute('aria-hidden', 'false');
}

if (typeof window !== 'undefined') {
  window.highlightCurrentNav = highlightCurrentNav;
  window.getCurrentPagePath = getCurrentPagePath;
  window.getLinkPagePath = getLinkPagePath;
}
