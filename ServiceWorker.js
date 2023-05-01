let cache_name = 'my-site-cache-v1'; 
const urlsToCache = [
    '/', 
    '/index.html', 
]; 

self.addEventListener('install', function(event) {
    
    // perform install steps    
    event.waitUntil(
        caches.open(cache_name) 
        .then(function(cache) {
            return cache.addAll(urlsToCache); 
        })
    )
    self.skipWaiting(); 
})

self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request) 
    .then(function(response) {
        if (response) {
            return response; 
        }
        return fetch(event.request)
    }))
})