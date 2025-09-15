const CACHE_NAME = 'dreamweaver-cache-v1';
const PRECACHE = ['./','./index.html','./manifest.json','./offline.html','./icon-192x192.png','./icon-512x512.png'];

self.addEventListener('install', evt => {
  evt.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => { if (k !== CACHE_NAME) return caches.delete(k); }))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', evt => {
  const req = evt.request;
  const url = new URL(req.url);

  // cross-origin -> network-first fallback to cache
  if (url.origin !== location.origin) {
    evt.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }

  if (req.mode === 'navigate') {
    evt.respondWith(fetch(req).then(r => { caches.open(CACHE_NAME).then(c => c.put(req, r.clone())); return r; }).catch(() => caches.match('./offline.html')));
    return;
  }

  if (req.method === 'GET') {
    evt.respondWith(
      caches.match(req).then(cached => {
        if (cached) {
          // update in background
          fetch(req).then(resp => caches.open(CACHE_NAME).then(c=> c.put(req, resp.clone()))).catch(()=>{});
          return cached;
        }
        return fetch(req).then(resp => {
          if (resp && resp.status === 200) {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then(c => c.put(req, copy));
          }
          return resp;
        }).catch(()=>caches.match('./offline.html'));
      })
    );
  }
});
