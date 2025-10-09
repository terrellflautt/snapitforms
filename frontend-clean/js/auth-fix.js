/**
 * SnapItForms Authentication Fix
 * Additional authentication handling and session management fixes
 */

// Ensure SnapITAuth is defined before use
window.SnapITAuth = window.SnapITAuth || {
    init: function() {
        console.log('SnapIT Auth initialized');
    },
    getToken: function() {
        return localStorage.getItem('snapit_auth_token') || sessionStorage.getItem('snapit_auth_token') || null;
    },
    setToken: function(token) {
        localStorage.setItem('snapit_auth_token', token);
        sessionStorage.setItem('snapit_auth_token', token);
    },
    clearToken: function() {
        localStorage.removeItem('snapit_auth_token');
        sessionStorage.removeItem('snapit_auth_token');
    },
    isAuthenticated: function() {
        return !!this.getToken();
    }
};

// Authentication state management
(function() {
    let authState = {
        isAuthenticated: false,
        user: null,
        tokens: {
            access: null,
            refresh: null
        },
        sessionExpiry: null
    };

    // Cross-tab communication for auth state
    const broadcastChannel = new BroadcastChannel('snapit_auth');

    // Listen for auth changes from other tabs
    broadcastChannel.addEventListener('message', (event) => {
        if (event.data.type === 'AUTH_STATE_CHANGED') {
            authState = event.data.state;
            handleAuthStateChange(authState);
        }
    });

    // Broadcast auth state changes
    function broadcastAuthChange(newState) {
        authState = newState;
        broadcastChannel.postMessage({
            type: 'AUTH_STATE_CHANGED',
            state: authState
        });
        handleAuthStateChange(authState);
    }

    // Handle auth state changes
    function handleAuthStateChange(state) {
        // Update UI elements
        updateAuthUI(state.isAuthenticated, state.user);

        // Update API headers
        updateAPIHeaders(state.tokens.access);

        // Handle session expiry
        if (state.sessionExpiry && Date.now() > state.sessionExpiry) {
            handleSessionExpiry();
        }
    }

    // Update UI based on auth state
    function updateAuthUI(isAuthenticated, user) {
        const authElements = document.querySelectorAll('[data-auth-state]');
        authElements.forEach(element => {
            const requiredState = element.getAttribute('data-auth-state');
            if (requiredState === 'authenticated' && isAuthenticated) {
                element.style.display = 'block';
            } else if (requiredState === 'unauthenticated' && !isAuthenticated) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });

        // Update user info elements
        if (user) {
            const userNameElements = document.querySelectorAll('[data-user-name]');
            userNameElements.forEach(element => {
                element.textContent = user.name || user.email || 'User';
            });

            const userEmailElements = document.querySelectorAll('[data-user-email]');
            userEmailElements.forEach(element => {
                element.textContent = user.email || '';
            });

            const userAvatarElements = document.querySelectorAll('[data-user-avatar]');
            userAvatarElements.forEach(element => {
                if (user.picture) {
                    element.src = user.picture;
                    element.style.display = 'block';
                }
            });
        }
    }

    // Update API headers for authenticated requests
    function updateAPIHeaders(accessToken) {
        if (accessToken) {
            // Set default headers for fetch requests
            const originalFetch = window.fetch;
            window.fetch = function(url, options = {}) {
                if (url.includes('api.snapitforms.com') || url.includes('snapitforms.com/api')) {
                    options.headers = {
                        ...options.headers,
                        'Authorization': `Bearer ${accessToken}`
                    };
                }
                return originalFetch(url, options);
            };
        }
    }

    // Handle session expiry
    function handleSessionExpiry() {
        console.log('Session expired, redirecting to login');

        // Clear all auth data
        localStorage.removeItem('snapit_user');
        localStorage.removeItem('snapit_jwt_token');
        localStorage.removeItem('snapit_auth_token');
        sessionStorage.removeItem('snapit_auth_token');

        // Reset auth state
        broadcastAuthChange({
            isAuthenticated: false,
            user: null,
            tokens: { access: null, refresh: null },
            sessionExpiry: null
        });

        // Show login prompt
        showLoginPrompt();
    }

    // Show login prompt
    function showLoginPrompt() {
        const loginModal = document.createElement('div');
        loginModal.className = 'auth-modal';
        loginModal.innerHTML = `
            <div class="auth-modal-content">
                <div class="auth-modal-header">
                    <h2>Session Expired</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="auth-modal-body">
                    <p>Your session has expired. Please sign in again to continue.</p>
                    <div id="google-signin-button"></div>
                </div>
            </div>
        `;

        // Add modal styles
        loginModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        document.body.appendChild(loginModal);

        // Close modal functionality
        const closeBtn = loginModal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(loginModal);
        });

        // Initialize Google Sign-In in the modal
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.renderButton(
                loginModal.querySelector('#google-signin-button'),
                {
                    theme: 'outline',
                    size: 'large',
                    text: 'sign_in_with',
                    width: 250
                }
            );
        }
    }

    // Token refresh mechanism
    async function refreshAuthToken() {
        const refreshToken = localStorage.getItem('snapit_refresh_token');
        if (!refreshToken) {
            handleSessionExpiry();
            return null;
        }

        try {
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refresh_token: refreshToken
                })
            });

            if (!response.ok) {
                throw new Error('Token refresh failed');
            }

            const data = await response.json();

            // Update tokens
            localStorage.setItem('snapit_auth_token', data.access_token);
            if (data.refresh_token) {
                localStorage.setItem('snapit_refresh_token', data.refresh_token);
            }

            // Update auth state
            broadcastAuthChange({
                isAuthenticated: true,
                user: authState.user,
                tokens: {
                    access: data.access_token,
                    refresh: data.refresh_token || refreshToken
                },
                sessionExpiry: Date.now() + (data.expires_in * 1000)
            });

            return data.access_token;
        } catch (error) {
            console.error('Token refresh failed:', error);
            handleSessionExpiry();
            return null;
        }
    }

    // Auto-refresh tokens before expiry
    function setupTokenRefresh() {
        const checkInterval = 5 * 60 * 1000; // Check every 5 minutes
        const refreshThreshold = 10 * 60 * 1000; // Refresh if expires within 10 minutes

        setInterval(() => {
            if (authState.isAuthenticated && authState.sessionExpiry) {
                const timeUntilExpiry = authState.sessionExpiry - Date.now();
                if (timeUntilExpiry < refreshThreshold) {
                    refreshAuthToken();
                }
            }
        }, checkInterval);
    }

    // Initialize auth state from stored data
    function initializeAuthState() {
        const storedUser = localStorage.getItem('snapit_user');
        const storedToken = localStorage.getItem('snapit_jwt_token');
        const authToken = localStorage.getItem('snapit_auth_token');

        if (storedUser && (storedToken || authToken)) {
            try {
                const user = JSON.parse(storedUser);
                authState = {
                    isAuthenticated: true,
                    user: user,
                    tokens: {
                        access: authToken || storedToken,
                        refresh: localStorage.getItem('snapit_refresh_token')
                    },
                    sessionExpiry: user.loginTime ? user.loginTime + (24 * 60 * 60 * 1000) : null // 24 hours
                };

                handleAuthStateChange(authState);
            } catch (error) {
                console.error('Failed to restore auth state:', error);
                handleSessionExpiry();
            }
        }
    }

    // Handle Google Sign-In callback override
    window.handleGoogleSignIn = function(response) {
        try {
            // Decode the JWT token
            const tokenParts = response.credential.split('.');
            const payload = JSON.parse(atob(tokenParts[1]));

            const user = {
                id: payload.sub,
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
                verified: payload.email_verified,
                loginTime: Date.now()
            };

            // Store user data
            localStorage.setItem('snapit_user', JSON.stringify(user));
            localStorage.setItem('snapit_jwt_token', response.credential);
            localStorage.setItem('snapit_auth_token', response.credential);

            // Update auth state
            broadcastAuthChange({
                isAuthenticated: true,
                user: user,
                tokens: {
                    access: response.credential,
                    refresh: null
                },
                sessionExpiry: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
            });

            // Track login event
            if (window.snapitAnalytics) {
                window.snapitAnalytics.trackEvent('user_login_fixed', {
                    method: 'google',
                    email: user.email,
                    verified: user.verified
                });
            }

            // Close any open login modals
            const authModals = document.querySelectorAll('.auth-modal');
            authModals.forEach(modal => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            });

            console.log('Authentication successful:', user);
        } catch (error) {
            console.error('Google Sign-In failed:', error);
            if (window.snapitAnalytics) {
                window.snapitAnalytics.trackEvent('auth_error_fixed', {
                    error: error.message
                });
            }
        }
    };

    // Sign out function
    window.snapitSignOut = function() {
        // Clear all stored data
        localStorage.removeItem('snapit_user');
        localStorage.removeItem('snapit_jwt_token');
        localStorage.removeItem('snapit_auth_token');
        localStorage.removeItem('snapit_refresh_token');
        sessionStorage.removeItem('snapit_auth_token');

        // Reset auth state
        broadcastAuthChange({
            isAuthenticated: false,
            user: null,
            tokens: { access: null, refresh: null },
            sessionExpiry: null
        });

        // Sign out from Google
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.disableAutoSelect();
        }

        // Track logout
        if (window.snapitAnalytics) {
            window.snapitAnalytics.trackEvent('user_logout_fixed', {
                timestamp: Date.now()
            });
        }

        console.log('User signed out successfully');
    };

    // Initialize everything when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeAuthState();
        setupTokenRefresh();

        // Setup sign-out buttons
        document.querySelectorAll('[data-auth-action="signout"]').forEach(button => {
            button.addEventListener('click', window.snapitSignOut);
        });
    });

    // Export auth utilities
    window.snapitAuthFix = {
        getAuthState: () => authState,
        refreshToken: refreshAuthToken,
        signOut: window.snapitSignOut,
        isAuthenticated: () => authState.isAuthenticated,
        getUser: () => authState.user,
        getAccessToken: () => authState.tokens.access
    };

})();

