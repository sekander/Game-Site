// public/sw.js
const CACHE_VERSION = 'v2';
const CACHE_NAME = `fnkyg4m3z-${CACHE_VERSION}`;

// Critical assets to cache immediately
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/content.json',
  '/manifest.json',
];

// Install event - cache critical assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching critical assets...');
        return cache.addAll(CRITICAL_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name.startsWith('fnkyg4m3z-'))
          .map(name => caches.delete(name))
      );
    })
    .then(() => self.clients.claim())
  );
});

// Fetch event - intelligent caching
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip API calls and external requests
  if (url.origin !== location.origin) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Check if it's a static asset
  const isStaticAsset = 
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|glb|mp4|webm)$/);
  
  // Cache-first for static assets, network-first for everything else
  if (isStaticAsset) {
    event.respondWith(cacheFirst(event.request));
  } else {
    event.respondWith(networkFirst(event.request));
  }
});

async function cacheFirst(request) {
  try {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    return cached || new Response('Network Error', { status: 408 });
  }
}
