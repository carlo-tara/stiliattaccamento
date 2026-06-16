// Mobile Menu Toggle
// Gestisce apertura/chiusura menu hamburger, focus trap e tastiera

let menuTrigger = null;

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);
}

function setOverlayState(overlay, isVisible) {
  if (!overlay) {
    return;
  }
  overlay.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
  overlay.tabIndex = isVisible ? 0 : -1;
}

function updateHamburgerLabel(hamburger, isOpen) {
  if (!hamburger) {
    return;
  }
  hamburger.setAttribute(
    'aria-label',
    isOpen ? 'Chiudi menu di navigazione' : 'Apri menu di navigazione'
  );
}

function focusFirstMenuItem(navLinks) {
  const focusable = getFocusableElements(navLinks);
  if (focusable.length > 0) {
    focusable[0].focus();
  }
}

function toggleMobileMenu() {
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.querySelector('.hamburger');
  const overlay = document.getElementById('mobileMenuOverlay');
  const body = document.body;

  if (!navLinks || !hamburger || !overlay) {
    return;
  }

  const isActive = navLinks.classList.contains('active');

  if (isActive) {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('active');
    body.style.overflow = '';
    setOverlayState(overlay, false);
    updateHamburgerLabel(hamburger, false);

    const openSubmenus = navLinks.querySelectorAll('.nav-item--has-submenu.open');
    openSubmenus.forEach((item) => {
      item.classList.remove('open');
      const toggle = item.querySelector('.nav-submenu-toggle');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        const submenuId = toggle.getAttribute('aria-controls');
        const submenu = submenuId ? document.getElementById(submenuId) : null;
        if (submenu) {
          submenu.setAttribute('aria-hidden', 'true');
        }
      }
    });

    if (menuTrigger && typeof menuTrigger.focus === 'function') {
      menuTrigger.focus();
    }
    menuTrigger = null;
  } else {
    menuTrigger = document.activeElement;
    navLinks.classList.add('active');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    overlay.classList.add('active');
    body.style.overflow = 'hidden';
    setOverlayState(overlay, true);
    updateHamburgerLabel(hamburger, true);
    focusFirstMenuItem(navLinks);
  }
}

function toggleSubmenu(button) {
  const navItem = button.closest('.nav-item--has-submenu');
  if (!navItem) {
    return;
  }

  const isOpen = navItem.classList.contains('open');
  const submenuId = button.getAttribute('aria-controls');
  const submenu = submenuId ? document.getElementById(submenuId) : null;

  if (isOpen) {
    navItem.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
    if (submenu) {
      submenu.setAttribute('aria-hidden', 'true');
    }
  } else {
    navItem.classList.add('open');
    button.setAttribute('aria-expanded', 'true');
    if (submenu) {
      submenu.setAttribute('aria-hidden', 'false');
    }
  }
}

let submenuInitialized = false;

function initializeSubmenus() {
  if (submenuInitialized) {
    return;
  }
  submenuInitialized = true;

  document.querySelectorAll('.nav-submenu').forEach((submenu) => {
    submenu.setAttribute('aria-hidden', 'true');
  });

  document.addEventListener('click', (e) => {
    const navLinks = document.getElementById('navLinks');
    if (!navLinks || !navLinks.contains(e.target)) {
      return;
    }

    const toggle = e.target.closest('.nav-submenu-toggle');
    if (toggle) {
      e.preventDefault();
      e.stopPropagation();
      toggleSubmenu(toggle);
      return;
    }

    const link = e.target.closest('a');
    if (link && !link.closest('.nav-submenu-toggle')) {
      if (navLinks.classList.contains('active')) {
        toggleMobileMenu();
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initializeSubmenus();
  const overlay = document.getElementById('mobileMenuOverlay');
  setOverlayState(overlay, false);
});

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.innerWidth >= 960) {
      const navLinks = document.getElementById('navLinks');
      const hamburger = document.querySelector('.hamburger');
      const overlay = document.getElementById('mobileMenuOverlay');

      if (navLinks) {
        navLinks.classList.remove('active');
      }
      if (hamburger) {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        updateHamburgerLabel(hamburger, false);
      }
      if (overlay) {
        overlay.classList.remove('active');
        setOverlayState(overlay, false);
      }
      document.body.style.overflow = '';
      menuTrigger = null;
    }
  }, 250);
});

document.addEventListener('keydown', (e) => {
  const navLinks = document.getElementById('navLinks');
  const isMenuOpen = navLinks && navLinks.classList.contains('active');

  if (e.key === 'Escape' && isMenuOpen) {
    toggleMobileMenu();
    return;
  }

  if (!isMenuOpen) {
    return;
  }

  if (e.key === 'Tab') {
    const focusable = getFocusableElements(navLinks);
    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

window.toggleMobileMenu = toggleMobileMenu;
window.initializeSubmenus = initializeSubmenus;
