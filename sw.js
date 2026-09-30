const C = 'rekap-wk-v2';
const CORE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(hit => {
    const net = fetch(e.request).then(r => {
      if (r && (r.ok || r.type === 'opaque')) { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); }
      return r;
    }).catch(() => hit);
    return hit || net;
  }));
});
