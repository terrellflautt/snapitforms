/**
 * SnapItForms Universal Authentication Fix
 * Cross-domain authentication synchronization and universal auth handling
 */

(function() {
    'use strict';

    // Universal auth configuration
    const SNAPIT_DOMAINS = [
        'snapitforms.com',
        'snapitagent.com',
        'snapitanalytics.com',
        'snapitqr.com',
        'snapiturl.com',
        'urlstatuschecker.com',
        'snapitsoftware.com',
        'snapitsaas.com'
    ];

    const AUTH_STORAGE_KEYS = {
        user: 'snapit_user',
        jwtToken: 'snapit_jwt_token',
        authToken: 'snapit_auth_token',
        refreshToken: 'snapit_refresh_token',
        sessionId: 'snapit_session_id',
        lastSync: 'snapit_auth_last_sync'
    };

    // Universal auth state manager
    class UniversalAuthManager {
        constructor() {
            this.authState = {
                isAuthenticated: false,
                user: null,
                tokens: {},
                lastSyncTime: 0
            };

            this.syncInProgress = false;
            this.listeners = [];
            this.init();
        }

        init() {
            this.restoreAuthState();
            this.setupMessageListeners();
            this.setupStorageListeners();
            this.schedulePeriodicSync();
            this.handleAuthSyncRequest();
        }

        // Restore auth state from storage
        restoreAuthState() {
            try {
                const userData = localStorage.getItem(AUTH_STORAGE_KEYS.user);
                const jwtToken = localStorage.getItem(AUTH_STORAGE_KEYS.jwtToken);
                const authToken = localStorage.getItem(AUTH_STORAGE_KEYS.authToken);
                const refreshToken = localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken);

                if (userData && (jwtToken || authToken)) {
                    const user = JSON.parse(userData);
                    this.authState = {
                        isAuthenticated: true,
                        user: user,
                        tokens: {
                            jwt: jwtToken,
                            auth: authToken,
                            refresh: refreshToken
                        },
                        lastSyncTime: parseInt(localStorage.getItem(AUTH_STORAGE_KEYS.lastSync) || '0')
                    };

                    this.notifyListeners('auth_restored', this.authState);
                    console.log('Universal auth state restored:', user.email);
                }
            } catch (error) {
                console.error('Failed to restore universal auth state:', error);
                this.clearAuthState();
            }
        }

        // Set authenticated user
        setAuthenticatedUser(user, tokens) {
            this.authState = {
                isAuthenticated: true,
                user: user,
                tokens: tokens,
                lastSyncTime: Date.now()
            };

            // Store in localStorage
            localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(user));
            if (tokens.jwt) localStorage.setItem(AUTH_STORAGE_KEYS.jwtToken, tokens.jwt);
            if (tokens.auth) localStorage.setItem(AUTH_STORAGE_KEYS.authToken, tokens.auth);
            if (tokens.refresh) localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, tokens.refresh);
            localStorage.setItem(AUTH_STORAGE_KEYS.lastSync, this.authState.lastSyncTime.toString());

            this.notifyListeners('auth_login', this.authState);
            this.syncAcrossDomains();
        }

        // Clear auth state
        clearAuthState() {
            this.authState = {
                isAuthenticated: false,
                user: null,
                tokens: {},
                lastSyncTime: Date.now()
            };

            // Clear localStorage
            Object.values(AUTH_STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });

            this.notifyListeners('auth_logout', this.authState);
            this.syncAcrossDomains();
        }

        // Sync authentication across all SnapIt domains
        syncAcrossDomains() {
            if (this.syncInProgress) return;
            this.syncInProgress = true;

            SNAPIT_DOMAINS.forEach(domain => {
                if (window.location.hostname !== domain) {
                    this.createSyncIframe(domain);
                }
            });

            // Reset sync flag after a delay
            setTimeout(() => {
                this.syncInProgress = false;
            }, 5000);
        }

        // Create iframe for cross-domain sync
        createSyncIframe(domain) {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.width = '1px';
            iframe.style.height = '1px';
            iframe.style.position = 'absolute';
            iframe.style.top = '-9999px';

            const syncData = {
                action: 'auth_sync',
                authState: this.authState,
                timestamp: Date.now()
            };

            iframe.src = `https://${domain}/auth-sync.html?data=${encodeURIComponent(JSON.stringify(syncData))}`;

            // Add load handler
            iframe.onload = () => {
                console.log(`Auth sync initiated with ${domain}`);
            };

            iframe.onerror = () => {
                console.warn(`Auth sync failed with ${domain}`);
            };

            document.body.appendChild(iframe);

            // Clean up iframe after sync
            setTimeout(() => {
                if (iframe.parentNode) {
                    iframe.parentNode.removeChild(iframe);
                }
            }, 3000);
        }

        // Setup message listeners for cross-domain communication
        setupMessageListeners() {
            window.addEventListener('message', (event) => {
                // Verify origin is from a trusted SnapIt domain
                const originDomain = new URL(event.origin).hostname;
                if (!SNAPIT_DOMAINS.includes(originDomain)) {
                    return;
                }

                if (event.data && event.data.type === 'snapit_auth_sync') {
                    this.handleRemoteAuthSync(event.data);
                }
            });
        }

        // Handle auth sync from other domains
        handleRemoteAuthSync(data) {
            try {
                const remoteAuthState = data.authState;
                const remoteTimestamp = data.timestamp || 0;

                // Only update if remote state is newer
                if (remoteTimestamp > this.authState.lastSyncTime) {
                    console.log('Updating auth state from remote sync');

                    if (remoteAuthState.isAuthenticated) {
                        this.setAuthenticatedUser(remoteAuthState.user, remoteAuthState.tokens);
                    } else {
                        this.clearAuthState();
                    }
                }
            } catch (error) {
                console.error('Failed to handle remote auth sync:', error);
            }
        }

        // Setup storage event listeners for same-domain sync
        setupStorageListeners() {
            window.addEventListener('storage', (event) => {
                if (event.key === AUTH_STORAGE_KEYS.user || event.key === AUTH_STORAGE_KEYS.jwtToken) {
                    console.log('Auth storage changed, refreshing state');
                    this.restoreAuthState();
                }
            });
        }

        // Schedule periodic sync to maintain consistency
        schedulePeriodicSync() {
            // Sync every 5 minutes
            setInterval(() => {
                if (this.authState.isAuthenticated) {
                    this.validateAndRefreshTokens();
                }
            }, 5 * 60 * 1000);
        }

        // Validate and refresh tokens if needed
        async validateAndRefreshTokens() {
            try {
                if (!this.authState.tokens.refresh) {
                    return;
                }

                // Check if tokens are close to expiry
                const tokenPayload = this.parseJWT(this.authState.tokens.jwt || this.authState.tokens.auth);
                if (tokenPayload && tokenPayload.exp) {
                    const expiryTime = tokenPayload.exp * 1000;
                    const currentTime = Date.now();
                    const timeUntilExpiry = expiryTime - currentTime;

                    // Refresh if expires within 10 minutes
                    if (timeUntilExpiry < 10 * 60 * 1000) {
                        await this.refreshTokens();
                    }
                }
            } catch (error) {
                console.error('Token validation failed:', error);
            }
        }

        // Refresh authentication tokens
        async refreshTokens() {
            try {
                const response = await fetch('/api/auth/refresh', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        refresh_token: this.authState.tokens.refresh
                    })
                });

                if (response.ok) {
                    const data = await response.json();

                    // Update tokens
                    const updatedTokens = {
                        ...this.authState.tokens,
                        auth: data.access_token,
                        jwt: data.access_token,
                        refresh: data.refresh_token || this.authState.tokens.refresh
                    };

                    this.setAuthenticatedUser(this.authState.user, updatedTokens);
                    console.log('Tokens refreshed successfully');
                } else {
                    throw new Error('Token refresh failed');
                }
            } catch (error) {
                console.error('Token refresh failed:', error);
                this.clearAuthState();
            }
        }

        // Parse JWT token
        parseJWT(token) {
            try {
                if (!token) return null;
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                return JSON.parse(jsonPayload);
            } catch (error) {
                console.error('JWT parsing failed:', error);
                return null;
            }
        }

        // Handle auth sync requests from URL parameters
        handleAuthSyncRequest() {
            const urlParams = new URLSearchParams(window.location.search);
            const syncData = urlParams.get('data');

            if (syncData) {
                try {
                    const parsedData = JSON.parse(decodeURIComponent(syncData));
                    if (parsedData.action === 'auth_sync') {
                        this.handleRemoteAuthSync(parsedData);
                    }
                } catch (error) {
                    console.error('Failed to parse auth sync data:', error);
                }
            }
        }

        // Add auth state listener
        addListener(callback) {
            this.listeners.push(callback);
        }

        // Remove auth state listener
        removeListener(callback) {
            const index = this.listeners.indexOf(callback);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        }

        // Notify all listeners of auth state changes
        notifyListeners(event, state) {
            this.listeners.forEach(callback => {
                try {
                    callback(event, state);
                } catch (error) {
                    console.error('Auth listener error:', error);
                }
            });
        }

        // Public API methods
        getAuthState() {
            return { ...this.authState };
        }

        isAuthenticated() {
            return this.authState.isAuthenticated;
        }

        getUser() {
            return this.authState.user;
        }

        getAccessToken() {
            return this.authState.tokens.auth || this.authState.tokens.jwt;
        }

        signOut() {
            console.log('Universal sign out initiated');
            this.clearAuthState();
        }
    }

    // Google Sign-In Universal Handler
    class GoogleSignInUniversal {
        constructor(universalAuth) {
            this.universalAuth = universalAuth;
            this.clientId = '242648112266-iglul54tuis9mhucsp1pmpqg0a48l8i0.apps.googleusercontent.com';
            this.init();
        }

        init() {
            // Override global Google Sign-In handler
            window.handleGoogleSignInUniversal = this.handleCredentialResponse.bind(this);

            // Initialize Google Identity Services
            if (typeof google !== 'undefined' && google.accounts) {
                google.accounts.id.initialize({
                    client_id: this.clientId,
                    callback: this.handleCredentialResponse.bind(this),
                    auto_select: false,
                    cancel_on_tap_outside: false
                });
            }
        }

        handleCredentialResponse(response) {
            try {
                const userInfo = this.parseGoogleToken(response.credential);

                const user = {
                    id: userInfo.sub,
                    email: userInfo.email,
                    name: userInfo.name,
                    picture: userInfo.picture,
                    verified: userInfo.email_verified,
                    loginTime: Date.now(),
                    provider: 'google'
                };

                const tokens = {
                    jwt: response.credential,
                    auth: response.credential,
                    google: response.credential
                };

                this.universalAuth.setAuthenticatedUser(user, tokens);

                // Track successful login
                if (window.snapitAnalytics) {
                    window.snapitAnalytics.trackEvent('universal_auth_login', {
                        provider: 'google',
                        email: user.email,
                        verified: user.verified,
                        domain: window.location.hostname
                    });
                }

                console.log('Universal Google Sign-In successful:', user.email);
            } catch (error) {
                console.error('Universal Google Sign-In failed:', error);

                if (window.snapitAnalytics) {
                    window.snapitAnalytics.trackEvent('universal_auth_error', {
                        provider: 'google',
                        error: error.message,
                        domain: window.location.hostname
                    });
                }
            }
        }

        parseGoogleToken(token) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        }

        renderSignInButton(containerId, options = {}) {
            if (typeof google !== 'undefined' && google.accounts) {
                const container = document.getElementById(containerId);
                if (container) {
                    google.accounts.id.renderButton(container, {
                        theme: options.theme || 'outline',
                        size: options.size || 'large',
                        text: options.text || 'sign_in_with',
                        width: options.width || 250,
                        ...options
                    });
                }
            }
        }
    }

    // Initialize Universal Auth Manager
    const universalAuth = new UniversalAuthManager();
    const googleSignIn = new GoogleSignInUniversal(universalAuth);

    // Expose universal auth API globally
    window.snapitUniversalAuth = {
        getAuthState: () => universalAuth.getAuthState(),
        isAuthenticated: () => universalAuth.isAuthenticated(),
        getUser: () => universalAuth.getUser(),
        getAccessToken: () => universalAuth.getAccessToken(),
        signOut: () => universalAuth.signOut(),
        addListener: (callback) => universalAuth.addListener(callback),
        removeListener: (callback) => universalAuth.removeListener(callback),
        syncAcrossDomains: () => universalAuth.syncAcrossDomains(),
        renderGoogleSignIn: (containerId, options) => googleSignIn.renderSignInButton(containerId, options)
    };

    // Auto-sync when page becomes visible (for tab switching)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && universalAuth.isAuthenticated()) {
            universalAuth.syncAcrossDomains();
        }
    });

    // Enhanced error handling and recovery
    window.addEventListener('error', (event) => {
        if (event.message && event.message.includes('auth')) {
            console.error('Auth-related error detected:', event.message);

            // Attempt to recover by refreshing auth state
            universalAuth.restoreAuthState();
        }
    });

    // Integration with existing auth systems
    if (window.snapitAuth) {
        // Listen to existing auth manager events
        if (typeof window.snapitAuth.onAuthChange === 'function') {
            window.snapitAuth.onAuthChange((type, user) => {
                if (type === 'login' && user) {
                    const tokens = {
                        jwt: localStorage.getItem(AUTH_STORAGE_KEYS.jwtToken),
                        auth: localStorage.getItem(AUTH_STORAGE_KEYS.authToken)
                    };
                    universalAuth.setAuthenticatedUser(user, tokens);
                } else if (type === 'logout') {
                    universalAuth.clearAuthState();
                }
            });
        }
    }

    console.log('SnapItForms Universal Auth loaded successfully');

})();

// Universal auth sync page handler (for iframe communication)
if (window.location.pathname === '/auth-sync.html' || window.location.search.includes('auth_sync')) {
    (function() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const syncData = urlParams.get('data');

            if (syncData) {
                const data = JSON.parse(decodeURIComponent(syncData));

                // Post message back to parent with sync data
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                        type: 'snapit_auth_sync',
                        authState: data.authState,
                        timestamp: data.timestamp
                    }, '*');
                }
            }
        } catch (error) {
            console.error('Auth sync page error:', error);
        }
    })();
}