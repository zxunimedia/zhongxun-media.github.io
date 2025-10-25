// Service Worker for 奇華智能行銷
const CACHE_NAME = 'mojolive-v1.0.0';
const STATIC_CACHE = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/main.js',
    '/images/company-logo.png'
];

const EXTERNAL_CACHE = [
    'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        Promise.all([
            caches.open(CACHE_NAME).then(cache => {
                return cache.addAll(STATIC_CACHE);
            }),
            caches.open(CACHE_NAME + '-external').then(cache => {
                return cache.addAll(EXTERNAL_CACHE);
            })
        ])
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && cacheName !== CACHE_NAME + '-external') {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;
    
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin) && 
        !event.request.url.startsWith('https://fonts.googleapis.com') &&
        !event.request.url.startsWith('https://cdnjs.cloudflare.com')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                
                return fetch(event.request).then(response => {
                    // Don't cache if not a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clone the response for caching
                    const responseToCache = response.clone();
                    const cacheKey = event.request.url.startsWith('https://fonts.googleapis.com') || 
                                   event.request.url.startsWith('https://cdnjs.cloudflare.com') ? 
                                   CACHE_NAME + '-external' : CACHE_NAME;
                    
                    caches.open(cacheKey).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                    
                    return response;
                });
            })
            .catch(() => {
                // Fallback for offline
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            })
    );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'contact-form') {
        event.waitUntil(syncContactForm());
    }
});

function syncContactForm() {
    // Handle offline form submissions
    return new Promise((resolve) => {
        // Implementation would go here
        resolve();
    });
}

// Push notifications (for future use)
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : '奇華智能行銷有新消息！',
        icon: '/images/company-logo.png',
        badge: '/images/company-logo.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: '查看詳情',
                icon: '/images/checkmark.png'
            },
            {
                action: 'close',
                title: '關閉',
                icon: '/images/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('奇華智能行銷', options)
    );
});