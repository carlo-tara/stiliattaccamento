// Service Worker — cache-first per asset statici, network-first per HTML

const CACHE_NAME = 'stili-attaccamento-v8';
const PRECACHE_URLS = [
  '/css/site.min.css',
  '/manifest.json',
  '/js/site.min.js',
  '/js/cookie-banner.js',
  '/js/gtm.js',
  '/js/pwa.js',
  '/js/utils.js',
  '/js/test-surveyjs.js',
  '/images/index-hero-480.webp',
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
