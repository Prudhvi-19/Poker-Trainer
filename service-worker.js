/*
 * ENH-003: PWA offline support
 *
 * Simple precache of the app shell and static assets.
 * - Hash routing means we only need to cache index.html and assets.
 * - Works for GitHub Pages subpath deployments because we use relative URLs.
 */

// BUG-034: Avoid a static cache version that requires manual bumping.
// Instead we use a stable cache name + a stale-while-revalidate strategy so
// deployed changes are fetched and replace cached assets automatically.
const CACHE_NAME = 'poker-trainer-cache';
const CACHE_PREFIX = 'poker-trainer-';

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
    caches.open(CACHE_NAME).then(async (cache) => {
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
    caches.keys()
      .then((keys) => Promise.all(
        keys.map((k) => {
          // Clean up any older caches we might have created before switching strategy.
          if (k === CACHE_NAME) return Promise.resolve();
          if (k.startsWith(CACHE_PREFIX)) return caches.delete(k);
          return Promise.resolve();
        })
      ))
      .then(() => self.clients.claim())
  );
});

// Cache-first for same-origin GET requests.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;
  if (!isSameOrigin) return;

  const isNavigate = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');

  // Network-first for navigations so index.html updates propagate.
  if (isNavigate) {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        if (res && res.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          cache.put('./index.html', res.clone());
        }
        return res;
      } catch (e) {
        const cached = await caches.match('./index.html');
        if (cached) return cached;
        throw e;
      }
    })());
    return;
  }

  // Stale-while-revalidate for static assets.
  event.respondWith((async () => {
    const cached = await caches.match(req);
    const cache = await caches.open(CACHE_NAME);

    const fetchPromise = fetch(req)
      .then((res) => {
        if (res && res.status === 200) {
          cache.put(req, res.clone());
        }
        return res;
      })
      .catch(() => null);

    if (cached) {
      // Update in background.
      event.waitUntil(fetchPromise);
      return cached;
    }

    const res = await fetchPromise;
    if (res) return res;
    return cached;
  })());
});
