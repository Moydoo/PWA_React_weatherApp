const CACHE_NAME = "version-1";
const urlsToCache = ['index.html', 'offline.html'];

const self = this;

//Install Service Worker
//Open the cache and save them
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');

                return cache.addAll(urlsToCache);
            })
    )
});

//Listen for requests
//We match all the request our site is saving and then fetch them again
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            //if it can't fetch the data, it means we do not have net connection
            //so it have to return offline.html
            .then(() => {
                return fetch(event.request)
                    .catch(() => caches.match('offline.html'))
            })
    )

});

//Activate the Service Worker
//delete all the previous versions and always keep the newest one
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [];

    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if (!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))
    )
});