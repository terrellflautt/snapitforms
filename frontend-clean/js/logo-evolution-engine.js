/**
 * Logo Evolution Engine - Dynamic Logo System
 * The logo that lives, breathes, and evolves with user interaction
 */

class LogoEvolutionEngine {
    constructor(userFingerprint, config) {
        this.userFingerprint = userFingerprint;
        this.config = config;
        this.currentState = {};
        this.evolutionHistory = [];
        this.activeVariants = new Set();
        this.seasonalOverrides = new Map();
        this.mysteryUnlocks = new Set();

        // Logo elements and mutations
        this.baseLogo = null;
        this.overlayElements = [];
        this.effectsLibrary = new Map();
        this.currentMutations = new Set();

        // Animation timelines
        this.animationQueue = [];
        this.activeAnimations = new Map();

        this.init();
    }

    async init() {
        try {
            // Load base logo and variations
            await this.loadLogoAssets();

            // Initialize effects library
            this.initializeEffectsLibrary();

            // Load user's logo evolution state
            await this.loadEvolutionState();

            // Apply current mutations
            this.applyCurrentMutations();

            // Start evolution monitoring
            this.startEvolutionMonitoring();

            console.log('🎨 Logo Evolution Engine initialized');
        } catch (error) {
            console.error('Logo Evolution Engine initialization failed:', error);
        }
    }

    async loadLogoAssets() {
        // Base SVG logo with mutation points
        this.baseLogo = {
            svg: await this.loadSVG('/images/snapit-logo-base.svg'),
            mutationPoints: [
                'core', 'accent', 'background', 'border', 'glow', 'particles'
            ],
            interactionElements: ['hover', 'click', 'focus']
        };

        // Load variation libraries
        this.logoVariations = {
            seasonal: await this.loadSeasonalVariations(),
            achievement: await this.loadAchievementVariations(),
            mystery: await this.loadMysteryVariations(),
            community: await this.loadCommunityVariations(),
            temporal: await this.loadTemporalVariations()
        };
    }

    async loadSVG(path) {
        try {
            const response = await fetch(path);
            const svgText = await response.text();
            const parser = new DOMParser();
            return parser.parseFromString(svgText, 'image/svg+xml').documentElement;
        } catch (error) {
            console.warn(`Could not load SVG: ${path}`, error);
            return this.createFallbackLogo();
        }
    }

