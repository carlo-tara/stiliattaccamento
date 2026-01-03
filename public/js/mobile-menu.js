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
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/c25677db-b7a5-4809-98b8-c33aebc2a0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'mobile-menu.js:34',message:'mobile-menu DOMContentLoaded',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
  // #endregion
  const navLinks = document.getElementById('navLinks');
  
  // #region agent log
  const hamburger = document.querySelector('.hamburger');
  const hamburgerLines = document.querySelectorAll('.hamburger-line');
  const computedStyle = hamburger ? window.getComputedStyle(hamburger) : null;
  fetch('http://127.0.0.1:7243/ingest/c25677db-b7a5-4809-98b8-c33aebc2a0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'mobile-menu.js:37',message:'navLinks and hamburger check',data:{navLinksExists:!!navLinks,hamburgerExists:!!hamburger,hamburgerLinesCount:hamburgerLines.length,hamburgerDisplay:computedStyle?.display,hamburgerVisibility:computedStyle?.visibility},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
  // #endregion
  
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

