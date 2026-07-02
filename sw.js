const CACHE_NAME = 'refresh-helper-v25';
const ASSETS = [
  './',
  './index.html',
  './coupang_logo.png',
  './our_logo.png',
  './아가 파우미.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting(); // 새로운 서비스 워커를 즉시 대기 상태에서 활성화 단계로 이동시킴
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // 현재 클라이언트를 즉시 제어하여 새로고침 시 즉각 반영되도록 함
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
