/**
 * SnapItForms Optimized JavaScript Bundle
 * Version: 2.0.0
 * Combined and optimized for performance
 */

'use strict';

// Utility functions and helpers
const Utils = {
    // Generate unique IDs
    generateId: (prefix = 'id') => `${prefix}_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`,

    // Debounce function for performance
    debounce: (func, wait, immediate) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    // Throttle function for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // DOM ready utility
    ready: (fn) => {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    },

    // Safe querySelector
    $: (selector, context = document) => context.querySelector(selector),
    $$: (selector, context = document) => context.querySelectorAll(selector),

    // Local storage with error handling
    storage: {
        get: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.warn('Error reading from localStorage:', e);
                return defaultValue;
            }
        },
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.warn('Error writing to localStorage:', e);
                return false;
            }
        },
        remove: (key) => {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.warn('Error removing from localStorage:', e);
                return false;
            }
        }
    },

    // API request utility with error handling
    api: {
        request: async (url, options = {}) => {
            const defaults = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const config = { ...defaults, ...options };

            try {
                const response = await fetch(url, config);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return await response.json();
                }

                return await response.text();
            } catch (error) {
                console.error('API request failed:', error);
                throw error;
            }
        }
    }
};

// Performance monitoring
const PerformanceMonitor = {
    metrics: {},

    start: (name) => {
        PerformanceMonitor.metrics[name] = performance.now();
    },

    end: (name) => {
        if (PerformanceMonitor.metrics[name]) {
            const duration = performance.now() - PerformanceMonitor.metrics[name];
            console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
            delete PerformanceMonitor.metrics[name];
            return duration;
        }
    },

    measure: (name, fn) => {
        PerformanceMonitor.start(name);
        const result = fn();
        PerformanceMonitor.end(name);
        return result;
    }
};

