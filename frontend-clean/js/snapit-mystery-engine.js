/**
 * SnapIT Mystery Engine - Core Hidden Games System
 * Revolutionary engagement ecosystem that transforms every interaction into a mystery
 */

class SnapItMysteryEngine {
    constructor() {
        this.version = "1.0.0";
        this.initialized = false;
        this.userFingerprint = null;
        this.mysteryLevel = 1;
        this.discoveredSecrets = new Set();
        this.activeEvents = new Map();

        // Core components
        this.logoEvolution = null;
        this.scavengerHunt = null;
        this.engagementEngine = null;
        this.crossPlatformTracker = null;

        // Configuration
        this.config = {
            apiBaseUrl: 'https://api.snapitforms.com',
            mysteryCooldown: 30000, // 30 seconds between major reveals
            logoMutationInterval: 60000, // Logo checks for changes every minute
            secretDetectionSensitivity: 0.7,
            communityEventThreshold: 100 // Users needed to trigger ecosystem events
        };

        this.init();
    }

    async init() {
        if (this.initialized) return;

        try {
            // Generate unique user fingerprint
            this.userFingerprint = await this.generateUserFingerprint();

            // Initialize core systems
            await this.initializeComponents();

            // Load user's mystery state
            await this.loadUserMysteryState();

            // Start background processes
            this.startMysteryProcesses();

            this.initialized = true;
            this.logMysteryEvent('system_initialized', { fingerprint: this.userFingerprint });

        } catch (error) {
            console.error('Mystery Engine initialization failed:', error);
        }
    }

    async generateUserFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('SnapIT Mystery Fingerprint', 2, 2);

        const fingerprint = {
            canvas: canvas.toDataURL(),
            screen: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
            platform: navigator.platform,
            timestamp: Date.now(),
            sessionId: this.generateSessionId(),
            mysteryHash: this.calculateMysteryHash()
        };