    createFallbackLogo() {
        // Create a fallback SVG logo if assets fail to load
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('width', '100');
        svg.setAttribute('height', '100');

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '50');
        circle.setAttribute('cy', '50');
        circle.setAttribute('r', '40');
        circle.setAttribute('fill', '#aa336a');
        circle.setAttribute('class', 'logo-core');

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '50');
        text.setAttribute('y', '55');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-family', 'Inter');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('font-size', '16');
        text.textContent = 'S';

        svg.appendChild(circle);
        svg.appendChild(text);

        return svg;
    }

    async loadSeasonalVariations() {
        return {
            spring: {
                name: 'Blooming',
                effects: ['petal-fall', 'growth-animation', 'color-shift-green'],
                triggers: ['march-equinox', 'april-active', 'may-active'],
                overlays: ['flower-petals', 'leaf-growth']
            },
            summer: {
                name: 'Solar Flare',
                effects: ['sun-rays', 'heat-shimmer', 'bright-pulse'],
                triggers: ['june-solstice', 'july-active', 'august-active'],
                overlays: ['sun-rays', 'heat-waves']
            },
            autumn: {
                name: 'Falling Leaves',
                effects: ['leaf-fall', 'color-shift-orange', 'wind-sway'],
                triggers: ['september-equinox', 'october-active', 'november-active'],
                overlays: ['falling-leaves', 'autumn-colors']
            },
            winter: {
                name: 'Crystalline',
                effects: ['snowflake-fall', 'ice-crystals', 'cool-glow'],
                triggers: ['december-solstice', 'january-active', 'february-active'],
                overlays: ['snowflakes', 'ice-patterns']
            }
        };
    }

    async loadAchievementVariations() {
        return {
            'first-form': {
                name: 'Form Creator',
                mutation: 'add-blueprint-overlay',
                trigger: 'forms_created >= 1',
                description: 'First form created'
            },
            'form-master': {
                name: 'Form Architect',
                mutation: 'add-crown-element',
                trigger: 'forms_created >= 10',
                description: 'Created 10 forms'
            },
            'template-explorer': {
                name: 'Template Explorer',
                mutation: 'add-compass-element',
                trigger: 'templates_used >= 3',
                description: 'Used multiple templates'
            },
            'mystery-seeker': {
                name: 'Mystery Seeker',
                mutation: 'add-magnifying-glass',
                trigger: 'secrets_discovered >= 5',
                description: 'Discovered 5 secrets'
            },
            'platform-hopper': {
                name: 'Ecosystem Explorer',
                mutation: 'add-constellation-effect',
                trigger: 'platforms_visited >= 3',
                description: 'Visited multiple SnapIT platforms'
            },
            'time-keeper': {
                name: 'Temporal Guardian',
                mutation: 'add-clock-hands',
                trigger: 'time_mysteries >= 2',
                description: 'Discovered time-based mysteries'
            },
            'community-helper': {
                name: 'Community Champion',
                mutation: 'add-helping-hands',
                trigger: 'helped_others >= 5',
                description: 'Helped community members'
            }
        };
    }

    async loadMysteryVariations() {
        return {
            'whisper-heard': {
                name: 'First Whisper',
                mutation: 'add-subtle-glow',
                rarity: 'common',
                description: 'Heard the first whisper'
            },
            'pattern-master': {
                name: 'Pattern Recognition',
                mutation: 'add-geometric-overlay',
                rarity: 'uncommon',
                description: 'Mastered mouse patterns'
            },
            'time-traveler': {
                name: 'Temporal Anomaly',
                mutation: 'add-time-distortion',
                rarity: 'rare',
                description: 'Discovered time mysteries'
            },
            'reality-bender': {
                name: 'Reality Breach',
                mutation: 'add-glitch-effect',
                rarity: 'epic',
                description: 'Bent the fabric of reality'
            },
            'master-explorer': {
                name: 'Omniscient Eye',
                mutation: 'add-all-seeing-eye',
                rarity: 'legendary',
                description: 'Discovered the deepest mysteries'
            }
        };
    }

    async loadCommunityVariations() {
        return {
            'helper': {
                name: 'Helpful Spirit',
                mutation: 'add-halo-effect',
                description: 'Helped other users'
            },
            'mentor': {
                name: 'Wise Guide',
                mutation: 'add-wisdom-aura',
                description: 'Mentored community members'
            },
            'legend': {
                name: 'Living Legend',
                mutation: 'add-legendary-effects',
                description: 'Achieved legendary status'
            }
        };
    }

    async loadTemporalVariations() {
        return {
            'night-owl': {
                name: 'Nocturnal',
                mutation: 'add-moon-phases',
                trigger: 'active_hours: 22-06',
                description: 'Active during night hours'
            },
            'early-bird': {
                name: 'Dawn Seeker',
                mutation: 'add-sunrise-effect',
                trigger: 'active_hours: 06-09',
                description: 'Active during dawn'
            },
            'weekend-warrior': {
                name: 'Weekend Explorer',
                mutation: 'add-weekend-sparkles',
                trigger: 'weekend_activity_high',
                description: 'Most active on weekends'
            }
        };
    }

    initializeEffectsLibrary() {
        this.effectsLibrary = new Map([
            ['subtle-glow', this.createSubtleGlowEffect],
            ['petal-fall', this.createPetalFallEffect],
            ['sun-rays', this.createSunRaysEffect],
            ['snowflake-fall', this.createSnowflakeEffect],
            ['geometric-overlay', this.createGeometricOverlay],
            ['time-distortion', this.createTimeDistortionEffect],
            ['glitch-effect', this.createGlitchEffect],
            ['halo-effect', this.createHaloEffect],
            ['constellation-effect', this.createConstellationEffect],
            ['blueprint-overlay', this.createBlueprintOverlay],
            ['crown-element', this.createCrownElement],
            ['magnifying-glass', this.createMagnifyingGlass],
            ['all-seeing-eye', this.createAllSeeingEye]
        ]);
    }

    async loadEvolutionState() {
        try {
            const response = await fetch(`${this.config.apiBaseUrl}/mystery/logo-state`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fingerprint: this.userFingerprint })
            });

            if (response.ok) {
                const state = await response.json();
                this.currentState = state.logoState || {};
                this.activeVariants = new Set(state.activeVariants || []);
                this.mysteryUnlocks = new Set(state.mysteryUnlocks || []);
                this.evolutionHistory = state.evolutionHistory || [];
            }
        } catch (error) {
            console.warn('Could not load logo evolution state:', error);
        }
    }

    processDiscovery(secretId, metadata) {
        // Check if this discovery unlocks new logo variants
        const unlockedVariants = this.checkVariantUnlocks(secretId, metadata);

        unlockedVariants.forEach(variant => {
            this.unlockVariant(variant);
        });

        // Trigger temporary celebration effect
        this.triggerCelebrationEffect(secretId);

        // Schedule logo mutation check
        setTimeout(() => {
            this.checkForMutations();
        }, 1000);
    }

    checkVariantUnlocks(secretId, metadata) {
        const unlockedVariants = [];

        // Check mystery-based unlocks
        if (this.logoVariations.mystery) {
            Object.entries(this.logoVariations.mystery).forEach(([variantId, variant]) => {
                if (this.evaluateUnlockCondition(variant, secretId, metadata)) {
                    unlockedVariants.push({ type: 'mystery', id: variantId, variant });
                }
            });
        }

        // Check achievement-based unlocks
        if (this.logoVariations.achievement) {
            Object.entries(this.logoVariations.achievement).forEach(([variantId, variant]) => {
                if (this.evaluateAchievementCondition(variant, secretId, metadata)) {
                    unlockedVariants.push({ type: 'achievement', id: variantId, variant });
                }
            });
        }

        return unlockedVariants;
    }

    evaluateUnlockCondition(variant, secretId, metadata) {
        // Simple condition evaluation - can be expanded
        if (variant.trigger === secretId) {
            return true;
        }

        // Pattern-based conditions
        if (variant.trigger === 'any_secret' && secretId) {
            return true;
        }

        if (variant.trigger === 'mouse_pattern' && metadata.type === 'mouse_pattern') {
            return true;
        }

        return false;
    }

    evaluateAchievementCondition(variant, secretId, metadata) {
        // This would connect to user's actual achievement data
        // For now, simulate based on secret discoveries
        if (variant.trigger.includes('secrets_discovered') && this.mysteryUnlocks.size >= 5) {
            return true;
        }

        return false;
    }

    unlockVariant(variantData) {
        const variantKey = `${variantData.type}_${variantData.id}`;

        if (this.activeVariants.has(variantKey)) {
            return; // Already unlocked
        }

        this.activeVariants.add(variantKey);
        this.mysteryUnlocks.add(variantData.id);

        // Log the unlock
        console.log(`🎨 Logo variant unlocked: ${variantData.variant.name}`);

        // Trigger unlock animation
        this.triggerVariantUnlockAnimation(variantData);

        // Save state
        this.saveEvolutionState();
    }

    triggerVariantUnlockAnimation(variantData) {
        // Create unlock notification
        const unlockNotification = document.createElement('div');
        unlockNotification.className = 'logo-variant-unlock';
        unlockNotification.innerHTML = `
            <div class="unlock-content">
                <div class="unlock-icon">🎨</div>
                <div class="unlock-text">
                    <div class="unlock-title">Logo Evolution</div>
                    <div class="unlock-subtitle">${variantData.variant.name} unlocked!</div>
                </div>
            </div>
        `;

        unlockNotification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #aa336a, #ff6b8a);
            color: white;
            padding: 15px 25px;
            border-radius: 15px;
            font-family: 'Inter', sans-serif;
            z-index: 10003;
            animation: logoUnlockSlide 5s ease-in-out forwards;
            box-shadow: 0 15px 40px rgba(170, 51, 106, 0.3);
        `;

        // Add unlock animation
        if (!document.querySelector('#logo-unlock-animation')) {
            const unlockStyle = document.createElement('style');
            unlockStyle.id = 'logo-unlock-animation';
            unlockStyle.textContent = `
                @keyframes logoUnlockSlide {
                    0% { transform: translateX(-50%) translateY(-100px); opacity: 0; }
                    20% { transform: translateX(-50%) translateY(0); opacity: 1; }
                    80% { transform: translateX(-50%) translateY(0); opacity: 1; }
                    100% { transform: translateX(-50%) translateY(-100px); opacity: 0; }
                }
                .unlock-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .unlock-icon {
                    font-size: 24px;
                }
                .unlock-title {
                    font-weight: 600;
                    font-size: 14px;
                }
                .unlock-subtitle {
                    font-size: 12px;
                    opacity: 0.9;
                }
            `;
            document.head.appendChild(unlockStyle);
        }

        document.body.appendChild(unlockNotification);

        setTimeout(() => {
            if (unlockNotification.parentNode) {
                unlockNotification.parentNode.removeChild(unlockNotification);
            }
        }, 5000);
    }

    triggerCelebrationEffect(secretId) {
        // Trigger temporary logo celebration based on discovery type
        const logoElements = document.querySelectorAll('.snapit-logo, .logo, [class*="logo"]');

        logoElements.forEach(logo => {
            // Add temporary celebration class
            logo.classList.add('mystery-celebration');

            // Add particle burst effect
            this.addParticleBurst(logo);

            // Remove celebration after animation
            setTimeout(() => {
                logo.classList.remove('mystery-celebration');
            }, 3000);
        });

        // Add celebration styles if not exists
        if (!document.querySelector('#logo-celebration-styles')) {
            const celebrationStyle = document.createElement('style');
            celebrationStyle.id = 'logo-celebration-styles';
            celebrationStyle.textContent = `
                .mystery-celebration {
                    animation: mysteryCelebration 3s ease-in-out;
                    filter: drop-shadow(0 0 20px rgba(255, 107, 138, 0.6));
                }
                @keyframes mysteryCelebration {
                    0%, 100% { transform: scale(1) rotate(0deg); }
                    25% { transform: scale(1.1) rotate(5deg); }
                    50% { transform: scale(1.05) rotate(-3deg); }
                    75% { transform: scale(1.08) rotate(2deg); }
                }
            `;
            document.head.appendChild(celebrationStyle);
        }
    }

    addParticleBurst(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.textContent = '✨';
            particle.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                font-size: 16px;
                z-index: 10004;
                pointer-events: none;
                animation: particleBurst 2s ease-out forwards;
                animation-delay: ${i * 0.1}s;
            `;

            // Set random direction for each particle
            const angle = (360 / 8) * i;
            particle.style.setProperty('--angle', angle + 'deg');

            document.body.appendChild(particle);

            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2100);
        }

        // Add particle animation if not exists
        if (!document.querySelector('#particle-burst-animation')) {
            const particleStyle = document.createElement('style');
            particleStyle.id = 'particle-burst-animation';
            particleStyle.textContent = `
                @keyframes particleBurst {
                    0% {
                        transform: translate(0, 0) scale(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(
                            calc(cos(var(--angle)) * 100px),
                            calc(sin(var(--angle)) * 100px)
                        ) scale(1) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(particleStyle);
        }
    }

    checkForMutations() {
        // Check current conditions and apply appropriate mutations
        const currentMutations = this.calculateCurrentMutations();

        // Apply new mutations
        currentMutations.forEach(mutation => {
            if (!this.currentMutations.has(mutation)) {
                this.applyMutation(mutation);
                this.currentMutations.add(mutation);
            }
        });

        // Remove outdated mutations
        this.currentMutations.forEach(mutation => {
            if (!currentMutations.has(mutation)) {
                this.removeMutation(mutation);
                this.currentMutations.delete(mutation);
            }
        });
    }

    calculateCurrentMutations() {
        const mutations = new Set();

        // Seasonal mutations
        const currentSeason = this.getCurrentSeason();
        if (this.logoVariations.seasonal[currentSeason]) {
            mutations.add(`seasonal_${currentSeason}`);
        }

        // Time-based mutations
        const timeVariations = this.getTimeBasedVariations();
        timeVariations.forEach(variation => mutations.add(variation));

        // Achievement mutations
        this.activeVariants.forEach(variant => {
            if (variant.startsWith('achievement_')) {
                mutations.add(variant);
            }
        });

        // Mystery mutations
        this.activeVariants.forEach(variant => {
            if (variant.startsWith('mystery_')) {
                mutations.add(variant);
            }
        });

        return mutations;
    }

    getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'autumn';
        return 'winter';
    }

    getTimeBasedVariations() {
        const variations = [];
        const hour = new Date().getHours();

        if (hour >= 22 || hour <= 6) {
            variations.push('temporal_night-owl');
        } else if (hour >= 6 && hour <= 9) {
            variations.push('temporal_early-bird');
        }

        const day = new Date().getDay();
        if (day === 0 || day === 6) {
            variations.push('temporal_weekend-warrior');
        }

        return variations;
    }

    applyCurrentMutations() {
        const logoElements = document.querySelectorAll('.snapit-logo, .logo, [class*="logo"]');

        logoElements.forEach(logo => {
            this.enhanceLogo(logo);
        });
    }

    enhanceLogo(logoElement) {
        // Add mutation classes based on active variants
        this.currentMutations.forEach(mutation => {
            logoElement.classList.add(`logo-${mutation}`);
        });

        // Add interaction enhancements
        this.addLogoInteractivity(logoElement);

        // Apply current effects
        this.applyActiveEffects(logoElement);
    }

    addLogoInteractivity(logo) {
        // Mouse following effect (if unlocked)
        if (this.activeVariants.has('mystery_whisper-heard')) {
            this.addMouseFollowEffect(logo);
        }

        // Click effects (if unlocked)
        if (this.activeVariants.has('achievement_form-master')) {
            this.addClickEffects(logo);
        }

        // Hover mysteries
        this.addHoverMysteries(logo);
    }

    addMouseFollowEffect(logo) {
        let isActive = false;

        document.addEventListener('mousemove', (e) => {
            if (isActive) return;

            const rect = logo.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance < 200) {
                const rotateX = (deltaY / distance) * 3;
                const rotateY = (deltaX / distance) * -3;

                logo.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                logo.style.transition = 'transform 0.2s ease-out';

                isActive = true;
                setTimeout(() => {
                    isActive = false;
                }, 100);
            }
        });
    }

    addClickEffects(logo) {
        logo.addEventListener('click', (e) => {
            // Trigger special click effect
            const clickEffect = document.createElement('div');
            clickEffect.className = 'logo-click-effect';
            clickEffect.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                background: radial-gradient(circle, rgba(255,107,138,0.8) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                left: ${e.offsetX - 10}px;
                top: ${e.offsetY - 10}px;
                animation: logoClickRipple 1s ease-out forwards;
            `;

            logo.style.position = 'relative';
            logo.appendChild(clickEffect);

            setTimeout(() => {
                if (clickEffect.parentNode) {
                    clickEffect.parentNode.removeChild(clickEffect);
                }
            }, 1000);

            // Add click animation if not exists
            if (!document.querySelector('#logo-click-animation')) {
                const clickStyle = document.createElement('style');
                clickStyle.id = 'logo-click-animation';
                clickStyle.textContent = `
                    @keyframes logoClickRipple {
                        0% { transform: scale(0); opacity: 1; }
                        100% { transform: scale(10); opacity: 0; }
                    }
                `;
                document.head.appendChild(clickStyle);
            }
        });
    }

    addHoverMysteries(logo) {
        let hoverTimer = null;

        logo.addEventListener('mouseenter', () => {
            hoverTimer = setTimeout(() => {
                // Trigger hover mystery after 5 seconds
                if (window.SnapItMystery && !window.SnapItMystery.hasDiscovered('logo_patient_hover')) {
                    window.SnapItMystery.triggerCustomMystery('logo_patient_hover', {
                        type: 'logo_interaction',
                        interaction: 'patient_hover'
                    });
                }
            }, 5000);
        });

        logo.addEventListener('mouseleave', () => {
            if (hoverTimer) {
                clearTimeout(hoverTimer);
                hoverTimer = null;
            }
        });
    }

    applyActiveEffects(logoElement) {
        // Apply visual effects based on active variants
        this.activeVariants.forEach(variantKey => {
            const [type, id] = variantKey.split('_');
            const variant = this.logoVariations[type]?.[id];

            if (variant && variant.mutation) {
                const effectFunction = this.effectsLibrary.get(variant.mutation);
                if (effectFunction) {
                    effectFunction.call(this, logoElement);
                }
            }
        });
    }

    // Effect creation functions
    createSubtleGlowEffect(logoElement) {
        logoElement.style.filter = (logoElement.style.filter || '') + ' drop-shadow(0 0 10px rgba(255, 107, 138, 0.3))';
    }

    createPetalFallEffect(logoElement) {
        // Add animated falling petals around the logo
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance each interval
                this.addFallingPetal(logoElement);
            }
        }, 2000);
    }

    addFallingPetal(logoElement) {
        const petal = document.createElement('div');
        petal.textContent = '🌸';
        petal.style.cssText = `
            position: absolute;
            font-size: 12px;
            top: -20px;
            left: ${Math.random() * 100}%;
            animation: petalFall 4s linear forwards;
            pointer-events: none;
            z-index: 1;
        `;

        logoElement.style.position = 'relative';
        logoElement.appendChild(petal);

        setTimeout(() => {
            if (petal.parentNode) {
                petal.parentNode.removeChild(petal);
            }
        }, 4000);

        // Add petal animation if not exists
        if (!document.querySelector('#petal-fall-animation')) {
            const petalStyle = document.createElement('style');
            petalStyle.id = 'petal-fall-animation';
            petalStyle.textContent = `
                @keyframes petalFall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(200px) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(petalStyle);
        }
    }

    createBlueprintOverlay(logoElement) {
        // Add blueprint-style overlay
        const overlay = document.createElement('div');
        overlay.className = 'blueprint-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background:
                linear-gradient(90deg, transparent 95%, rgba(0, 150, 255, 0.2) 100%),
                linear-gradient(0deg, transparent 95%, rgba(0, 150, 255, 0.2) 100%);
            background-size: 10px 10px;
            pointer-events: none;
            opacity: 0.3;
        `;

        logoElement.style.position = 'relative';
        logoElement.appendChild(overlay);
    }

    createGlitchEffect(logoElement) {
        // Add digital glitch effect
        logoElement.style.animation = 'logoGlitch 0.5s infinite';

        if (!document.querySelector('#logo-glitch-animation')) {
            const glitchStyle = document.createElement('style');
            glitchStyle.id = 'logo-glitch-animation';
            glitchStyle.textContent = `
                @keyframes logoGlitch {
                    0%, 100% { transform: translate(0); }
                    10% { transform: translate(-2px, 2px); }
                    20% { transform: translate(2px, -2px); }
                    30% { transform: translate(-2px, -2px); }
                    40% { transform: translate(2px, 2px); }
                    50% { transform: translate(-2px, 2px); }
                    60% { transform: translate(2px, -2px); }
                    70% { transform: translate(-2px, -2px); }
                    80% { transform: translate(2px, 2px); }
                    90% { transform: translate(-2px, 2px); }
                }
            `;
            document.head.appendChild(glitchStyle);
        }
    }

    // Additional effect methods would go here...

    async saveEvolutionState() {
        try {
            await fetch(`${this.config.apiBaseUrl}/mystery/save-logo-state`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fingerprint: this.userFingerprint,
                    logoState: this.currentState,
                    activeVariants: Array.from(this.activeVariants),
                    mysteryUnlocks: Array.from(this.mysteryUnlocks),
                    evolutionHistory: this.evolutionHistory,
                    timestamp: Date.now()
                })
            });
        } catch (error) {
            console.warn('Could not save logo evolution state:', error);
        }
    }

    startEvolutionMonitoring() {
        // Monitor for new logos added to the page
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        const logos = node.querySelectorAll ?
                            node.querySelectorAll('.snapit-logo, .logo, [class*="logo"]') : [];

                        logos.forEach(logo => {
                            this.enhanceLogo(logo);
                        });

                        // Check if the node itself is a logo
                        if (node.matches && node.matches('.snapit-logo, .logo, [class*="logo"]')) {
                            this.enhanceLogo(node);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Public API
    getCurrentVariants() {
        return Array.from(this.activeVariants);
    }

    getEvolutionHistory() {
        return [...this.evolutionHistory];
    }

    previewVariant(variantId) {
        // Temporarily apply a variant for preview
        // Implementation for preview system
    }
}

// Export for use by mystery engine
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LogoEvolutionEngine;
}