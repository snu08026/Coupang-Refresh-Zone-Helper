const CACHE_NAME = 'refresh-helper-v41';
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
  const url = new URL(e.request.url);

  // 1. 실시간 동기화 API나 외부 요청은 캐시하지 않고 즉시 네트워크 요청
  if (url.hostname.includes('keyvalue.immanuel.co')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // 2. index.html 및 루트 경로는 항상 Network-First 전략 사용
  // 네트워크가 온라인일 때는 최신 버전의 HTML을 즉시 받아오고, 캐시도 최신 버전으로 갱신
  // 네트워크가 끊겼을 때(오프라인)만 캐시된 사본을 반환
  if (url.pathname === '/' || url.pathname.endsWith('index.html') || url.pathname.includes('/Coupang-Refresh-Zone-Helper/')) {
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          // 응답이 유효한 경우 캐시에 복사해 둠
          if (response && response.status === 200) {
            const responseCopy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, responseCopy);
            });
          }
          return response;
        })
        .catch(() => {
          // 네트워크 실패 시 캐시에서 로드
          return caches.match(e.request);
        })
    );
    return;
  }

  // 3. 그 외 이미지 등 정적 리소스는 Cache-First 전략 사용
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseToCache);
        });
        return response;
      });
    })
  );
});

