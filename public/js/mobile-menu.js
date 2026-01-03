// Mobile Menu Toggle
// Gestisce l'apertura e chiusura del menu hamburger su mobile

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
    // Close menu and all submenus
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('active');
    body.style.overflow = ''; // Restore scroll
    
    // Close all open submenus
    const openSubmenus = navLinks.querySelectorAll('.nav-item--has-submenu.open');
    openSubmenus.forEach(item => {
      item.classList.remove('open');
      const toggle = item.querySelector('.nav-submenu-toggle');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  } else {
    // Open menu
    navLinks.classList.add('active');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    overlay.classList.add('active');
    body.style.overflow = 'hidden'; // Prevent background scroll
  }
}

// Toggle submenu
function toggleSubmenu(button) {
  const navItem = button.closest('.nav-item--has-submenu');
  if (!navItem) return;
  
  const isOpen = navItem.classList.contains('open');
  
  if (isOpen) {
    navItem.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
  } else {
    navItem.classList.add('open');
    button.setAttribute('aria-expanded', 'true');
  }
}

// Event delegation flag to prevent multiple listeners
let submenuInitialized = false;

// Initialize submenu functionality using event delegation
function initializeSubmenus() {
  // Only initialize once
  if (submenuInitialized) return;
  submenuInitialized = true;
  
  // Use event delegation on document (works even if menu is loaded dynamically)
  document.addEventListener('click', (e) => {
    const navLinks = document.getElementById('navLinks');
    if (!navLinks) return;
    
    // Only handle clicks inside navLinks
    if (!navLinks.contains(e.target)) return;
    
    // Check if clicked element is a submenu toggle button
    const toggle = e.target.closest('.nav-submenu-toggle');
    if (toggle) {
      e.preventDefault();
      e.stopPropagation();
      toggleSubmenu(toggle);
      return;
    }
    
    // Check if clicked element is a link (but not the toggle button)
    const link = e.target.closest('a');
    if (link && !link.closest('.nav-submenu-toggle')) {
      // Close menu after navigation
      toggleMobileMenu();
    }
  });
}

// Initialize on DOMContentLoaded (for pages where template is already in DOM)
document.addEventListener('DOMContentLoaded', () => {
  initializeSubmenus();

});

// Close menu on window resize if switching to desktop (moved outside DOMContentLoaded)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.innerWidth >= 960) {
      const navLinks = document.getElementById('navLinks');
      const hamburger = document.querySelector('.hamburger');
      const overlay = document.getElementById('mobileMenuOverlay');
      
      if (navLinks) navLinks.classList.remove('active');
      if (hamburger) {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }, 250);
});

// Close menu on Escape key (moved outside DOMContentLoaded)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const navLinks = document.getElementById('navLinks');
    if (navLinks && navLinks.classList.contains('active')) {
      toggleMobileMenu();
    }
  }
});

// Make functions globally accessible
window.toggleMobileMenu = toggleMobileMenu;
window.initializeSubmenus = initializeSubmenus;

