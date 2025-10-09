/**
 * Universal API Interceptor - Automatically adds authentication to all API calls
 * This fixes the 403 "Missing Authentication Token" errors across all SnapIT sites
 */

(function() {
    'use strict';
    
    // Store the original fetch function
    const originalFetch = window.fetch;
    
    // Override fetch to automatically add authentication
    window.fetch = async function(url, options = {}) {
        // Check if this is an API call to our domains
        const isSnapitAPI = typeof url === 'string' && (
            url.includes('api.snapitforms.com') ||
            url.includes('api.snapitagent.com') ||
            url.includes('api.snapitanalytics.com') ||
            url.includes('api.snapitqr.com') ||
            url.includes('api.snapiturl.com') ||
            url.includes('api.urlstatuschecker.com') ||
            url.includes('execute-api.us-east-1.amazonaws.com') ||
            (typeof CONFIG !== 'undefined' && url.includes(CONFIG.API_BASE_URL))
        );
        
        // If it's a SnapIT API call, add authentication
        if (isSnapitAPI) {
            // Get auth headers from the unified auth system
            let authHeaders = {};
            
            if (window.snapitAuth && typeof window.snapitAuth.getAuthHeaders === 'function') {
                authHeaders = window.snapitAuth.getAuthHeaders();
            } else {
                // Fallback: try to get token from localStorage
                const token = localStorage.getItem('google_id_token') || 
                             localStorage.getItem('snapit_auth_token');
                
                if (token) {
                    authHeaders = {
                        'Authorization': `Bearer ${token}`,
                        'X-Service': window.location.hostname.split('.')[0].replace('snapit', '')
                    };
                }
            }
            
            // Merge authentication headers with existing headers
            options.headers = {
                'Content-Type': 'application/json',
                ...authHeaders,
                ...(options.headers || {})
            };
            
            console.log(`[API Interceptor] Adding auth to ${url}`, {
                hasAuth: !!authHeaders.Authorization,
                headers: Object.keys(authHeaders)
            });
        }
        
        // Call the original fetch with enhanced options
        try {
            const response = await originalFetch(url, options);
            
            // Log API call results for debugging
            if (isSnapitAPI) {
                console.log(`[API Interceptor] ${options.method || 'GET'} ${url}: ${response.status}`);
                
                // If we get 401/403, it means auth is still failing
                if (response.status === 401 || response.status === 403) {
                    console.warn('[API Interceptor] Authentication failed - may need to sign in again');
                    
                    // Trigger auth refresh if available
                    if (window.snapitAuth && typeof window.snapitAuth.refreshToken === 'function') {
                        window.snapitAuth.refreshToken();
                    }
                }
            }
            
            return response;
        } catch (error) {
            console.error(`[API Interceptor] Error calling ${url}:`, error);
            throw error;
        }
    };
    
    console.log('[API Interceptor] Initialized - all API calls will now include authentication');
})();

// Also intercept XMLHttpRequest for older code
(function() {
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._url = url;
        this._method = method;
        return originalXHROpen.apply(this, [method, url, ...args]);
    };
    
    XMLHttpRequest.prototype.send = function(data) {
        // Check if this is a SnapIT API call
        const isSnapitAPI = this._url && (
            this._url.includes('api.snapitforms.com') ||
            this._url.includes('api.snapitagent.com') ||
            this._url.includes('api.snapitanalytics.com') ||
            this._url.includes('api.snapitqr.com') ||
            this._url.includes('api.snapiturl.com') ||
            this._url.includes('api.urlstatuschecker.com') ||
            this._url.includes('execute-api.us-east-1.amazonaws.com')
        );
        
        if (isSnapitAPI) {
            // Add authentication headers
            const token = localStorage.getItem('google_id_token') || 
                         localStorage.getItem('snapit_auth_token');
            
            if (token) {
                this.setRequestHeader('Authorization', `Bearer ${token}`);
                this.setRequestHeader('X-Service', window.location.hostname.split('.')[0]);
                console.log(`[XHR Interceptor] Adding auth to ${this._url}`);
            }
        }
        
        return originalXHRSend.apply(this, [data]);
    };
})();