// Enhanced Analytics System
const Analytics = {
    config: {
        apiEndpoint: 'https://api.snapitanalytics.com/events',
        userId: null,
        sessionId: Utils.generateId('session'),
        environment: 'production',
        version: '2.0.0'
    },

    queue: [],
    initialized: false,

    init() {
        this.trackPageView();
        this.setupErrorTracking();
        this.setupUserBehavior();
        this.setupPerformanceTracking();
        this.startBatchSending();
        this.initialized = true;
    },

    trackEvent(event, properties = {}) {
        const eventData = {
            event,
            properties: {
                ...properties,
                timestamp: Date.now(),
                url: window.location.href,
                referrer: document.referrer,
                userAgent: navigator.userAgent,
                sessionId: this.config.sessionId,
                userId: this.config.userId,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            }
        };

        this.queue.push(eventData);

        // Send immediately for critical events
        if (['error', 'conversion', 'form_submit'].includes(event)) {
            this.flush();
        }
    },

    trackPageView() {
        const pageData = {
            page: window.location.pathname,
            title: document.title,
            loadTime: performance.timing ?
                performance.timing.loadEventEnd - performance.timing.navigationStart : 0
        };

        this.trackEvent('page_view', pageData);
    },

    trackConversion(value, currency = 'USD', eventType = 'purchase') {
        this.trackEvent('conversion', {
            value,
            currency,
            event_type: eventType,
            transaction_id: Utils.generateId('trans')
        });
    },

    setupErrorTracking() {
        window.addEventListener('error', (event) => {
            this.trackEvent('javascript_error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.trackEvent('promise_rejection', {
                reason: event.reason?.toString(),
                stack: event.reason?.stack
            });
        });
    },

    setupUserBehavior() {
        // Click tracking
        document.addEventListener('click', Utils.throttle((event) => {
            const element = event.target;
            if (element.matches('button, a, [data-track]')) {
                this.trackEvent('click', {
                    element: element.tagName.toLowerCase(),
                    text: element.textContent?.trim().substring(0, 100),
                    selector: this.getElementSelector(element)
                });
            }
        }, 100));

        // Form interaction tracking
        document.addEventListener('focus', (event) => {
            if (event.target.matches('input, textarea, select')) {
                this.trackEvent('form_field_focus', {
                    field_type: event.target.type || event.target.tagName.toLowerCase(),
                    field_name: event.target.name || event.target.id
                });
            }
        }, true);

        // Scroll depth tracking
        let maxScroll = 0;
        window.addEventListener('scroll', Utils.throttle(() => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );

            if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
                maxScroll = scrollPercent;
                this.trackEvent('scroll_depth', { depth: scrollPercent });
            }
        }, 500));
    },

    setupPerformanceTracking() {
        // Core Web Vitals
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        this.trackEvent('web_vital', {
                            name: entry.name,
                            value: entry.value,
                            rating: this.getVitalRating(entry.name, entry.value)
                        });
                    });
                });

                observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
            } catch (e) {
                console.warn('Performance Observer not supported');
            }
        }
    },

    getVitalRating(name, value) {
        const thresholds = {
            'largest-contentful-paint': [2500, 4000],
            'first-input': [100, 300],
            'layout-shift': [0.1, 0.25]
        };

        const [good, needsImprovement] = thresholds[name] || [0, 0];

        if (value <= good) return 'good';
        if (value <= needsImprovement) return 'needs-improvement';
        return 'poor';
    },

    getElementSelector(element) {
        if (element.id) return `#${element.id}`;
        if (element.className) return `.${element.className.split(' ')[0]}`;
        return element.tagName.toLowerCase();
    },

    async flush() {
        if (this.queue.length === 0) return;

        const events = [...this.queue];
        this.queue = [];

        try {
            await Utils.api.request(this.config.apiEndpoint, {
                method: 'POST',
                body: JSON.stringify({ events })
            });
        } catch (error) {
            console.warn('Failed to send analytics:', error);
            // Re-queue events for retry
            this.queue.unshift(...events);
        }
    },

    startBatchSending() {
        // Send queued events every 30 seconds
        setInterval(() => {
            if (this.queue.length > 0) {
                this.flush();
            }
        }, 30000);

        // Send on page unload
        window.addEventListener('beforeunload', () => {
            if (this.queue.length > 0) {
                navigator.sendBeacon?.(this.config.apiEndpoint, JSON.stringify({ events: this.queue }));
            }
        });
    }
};

