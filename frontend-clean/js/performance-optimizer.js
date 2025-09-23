// Performance Optimization Module for SnapIT Forms
// Fastest loading form submission web app optimization

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Optimize on page load
        document.addEventListener('DOMContentLoaded', () => {
            this.optimizeImages();
            this.optimizeCSS();
            this.enableResourcePrefetching();
            this.optimizeTranslations();
            this.setupIntersectionObserver();
            this.enableServiceWorker();
        });

        // Optimize on window load
        window.addEventListener('load', () => {
            this.preloadCriticalResources();
            this.optimizeFormElements();
        });
    }

    // Optimize image loading with lazy loading
    optimizeImages() {
        const images = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }

    // Optimize CSS delivery
    optimizeCSS() {
        // Remove unused CSS (basic implementation)
        const unusedSelectors = [
            '.unused-class',
            '.deprecated-style'
        ];

        unusedSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => el.remove());
        });

        // Inline critical CSS for above-the-fold content
        this.inlineCriticalCSS();
    }

    // Inline critical CSS
    inlineCriticalCSS() {
        const criticalCSS = `
            .hero { display: block; }
            .nav-menu { display: flex; }
            .language-selector { position: relative; }
        `;

        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
    }

    // Enable resource prefetching for faster navigation
    enableResourcePrefetching() {
        const prefetchResources = [
            '/form-generator.html',
            '/dashboard.html',
            '/templates.html',
            '/js/translations.js',
            '/js/language-selector.js'
        ];

        prefetchResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = resource;
            document.head.appendChild(link);
        });
    }

    // Optimize translation system performance
    optimizeTranslations() {
        if (window.translator) {
            // Cache translations in localStorage
            const cacheKey = 'snapit-translations-cache';
            const cachedTranslations = localStorage.getItem(cacheKey);

            if (!cachedTranslations) {
                localStorage.setItem(cacheKey, JSON.stringify(window.TRANSLATIONS));
            }

            // Optimize translation lookup with memoization
            const originalT = window.translator.t.bind(window.translator);
            const translationCache = new Map();

            window.translator.t = function(key, variables = {}) {
                const cacheKey = `${key}_${JSON.stringify(variables)}`;

                if (translationCache.has(cacheKey)) {
                    return translationCache.get(cacheKey);
                }

                const result = originalT(key, variables);
                translationCache.set(cacheKey, result);
                return result;
            };
        }
    }

    // Setup intersection observer for performance monitoring
    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');

                        // Load language selector when it comes into view
                        if (entry.target.id === 'language-selector-container') {
                            this.initializeLanguageSelector();
                        }
                    }
                });
            }, {
                threshold: 0.1
            });

            // Observe key elements
            const observeElements = document.querySelectorAll(
                '#language-selector-container, .pricing-card, .feature-card'
            );
            observeElements.forEach(el => observer.observe(el));
        }
    }

    // Initialize language selector when needed
    initializeLanguageSelector() {
        if (window.LanguageSelector && !this.languageSelectorInitialized) {
            new window.LanguageSelector();
            this.languageSelectorInitialized = true;
        }
    }

    // Preload critical resources
    preloadCriticalResources() {
        const criticalResources = [
            'https://api.snapitforms.com',
            'https://accounts.google.com',
            'https://js.stripe.com'
        ];

        criticalResources.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = url;
            document.head.appendChild(link);
        });
    }

    // Optimize form elements for better performance
    optimizeFormElements() {
        // Debounce form input validation
        const formInputs = document.querySelectorAll('input, textarea, select');

        formInputs.forEach(input => {
            let timeout;
            input.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.validateField(e.target);
                }, 300);
            });
        });

        // Optimize form submission with request queuing
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', this.optimizedFormSubmit.bind(this));
        });
    }

    // Optimized form submission
    optimizedFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        // Show loading state immediately
        this.showLoadingState(form);

        // Use fetch with timeout for better performance
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        fetch(form.action, {
            method: 'POST',
            body: formData,
            signal: controller.signal
        })
        .then(response => {
            clearTimeout(timeoutId);
            return response.json();
        })
        .then(data => {
            this.hideLoadingState(form);
            this.showSuccessMessage(data);
        })
        .catch(error => {
            clearTimeout(timeoutId);
            this.hideLoadingState(form);
            this.showErrorMessage(error);
        });
    }

    // Field validation
    validateField(field) {
        // Basic validation logic
        const isValid = field.checkValidity();
        field.classList.toggle('invalid', !isValid);
        field.classList.toggle('valid', isValid);
    }

    // Loading state management
    showLoadingState(form) {
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = window.translator ?
                window.translator.t('form.submitting') : 'Submitting...';
        }
    }

    hideLoadingState(form) {
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = window.translator ?
                window.translator.t('form.submit') : 'Submit';
        }
    }

    // Success/Error message handling
    showSuccessMessage(data) {
        const message = window.translator ?
            window.translator.t('form.success') : 'Form submitted successfully!';
        this.showNotification(message, 'success');
    }

    showErrorMessage(error) {
        const message = window.translator ?
            window.translator.t('form.error') : 'An error occurred. Please try again.';
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Enable service worker for caching
    enableServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Performance SW registered:', registration);
                })
                .catch(error => {
                    console.log('Performance SW registration failed:', error);
                });
        }
    }

    // Performance monitoring
    measurePerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];

                console.log('Performance Metrics:', {
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
                    fullyLoaded: perfData.loadEventEnd - perfData.fetchStart,
                    firstPaint: performance.getEntriesByType('paint')[0]?.startTime,
                    translationSystemReady: performance.now()
                });
            });
        }
    }
}

// Initialize performance optimizer
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
    window.performanceOptimizer.measurePerformance();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}