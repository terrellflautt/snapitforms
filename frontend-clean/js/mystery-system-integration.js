/**
 * SnapIT Mystery System Integration
 * Simple integration script to add mystery system to existing SnapIT platforms
 */

(function() {
    'use strict';

    // Configuration for each platform
    const PLATFORM_CONFIGS = {
        snapitforms: {
            mysteries: ['form_field_coordinates', 'template_explorer', 'submission_counter'],
            logoVariants: ['form_creator', 'template_master', 'submission_wizard'],
            specialFeatures: ['form_generation_hints', 'template_secrets']
        },
        snapitanalytics: {
            mysteries: ['data_patterns', 'chart_secrets', 'insight_codes'],
            logoVariants: ['data_prophet', 'insight_master', 'chart_wizard'],
            specialFeatures: ['hidden_dashboards', 'predictive_easter_eggs']
        },
        snapitqr: {
            mysteries: ['qr_patterns', 'url_magic', 'code_artistry'],
            logoVariants: ['qr_artist', 'url_magician', 'pattern_master'],
            specialFeatures: ['secret_qr_generators', 'magic_url_shortcuts']
        },
        snapitsaas: {
            mysteries: ['community_secrets', 'forum_wisdom', 'collaboration_keys'],
            logoVariants: ['community_champion', 'wisdom_keeper', 'collaboration_master'],
            specialFeatures: ['secret_forums', 'mentor_access']
        },
        snapitagent: {
            mysteries: ['ai_consciousness', 'prompt_mastery', 'agent_secrets'],
            logoVariants: ['ai_whisperer', 'prompt_wizard', 'agent_master'],
            specialFeatures: ['advanced_ai_features', 'prompt_optimization']
        }
    };

    // Simple mystery integration for existing pages
    class SimpleMysteryIntegration {
        constructor() {
            this.platform = this.detectPlatform();
            this.config = PLATFORM_CONFIGS[this.platform] || PLATFORM_CONFIGS.snapitsaas;
            this.userFingerprint = null;
            this.initialized = false;

            this.init();
        }

        detectPlatform() {
            const hostname = window.location.hostname.toLowerCase();

            if (hostname.includes('forms')) return 'snapitforms';
            if (hostname.includes('analytics')) return 'snapitanalytics';
            if (hostname.includes('qr')) return 'snapitqr';
            if (hostname.includes('url')) return 'snapiturl';
            if (hostname.includes('agent')) return 'snapitagent';

            return 'snapitsaas';
        }

        async init() {
            try {
                // Generate simple fingerprint
                this.userFingerprint = await this.generateSimpleFingerprint();

                // Add basic mystery elements
                this.addBasicMysteries();

                // Enhance existing logos
                this.enhanceLogos();

                // Add platform-specific features
                this.addPlatformFeatures();

                // Start simple tracking
                this.startSimpleTracking();

                this.initialized = true;
                console.log(`🎭 Simple mystery system activated for ${this.platform}`);

            } catch (error) {
                console.warn('Mystery system could not initialize:', error);
            }
        }

        async generateSimpleFingerprint() {
            const data = [
                navigator.userAgent,
                screen.width + 'x' + screen.height,
                new Date().getTimezoneOffset(),
                navigator.language,
                Date.now()
            ].join('|');

            // Simple hash function
            let hash = 0;
            for (let i = 0; i < data.length; i++) {
                const char = data.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32-bit integer
            }

            return Math.abs(hash).toString(16);
        }

        addBasicMysteries() {
            // Add hover mystery to buttons
            this.addHoverMysteries();

            // Add click pattern detection
            this.addClickPatternDetection();

            // Add time-based mysteries
            this.addTimeMysteries();

            // Add scroll mysteries
            this.addScrollMysteries();
        }

        addHoverMysteries() {
            const buttons = document.querySelectorAll('button, .btn, a[role="button"]');

            buttons.forEach(button => {
                let hoverTimer = null;

                button.addEventListener('mouseenter', () => {
                    hoverTimer = setTimeout(() => {
                        this.triggerHoverMystery(button);
                    }, 7000); // 7 second hover
                });

                button.addEventListener('mouseleave', () => {
                    if (hoverTimer) {
                        clearTimeout(hoverTimer);
                        hoverTimer = null;
                    }
                });
            });
        }

        triggerHoverMystery(element) {
            if (localStorage.getItem('snapit_hover_mystery_discovered')) return;

            localStorage.setItem('snapit_hover_mystery_discovered', 'true');

            this.showMysteryMessage('✨ Patience reveals hidden wisdom...', element);

            // Enhance logo if present
            this.addLogoEnhancement('patience_master');
        }

        addClickPatternDetection() {
            let clickCount = 0;
            let clickTimer = null;

            document.addEventListener('click', () => {
                clickCount++;

                if (clickTimer) clearTimeout(clickTimer);

                clickTimer = setTimeout(() => {
                    if (clickCount >= 10) {
                        this.triggerClickPatternMystery(clickCount);
                    }
                    clickCount = 0;
                }, 5000);
            });
        }

        triggerClickPatternMystery(clickCount) {
            if (localStorage.getItem('snapit_click_pattern_discovered')) return;

            localStorage.setItem('snapit_click_pattern_discovered', 'true');

            this.showMysteryMessage('🌀 The rhythm of interaction unlocks secrets...', document.body);

            this.addLogoEnhancement('interaction_master');
        }

        addTimeMysteries() {
            setInterval(() => {
                const now = new Date();
                const timeString = now.toTimeString().split(' ')[0];

                // Magic times
                if (timeString === '11:11:11' || timeString === '22:22:22') {
                    this.triggerTimeMystery(timeString);
                }

                // Pi time
                if (timeString === '03:14:15' || timeString === '15:14:15') {
                    this.triggerPiTimeMystery();
                }
            }, 1000);
        }

        triggerTimeMystery(timeString) {
            const key = `snapit_time_mystery_${timeString.replace(/:/g, '')}`;
            if (localStorage.getItem(key)) return;

            localStorage.setItem(key, 'true');

            this.showMysteryMessage('⏰ Time itself becomes mystical...', document.body);

            this.addLogoEnhancement('time_keeper');
        }

        triggerPiTimeMystery() {
            if (localStorage.getItem('snapit_pi_time_discovered')) return;

            localStorage.setItem('snapit_pi_time_discovered', 'true');

            this.showMysteryMessage('🔢 The universe speaks in mathematical poetry...', document.body);

            this.addLogoEnhancement('mathematical_mind');
        }

        addScrollMysteries() {
            let maxScrollDepth = 0;

            window.addEventListener('scroll', this.throttle(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollDepth = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

                maxScrollDepth = Math.max(maxScrollDepth, scrollDepth);

                if (maxScrollDepth >= 95 && !localStorage.getItem('snapit_scroll_explorer_discovered')) {
                    localStorage.setItem('snapit_scroll_explorer_discovered', 'true');
                    this.showMysteryMessage('📜 The depths reveal their secrets to persistent explorers...', document.body);
                    this.addLogoEnhancement('deep_explorer');
                }
            }, 200));
        }

        enhanceLogos() {
            const logos = document.querySelectorAll('.snapit-logo, .logo, [class*="logo"], img[alt*="SnapIT"], img[alt*="logo"]');

            logos.forEach(logo => {
                this.makeLogoInteractive(logo);
                this.applyExistingEnhancements(logo);
            });
        }

        makeLogoInteractive(logo) {
            // Add subtle hover effect
            logo.style.transition = 'all 0.3s ease';
            logo.style.cursor = 'pointer';

            logo.addEventListener('mouseenter', () => {
                logo.style.transform = 'scale(1.05)';
                logo.style.filter = 'drop-shadow(0 0 10px rgba(255, 107, 138, 0.3))';
            });

            logo.addEventListener('mouseleave', () => {
                logo.style.transform = 'scale(1)';
                logo.style.filter = '';
            });

            // Add click effect
            logo.addEventListener('click', () => {
                this.triggerLogoClickMystery(logo);
            });
        }

        triggerLogoClickMystery(logo) {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: radial-gradient(circle, rgba(255,107,138,0.6) 0%, transparent 70%);
                border-radius: 50%;
                transform: scale(0);
                animation: logoRipple 1s ease-out;
                pointer-events: none;
                left: 50%;
                top: 50%;
                transform-origin: center;
            `;

            logo.style.position = 'relative';
            logo.appendChild(ripple);

            // Add ripple animation if not exists
            if (!document.querySelector('#logo-ripple-style')) {
                const style = document.createElement('style');
                style.id = 'logo-ripple-style';
                style.textContent = `
                    @keyframes logoRipple {
                        0% { transform: scale(0); opacity: 1; }
                        100% { transform: scale(20); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }

            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 1000);
        }

        applyExistingEnhancements(logo) {
            // Apply saved logo enhancements
            const enhancements = this.getSavedEnhancements();

            enhancements.forEach(enhancement => {
                this.applyLogoEnhancement(logo, enhancement);
            });
        }

        addLogoEnhancement(enhancementType) {
            // Save enhancement
            const saved = this.getSavedEnhancements();
            if (!saved.includes(enhancementType)) {
                saved.push(enhancementType);
                localStorage.setItem('snapit_logo_enhancements', JSON.stringify(saved));
            }

            // Apply to all logos
            const logos = document.querySelectorAll('.snapit-logo, .logo, [class*="logo"], img[alt*="SnapIT"], img[alt*="logo"]');
            logos.forEach(logo => {
                this.applyLogoEnhancement(logo, enhancementType);
            });
        }

        getSavedEnhancements() {
            const saved = localStorage.getItem('snapit_logo_enhancements');
            return saved ? JSON.parse(saved) : [];
        }

        applyLogoEnhancement(logo, enhancementType) {
            const enhancements = {
                patience_master: () => {
                    logo.style.filter = (logo.style.filter || '') + ' drop-shadow(0 0 8px rgba(255, 107, 138, 0.4))';
                },
                interaction_master: () => {
                    logo.style.animation = 'subtlePulse 3s ease-in-out infinite';
                },
                time_keeper: () => {
                    logo.style.transform = (logo.style.transform || '') + ' rotate(1deg)';
                },
                mathematical_mind: () => {
                    logo.style.background = 'linear-gradient(45deg, transparent 49%, rgba(255,107,138,0.1) 50%, transparent 51%)';
                },
                deep_explorer: () => {
                    logo.style.boxShadow = '0 0 20px rgba(170, 51, 106, 0.3)';
                }
            };

            if (enhancements[enhancementType]) {
                enhancements[enhancementType]();
            }

            // Add pulse animation if not exists
            if (!document.querySelector('#logo-enhancement-styles')) {
                const style = document.createElement('style');
                style.id = 'logo-enhancement-styles';
                style.textContent = `
                    @keyframes subtlePulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.8; }
                    }
                `;
                document.head.appendChild(style);
            }
        }

        addPlatformFeatures() {
            // Add platform-specific enhancements
            const features = this.config.specialFeatures;

            if (this.platform === 'snapitforms') {
                this.addFormMysteries();
            } else if (this.platform === 'snapitanalytics') {
                this.addAnalyticsMysteries();
            }

            // Add hidden elements to page
            this.addHiddenElements();
        }

        addFormMysteries() {
            // Add mysteries specific to forms platform
            const forms = document.querySelectorAll('form');

            forms.forEach(form => {
                // Add hidden coordinate fields
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = 'mystery_coordinate';
                hiddenField.value = this.generateMysteryCoordinate();
                form.appendChild(hiddenField);

                // Track form interactions
                form.addEventListener('submit', () => {
                    this.trackFormSubmission();
                });
            });
        }

        generateMysteryCoordinate() {
            // Generate coordinates that might be meaningful
            const mysteryCoords = [
                '40.7128,-74.0060', // NYC
                '37.7749,-122.4194', // SF
                '51.5074,-0.1278' // London
            ];

            return mysteryCoords[Math.floor(Math.random() * mysteryCoords.length)];
        }

        trackFormSubmission() {
            let count = parseInt(localStorage.getItem('snapit_form_submissions') || '0');
            count++;
            localStorage.setItem('snapit_form_submissions', count.toString());

            if (count === 7 && !localStorage.getItem('snapit_seven_forms_mystery')) {
                localStorage.setItem('snapit_seven_forms_mystery', 'true');
                this.showMysteryMessage('🎯 The seventh submission unlocks ancient pathways...', document.body);
                this.addLogoEnhancement('form_master');
            }
        }

        addHiddenElements() {
            // Add invisible mystery zones
            const zones = [
                { x: 0, y: 0, w: 30, h: 30, secret: 'corner_seeker' },
                { x: window.innerWidth - 30, y: 0, w: 30, h: 30, secret: 'top_right_finder' }
            ];

            zones.forEach(zone => {
                const element = document.createElement('div');
                element.style.cssText = `
                    position: fixed;
                    left: ${zone.x}px;
                    top: ${zone.y}px;
                    width: ${zone.w}px;
                    height: ${zone.h}px;
                    z-index: 9999;
                    opacity: 0;
                    cursor: pointer;
                `;

                element.addEventListener('click', () => {
                    this.triggerZoneMystery(zone.secret);
                });

                document.body.appendChild(element);
            });
        }

        triggerZoneMystery(secretId) {
            const key = `snapit_zone_${secretId}`;
            if (localStorage.getItem(key)) return;

            localStorage.setItem(key, 'true');

            this.showMysteryMessage('🔍 Hidden corners reveal their secrets to the curious...', document.body);
            this.addLogoEnhancement('zone_explorer');
        }

        startSimpleTracking() {
            // Simple session tracking
            const sessionStart = Date.now();

            // Track page visibility
            let totalFocusTime = 0;
            let lastFocusStart = sessionStart;

            window.addEventListener('focus', () => {
                lastFocusStart = Date.now();
            });

            window.addEventListener('blur', () => {
                totalFocusTime += Date.now() - lastFocusStart;
            });

            // Save session data before page unload
            window.addEventListener('beforeunload', () => {
                const sessionData = {
                    platform: this.platform,
                    duration: Date.now() - sessionStart,
                    focusTime: totalFocusTime + (Date.now() - lastFocusStart),
                    enhancements: this.getSavedEnhancements().length,
                    timestamp: Date.now()
                };

                localStorage.setItem('snapit_last_session', JSON.stringify(sessionData));
            });
        }

        showMysteryMessage(message, targetElement) {
            const messageEl = document.createElement('div');
            messageEl.className = 'snapit-mystery-message';
            messageEl.textContent = message;
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #aa336a, #ff6b8a);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                font-size: 14px;
                font-weight: 500;
                z-index: 10000;
                max-width: 300px;
                animation: mysterySlideIn 0.5s ease-out, mysterySlideOut 0.5s ease-in 4.5s forwards;
                box-shadow: 0 10px 30px rgba(170, 51, 106, 0.3);
            `;

            // Add animation styles if not exists
            if (!document.querySelector('#mystery-message-styles')) {
                const style = document.createElement('style');
                style.id = 'mystery-message-styles';
                style.textContent = `
                    @keyframes mysterySlideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes mysterySlideOut {
                        from { transform: translateX(0); opacity: 1; }
                        to { transform: translateX(100%); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }

            document.body.appendChild(messageEl);

            // Add sparkle effect
            this.addSparkleEffect();

            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 5000);
        }

        addSparkleEffect() {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const sparkle = document.createElement('div');
                    sparkle.textContent = '✨';
                    sparkle.style.cssText = `
                        position: fixed;
                        left: ${Math.random() * window.innerWidth}px;
                        top: ${Math.random() * window.innerHeight}px;
                        font-size: ${Math.random() * 16 + 8}px;
                        z-index: 9999;
                        pointer-events: none;
                        animation: sparkleFloat 2s ease-out forwards;
                    `;

                    document.body.appendChild(sparkle);

                    setTimeout(() => {
                        if (sparkle.parentNode) {
                            sparkle.parentNode.removeChild(sparkle);
                        }
                    }, 2000);
                }, i * 100);
            }

            // Add sparkle animation if not exists
            if (!document.querySelector('#sparkle-styles')) {
                const style = document.createElement('style');
                style.id = 'sparkle-styles';
                style.textContent = `
                    @keyframes sparkleFloat {
                        0% { opacity: 0; transform: translateY(0) scale(0); }
                        20% { opacity: 1; transform: translateY(-10px) scale(1); }
                        100% { opacity: 0; transform: translateY(-50px) scale(0); }
                    }
                `;
                document.head.appendChild(style);
            }
        }

        throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }

        // Public API
        getStats() {
            return {
                platform: this.platform,
                enhancements: this.getSavedEnhancements(),
                sessionData: JSON.parse(localStorage.getItem('snapit_last_session') || '{}'),
                mysteriesDiscovered: Object.keys(localStorage).filter(key => key.startsWith('snapit_') && key.includes('_discovered')).length
            };
        }

        triggerTestMystery() {
            this.showMysteryMessage('🎭 Test mystery activated! The system is working perfectly.', document.body);
            this.addLogoEnhancement('test_master');
        }
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.SnapItSimpleMystery = new SimpleMysteryIntegration();
        });
    } else {
        window.SnapItSimpleMystery = new SimpleMysteryIntegration();
    }

    // Debug helper
    window.snapitMysteryDebug = {
        triggerTest: () => window.SnapItSimpleMystery?.triggerTestMystery(),
        getStats: () => window.SnapItSimpleMystery?.getStats(),
        clearData: () => {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('snapit_')) {
                    localStorage.removeItem(key);
                }
            });
            location.reload();
        }
    };

})();