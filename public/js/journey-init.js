// journey-init.js
// Inizializza banner percorso dopo caricamento moduli journey

document.addEventListener('DOMContentLoaded', () => {
  if (typeof initJourneyBanner === 'function') {
    initJourneyBanner();
  }
});
