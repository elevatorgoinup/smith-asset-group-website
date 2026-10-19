/* Smith Asset Group service worker: makes the site installable and keeps it usable on a weak signal.
   Pages: network first, fall back to the saved copy, then the offline page.
   Static files (css, js, icons, images): saved copy first, refreshed in the background.
   Never touches form submissions, county GIS data, or anything from another site. */
var VERSION = 'sag-v1';
var CORE = ['/', '/index.html', '/site.css', '/site.js', '/deals-board.js', '/offline.html', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;          // only our own files
  if (url.pathname.endsWith('/deals.json')) {                 // deals: always fresh, saved copy if offline
    e.respondWith(fetch(req).then(function (r) { if (r && r.ok) { var c = r.clone(); caches.open(VERSION).then(function (s) { s.put(req, c); }); } return r; })
      .catch(function () { return caches.match(req, { ignoreSearch: true }); }));
    return;
  }
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(function (r) {
      if (r && r.ok) { var c = r.clone(); caches.open(VERSION).then(function (s) { s.put(req, c); }); }
      return r;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (hit) { return hit || caches.match('/offline.html'); });
    }));
    return;
  }
  e.respondWith(caches.match(req).then(function (hit) {
    var net = fetch(req).then(function (r) {
      if (r && r.ok) { var c = r.clone(); caches.open(VERSION).then(function (s) { s.put(req, c); }); }
      return r;
    }).catch(function () { return hit; });
    return hit || net;
  }));
});
