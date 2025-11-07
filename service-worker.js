// Service Worker for SHPE 2025 Prompt Delivery App
// Provides offline functionality and caching

const CACHE_NAME = 'shpe-2025-v11';

// Use relative URLs - they work both locally and on GitHub Pages
// NOTE: Logo files are intentionally NOT cached - always fetch fresh from network
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './branding-config.json',
  './branding-loader.js',
  './prompts-manifest.json',
  './prompts-data.json'
];

// Install event - cache all essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching essential files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activation complete');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // NEVER cache logo files - always fetch fresh to avoid stale cache issues
  const isLogoFile = event.request.url.includes('logo.webp') ||
                     event.request.url.includes('logo.png') ||
                     event.request.url.includes('/assets/');

  if (isLogoFile) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Do NOT cache logo files at all
          return networkResponse;
        })
        .catch(() => {
          // No fallback for logos - just fail
          return new Response('Logo not available offline', { status: 404 });
        })
    );
    return;
  }

  // For other resources, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('[Service Worker] Serving from cache:', event.request.url);
          return cachedResponse;
        }

        // Otherwise fetch from network
        console.log('[Service Worker] Fetching from network:', event.request.url);
        return fetch(event.request)
          .then((networkResponse) => {
            // Don't cache if not a successful response
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            // Cache successful responses for future use
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                // Only cache same-origin requests
                if (event.request.url.startsWith(self.location.origin)) {
                  cache.put(event.request, responseToCache);
                }
              });

            return networkResponse;
          })
          .catch((error) => {
            console.error('[Service Worker] Fetch failed:', error);

            // For navigation requests, return cached index.html as fallback
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }

            throw error;
          });
      })
  );
});

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
