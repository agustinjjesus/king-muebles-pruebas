/* Tren Urquiza horarios: guarda la página para usarla sin señal. */
var CACHE = 'urquiza-c071cfc13f';
var CORE = ['./', './index.html', './privacidad.html', './manifest.webmanifest', './favicon.svg', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(CORE); }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k.indexOf('urquiza-') === 0 && k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

self.addEventListener('fetch', function(e){
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  /* La página: primero internet (así llegan los horarios nuevos), si no hay señal, la copia guardada. */
  if (req.mode === 'navigate'){
    e.respondWith(fetch(req).then(function(res){
      var copy = res.clone();
      caches.open(CACHE).then(function(c){ c.put(url.pathname.endsWith('privacidad.html') ? './privacidad.html' : './index.html', copy); });
      return res;
    }).catch(function(){
      return caches.match(url.pathname.endsWith('privacidad.html') ? './privacidad.html' : './index.html');
    }));
    return;
  }
  /* Íconos y tipografías: la copia guardada, y se actualiza en segundo plano. */
  var mine = url.origin === self.location.origin;
  var fonts = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (mine || fonts){
    e.respondWith(caches.match(req).then(function(hit){
      var net = fetch(req).then(function(res){
        if (res && (res.ok || res.type === 'opaque')){ var copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); }
        return res;
      }).catch(function(){ return hit; });
      return hit || net;
    }));
  }
});
