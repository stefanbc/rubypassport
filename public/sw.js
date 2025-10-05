/* eslint-env serviceworker */

const CACHE_NAME = 'rp-cache-v2'; // Increment cache name on new builds

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
  // We only want to handle GET requests.
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // For navigation requests (e.g., loading a page), use a stale-while-revalidate strategy.
      if (event.request.mode === 'navigate') {
        try {
          // Fetch from the network first.
          const networkResponse = await fetch(event.request);
          // Update the cache with the new version.
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        } catch (error) {
          // If the network fails, try to serve from the cache.
          const cachedResponse = await cache.match(event.request);
          return cachedResponse;
        }
      }

      // For other requests (assets like JS, CSS, images), use a cache-first strategy.
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      // If not in cache, fetch from the network, cache it, and then return it.
      try {
        const networkResponse = await fetch(event.request);
        // Don't cache opaque or error responses.
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
        const responseToCache = networkResponse.clone();
          cache.put(event.request, responseToCache);
        }
        return networkResponse;
      } catch (error) {
        // Handle fetch errors, e.g., for offline scenarios.
        console.error('Fetch failed:', error);
        // You could return a fallback response here if needed.
      }
    })()
  );
});