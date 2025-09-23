// Mobile UX Enhancements for SnapitForms
// Optimized for touch interactions and mobile-first experience

class MobileUXManager {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.isTouch = 'ontouchstart' in window;
        this.init();
    }

    init() {
        this.setupTouchOptimizations();
        this.setupMobileNavigation();
        this.setupOnboarding();
        this.setupMobileModals();
        this.setupSwipeGestures();
        this.handleOrientationChange();
    }

    // Touch-optimized interactions
    setupTouchOptimizations() {
        if (!this.isTouch) return;

        // Add touch-friendly hover states
        document.addEventListener('touchstart', (e) => {
            const target = e.target.closest('button, .btn, .card, .template-card');
            if (target) {
                target.classList.add('touch-active');
            }
        });

        document.addEventListener('touchend', (e) => {
            setTimeout(() => {
                document.querySelectorAll('.touch-active').forEach(el => {
                    el.classList.remove('touch-active');
                });
            }, 150);
        });

        // Prevent zoom on double tap for form inputs
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = new Date().getTime();
            if (now - lastTouchEnd <= 300) {
                const target = e.target;
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
                    e.preventDefault();
                }
            }
            lastTouchEnd = now;
        }, false);

        // Add haptic feedback for supported devices
        this.addHapticFeedback();
    }

    // Enhanced mobile navigation
    setupMobileNavigation() {
        const nav = document.querySelector('.navbar');
        if (!nav) return;

        // Create mobile menu toggle
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-menu-toggle';
        mobileToggle.innerHTML = `
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        `;
        mobileToggle.setAttribute('aria-label', 'Toggle mobile menu');

        const navMenu = nav.querySelector('.nav-menu');
        if (navMenu && this.isMobile) {
            nav.insertBefore(mobileToggle, navMenu);
            navMenu.classList.add('mobile-hidden');

            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('mobile-hidden');
                mobileToggle.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!nav.contains(e.target) && !navMenu.classList.contains('mobile-hidden')) {
                    navMenu.classList.add('mobile-hidden');
                    mobileToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        }

        // Sticky navbar optimization for mobile
        this.setupStickyNav(nav);
    }

    // Interactive onboarding system
    setupOnboarding() {
        // Check if user has seen onboarding
        if (localStorage.getItem('snapit_onboarding_completed')) {
            return;
        }

        // Create onboarding overlay
        const onboarding = document.createElement('div');
        onboarding.className = 'onboarding-overlay';
        onboarding.innerHTML = `
            <div class="onboarding-content">
                <div class="onboarding-steps">
                    <div class="onboarding-step active" data-step="1">
                        <div class="step-content">
                            <div class="step-icon">🚀</div>
                            <h3>Welcome to SnapitForms!</h3>
                            <p>Create professional forms in minutes without any coding. Let's get you started!</p>
                            <div class="step-actions">
                                <button class="btn btn-primary" onclick="snapitMobile.nextOnboardingStep()">Get Started</button>
                                <button class="btn btn-outline" onclick="snapitMobile.skipOnboarding()">Skip Tour</button>
                            </div>
                        </div>
                    </div>

                    <div class="onboarding-step" data-step="2">
                        <div class="step-content">
                            <div class="step-icon">📧</div>
                            <h3>Sign Up for Free</h3>
                            <p>Get 500 free form submissions per month. No credit card required!</p>
                            <div class="step-actions">
                                <button class="btn btn-primary" onclick="snapitMobile.triggerSignup()">Sign Up Now</button>
                                <button class="btn btn-outline" onclick="snapitMobile.nextOnboardingStep()">Learn More First</button>
                            </div>
                        </div>
                    </div>

                    <div class="onboarding-step" data-step="3">
                        <div class="step-content">
                            <div class="step-icon">🎨</div>
                            <h3>Choose a Template</h3>
                            <p>Start with one of our 100+ professional templates or build from scratch.</p>
                            <div class="step-actions">
                                <button class="btn btn-primary" onclick="snapitMobile.openTemplates()">Browse Templates</button>
                                <button class="btn btn-outline" onclick="snapitMobile.openFormBuilder()">Build Custom Form</button>
                            </div>
                        </div>
                    </div>

                    <div class="onboarding-step" data-step="4">
                        <div class="step-content">
                            <div class="step-icon">⚡</div>
                            <h3>Deploy Instantly</h3>
                            <p>Copy the generated code and paste it into your website. Forms work immediately!</p>
                            <div class="step-actions">
                                <button class="btn btn-primary" onclick="snapitMobile.completeOnboarding()">Start Building</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="onboarding-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 25%"></div>
                    </div>
                    <span class="progress-text">Step 1 of 4</span>
                </div>
            </div>
        `;

        document.body.appendChild(onboarding);
        this.currentOnboardingStep = 1;

        // Show onboarding after a short delay
        setTimeout(() => {
            onboarding.classList.add('visible');
        }, 1000);
    }

    // Mobile-optimized modals
    setupMobileModals() {
        // Make modals full-screen on mobile
        if (this.isMobile) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.classList.contains('modal')) {
                            node.classList.add('mobile-fullscreen');
                        }
                    });
                });
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }

        // Add swipe-to-dismiss for modals
        this.setupModalSwipeGestures();
    }

    // Swipe gesture support
    setupSwipeGestures() {
        let startX, startY, endX, endY;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe(startX, startY, endX, endY, e.target);
        });
    }

    handleSwipe(startX, startY, endX, endY, target) {
        const diffX = endX - startX;
        const diffY = endY - startY;
        const threshold = 50;

        // Swipe right to go back in onboarding
        if (diffX > threshold && Math.abs(diffY) < threshold) {
            if (target.closest('.onboarding-overlay')) {
                this.previousOnboardingStep();
            }
        }

        // Swipe left to advance in onboarding
        if (diffX < -threshold && Math.abs(diffY) < threshold) {
            if (target.closest('.onboarding-overlay')) {
                this.nextOnboardingStep();
            }
        }

        // Swipe down to dismiss modal
        if (diffY > threshold && Math.abs(diffX) < threshold) {
            const modal = target.closest('.modal');
            if (modal && modal.classList.contains('mobile-fullscreen')) {
                modal.style.display = 'none';
            }
        }
    }

    // Orientation change handling
    handleOrientationChange() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.recalculateLayout();
            }, 100);
        });

        window.addEventListener('resize', this.debounce(() => {
            this.isMobile = window.innerWidth <= 768;
            this.recalculateLayout();
        }, 250));
    }

    // Onboarding navigation methods
    nextOnboardingStep() {
        if (this.currentOnboardingStep < 4) {
            this.showOnboardingStep(this.currentOnboardingStep + 1);
        }
    }

    previousOnboardingStep() {
        if (this.currentOnboardingStep > 1) {
            this.showOnboardingStep(this.currentOnboardingStep - 1);
        }
    }

    showOnboardingStep(step) {
        const steps = document.querySelectorAll('.onboarding-step');
        steps.forEach(stepEl => stepEl.classList.remove('active'));

        const targetStep = document.querySelector(`[data-step="${step}"]`);
        if (targetStep) {
            targetStep.classList.add('active');
            this.currentOnboardingStep = step;

            // Update progress
            const progressFill = document.querySelector('.progress-fill');
            const progressText = document.querySelector('.progress-text');
            if (progressFill && progressText) {
                progressFill.style.width = `${(step / 4) * 100}%`;
                progressText.textContent = `Step ${step} of 4`;
            }
        }
    }

    triggerSignup() {
        this.completeOnboarding();
        if (typeof google !== 'undefined') {
            google.accounts.id.prompt();
        }
    }

    openTemplates() {
        this.completeOnboarding();
        if (typeof openTemplateGallery === 'function') {
            openTemplateGallery();
        } else {
            window.location.href = '/templates.html';
        }
    }

    openFormBuilder() {
        this.completeOnboarding();
        if (typeof openFormGenerator === 'function') {
            openFormGenerator();
        } else {
            window.location.href = '/form-generator.html';
        }
    }

    skipOnboarding() {
        this.completeOnboarding();
    }

    completeOnboarding() {
        const overlay = document.querySelector('.onboarding-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            setTimeout(() => overlay.remove(), 300);
        }
        localStorage.setItem('snapit_onboarding_completed', 'true');
    }

    // Sticky navigation optimization
    setupStickyNav(nav) {
        let lastScrollTop = 0;
        let navHeight = nav.offsetHeight;

        window.addEventListener('scroll', this.debounce(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > navHeight) {
                if (scrollTop > lastScrollTop) {
                    // Scrolling down - hide nav
                    nav.style.transform = `translateY(-${navHeight}px)`;
                } else {
                    // Scrolling up - show nav
                    nav.style.transform = 'translateY(0)';
                }
            }

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, 10));
    }

    // Modal swipe gestures
    setupModalSwipeGestures() {
        document.addEventListener('touchstart', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                this.modalTouchStart = {
                    y: e.touches[0].clientY,
                    scrollTop: modal.scrollTop
                };
            }
        });

        document.addEventListener('touchmove', (e) => {
            const modal = e.target.closest('.modal');
            if (modal && this.modalTouchStart) {
                const deltaY = e.touches[0].clientY - this.modalTouchStart.y;
                if (modal.scrollTop === 0 && deltaY > 0) {
                    modal.style.transform = `translateY(${Math.min(deltaY / 2, 100)}px)`;
                }
            }
        });

        document.addEventListener('touchend', (e) => {
            const modal = e.target.closest('.modal');
            if (modal && this.modalTouchStart) {
                const deltaY = e.changedTouches[0].clientY - this.modalTouchStart.y;
                if (deltaY > 100) {
                    modal.style.display = 'none';
                }
                modal.style.transform = '';
                this.modalTouchStart = null;
            }
        });
    }

    // Add haptic feedback
    addHapticFeedback() {
        if ('vibrate' in navigator) {
            document.addEventListener('click', (e) => {
                const target = e.target.closest('button, .btn');
                if (target) {
                    navigator.vibrate(10); // Short vibration
                }
            });
        }
    }

    // Layout recalculation
    recalculateLayout() {
        // Force recalculation of viewport height for mobile browsers
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        // Adjust modal heights
        document.querySelectorAll('.modal').forEach(modal => {
            if (this.isMobile) {
                modal.style.height = `${window.innerHeight}px`;
            } else {
                modal.style.height = '';
            }
        });
    }

    // Utility: Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Show mobile-specific notifications
    showMobileNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `mobile-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-text">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);

        // Animate in
        setTimeout(() => notification.classList.add('visible'), 10);
    }

    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    // Progressive Web App prompt
    setupPWAPrompt() {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;

            // Show install prompt after user interacts with the app
            setTimeout(() => {
                this.showPWAInstallPrompt(deferredPrompt);
            }, 30000); // Show after 30 seconds
        });
    }

    showPWAInstallPrompt(deferredPrompt) {
        const installPrompt = document.createElement('div');
        installPrompt.className = 'pwa-install-prompt';
        installPrompt.innerHTML = `
            <div class="install-prompt-content">
                <div class="install-icon">📱</div>
                <h3>Install SnapitForms</h3>
                <p>Add to your home screen for quick access!</p>
                <div class="install-actions">
                    <button class="btn btn-primary install-btn">Install</button>
                    <button class="btn btn-outline dismiss-btn">Not Now</button>
                </div>
            </div>
        `;

        document.body.appendChild(installPrompt);

        // Handle install
        installPrompt.querySelector('.install-btn').addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                deferredPrompt = null;
            }
            installPrompt.remove();
        });

        // Handle dismiss
        installPrompt.querySelector('.dismiss-btn').addEventListener('click', () => {
            installPrompt.remove();
            localStorage.setItem('pwa_install_dismissed', 'true');
        });

        // Show with animation
        setTimeout(() => installPrompt.classList.add('visible'), 100);
    }
}

// Initialize mobile UX manager
let snapitMobile;
document.addEventListener('DOMContentLoaded', () => {
    snapitMobile = new MobileUXManager();
});

// Make it globally available
window.snapitMobile = snapitMobile;