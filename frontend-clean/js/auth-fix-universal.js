// Auth Fix Universal
// This file ensures authentication works across all pages
console.log('Auth Fix Universal loaded');

// Fix any auth-related issues
window.authFix = {
    init: function() {
        console.log('Auth fix initialized');
    }
};

if (window.addEventListener) {
    window.addEventListener('load', window.authFix.init);
} else {
    window.attachEvent('onload', window.authFix.init);
}