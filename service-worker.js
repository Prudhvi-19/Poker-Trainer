/*
 * ENH-003: PWA offline support
 *
 * Simple precache of the app shell and static assets.
 * - Hash routing means we only need to cache index.html and assets.
 * - Works for GitHub Pages subpath deployments because we use relative URLs.
 */

const CACHE_VERSION = 'poker-trainer-v2';

// Precache the full static asset set so the app works offline after first load.
// NOTE: Keep paths relative to support GitHub Pages subpath deployments.
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',

  // CSS
  './css/variables.css',
  './css/base.css',
  './css/layout.css',
  './css/components.css',
  './css/modules.css',
  './css/responsive.css',

  // JS entry
  './js/app.js',
  './js/router.js',

  // JS components
  './js/components/Card.js',
  './js/components/HandGrid.js',
  './js/components/Modal.js',
  './js/components/Navigation.js',

  // JS data
  './js/data/concepts.js',
  './js/data/postflopRanges.js',
  './js/data/ranges.js',
  './js/data/scenarios.js',

  // JS modules
  './js/modules/betSizingTrainer.js',
  './js/modules/boardTextureTrainer.js',
  './js/modules/cbetTrainer.js',
  './js/modules/charts.js',
  './js/modules/concepts.js',
  './js/modules/dashboard.js',
  './js/modules/equityCalculator.js',
  './js/modules/handReplayer.js',
  './js/modules/multistreetTrainer.js',
  './js/modules/postflopTrainer.js',
  './js/modules/potOddsTrainer.js',
  './js/modules/preflopTrainer.js',
  './js/modules/rangeVisualizer.js',
  './js/modules/scenarios.js',
  './js/modules/sessionHistory.js',
  './js/modules/settings.js',

  // JS utils
  './js/utils/boardAnalyzer.js',
  './js/utils/constants.js',
  './js/utils/deckManager.js',
  './js/utils/equity.js',
  './js/utils/evFeedback.js',
  './js/utils/handEvaluator.js',
  './js/utils/helpers.js',
  './js/utils/rating.js',
  './js/utils/shortcutManager.js',
  './js/utils/srs.js',
  './js/utils/smartPracticeSession.js',
  './js/utils/stats.js',
  './js/utils/storage.js',

  // Icons
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(async (cache) => {
      try {
        await cache.addAll(PRECACHE_URLS);
      } catch (e) {
        // If one asset fails to cache (e.g., missing optional icon), don't brick install.
        // We'll still have runtime caching.
        console.warn('[sw] precache failed:', e);
      }
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_VERSION ? caches.delete(k) : Promise.resolve())))
    ).then(() => self.clients.claim())
  );
});

// Cache-first for same-origin GET requests.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;
  if (!isSameOrigin) return;

  // Always serve app shell for navigation requests.
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then((cached) => cached || fetch(req).catch(() => caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          // Cache successful responses.
          if (res && res.status === 200) {
            const resClone = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, resClone));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});
