// profile-page-init.js
// Inizializza journey-next-step su pagine profilo via data-attribute su body

document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('journey-next-step-content');
  if (!el || typeof renderJourneyNextSteps !== 'function') {
    return;
  }

  const { profileStile, profileLivello } = document.body.dataset;
  if (!profileStile || !profileLivello) {
    return;
  }

  const depth = window.location.pathname.split('/').filter(Boolean).length;
  const basePath = depth > 1 ? '../' : './';

  renderJourneyNextSteps(el, {
    stile: profileStile,
    livello: profileLivello,
    basePath,
    compact: true,
  });
});