// Handle authentication errors and retries
(function() {
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    // Enhanced fetch with auth retry logic
    const originalFetch = window.fetch;
    window.fetch = function(url, options = {}) {
        // Only apply auth retry logic to SnapItForms API calls
        if (url.includes('api.snapitforms.com') || url.includes('snapitforms.com/api')) {
            return fetchWithAuthRetry(url, options, 0);
        }
        return originalFetch(url, options);
    };

    async function fetchWithAuthRetry(url, options, retryCount) {
        try {
            const response = await originalFetch(url, options);

            // If unauthorized and we haven't exceeded retry limit
            if (response.status === 401 && retryCount < maxRetries) {
                console.log(`Auth failed, attempting retry ${retryCount + 1}/${maxRetries}`);

                // Try to refresh the token
                const newToken = await window.snapitAuthFix.refreshToken();

                if (newToken) {
                    // Update the authorization header and retry
                    options.headers = {
                        ...options.headers,
                        'Authorization': `Bearer ${newToken}`
                    };

                    // Wait before retrying
                    await new Promise(resolve => setTimeout(resolve, retryDelay));

                    return fetchWithAuthRetry(url, options, retryCount + 1);
                }
            }

            return response;
        } catch (error) {
            // Network error - retry if we haven't exceeded limit
            if (retryCount < maxRetries) {
                console.log(`Network error, attempting retry ${retryCount + 1}/${maxRetries}`);
                await new Promise(resolve => setTimeout(resolve, retryDelay * (retryCount + 1)));
                return fetchWithAuthRetry(url, options, retryCount + 1);
            }
            throw error;
        }
    }
})();

console.log('SnapItForms Auth Fix loaded successfully');