// Authentication Manager
const AuthManager = {
    config: {
        apiEndpoint: 'https://api.snapitforms.com/auth',
        storageKeys: {
            user: 'snapit_user',
            token: 'snapit_auth_token',
            refreshToken: 'snapit_refresh_token'
        }
    },

    user: null,
    token: null,
    isAuthenticated: false,
    listeners: [],

    init() {
        this.restoreSession();
        this.setupTokenRefresh();
    },

    restoreSession() {
        this.token = Utils.storage.get(this.config.storageKeys.token);
        this.user = Utils.storage.get(this.config.storageKeys.user);

        if (this.token && this.user) {
            this.isAuthenticated = true;
            this.notifyListeners('restored');
        }
    },

    async login(credentials) {
        try {
            const response = await Utils.api.request(`${this.config.apiEndpoint}/login`, {
                method: 'POST',
                body: JSON.stringify(credentials)
            });

            if (response.success) {
                this.setSession(response.user, response.token, response.refreshToken);
                Analytics.trackEvent('user_login', { method: 'email' });
                return { success: true };
            }

            return { success: false, error: response.message };
        } catch (error) {
            Analytics.trackEvent('login_error', { error: error.message });
            return { success: false, error: 'Login failed. Please try again.' };
        }
    },

    async loginWithGoogle(googleToken) {
        try {
            const response = await Utils.api.request(`${this.config.apiEndpoint}/google`, {
                method: 'POST',
                body: JSON.stringify({ token: googleToken })
            });

            if (response.success) {
                this.setSession(response.user, response.token, response.refreshToken);
                Analytics.trackEvent('user_login', { method: 'google' });
                return { success: true };
            }

            return { success: false, error: response.message };
        } catch (error) {
            Analytics.trackEvent('login_error', { error: error.message, method: 'google' });
            return { success: false, error: 'Google login failed. Please try again.' };
        }
    },

    async register(userData) {
        try {
            const response = await Utils.api.request(`${this.config.apiEndpoint}/register`, {
                method: 'POST',
                body: JSON.stringify(userData)
            });

            if (response.success) {
                this.setSession(response.user, response.token, response.refreshToken);
                Analytics.trackEvent('user_register');
                return { success: true };
            }

            return { success: false, error: response.message };
        } catch (error) {
            Analytics.trackEvent('register_error', { error: error.message });
            return { success: false, error: 'Registration failed. Please try again.' };
        }
    },

    logout() {
        this.clearSession();
        Analytics.trackEvent('user_logout');
        this.notifyListeners('logout');
    },

    setSession(user, token, refreshToken) {
        this.user = user;
        this.token = token;
        this.isAuthenticated = true;

        Utils.storage.set(this.config.storageKeys.user, user);
        Utils.storage.set(this.config.storageKeys.token, token);
        if (refreshToken) {
            Utils.storage.set(this.config.storageKeys.refreshToken, refreshToken);
        }

        this.notifyListeners('login');
    },

    clearSession() {
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;

        Utils.storage.remove(this.config.storageKeys.user);
        Utils.storage.remove(this.config.storageKeys.token);
        Utils.storage.remove(this.config.storageKeys.refreshToken);
    },

    async refreshToken() {
        const refreshToken = Utils.storage.get(this.config.storageKeys.refreshToken);
        if (!refreshToken) return false;

        try {
            const response = await Utils.api.request(`${this.config.apiEndpoint}/refresh`, {
                method: 'POST',
                body: JSON.stringify({ refreshToken })
            });

            if (response.success) {
                this.setSession(response.user, response.token, response.refreshToken);
                return true;
            }
        } catch (error) {
            console.warn('Token refresh failed:', error);
        }

        this.clearSession();
        return false;
    },

    setupTokenRefresh() {
        // Check token validity every 5 minutes
        setInterval(async () => {
            if (this.isAuthenticated) {
                const isValid = await this.validateToken();
                if (!isValid) {
                    await this.refreshToken();
                }
            }
        }, 5 * 60 * 1000);
    },

    async validateToken() {
        if (!this.token) return false;

        try {
            const response = await Utils.api.request(`${this.config.apiEndpoint}/validate`, {
                headers: { Authorization: `Bearer ${this.token}` }
            });
            return response.valid;
        } catch (error) {
            return false;
        }
    },

    onAuthChange(callback) {
        this.listeners.push(callback);
    },

    notifyListeners(event) {
        this.listeners.forEach(callback => {
            try {
                callback(event, this.user, this.isAuthenticated);
            } catch (error) {
                console.error('Auth listener error:', error);
            }
        });
    },

    getAuthHeaders() {
        return this.token ? { Authorization: `Bearer ${this.token}` } : {};
    }
};

