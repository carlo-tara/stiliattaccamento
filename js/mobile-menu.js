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
    // Close menu
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('active');
    body.style.overflow = ''; // Restore scroll
  } else {
    // Open menu
    navLinks.classList.add('active');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    overlay.classList.add('active');
    body.style.overflow = 'hidden'; // Prevent background scroll
  }
}

// Close menu when clicking on a link (mobile)
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.getElementById('navLinks');
  if (navLinks) {
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        // Close menu after navigation on mobile
        if (window.innerWidth < 960) {
          toggleMobileMenu();
        }
      });
    });
  }

  // Close menu on window resize if switching to desktop
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

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const navLinks = document.getElementById('navLinks');
      if (navLinks && navLinks.classList.contains('active')) {
        toggleMobileMenu();
      }
    }
  });
});

// Make function globally accessible
window.toggleMobileMenu = toggleMobileMenu;

