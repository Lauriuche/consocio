// NOME DO CACHE
const CACHE_NAME = 'cdb-calc-v1';

// FICHEIROS A SEREM GUARDADOS EM CACHE PARA FUNCIONAMENTO OFFLINE
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // Se tivéssemos imagens locais, íamos incluí-las aqui
  // O Tailwind e Chart.js estão via CDN, normalmente não são "cacheados" desta forma simples, 
  // mas o navegador fará o seu próprio cache. Para PWA offline robusta, o ideal seria baixar os ficheiros localmente.
];

// INSTALAÇÃO DO SERVICE WORKER E ARMAZENAMENTO NO CACHE
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// INTERCETAR PEDIDOS DE REDE (FETCH) PARA SERVIR DO CACHE SE ESTIVER OFFLINE
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Se encontrar no cache, devolve do cache. Caso contrário, tenta a rede.
        return response || fetch(event.request);
      })
  );
});

// ATUALIZAÇÃO DO SERVICE WORKER (Limpar caches antigos)
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