// Form Builder and Handler
const FormManager = {
    forms: new Map(),

    init() {
        this.setupFormHandlers();
        this.setupValidation();
    },

    setupFormHandlers() {
        document.addEventListener('submit', async (event) => {
            const form = event.target;
            if (!form.matches('[data-snapit-form]')) return;

            event.preventDefault();
            await this.handleSubmission(form);
        });
    },

    async handleSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const formKey = form.dataset.snapitForm;

        try {
            this.showLoading(form, true);

            const response = await Utils.api.request('https://api.snapitforms.com/submit', {
                method: 'POST',
                headers: {
                    ...AuthManager.getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    formKey,
                    data,
                    metadata: {
                        url: window.location.href,
                        userAgent: navigator.userAgent,
                        timestamp: Date.now()
                    }
                })
            });

            if (response.success) {
                this.showSuccess(form);
                Analytics.trackEvent('form_submit', { formKey, success: true });
                form.reset();
            } else {
                this.showError(form, response.message);
                Analytics.trackEvent('form_submit', { formKey, success: false, error: response.message });
            }
        } catch (error) {
            this.showError(form, 'Submission failed. Please try again.');
            Analytics.trackEvent('form_submit_error', { formKey, error: error.message });
        } finally {
            this.showLoading(form, false);
        }
    },

    setupValidation() {
        document.addEventListener('blur', (event) => {
            const input = event.target;
            if (input.matches('input, textarea, select')) {
                this.validateField(input);
            }
        }, true);

        document.addEventListener('input', Utils.debounce((event) => {
            const input = event.target;
            if (input.matches('input[type="email"], input[type="url"]')) {
                this.validateField(input);
            }
        }, 500));
    },

    validateField(field) {
        const errors = [];
        const value = field.value.trim();

        // Required validation
        if (field.required && !value) {
            errors.push(`${this.getFieldLabel(field)} is required`);
        }

        // Type-specific validation
        if (value && field.type) {
            switch (field.type) {
                case 'email':
                    if (!this.isValidEmail(value)) {
                        errors.push('Please enter a valid email address');
                    }
                    break;
                case 'url':
                    if (!this.isValidUrl(value)) {
                        errors.push('Please enter a valid URL');
                    }
                    break;
                case 'tel':
                    if (!this.isValidPhone(value)) {
                        errors.push('Please enter a valid phone number');
                    }
                    break;
            }
        }

        // Length validation
        if (field.minLength && value.length < field.minLength) {
            errors.push(`Minimum ${field.minLength} characters required`);
        }

        if (field.maxLength && value.length > field.maxLength) {
            errors.push(`Maximum ${field.maxLength} characters allowed`);
        }

        this.displayFieldErrors(field, errors);
        return errors.length === 0;
    },

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    isValidPhone(phone) {
        return /^[\+]?[\d\s\-\(\)]{10,}$/.test(phone);
    },

    getFieldLabel(field) {
        const label = document.querySelector(`label[for="${field.id}"]`);
        return label?.textContent || field.name || 'Field';
    },

    displayFieldErrors(field, errors) {
        const errorContainer = field.parentNode.querySelector('.form-error');

        if (errors.length > 0) {
            field.classList.add('error');
            if (errorContainer) {
                errorContainer.textContent = errors[0];
            } else {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'form-error';
                errorDiv.textContent = errors[0];
                field.parentNode.appendChild(errorDiv);
            }
        } else {
            field.classList.remove('error');
            if (errorContainer) {
                errorContainer.remove();
            }
        }
    },

    showLoading(form, show) {
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = show;
            submitBtn.textContent = show ? 'Submitting...' : submitBtn.dataset.originalText || 'Submit';
            if (!submitBtn.dataset.originalText) {
                submitBtn.dataset.originalText = submitBtn.textContent;
            }
        }
    },

    showSuccess(form) {
        this.showMessage(form, 'Form submitted successfully!', 'success');
    },

    showError(form, message) {
        this.showMessage(form, message, 'error');
    },

    showMessage(form, message, type) {
        let messageDiv = form.querySelector('.form-message');
        if (!messageDiv) {
            messageDiv = document.createElement('div');
            messageDiv.className = 'form-message';
            form.appendChild(messageDiv);
        }

        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;

        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
};

