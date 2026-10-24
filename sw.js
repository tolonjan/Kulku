// Kulku – service worker: sovellus aukeaa myös ilman verkkoa.
// Sivu haetaan ensisijaisesti verkosta (aina uusin versio), välimuistista vain jos verkkoa ei ole.
// Rajapintakutsuja (/api/ ja ulkoiset palvelut) ei välimuisteta – lähtötiedot välimuistittaa sovellus itse.
const CACHE = 'kulku-v1';
const SHELL = ['/', '/manifest.webmanifest', '/api/icon?n=icon-192', '/api/icon?n=icon-512'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const isIcon = url.pathname === '/api/icon';
  if (url.pathname.startsWith('/api/') && !isIcon) return;

  if (req.mode === 'navigate') {
    e.respondWith(fetch(req)
      .then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put('/', copy)); return r; })
      .catch(() => caches.match('/')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return r;
  })));
});