        // Create cryptographic hash of fingerprint
        const encoder = new TextEncoder();
        const data = encoder.encode(JSON.stringify(fingerprint));
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        return hashHex.substring(0, 16); // Use first 16 characters as unique ID
    }

    generateSessionId() {
        return 'mystery_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    calculateMysteryHash() {
        // Create a hash based on current page elements and user interaction patterns
        const pageElements = Array.from(document.querySelectorAll('*')).slice(0, 50);
        const elementData = pageElements.map(el => el.tagName + el.className).join('');
        return btoa(elementData).substring(0, 12);
    }

    async initializeComponents() {
        // Initialize Logo Evolution System
        this.logoEvolution = new LogoEvolutionEngine(this.userFingerprint, this.config);

        // Initialize Scavenger Hunt System
        this.scavengerHunt = new ScavengerHuntEngine(this.userFingerprint, this.config);

        // Initialize Engagement Engine
        this.engagementEngine = new AutonomousEngagementEngine(this.userFingerprint, this.config);

        // Initialize Cross-Platform Tracker
        this.crossPlatformTracker = new CrossPlatformTracker(this.userFingerprint, this.config);

        await Promise.all([
            this.logoEvolution.init(),
            this.scavengerHunt.init(),
            this.engagementEngine.init(),
            this.crossPlatformTracker.init()
        ]);
    }

    async loadUserMysteryState() {
        try {
            const response = await fetch(`${this.config.apiBaseUrl}/mystery/user-state`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fingerprint: this.userFingerprint })
            });

            if (response.ok) {
                const mysteryState = await response.json();
                this.mysteryLevel = mysteryState.level || 1;
                this.discoveredSecrets = new Set(mysteryState.discoveredSecrets || []);

                // Restore component states
                if (mysteryState.logoEvolution) {
                    this.logoEvolution.restoreState(mysteryState.logoEvolution);
                }
                if (mysteryState.scavengerProgress) {
                    this.scavengerHunt.restoreProgress(mysteryState.scavengerProgress);
                }
            }
        } catch (error) {
            console.warn('Could not load mystery state:', error);
            // Continue with default state
        }
    }

    startMysteryProcesses() {
        // Logo mutation checker
        setInterval(() => {
            this.logoEvolution.checkForMutations();
        }, this.config.logoMutationInterval);

        // Mystery event scanner
        setInterval(() => {
            this.scanForMysteryEvents();
        }, 5000);

        // Engagement analyzer
        setInterval(() => {
            this.engagementEngine.analyzeCurrentSession();
        }, 10000);

        // Cross-platform synchronizer
        setInterval(() => {
            this.crossPlatformTracker.synchronize();
        }, 30000);

        // Start passive mystery detection
        this.initializeMysteryDetection();
    }

    initializeMysteryDetection() {
        // Mouse movement mysteries
        this.setupMouseMysteries();

        // Time-based mysteries
        this.setupTimeMysteries();

        // Interaction pattern mysteries
        this.setupInteractionMysteries();

        // Hidden element mysteries
        this.setupHiddenElementMysteries();
    }

    setupMouseMysteries() {
        let mouseTrail = [];
        let idleTimer = null;

        document.addEventListener('mousemove', (e) => {
            mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });

            // Keep only recent movements
            if (mouseTrail.length > 50) {
                mouseTrail = mouseTrail.slice(-50);
            }

            // Check for mysterious patterns
            this.analyzeMousePattern(mouseTrail);

            // Reset idle timer
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                this.triggerIdleMystery();
            }, 30000);
        });

        // Logo following effect
        const logos = document.querySelectorAll('.snapit-logo, .logo, [class*="logo"]');
        logos.forEach(logo => {
            this.addLogoFollowEffect(logo);
        });
    }

    analyzeMousePattern(trail) {
        if (trail.length < 10) return;

        // Check for specific patterns
        const patterns = {
            circle: this.detectCircularMotion(trail),
            figure8: this.detectFigureEight(trail),
            spiral: this.detectSpiral(trail),
            konami: this.detectKonamiPattern(trail)
        };

        Object.entries(patterns).forEach(([pattern, detected]) => {
            if (detected && !this.discoveredSecrets.has(`mouse_${pattern}`)) {
                this.triggerSecretDiscovery(`mouse_${pattern}`, {
                    type: 'mouse_pattern',
                    pattern: pattern,
                    coordinates: trail.slice(-10)
                });
            }
        });
    }

    detectCircularMotion(trail) {
        if (trail.length < 20) return false;

        const recent = trail.slice(-20);
        const center = this.calculateCenter(recent);
        const distances = recent.map(point =>
            Math.sqrt(Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2))
        );

        const avgDistance = distances.reduce((a, b) => a + b) / distances.length;
        const variance = distances.reduce((sum, d) => sum + Math.pow(d - avgDistance, 2), 0) / distances.length;

        return variance < 100 && avgDistance > 30; // Relatively circular with reasonable radius
    }

    detectFigureEight(trail) {
        // Implementation for figure-8 detection
        // Complex pattern analysis for infinity symbol movement
        return false; // Placeholder
    }

    detectSpiral(trail) {
        // Implementation for spiral pattern detection
        return false; // Placeholder
    }

    detectKonamiPattern(trail) {
        // Check for up-up-down-down-left-right-left-right pattern in mouse movements
        return false; // Placeholder
    }

    calculateCenter(points) {
        const x = points.reduce((sum, p) => sum + p.x, 0) / points.length;
        const y = points.reduce((sum, p) => sum + p.y, 0) / points.length;
        return { x, y };
    }

    addLogoFollowEffect(logo) {
        let isFollowing = false;

        document.addEventListener('mousemove', (e) => {
            if (!isFollowing && this.mysteryLevel >= 2) {
                const rect = logo.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const deltaX = e.clientX - centerX;
                const deltaY = e.clientY - centerY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                if (distance < 200) {
                    const rotateX = (deltaY / distance) * 5;
                    const rotateY = (deltaX / distance) * -5;

                    logo.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                    logo.style.transition = 'transform 0.1s ease-out';
                }
            }
        });
    }

    setupTimeMysteries() {
        // Check for special times
        setInterval(() => {
            const now = new Date();
            const timeString = now.toTimeString().split(' ')[0];

            // Palindrome times (like 12:21:21)
            if (this.isPalindromeTime(timeString)) {
                this.triggerTimeMystery('palindrome_time', timeString);
            }

            // Magic numbers (11:11, 22:22, etc.)
            if (this.isMagicTime(timeString)) {
                this.triggerTimeMystery('magic_time', timeString);
            }

            // Pi time (3:14:15)
            if (timeString === '03:14:15' || timeString === '15:14:15') {
                this.triggerTimeMystery('pi_time', timeString);
            }

        }, 1000);
    }

    isPalindromeTime(timeString) {
        const cleaned = timeString.replace(/:/g, '');
        return cleaned === cleaned.split('').reverse().join('');
    }

    isMagicTime(timeString) {
        const magicTimes = ['11:11:11', '22:22:22', '12:34:56', '01:23:45'];
        return magicTimes.includes(timeString);
    }

    setupInteractionMysteries() {
        // Long hover mysteries
        let hoverTimer = null;

        document.addEventListener('mouseenter', (e) => {
            if (e.target.matches('button, .btn, a, [onclick]')) {
                hoverTimer = setTimeout(() => {
                    this.triggerHoverMystery(e.target);
                }, 7000); // 7 second hover
            }
        }, true);

        document.addEventListener('mouseleave', () => {
            if (hoverTimer) {
                clearTimeout(hoverTimer);
                hoverTimer = null;
            }
        }, true);

        // Rapid click mysteries
        let clickCount = 0;
        let clickTimer = null;

        document.addEventListener('click', (e) => {
            clickCount++;

            if (clickTimer) clearTimeout(clickTimer);

            clickTimer = setTimeout(() => {
                if (clickCount >= 10) {
                    this.triggerRapidClickMystery(clickCount);
                }
                clickCount = 0;
            }, 5000);
        });

        // Keyboard combinations
        let keySequence = [];

        document.addEventListener('keydown', (e) => {
            keySequence.push(e.key);

            if (keySequence.length > 10) {
                keySequence = keySequence.slice(-10);
            }

            this.checkKeySequences(keySequence);
        });
    }

    triggerHoverMystery(element) {
        if (this.discoveredSecrets.has('hover_patience')) return;

        // Create mystical whisper effect
        const whisper = document.createElement('div');
        whisper.className = 'mystery-whisper';
        whisper.textContent = 'The builders leave marks for other builders...';
        whisper.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: #ff6b8a;
            padding: 20px;
            border-radius: 10px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 2s ease-in-out;
            pointer-events: none;
            box-shadow: 0 0 30px rgba(255, 107, 138, 0.3);
        `;

        document.body.appendChild(whisper);

        setTimeout(() => {
            whisper.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            whisper.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(whisper);
            }, 2000);
        }, 5000);

        this.triggerSecretDiscovery('hover_patience', {
            type: 'interaction_mystery',
            element: element.tagName,
            message: 'First whisper heard'
        });
    }

    setupHiddenElementMysteries() {
        // Scan for hidden elements that become clickable under certain conditions
        this.scanForHiddenTriggers();

        // Add invisible mystery zones
        this.addInvisibleMysteryZones();

        // Scan HTML comments for clues
        this.scanCommentsForClues();
    }

    scanForHiddenTriggers() {
        const hiddenElements = document.querySelectorAll('[data-mystery], [class*="hidden"], [style*="display: none"]');

        hiddenElements.forEach(element => {
            // Add mystery interaction
            element.addEventListener('click', (e) => {
                if (this.mysteryLevel >= element.dataset.requiredLevel || 1) {
                    this.activateHiddenElement(element);
                }
            });
        });
    }

    addInvisibleMysteryZones() {
        // Add invisible clickable areas that reveal secrets
        const zones = [
            { x: 0, y: 0, width: 50, height: 50, secret: 'corner_explorer' },
            { x: window.innerWidth - 50, y: 0, width: 50, height: 50, secret: 'corner_seeker' },
            { x: window.innerWidth / 2 - 25, y: window.innerHeight / 2 - 25, width: 50, height: 50, secret: 'center_finder' }
        ];

        zones.forEach(zone => {
            const mysteryZone = document.createElement('div');
            mysteryZone.style.cssText = `
                position: fixed;
                left: ${zone.x}px;
                top: ${zone.y}px;
                width: ${zone.width}px;
                height: ${zone.height}px;
                z-index: 9999;
                opacity: 0;
                cursor: pointer;
                background: transparent;
            `;

            mysteryZone.addEventListener('click', () => {
                this.triggerSecretDiscovery(zone.secret, {
                    type: 'hidden_zone',
                    location: { x: zone.x, y: zone.y }
                });
            });

            document.body.appendChild(mysteryZone);
        });
    }

    scanCommentsForClues() {
        // Scan HTML comments for hidden clues
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_COMMENT,
            null,
            false
        );

        const comments = [];
        let node;

        while (node = walker.nextNode()) {
            comments.push(node.nodeValue.trim());
        }

        comments.forEach(comment => {
            if (comment.includes('mystery:') || comment.includes('secret:') || comment.includes('clue:')) {
                this.parseCommentClue(comment);
            }
        });
    }

    parseCommentClue(comment) {
        // Parse structured clues from comments
        // Format: <!-- mystery:coordinate_clue data:40.7128,-74.0060 next:snapitanalytics.com/hidden -->

        const mysteryMatch = comment.match(/mystery:(\w+)/);
        const dataMatch = comment.match(/data:([^\\s]+)/);
        const nextMatch = comment.match(/next:([^\\s]+)/);

        if (mysteryMatch) {
            const mysteryId = mysteryMatch[1];
            const data = dataMatch ? dataMatch[1] : null;
            const nextUrl = nextMatch ? nextMatch[1] : null;

            this.registerCommentClue(mysteryId, { data, nextUrl, comment });
        }
    }

    async triggerSecretDiscovery(secretId, metadata = {}) {
        if (this.discoveredSecrets.has(secretId)) return;

        this.discoveredSecrets.add(secretId);

        // Log the discovery
        this.logMysteryEvent('secret_discovered', {
            secretId,
            metadata,
            timestamp: Date.now(),
            mysteryLevel: this.mysteryLevel
        });

        // Update user progress
        await this.updateUserProgress();

        // Trigger visual feedback
        this.showSecretDiscoveryEffect(secretId, metadata);

        // Check for level up
        this.checkLevelUp();

        // Trigger logo evolution
        this.logoEvolution.processDiscovery(secretId, metadata);

        // Update scavenger hunt progress
        this.scavengerHunt.processDiscovery(secretId, metadata);
    }

    showSecretDiscoveryEffect(secretId, metadata) {
        // Create mystical discovery effect
        const effect = document.createElement('div');
        effect.className = 'secret-discovery-effect';

        const messages = {
            'hover_patience': '✨ Patience reveals hidden wisdom',
            'mouse_circle': '🌀 The circle of mystery completes',
            'corner_explorer': '🔍 Hidden corners hold ancient secrets',
            'pi_time': '🔢 The universe speaks in numbers',
            'magic_time': '⏰ Time itself becomes mystical'
        };

        effect.textContent = messages[secretId] || '🎭 A new mystery unfolds...';
        effect.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff6b8a, #aa336a);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            z-index: 10001;
            animation: mysteryReveal 4s ease-in-out forwards;
            box-shadow: 0 10px 30px rgba(255, 107, 138, 0.3);
        `;

        // Add mystical animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes mysteryReveal {
                0% { transform: translateX(400px) scale(0.8); opacity: 0; }
                20% { transform: translateX(0) scale(1.1); opacity: 1; }
                80% { transform: translateX(0) scale(1); opacity: 1; }
                100% { transform: translateX(400px) scale(0.8); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(effect);

        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 4000);

        // Add sparkle effects
        this.addSparkleEffect();
    }

    addSparkleEffect() {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.textContent = '✨';
                sparkle.style.cssText = `
                    position: fixed;
                    left: ${Math.random() * window.innerWidth}px;
                    top: ${Math.random() * window.innerHeight}px;
                    font-size: ${Math.random() * 20 + 10}px;
                    z-index: 10000;
                    pointer-events: none;
                    animation: sparkleFloat 3s ease-out forwards;
                `;

                document.body.appendChild(sparkle);

                setTimeout(() => {
                    if (sparkle.parentNode) {
                        sparkle.parentNode.removeChild(sparkle);
                    }
                }, 3000);
            }, i * 200);
        }

        // Add sparkle animation if not exists
        if (!document.querySelector('#sparkle-animation')) {
            const sparkleStyle = document.createElement('style');
            sparkleStyle.id = 'sparkle-animation';
            sparkleStyle.textContent = `
                @keyframes sparkleFloat {
                    0% { opacity: 0; transform: translateY(0) rotate(0deg) scale(0); }
                    20% { opacity: 1; transform: translateY(-20px) rotate(90deg) scale(1); }
                    100% { opacity: 0; transform: translateY(-100px) rotate(360deg) scale(0); }
                }
            `;
            document.head.appendChild(sparkleStyle);
        }
    }

    checkLevelUp() {
        const previousLevel = this.mysteryLevel;
        const newLevel = Math.floor(this.discoveredSecrets.size / 5) + 1; // Level up every 5 secrets

        if (newLevel > previousLevel) {
            this.mysteryLevel = newLevel;
            this.triggerLevelUp(newLevel);
        }
    }

    triggerLevelUp(newLevel) {
        this.logMysteryEvent('level_up', { newLevel, secretsDiscovered: this.discoveredSecrets.size });

        // Show level up effect
        const levelUpEffect = document.createElement('div');
        levelUpEffect.textContent = `🎭 Mystery Level ${newLevel} Unlocked!`;
        levelUpEffect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #aa336a, #ff6b8a);
            color: white;
            padding: 30px 40px;
            border-radius: 20px;
            font-family: 'Inter', sans-serif;
            font-size: 24px;
            font-weight: bold;
            z-index: 10002;
            animation: levelUpReveal 5s ease-in-out forwards;
            box-shadow: 0 20px 50px rgba(170, 51, 106, 0.4);
            text-align: center;
        `;

        document.body.appendChild(levelUpEffect);

        setTimeout(() => {
            if (levelUpEffect.parentNode) {
                levelUpEffect.parentNode.removeChild(levelUpEffect);
            }
        }, 5000);

        // Unlock new features based on level
        this.unlockLevelFeatures(newLevel);
    }

    unlockLevelFeatures(level) {
        const features = {
            2: () => {
                this.enableLogoFollowing();
                this.revealHiddenMenuItems();
            },
            3: () => {
                this.enableCrossPlatformClues();
                this.unlockSecretDashboard();
            },
            5: () => {
                this.enableTimeManipulation();
                this.unlockMysteryCreation();
            },
            10: () => {
                this.enableRealityBending();
                this.unlockMasterMysteries();
            }
        };

        if (features[level]) {
            features[level]();
        }
    }

    async updateUserProgress() {
        try {
            await fetch(`${this.config.apiBaseUrl}/mystery/update-progress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fingerprint: this.userFingerprint,
                    mysteryLevel: this.mysteryLevel,
                    discoveredSecrets: Array.from(this.discoveredSecrets),
                    timestamp: Date.now()
                })
            });
        } catch (error) {
            console.warn('Could not update mystery progress:', error);
        }
    }

    logMysteryEvent(eventType, data) {
        // Log to console for debugging
        console.log(`🎭 Mystery Event: ${eventType}`, data);

        // Send to analytics (implement your analytics here)
        if (window.gtag) {
            gtag('event', 'mystery_interaction', {
                event_category: 'hidden_games',
                event_label: eventType,
                custom_parameter_1: this.mysteryLevel,
                custom_parameter_2: this.discoveredSecrets.size
            });
        }

        // Store in local history
        const mysteryHistory = JSON.parse(localStorage.getItem('snapit_mystery_history') || '[]');
        mysteryHistory.push({
            type: eventType,
            data: data,
            timestamp: Date.now(),
            level: this.mysteryLevel
        });

        // Keep only last 100 events
        if (mysteryHistory.length > 100) {
            mysteryHistory.splice(0, mysteryHistory.length - 100);
        }

        localStorage.setItem('snapit_mystery_history', JSON.stringify(mysteryHistory));
    }

    // Public API for triggering mysteries from external code
    triggerCustomMystery(mysteryId, data = {}) {
        this.triggerSecretDiscovery(mysteryId, { ...data, source: 'custom_trigger' });
    }

    // Get current mystery state
    getMysteryState() {
        return {
            level: this.mysteryLevel,
            secretsDiscovered: this.discoveredSecrets.size,
            userFingerprint: this.userFingerprint,
            initialized: this.initialized
        };
    }

    // Check if specific secret is discovered
    hasDiscovered(secretId) {
        return this.discoveredSecrets.has(secretId);
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.SnapItMystery = new SnapItMysteryEngine();
    });
} else {
    window.SnapItMystery = new SnapItMysteryEngine();
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SnapItMysteryEngine;
}