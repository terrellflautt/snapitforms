/**
 * SnapItForms Unified System
 * Main JavaScript file containing authentication, analytics, payments, and form handling
 */

// Utility functions
function generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

function generateTransactionId() {
    return 'trans_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

// Analytics System
(function() {
    window.snapitAnalytics = {
        config: {
            apiEndpoint: 'https://api.snapitanalytics.com/events',
            userId: null,
            sessionId: generateSessionId(),
            environment: 'production',
            version: '2.0.0'
        },

        // Initialize tracking
        init: function() {
            this.trackPageView();
            this.setupPerformanceMonitoring();
            this.setupErrorTracking();
            this.setupUserBehavior();
        },

        // Enhanced event tracking
        trackEvent: function(event, properties = {}) {
            const eventData = {
                event: event,
                properties: {
                    ...properties,
                    timestamp: Date.now(),
                    url: window.location.href,
                    referrer: document.referrer,
                    userAgent: navigator.userAgent,
                    sessionId: this.config.sessionId,
                    userId: this.config.userId
                }
            };

            // Send to multiple endpoints
            this.sendToAnalytics(eventData);
            this.sendToGoogleAnalytics(event, properties);
        },

        // Page view tracking with performance
        trackPageView: function() {
            const pageData = {
                page: window.location.pathname,
                title: document.title,
                loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                timestamp: Date.now()
            };

            this.trackEvent('page_view', pageData);
        },

        // Conversion tracking
        trackConversion: function(value, currency = 'USD', event = 'purchase') {
            this.trackEvent('conversion', {
                value: value,
                currency: currency,
                event_type: event
            });

            // Send to Google Analytics Enhanced Ecommerce
            if (typeof gtag !== 'undefined') {
                gtag('event', 'purchase', {
                    transaction_id: generateTransactionId(),
                    value: value,
                    currency: currency
                });
            }
        },

        // Performance monitoring
        setupPerformanceMonitoring: function() {
            // Core Web Vitals
            if (typeof PerformanceObserver !== 'undefined') {
                new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        this.trackEvent('core_web_vitals', {
                            metric: entry.name,
                            value: entry.value,
                            rating: this.getWebVitalRating(entry.name, entry.value)
                        });
                    }
                }).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'cumulative-layout-shift'] });
            }
        },

        // Error tracking
        setupErrorTracking: function() {
            window.addEventListener('error', (error) => {
                this.trackEvent('javascript_error', {
                    message: error.message,
                    filename: error.filename,
                    lineno: error.lineno,
                    colno: error.colno,
                    stack: error.error ? error.error.stack : null
                });
            });

            window.addEventListener('unhandledrejection', (event) => {
                this.trackEvent('promise_rejection', {
                    reason: event.reason,
                    stack: event.reason ? event.reason.stack : null
                });
            });
        },

        // User behavior tracking
        setupUserBehavior: function() {
            // Scroll tracking
            let maxScroll = 0;
            window.addEventListener('scroll', () => {
                const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                if (scrollPercent > maxScroll) {
                    maxScroll = scrollPercent;
                    if (maxScroll % 25 === 0) {
                        this.trackEvent('scroll_depth', { depth: maxScroll });
                    }
                }
            });

            // Click tracking
            document.addEventListener('click', (event) => {
                if (event.target.tagName === 'A' || event.target.closest('button')) {
                    this.trackEvent('click', {
                        element: event.target.tagName,
                        text: event.target.textContent.substring(0, 100),
                        href: event.target.href || null
                    });
                }
            });
        },

        // Send data to analytics API
        sendToAnalytics: function(data) {
            fetch(this.config.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }).catch(console.error);
        },

        // Google Analytics integration
        sendToGoogleAnalytics: function(event, properties) {
            if (typeof gtag !== 'undefined') {
                gtag('event', event, properties);
            }
        },

        // Web Vitals rating
        getWebVitalRating: function(metric, value) {
            const thresholds = {
                'largest-contentful-paint': [2500, 4000],
                'first-input': [100, 300],
                'cumulative-layout-shift': [0.1, 0.25]
            };

            const [good, poor] = thresholds[metric] || [0, 0];
            return value <= good ? 'good' : value <= poor ? 'needs-improvement' : 'poor';
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.snapitAnalytics.init());
    } else {
        window.snapitAnalytics.init();
    }
})();

