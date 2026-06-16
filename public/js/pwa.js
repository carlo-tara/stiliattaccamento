// pwa.js — registrazione Service Worker (cache asset statici)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW opzionale: fallimento silenzioso in dev locale senza HTTPS
    });
  });
}
