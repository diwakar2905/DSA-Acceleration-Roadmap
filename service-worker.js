const CACHE_NAME = "dsa-roadmap-cache-v3";
const OFFLINE_URL = "/offline.html";

const APP_SHELL = [
    "/",
    "/index.html",
    "/offline.html",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "/icons/icon-maskable-192x192.png",
    "/icons/icon-maskable-512x512.png",
    // Local vendor files
    "/vendor/jspdf.umd.min.js",
    "/vendor/jspdf.plugin.autotable.min.js",
    "/vendor/html2canvas.min.js"
];

// ✅ Install - Now with skipWaiting for instant activation
self.addEventListener("install", (event) => {
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("SW: Caching app shell");
            return cache.addAll(APP_SHELL);
        })
    );
});

// ✅ Activate - With immediate claim and better cleanup
self.addEventListener("activate", (event) => {
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then((keys) =>
                Promise.all(
                    keys.map((key) => {
                        if (key !== CACHE_NAME) {
                            console.log("SW: Removing old cache", key);
                            return caches.delete(key);
                        }
                    })
                )
            ),
            // Take control immediately
            self.clients.claim()
        ])
    );
});

// ✅ Fetch: Improved stale-while-revalidate + fallbacks
self.addEventListener("fetch", (event) => {
    // Only handle GET requests
    if (event.request.method !== "GET") return;

    // Handle navigation (HTML pages)
    if (event.request.mode === "navigate") {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(OFFLINE_URL))
        );
        return;
    }

    // Ignore external CDN requests in cache
    const url = new URL(event.request.url);
    const isLocal = url.origin === self.location.origin;

    event.respondWith(
        caches.open(CACHE_NAME).then(async (cache) => {
            const cachedResponse = await cache.match(event.request);

            const networkFetch = fetch(event.request)
                .then((networkResponse) => {
                    // Only cache successful local responses
                    if (isLocal && networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                })
                .catch((error) => {
                    console.warn("SW: Network fetch failed", error);
                    return cachedResponse || Promise.reject("No cached response available");
                });

            return cachedResponse || networkFetch;
        })
    );
});