// seo-config.js
// Configurazione SEO condivisa tra script di generazione

const SITE_URL = 'https://stiliattaccamento.com';
const SITE_NAME = 'Stili di Attaccamento Wiki';
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/index-hero.webp`;
const DEFAULT_OG_IMAGE_ALT =
  'Paesaggio astratto che rappresenta il viaggio verso la consapevolezza dell\'attaccamento';
const DEFAULT_OG_IMAGE_WIDTH = '800';
const DEFAULT_OG_IMAGE_HEIGHT = '600';
const DEFAULT_LOCALE = 'it_IT';
const SITE_LAUNCH_DATE = '2024-12-27';

const SITEMAP_PRIORITY = {
  'index.html': 1.0,
  'test.html': 0.9,
  'stili-base.html': 0.9,
  'modello-gradienti.html': 0.9,
  'archetipi.html': 0.9,
  'fondamenti.html': 0.85,
  'mappa-personale.html': 0.85,
  'esercizi.html': 0.85,
  'approfondimenti.html': 0.8,
  'libri.html': 0.8,
  'storie-reali.html': 0.8,
  'dinamiche-coppia.html': 0.75,
  'come-supportare-partner.html': 0.75,
  'quando-cercare-aiuto.html': 0.75,
  'risorse.html': 0.7,
  'mazzo-tarocchi.html': 0.65,
  'privacy-policy.html': 0.2,
  'cookie-policy.html': 0.2,
  'termini-condizioni.html': 0.2,
};

const PROFILE_PRIORITY = 0.8;
const SUBSECTION_PRIORITY = 0.7;

module.exports = {
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_WIDTH,
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_LOCALE,
  SITE_LAUNCH_DATE,
  SITEMAP_PRIORITY,
  PROFILE_PRIORITY,
  SUBSECTION_PRIORITY,
};
