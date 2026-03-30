const CACHE = 'ritual-v3';
const ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('/index.html')))
  );
});
self.addEventListener('push', e => {
  const d = e.data ? e.data.json() : { title: 'Ritual', body: 'Час для ритуалу!' };
  e.waitUntil(self.registration.showNotification(d.title, { body: d.body, icon: '/icon-192.png', badge: '/icon-192.png', vibrate: [100, 50, 100] }));
});
self.addEventListener('notificationclick', e => { e.notification.close(); e.waitUntil(clients.openWindow('/')); });
