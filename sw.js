// Define um nome e uma versão para o cache.
// Mudar a versão (ex: v2) no futuro forçará a atualização de todos os arquivos.
const CACHE_NAME = '1.3';

// Lista de todos os arquivos que seu site precisa para funcionar offline.
// Eu analisei seu index.html e listei todos os recursos essenciais.
const urlsToCache = [
    // Arquivos principais
    './',
    './index.html',
    './cifras.json', // Nosso banco de dados de cifras
    './assets/css/styles.css',
    './assets/js/script.js',
    './assets/js/Pizzicato.min.js',

    // Páginas dos iframes
    './santamissa.html',
    './oracoes.html',

    // Dependências externas (CDNs) - CRÍTICO para o modo offline!
    'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.8.1/font/bootstrap-icons.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
    'https://code.jquery.com/jquery-3.3.1.slim.min.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js'
];

// Evento de Instalação: Salva todos os arquivos listados no cache.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
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
                    if (cacheName !== CACHE_NAME) {
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
        event.source.postMessage({ type: 'CACHE_NAME', version: CACHE_NAME });
    }
});
