const version = '2.0';

const urlsToCache = [
    // Arquivos principais
    './',
    './index.html',
    './cifras.json',
    './assets/css/styles.css',
    './assets/css/frames-styles.css',
    './assets/lib/css/Bootstrap/bootstrap-icons/1.8.1/bootstrap-icons.css',
    './assets/lib/css/Bootstrap/bootstrap-icons/1.8.1/fonts/bootstrap-icons.woff2',
    './assets/lib/css/Bootstrap/4.5.2/bootstrap.min.css',
    './assets/js/script.js',
    './assets/js/CifraPlayer.js',
    './assets/js/AudioContextManager.js',
    './assets/js/LocalStorageManager.js',
    './assets/js/MusicTheory.js',
    './assets/js/UIController.js',
    './assets/lib/js/Jquery/3.5.1/jquery.min.js',
    './assets/lib/js/Bootstrap/4.3.1/bootstrap.min.js',

    // Páginas dos iframes
    './santamissa.html',
    './oracoes.html',

    // Dependências externas (CDNs) - CRÍTICO para o modo offline!
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'
];

// Evento de Instalação: Salva todos os arquivos listados no cache.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(version)
            .then(cache => {
                console.log('Cache aberto. Adicionando arquivos essenciais para modo offline.');
                return cache.addAll(urlsToCache);
            })
    );
});

// Se o nome do cache não for o cache atual, ele será deletado.
self.addEventListener('activate', event => {
    console.log('activate');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== version) {
                        console.log('Cache antigo encontrado. Deletando:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Evento de Fetch: Intercepta todas as requisições da página.
self.addEventListener('fetch', event => {
    event.respondWith(
        // 1. Tenta encontrar o recurso no cache.
        caches.match(event.request)
            .then(response => {
                // Se encontrou no cache, retorna o arquivo salvo. A página carrega instantaneamente.
                if (response) {
                    return response;
                }
                // Se não encontrou, vai para a internet buscar o recurso.
                return fetch(event.request);
            }
        )
    );
});

self.addEventListener('message', event => {
    if (event.data && event.data.type === 'GET_VERSION') {
        event.source.postMessage({ type: 'version', version: version });
    }
});