// UI Enhancement Manager
const UIManager = {
    init() {
        this.setupModals();
        this.setupTooltips();
        this.setupSmoothScrolling();
        this.setupLazyLoading();
        this.setupKeyboardNavigation();
    },

    setupModals() {
        document.addEventListener('click', (event) => {
            const trigger = event.target.closest('[data-modal-target]');
            if (trigger) {
                event.preventDefault();
                const targetId = trigger.dataset.modalTarget;
                this.openModal(targetId);
            }

            const close = event.target.closest('[data-modal-close]');
            if (close) {
                event.preventDefault();
                this.closeModal(close.closest('.modal-overlay'));
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                const openModal = document.querySelector('.modal-overlay.active');
                if (openModal) {
                    this.closeModal(openModal);
                }
            }
        });

        // Close modal on backdrop click
        document.addEventListener('click', (event) => {
            if (event.target.matches('.modal-overlay.active')) {
                this.closeModal(event.target);
            }
        });
    },

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Focus first focusable element
            const focusable = modal.querySelector('input, button, textarea, select, [tabindex]:not([tabindex="-1"])');
            if (focusable) {
                focusable.focus();
            }

            Analytics.trackEvent('modal_open', { modalId });
        }
    },

    closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            Analytics.trackEvent('modal_close');
        }
    },

    setupTooltips() {
        const tooltips = document.querySelectorAll('[data-tooltip]');
        tooltips.forEach(element => {
            element.addEventListener('mouseenter', this.showTooltip.bind(this));
            element.addEventListener('mouseleave', this.hideTooltip.bind(this));
        });
    },

    showTooltip(event) {
        const element = event.target;
        const text = element.dataset.tooltip;

        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.position = 'absolute';
        tooltip.style.zIndex = '1000';
        tooltip.style.background = '#333';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '0.5rem';
        tooltip.style.borderRadius = '0.25rem';
        tooltip.style.fontSize = '0.875rem';

        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';

        element._tooltip = tooltip;
    },

    hideTooltip(event) {
        const tooltip = event.target._tooltip;
        if (tooltip) {
            tooltip.remove();
            delete event.target._tooltip;
        }
    },

    setupSmoothScrolling() {
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href^="#"]');
            if (link) {
                event.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);

                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    },

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    },

    setupKeyboardNavigation() {
        // Tab trap for modals
        document.addEventListener('keydown', (event) => {
            const modal = document.querySelector('.modal-overlay.active');
            if (!modal || event.key !== 'Tab') return;

            const focusableElements = modal.querySelectorAll(
                'input:not([disabled]), button:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        });
    }
};

// Google OAuth integration
const GoogleAuth = {
    clientId: '1074652458977-5sks6ipv9dqd1lqj3v4n2cqm6v0j8ckm.apps.googleusercontent.com',

    init() {
        if (typeof google !== 'undefined' && google.accounts) {
            this.initializeGoogleSignIn();
        } else {
            // Retry after Google library loads
            setTimeout(() => this.init(), 1000);
        }
    },

    initializeGoogleSignIn() {
        google.accounts.id.initialize({
            client_id: this.clientId,
            callback: this.handleGoogleResponse.bind(this)
        });

        // Render sign-in buttons
        const signInButtons = document.querySelectorAll('.google-signin-button');
        signInButtons.forEach(button => {
            google.accounts.id.renderButton(button, {
                theme: 'outline',
                size: 'large',
                width: button.offsetWidth
            });
        });
    },

    async handleGoogleResponse(response) {
        try {
            const result = await AuthManager.loginWithGoogle(response.credential);

            if (result.success) {
                window.location.href = '/dashboard.html';
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            this.showError('Google authentication failed');
            console.error('Google auth error:', error);
        }
    },

    showError(message) {
        // Show error message to user
        const errorDiv = document.createElement('div');
        errorDiv.className = 'auth-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            z-index: 1000;
        `;

        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
};

// Initialize all systems when DOM is ready
Utils.ready(() => {
    PerformanceMonitor.start('initialization');

    Analytics.init();
    AuthManager.init();
    FormManager.init();
    UIManager.init();
    GoogleAuth.init();

    PerformanceMonitor.end('initialization');

    // Global error boundary
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
    });
});

// Export for external use
window.SnapItForms = {
    Utils,
    Analytics,
    AuthManager,
    FormManager,
    UIManager,
    GoogleAuth,
    PerformanceMonitor
};