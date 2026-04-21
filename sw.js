// Birthday Adventure Game Pack — Service Worker
// Strategy: cache-first for all local assets. Fonts are now self-hosted (see
// assets/fonts/), so we no longer need a separate cache for Google Fonts.

const CACHE_VERSION = 'v4';
const CACHE_NAME = `birthday-adventure-${CACHE_VERSION}`;

const LOCAL_ASSETS = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './launcher/index.html',
  './launcher/launcher.js',
  './assets/css/global.css',
  './assets/fonts/fonts.css',
  './assets/fonts/fredoka-one-400.ttf',
  './assets/fonts/nunito-400.ttf',
  './assets/fonts/nunito-600.ttf',
  './assets/fonts/nunito-700.ttf',
  './assets/fonts/nunito-800.ttf',
  './config/app-config.js',
  './engine/panda-adventure.js',
  './engine/utils.js',
  './engine/config-loader.js',
  './engine/state-manager.js',
  './engine/unlock-engine.js',
  './engine/game-bridge.js',
  './engine/theme-manager.js',
  './engine/sounds.js',
  './games/catch.html',
  './games/memory-match.html',
  './games/stack.html',
  './games/wordle.html',
  './games/dressup.html',
  './games/sudoku.html',
  './games/by-numbers.html',
  './games/tetris-mosaic.html',
  './games/code-breaker.html',
  './games/birthday-quest.html',
  './games/shared/game-shell.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './assets/output.webp',
  './assets/panda_walkthrough.webp'
];

// ── Install: precache all local assets ──────────────────────────────────────
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // Cache assets individually so a single missing file doesn't break install
      return Promise.all(
        LOCAL_ASSETS.map(function (url) {
          return cache.add(url).catch(function (err) {
            console.warn('[SW] Failed to cache:', url, err);
          });
        })
      );
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

// ── Activate: remove old caches ─────────────────────────────────────────────
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) {
          return key !== CACHE_NAME;
        }).map(function (key) {
          return caches.delete(key);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// ── Fetch: cache-first for local assets ─────────────────────────────────────
self.addEventListener('fetch', function (event) {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // All requests: cache-first, fallback to network, then offline page
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;

      return fetch(event.request).then(function (response) {
        // Cache successful GET responses
        if (response.ok) {
          var responseClone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(function () {
        // Offline fallback: serve offline.html for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('./offline.html');
        }
        return new Response('', { status: 408, statusText: 'Offline' });
      });
    })
  );
});
