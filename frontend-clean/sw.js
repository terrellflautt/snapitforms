// SnapItForms Service Worker
// Version: 1.0.0
// Purpose: Caching strategy and offline functionality

const CACHE_NAME = 'snapitforms-v1.0.0';
const STATIC_CACHE_NAME = 'snapitforms-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'snapitforms-dynamic-v1.0.0';

// Static assets to cache
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/dashboard.html',
    '/css/style.css',
    '/js/unified-system.js',
    '/js/auth-fix-universal.js',
    '/js/api-interceptor.js',
    '/images/snapit-logo.png',
    '/favicon.ico',
    '/manifest.json'
];

// API endpoints to cache dynamically
const API_CACHE_PATTERNS = [
    /^https:\/\/api\.snapitforms\.com\//,
    /^https:\/\/.*\.execute-api\.us-east-1\.amazonaws\.com\//
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Installation complete');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Installation failed', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE_NAME &&
                            cacheName !== DYNAMIC_CACHE_NAME &&
                            cacheName !== CACHE_NAME) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activation complete');
                return self.clients.claim();
            })
    );
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // Skip caching for non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip caching for Chrome extension requests
    if (url.protocol === 'chrome-extension:') {
        return;
    }

    // Skip caching for external third-party resources (Google, Stripe, etc.)
    const externalDomains = [
        'accounts.google.com',
        'js.stripe.com',
        'm.stripe.com',
        'r.stripe.com',
        'q.stripe.com',
        'b.stripecdn.com',
        'fonts.googleapis.com',
        'fonts.gstatic.com'
    ];

    if (externalDomains.some(domain => url.hostname.includes(domain))) {
        // Let browser handle these directly without Service Worker interference
        return;
    }

    event.respondWith(
        handleFetchRequest(request)
    );
});

async function handleFetchRequest(request) {
    const url = new URL(request.url);

    try {
        // Strategy for static assets: Cache First
        if (STATIC_ASSETS.some(asset => request.url.endsWith(asset))) {
            return await cacheFirst(request, STATIC_CACHE_NAME);
        }

        // Strategy for API calls: Network First
        if (API_CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
            return await networkFirst(request, DYNAMIC_CACHE_NAME);
        }

        // Strategy for HTML pages: Network First with fallback
        if (request.headers.get('accept').includes('text/html')) {
            return await networkFirstWithFallback(request, DYNAMIC_CACHE_NAME);
        }

        // Default strategy: Network First
        return await networkFirst(request, DYNAMIC_CACHE_NAME);

    } catch (error) {
        console.error('Service Worker: Fetch failed', error);

        // Return cached version if available
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Return offline fallback for HTML requests
        if (request.headers.get('accept').includes('text/html')) {
            return new Response(
                `<html>
                    <head><title>Offline - SnapItForms</title></head>
                    <body>
                        <h1>You're offline</h1>
                        <p>Please check your internet connection and try again.</p>
                    </body>
                </html>`,
                { headers: { 'Content-Type': 'text/html' } }
            );
        }

        throw error;
    }
}

// Cache First strategy
async function cacheFirst(request, cacheName) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
        const cache = await caches.open(cacheName);
        cache.put(request, networkResponse.clone());
    }
    return networkResponse;
}

// Network First strategy
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// Network First with HTML fallback
async function networkFirstWithFallback(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Return index.html as fallback for SPA routing
        const indexResponse = await caches.match('/index.html');
        if (indexResponse) {
            return indexResponse;
        }

        throw error;
    }
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'form-submission') {
        event.waitUntil(
            handleBackgroundFormSubmission()
        );
    }
});

async function handleBackgroundFormSubmission() {
    try {
        // Get pending form submissions from IndexedDB
        const pendingSubmissions = await getPendingSubmissions();

        for (const submission of pendingSubmissions) {
            try {
                const response = await fetch(submission.url, {
                    method: 'POST',
                    headers: submission.headers,
                    body: submission.body
                });

                if (response.ok) {
                    await removePendingSubmission(submission.id);
                    console.log('Service Worker: Form submission synchronized');
                }
            } catch (error) {
                console.error('Service Worker: Background sync failed', error);
            }
        }
    } catch (error) {
        console.error('Service Worker: Background sync error', error);
    }
}

// Push notification handling
self.addEventListener('push', (event) => {
    if (!event.data) {
        return;
    }

    const data = event.data.json();
    const options = {
        body: data.body || 'New form submission received',
        icon: '/images/snapit-logo.png',
        badge: '/images/snapit-logo.png',
        tag: 'form-notification',
        requireInteraction: true,
        actions: [
            {
                action: 'view',
                title: 'View Dashboard'
            },
            {
                action: 'dismiss',
                title: 'Dismiss'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'SnapItForms', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/dashboard.html')
        );
    }
});

// Utility functions for IndexedDB operations
async function getPendingSubmissions() {
    // Implementation for retrieving pending submissions from IndexedDB
    return [];
}

async function removePendingSubmission(id) {
    // Implementation for removing submission from IndexedDB
    return true;
}

// Error handling
self.addEventListener('error', (event) => {
    console.error('Service Worker: Global error', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('Service Worker: Unhandled promise rejection', event.reason);
    event.preventDefault();
});