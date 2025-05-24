const CACHE_NAME = 'simple-pwa-cache-v1';

// Assets to cache
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles.css',
  '/js/app.js',
  '/images/icon-72x72.png',
  '/images/icon-96x96.png',
  '/images/icon-128x128.png',
  '/images/icon-144x144.png',
  '/images/icon-152x152.png',
  '/images/icon-192x192.png',
  '/images/icon-384x384.png',
  '/images/icon-512x512.png',
  '/images/maskable-icon-192x192.png',
  '/images/maskable-icon-512x512.png',
  '/images/icon-home.svg',
  '/images/icon-settings.svg',
  '/images/icon-notification.svg',
  '/images/icon-user.svg',
  '/images/icon-share.svg',
  '/images/icon-favorite.svg',
  '/images/app-icon.svg',
  '/images/maskable-icon.svg'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');

  // Skip waiting forces the waiting service worker to become the active service worker
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell and content');
        return cache.addAll(ASSETS_TO_CACHE.map(url => new URL(url, self.location.origin).href));
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');

  // Claim control immediately
  event.waitUntil(self.clients.claim());

  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Removing old cache: ' + key);
          return caches.delete(key);
        }
      }));
    })
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received');

  const title = 'Simple PWA';
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: 'images/icon-192x192.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});