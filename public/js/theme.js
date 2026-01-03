// Theme - Light mode only (forced)
// Theme selection is disabled, only light theme is available

const THEME_LIGHT = 'light';

function setTheme(theme) {
  // Force light theme always
  document.documentElement.setAttribute('data-theme', THEME_LIGHT);
  
  // Hide theme toggle button if present
  const toggleBtn = document.querySelector('.theme-toggle');
  if (toggleBtn) {
    toggleBtn.style.display = 'none';
  }
}

// Initialize theme immediately (before DOM ready)
// Set light theme as early as possible
if (document.documentElement) {
  document.documentElement.setAttribute('data-theme', THEME_LIGHT);
  // Also set on body
  if (document.body) {
    document.body.setAttribute('data-theme', THEME_LIGHT);
  }
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
  // Always set light theme
  setTheme(THEME_LIGHT);
});

// Also set immediately when script loads
setTheme(THEME_LIGHT);

// Disable toggle functions (kept for backward compatibility but do nothing)
function toggleTheme() {
  // Disabled - theme is always light
  setTheme(THEME_LIGHT);
}

function toggleHighContrast() {
  // Disabled - theme is always light
  setTheme(THEME_LIGHT);
}

// Make functions globally accessible (for backward compatibility)
window.toggleTheme = toggleTheme;
window.setTheme = setTheme;
window.toggleHighContrast = toggleHighContrast;

// Export functions for external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { setTheme, toggleTheme, toggleHighContrast, THEME_LIGHT };
}
