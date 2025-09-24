/* eslint-env serviceworker */

const CACHE_NAME = 'rp-cache-v1';

// This list should be updated with your actual build files.
// Build tools like Vite or Create React App can automate this.
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/apple-touch-icon.png',
  '/images/favicon-96x96.png',
  '/images/favicon.ico',
  '/images/favicon.svg',
  '/images/og-image.png',
  '/images/web-app-manifest-192x192.png',
  '/images/web-app-manifest-512x512.png',
];

/**
 * Installation event: Caches the app shell.
 */
self.addEventListener('install', (event) => {
  // Skip waiting so the new service worker activates immediately.
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      // Use individual requests instead of cache.addAll to be more resilient
      // against potential 404s on optional assets.
      const promises = URLS_TO_CACHE.map((url) => {
        return cache.add(url).catch((err) => {
          console.warn(`Failed to cache ${url}:`, err);
        });
      });
      return Promise.all(promises);
    })
  );
});

/**
 * Activation event: Cleans up old caches.
 */
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

/**
 * Fetch event: Serves assets from cache, falling back to the network.
 */
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});