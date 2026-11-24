/* La página se mudó a https://horariosdelurquiza.github.io/ : este archivo borra la copia guardada vieja. */
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){ return Promise.all(keys.map(function(k){ return caches.delete(k); })); })
    .then(function(){ return self.registration.unregister(); })
    .then(function(){ return self.clients.matchAll(); })
    .then(function(cs){ cs.forEach(function(c){ c.navigate(c.url); }); }));
});
