// SnapIT Forms Service Worker
// Ultimate performance and caching optimization

const CACHE_NAME = 'snapitforms-v1.2.0';
const STATIC_CACHE = 'snapitforms-static-v1.2.0';
const DYNAMIC_CACHE = 'snapitforms-dynamic-v1.2.0';

// Resources to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/dashboard.html',
    '/form-generator.html',
    '/templates.html',
    '/css/landingstyles.css',
    '/css/formsmain.css',
    '/css/formsstyles.css',
    '/css/language-selector.css',
    '/js/translations.js',
    '/js/language-selector.js',
    '/js/performance-optimizer.js',
    '/favicon.ico',
    '/apple-touch-icon.png'
];

// API endpoints to cache
const API_ENDPOINTS = [
    'https://api.snapitforms.com/health',
    'https://api.snapitforms.com/forms',
    'https://api.snapitforms.com/templates'
];

// Install service worker
self.addEventListener('install', (event) => {
    console.log('SnapIT Forms SW: Installing...');

    event.waitUntil(
        Promise.all([
            caches.open(STATIC_CACHE).then(cache => {
                console.log('SnapIT Forms SW: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            }),
            caches.open(DYNAMIC_CACHE).then(cache => {
                console.log('SnapIT Forms SW: Preparing dynamic cache');
                return Promise.resolve();
            })
        ])
    );

    // Skip waiting to activate immediately
    self.skipWaiting();
});

// Activate service worker
self.addEventListener('activate', (event) => {
    console.log('SnapIT Forms SW: Activating...');

    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('SnapIT Forms SW: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Take control of all pages
            self.clients.claim()
        ])
    );
});

// Fetch handler with advanced caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip Chrome extensions
    if (url.protocol === 'chrome-extension:') {
        return;
    }

    // Handle different types of requests
    if (url.hostname === 'snapitforms.com' || url.hostname === 'www.snapitforms.com') {
        event.respondWith(handleSnapITRequest(request));
    } else if (url.hostname === 'api.snapitforms.com') {
        event.respondWith(handleAPIRequest(request));
    } else if (url.hostname.includes('googleapis.com') || url.hostname.includes('gstatic.com')) {
        event.respondWith(handleGoogleRequest(request));
    } else if (url.hostname.includes('stripe.com')) {
        event.respondWith(handleStripeRequest(request));
    } else {
        event.respondWith(handleExternalRequest(request));
    }
});

// Handle SnapIT Forms requests (Cache First strategy)
async function handleSnapITRequest(request) {
    const url = new URL(request.url);

    // For HTML pages, use Network First for freshness
    if (url.pathname.endsWith('.html') || url.pathname === '/') {
        return networkFirstStrategy(request, DYNAMIC_CACHE);
    }

    // For static assets (CSS, JS, images), use Cache First
    if (isStaticAsset(url.pathname)) {
        return cacheFirstStrategy(request, STATIC_CACHE);
    }

    // Default to Network First
    return networkFirstStrategy(request, DYNAMIC_CACHE);
}

// Handle API requests (Network First with short cache)
async function handleAPIRequest(request) {
    return networkFirstStrategy(request, DYNAMIC_CACHE, 30000); // 30 second cache
}

// Handle Google services (Cache First)
async function handleGoogleRequest(request) {
    return cacheFirstStrategy(request, STATIC_CACHE);
}

// Handle Stripe requests (Network Only)
async function handleStripeRequest(request) {
    return fetch(request);
}

// Handle external requests (Network First)
async function handleExternalRequest(request) {
    return networkFirstStrategy(request, DYNAMIC_CACHE);
}

// Cache First Strategy
async function cacheFirstStrategy(request, cacheName) {
    try {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            // Update cache in background
            fetch(request).then(response => {
                if (response.ok) {
                    cache.put(request, response.clone());
                }
            }).catch(() => {
                // Ignore network errors for background updates
            });

            return cachedResponse;
        }

        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            await cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.error('SnapIT Forms SW: Cache First error:', error);
        return new Response('Service Unavailable', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Network First Strategy
async function networkFirstStrategy(request, cacheName, maxAge = 300000) { // 5 minutes default
    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);

            // Add timestamp for cache expiration
            const responseToCache = networkResponse.clone();
            responseToCache.headers.set('sw-cached-at', Date.now().toString());

            await cache.put(request, responseToCache);
        }

        return networkResponse;
    } catch (error) {
        console.log('SnapIT Forms SW: Network failed, trying cache:', error.message);

        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            // Check if cache is still valid
            const cachedAt = cachedResponse.headers.get('sw-cached-at');
            if (cachedAt && (Date.now() - parseInt(cachedAt)) < maxAge) {
                return cachedResponse;
            }
        }

        return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable - Offline'
        });
    }
}

// Check if URL is a static asset
function isStaticAsset(pathname) {
    const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2'];
    return staticExtensions.some(ext => pathname.endsWith(ext));
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'form-submission') {
        event.waitUntil(syncFormSubmissions());
    }
});

// Sync form submissions when back online
async function syncFormSubmissions() {
    try {
        const db = await openIndexedDB();
        const pendingSubmissions = await getPendingSubmissions(db);

        for (const submission of pendingSubmissions) {
            try {
                const response = await fetch('https://api.snapitforms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(submission.data)
                });

                if (response.ok) {
                    await removePendingSubmission(db, submission.id);
                    console.log('SnapIT Forms SW: Synced form submission:', submission.id);
                }
            } catch (error) {
                console.error('SnapIT Forms SW: Failed to sync submission:', error);
            }
        }
    } catch (error) {
        console.error('SnapIT Forms SW: Background sync error:', error);
    }
}

// IndexedDB helpers for offline form storage
function openIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('snapitforms-offline', 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('submissions')) {
                db.createObjectStore('submissions', { keyPath: 'id' });
            }
        };
    });
}

function getPendingSubmissions(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['submissions'], 'readonly');
        const store = transaction.objectStore('submissions');
        const request = store.getAll();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

function removePendingSubmission(db, id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['submissions'], 'readwrite');
        const store = transaction.objectStore('submissions');
        const request = store.delete(id);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
    });
}

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            })
        );
    }
});

// Performance monitoring
self.addEventListener('fetch', (event) => {
    const startTime = performance.now();

    event.respondWith(
        handleRequest(event.request).then(response => {
            const endTime = performance.now();
            const duration = endTime - startTime;

            // Log slow requests
            if (duration > 1000) {
                console.warn(`SnapIT Forms SW: Slow request (${duration.toFixed(2)}ms):`, event.request.url);
            }

            return response;
        })
    );
});

// Route requests to appropriate handlers
function handleRequest(request) {
    return self.dispatchEvent(new FetchEvent('fetch', { request }));
}

console.log('SnapIT Forms Service Worker loaded successfully');