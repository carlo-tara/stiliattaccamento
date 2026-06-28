// Service Worker — cache-first per asset statici, network-first per HTML

const CACHE_NAME = 'stili-attaccamento-v6';
const PRECACHE_URLS = [
  '/css/site.min.css',
  '/manifest.json',
  '/js/constants.js',
  '/js/template-loader.js',
  '/js/theme.js',
  '/js/mobile-menu.js',
  '/js/nav-highlight.js',
  '/js/breadcrumb-generator.js',
  '/js/cookie-banner.js',
  '/js/gtm.js',
  '/js/utils.js',
  '/js/test-surveyjs.js',
  '/js/pwa.js',
  '/templates/header.html',
  '/templates/topbar.html',
  '/templates/footer.html',
  '/images/index-hero-700.webp',
];

const CACHEABLE_EXTENSIONS = /\.(css|js|webp|png|jpg|jpeg|svg|woff2?)$/i;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    event.respondWith(
      fetch(request)
        .then((response) => response)
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  if (CACHEABLE_EXTENSIONS.test(url.pathname) || url.pathname.includes('/templates/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
  }
});