// Authentication Manager
class SnapITAuthManager {
    constructor() {
        this.currentUser = null;
        this.listeners = [];
        this.initializeAuth();
    }

    initializeAuth() {
        // Check for existing session
        const storedUser = localStorage.getItem('snapit_user');
        const storedToken = localStorage.getItem('snapit_jwt_token');

        if (storedUser && storedToken) {
            try {
                this.currentUser = JSON.parse(storedUser);
                this.validateSession();
            } catch (error) {
                this.clearSession();
            }
        }

        // Initialize Google Auth
        this.initializeGoogleAuth();
    }

    initializeGoogleAuth() {
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.initialize({
                client_id: '242648112266-3oepgrf25h8dak6sg01vq5kbsrkjo3s9.apps.googleusercontent.com',
                callback: this.handleCredentialResponse.bind(this),
                auto_select: false,
                cancel_on_tap_outside: false
            });
        }
    }

    async handleCredentialResponse(response) {
        try {
            // Send Google credential to backend for verification and user creation/update
            const apiResponse = await fetch('https://api.snapitforms.com/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': window.location.origin
                },
                body: JSON.stringify({
                    token: response.credential
                })
            });

            if (!apiResponse.ok) {
                const errorData = await apiResponse.json();
                throw new Error(errorData.error || 'Authentication failed');
            }

            const data = await apiResponse.json();

            if (!data.success || !data.user || !data.user.accessKey) {
                throw new Error('Registration failed. Please try again.');
            }

            // Store user data with accessKey from backend
            this.currentUser = {
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                picture: data.user.picture,
                accessKey: data.user.accessKey,
                plan: data.user.plan,
                planLimits: data.user.planLimits,
                usage: data.user.usage,
                verified: true,
                loginTime: Date.now()
            };

            // Store session with backend JWT token
            localStorage.setItem('snapit_user', JSON.stringify(this.currentUser));
            localStorage.setItem('snapit_jwt_token', data.token);
            localStorage.setItem('snapit_access_key', data.user.accessKey);

            // Track login
            window.snapitAnalytics.trackEvent('user_login', {
                method: 'google',
                email: this.currentUser.email,
                plan: this.currentUser.plan
            });

            // Update analytics user ID
            window.snapitAnalytics.config.userId = this.currentUser.id;

            // Notify listeners
            this.notifyAuthChange('login', this.currentUser);

            // Redirect to dashboard
            window.location.href = '/dashboard.html';

        } catch (error) {
            console.error('Authentication failed:', error);
            alert(error.message || 'Registration failed. Please try again.');
            window.snapitAnalytics.trackEvent('auth_error', {
                error: error.message
            });
        }
    }

    async validateSession() {
        try {
            const response = await fetch('/api/validate-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('snapit_jwt_token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Session invalid');
            }

            const data = await response.json();
            if (!data.valid) {
                this.clearSession();
            }
        } catch (error) {
            console.error('Session validation failed:', error);
            this.clearSession();
        }
    }

    signOut() {
        window.snapitAnalytics.trackEvent('user_logout', {
            email: this.currentUser?.email,
            sessionDuration: Date.now() - (this.currentUser?.loginTime || Date.now())
        });

        this.clearSession();
        this.notifyAuthChange('logout', null);

        // Sign out from Google
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.disableAutoSelect();
        }
    }

    clearSession() {
        this.currentUser = null;
        localStorage.removeItem('snapit_user');
        localStorage.removeItem('snapit_jwt_token');
        window.snapitAnalytics.config.userId = null;
    }

    syncAuthAcrossDomains() {
        const domains = [
            'snapitagent.com',
            'snapitforms.com',
            'snapitanalytics.com',
            'snapitqr.com',
            'snapiturl.com',
            'urlstatuschecker.com',
            'snapitsoftware.com',
            'snapitsaas.com'
        ];

        domains.forEach(domain => {
            if (window.location.hostname !== domain) {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = `https://${domain}/auth-sync?user=${encodeURIComponent(JSON.stringify(this.currentUser))}`;
                document.body.appendChild(iframe);

                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 3000);
            }
        });
    }

    decodeJWT(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    onAuthChange(callback) {
        this.listeners.push(callback);
    }

    notifyAuthChange(type, user) {
        this.listeners.forEach(callback => {
            try {
                callback(type, user);
            } catch (error) {
                console.error('Auth listener error:', error);
            }
        });
    }
}

