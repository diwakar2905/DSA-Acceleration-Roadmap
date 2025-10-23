const CACHE_NAME = 'dsa-roadmap-cache-v2'; // Bump version to trigger update
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable-192x192.png',
  '/icons/icon-maskable-512x512.png'
];

// On install, cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching App Shell');
        return cache.addAll(APP_SHELL_URLS); // Corrected from the previous version
      })
  );
});

// On fetch, use a stale-while-revalidate strategy
self.addEventListener('fetch', (event) => {
  // Let the browser handle non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // 1. Try to get the response from the cache
      const cachedResponse = await cache.match(event.request);

      // 2. Fetch from the network in the background to update the cache
      const fetchedResponsePromise = fetch(event.request).then((networkResponse) => {
        // If the fetch is successful, clone it and update the cache.
        cache.put(event.request, networkResponse.clone());
        return networkResponse;
      }).catch(err => {
        // The network failed, but we might have a cached response.
        // If not, this will naturally result in a network error.
        console.warn('Service Worker: Fetch failed, relying on cache.', err);
        // This return is important for the `||` operator below
        return cachedResponse; 
      });

      // 3. Return the cached response immediately if available, otherwise wait for the network
      return cachedResponse || fetchedResponsePromise;
    })
  );
});

// On activate, clean up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});