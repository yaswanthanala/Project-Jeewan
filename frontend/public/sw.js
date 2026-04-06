const CACHE_NAME = 'jeewan-offline-v1';

// Add core routes and assets here to guarantee offline support
const OFFLINE_URLS = [
  '/',
  '/quiz',
  '/chat',
  '/stories',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Don't strongly block on all failing
      return cache.addAll(OFFLINE_URLS.map(url => new Request(url, { cache: 'reload' })))
        .catch(err => console.log('Offline cache pre-load partial success:', err));
    })
  );
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;
  // Ignore external cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version, but update in background
        event.waitUntil(
          fetch(event.request).then((networkResponse) => {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }).catch(() => {})
        );
        return cachedResponse;
      }

      // If not cached, attempt network
      return fetch(event.request).then((networkResponse) => {
        // Cache successful responses for next time
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // If entirely offline and not in cache, fallback to offline page or index
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});
