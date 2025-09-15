const CACHE_NAME = 'dreamweaver-cache-v1';
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './offline.html',
  './icon-192x192.png',
  './icon-512x512.png'
];

// Install: precache key resources
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => { if (k !== CACHE_NAME) return caches.delete(k); })))
    .then(() => self.clients.claim())
  );
});

// Fetch: navigation -> network-first with offline fallback; assets -> cache-first
self.addEventListener('fetch', evt => {
  const req = evt.request;
  const url = new URL(req.url);

  // Cross-origin (fonts, cdn) -> try network then cache fallback
  if (url.origin !== location.origin) {
    evt.respondWith(
      fetch(req).catch(() => caches.match(req))
    );
    return;
  }

  // Navigation requests -> network-first fallback to offline.html
  if (req.mode === 'navigate') {
    evt.respondWith(
      fetch(req).then(resp => {
        // optionally update cache
        const copy = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        return resp;
      }).catch(() => caches.match('./offline.html'))
    );
    return;
  }

  // Other GET requests -> cache-first, but try network to refresh
  if (req.method === 'GET') {
    evt.respondWith(
      caches.match(req).then(cached => {
        if (cached) {
          // background update
          fetch(req).then(resp => {
            caches.open(CACHE_NAME).then(cache => cache.put(req, resp.clone()));
          }).catch(()=>{});
          return cached;
        }
        return fetch(req).then(resp => {
          // store same-origin responses
          if (resp && resp.status === 200) {
            const respClone = resp.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, respClone));
          }
          return resp;
        }).catch(() => caches.match('./offline.html'));
      })
    );
  }
});