// Stripe Payment Manager
class SnapITStripeManager {
    constructor(publishableKey) {
        this.stripe = Stripe(publishableKey);
        this.elements = null;
        this.card = null;
        this.currentPlan = null;
    }

    // Initialize payment elements
    initializePayment(plan) {
        this.currentPlan = plan;
        this.elements = this.stripe.elements({
            appearance: {
                theme: 'stripe',
                variables: {
                    colorPrimary: '#0570de',
                    colorBackground: '#ffffff',
                    colorText: '#30313d',
                    colorDanger: '#df1b41',
                    fontFamily: 'Ideal Sans, system-ui, sans-serif',
                    spacingUnit: '2px',
                    borderRadius: '4px'
                }
            }
        });

        this.card = this.elements.create('card');
        this.setupEventListeners();
    }

    // Create subscription
    async createSubscription(customerId, priceId) {
        try {
            window.snapitAnalytics.trackEvent('subscription_attempt', {
                plan: this.currentPlan,
                priceId: priceId
            });

            const response = await fetch('/api/create-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId: priceId,
                    customerId: customerId,
                    metadata: {
                        source: 'snapit_web',
                        plan: this.currentPlan,
                        timestamp: Date.now()
                    }
                })
            });

            const { subscriptionId, paymentIntent } = await response.json();

            if (paymentIntent && paymentIntent.status === 'requires_action') {
                const { error } = await this.stripe.confirmCardPayment(paymentIntent.client_secret);

                if (error) {
                    window.snapitAnalytics.trackEvent('subscription_failed', {
                        error: error.message,
                        code: error.code
                    });
                    throw error;
                } else {
                    window.snapitAnalytics.trackConversion(
                        this.getPlanPrice(this.currentPlan),
                        'USD',
                        'subscription'
                    );
                    return { subscriptionId, paymentIntent };
                }
            } else {
                window.snapitAnalytics.trackConversion(
                    this.getPlanPrice(this.currentPlan),
                    'USD',
                    'subscription'
                );
                return { subscriptionId, paymentIntent };
            }
        } catch (error) {
            console.error('Subscription creation failed:', error);
            throw error;
        }
    }

    // Usage-based billing
    async recordUsage(subscriptionItemId, quantity, action = 'increment') {
        try {
            const response = await fetch('/api/record-usage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscriptionItemId: subscriptionItemId,
                    quantity: quantity,
                    action: action,
                    timestamp: Date.now()
                })
            });

            return await response.json();
        } catch (error) {
            console.error('Usage recording failed:', error);
            throw error;
        }
    }

    // Redirect to customer portal
    redirectToCustomerPortal(customerId) {
        window.snapitAnalytics.trackEvent('portal_redirect', { customerId });
        fetch('/api/create-portal-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ customerId })
        })
        .then(response => response.json())
        .then(({ url }) => {
            window.location.href = url;
        });
    }

    // Event listeners
    setupEventListeners() {
        this.card.on('ready', () => {
            window.snapitAnalytics.trackEvent('payment_form_ready');
        });

        this.card.on('change', (event) => {
            if (event.error) {
                window.snapitAnalytics.trackEvent('payment_form_error', {
                    error: event.error.message
                });
            }
        });
    }

    // Helper functions
    getPlanPrice(plan) {
        const prices = {
            'starter': 9,
            'professional': 29,
            'enterprise': 99
        };
        return prices[plan] || 0;
    }
}

