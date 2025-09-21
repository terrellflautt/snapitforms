// Auth Interceptor
// Intercepts and fixes auth-related API calls
console.log('Auth Interceptor loaded');

window.authInterceptor = {
    init: function() {
        console.log('Auth interceptor initialized');
        // Add auth headers to all API requests
        this.interceptFetch();
    },

    interceptFetch: function() {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const [url, options = {}] = args;

            // Add auth headers if missing
            if (typeof url === 'string' && url.includes('api.snapitforms.com')) {
                options.headers = options.headers || {};

                // Get access key from URL or localStorage
                const urlParams = new URLSearchParams(window.location.search);
                const accessKey = urlParams.get('key') || localStorage.getItem('accessKey');

                if (accessKey && !options.headers['X-Access-Key']) {
                    options.headers['X-Access-Key'] = accessKey;
                }
            }

            return originalFetch.apply(this, [url, options]);
        };
    }
};

if (window.addEventListener) {
    window.addEventListener('load', window.authInterceptor.init.bind(window.authInterceptor));
} else {
    window.attachEvent('onload', window.authInterceptor.init.bind(window.authInterceptor));
}