// Form Submission Handler
async function handleFormSubmission(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    // Convert FormData to URL encoded string
    const urlEncoded = new URLSearchParams(formData).toString();

    // Try multiple submission endpoints
    const endpoints = [
        'https://api.snapitforms.com/submit',
        'https://dnxslxuth3.execute-api.us-east-1.amazonaws.com/production/submit',
        'https://dnxslxuth3.execute-api.us-east-1.amazonaws.com/dev/submit'
    ];

    for (let i = 0; i < endpoints.length; i++) {
        try {
            console.log(`Trying form submission endpoint ${i + 1}: ${endpoints[i]}`);
            const response = await fetch(endpoints[i], {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: urlEncoded
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Form submitted successfully:', result);

                // Track successful submission
                window.snapitAnalytics.trackEvent('form_submission_success', {
                    endpoint: endpoints[i],
                    attempt: i + 1
                });

                // Show success message
                showNotification('success', 'Form submitted successfully!');
                form.reset();
                return;
            }
        } catch (error) {
            console.error(`Endpoint ${i + 1} failed:`, error);
            continue;
        }
    }

    // If all endpoints fail
    console.error('All form submission endpoints failed');
    window.snapitAnalytics.trackEvent('form_submission_failed', {
        endpoints_tried: endpoints.length
    });
    showNotification('error', 'Failed to submit form. Please try again.');
}

// Usage Tracker
class UsageTracker {
    constructor() {
        this.currentUsage = 0;
        this.monthlyLimit = 500; // Free tier limit
        this.checkUsage();
    }

    async checkUsage() {
        try {
            const accessKey = localStorage.getItem('accessKey');
            if (!accessKey) return;

            const response = await fetch('https://api.snapitforms.com/usage', {
                headers: {
                    'Authorization': `Bearer ${accessKey}`
                }
            });

            const data = await response.json();
            this.currentUsage = data.currentUsage || 0;
            this.monthlyLimit = data.monthlyLimit || 500;

            this.updateUsageDisplay();
            this.checkUsageThreshold();
        } catch (error) {
            console.error('Failed to check usage:', error);
        }
    }

    updateUsageDisplay() {
        const usageElements = document.querySelectorAll('.usage-display');
        usageElements.forEach(element => {
            element.textContent = `${this.currentUsage} / ${this.monthlyLimit} submissions used`;
        });
    }

    checkUsageThreshold() {
        const percentage = (this.currentUsage / this.monthlyLimit) * 100;

        if (percentage >= 80) {
            this.showUpgradePrompt();
        }
    }

    showUpgradePrompt() {
        const notification = document.createElement('div');
        notification.className = 'usage-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <h4>Usage Alert</h4>
                <p>You've used ${this.currentUsage} of ${this.monthlyLimit} monthly submissions.</p>
                <button onclick="location.href='#pricing'">Upgrade Plan</button>
            </div>
        `;
        document.body.appendChild(notification);

        if (window.snapitAnalytics) {
            window.snapitAnalytics.trackEvent('upgrade_prompt_shown', {
                current_usage: this.currentUsage,
                limit: this.monthlyLimit
            });
        }
    }
}

// Notification System
function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        word-wrap: break-word;
        ${type === 'success' ? 'background-color: #10b981;' : 'background-color: #ef4444;'}
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Global instances
window.snapitAuth = new SnapITAuthManager();
window.snapitStripe = null; // Initialized when needed
window.usageTracker = new UsageTracker();

// Global functions
window.handleFormSubmission = handleFormSubmission;
window.showNotification = showNotification;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Setup form submission handlers
    document.querySelectorAll('form').forEach(form => {
        if (form.getAttribute('action') && form.getAttribute('action').includes('snapitforms.com')) {
            form.addEventListener('submit', handleFormSubmission);
        }
    });
});