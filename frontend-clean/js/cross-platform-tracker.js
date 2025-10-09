/**
 * Cross-Platform Tracker - Universal SnapIT Ecosystem Consciousness
 * Tracks user journey across all SnapIT platforms and synchronizes mystery state
 */

class CrossPlatformTracker {
    constructor(userFingerprint, config) {
        this.userFingerprint = userFingerprint;
        this.config = config;
        this.currentPlatform = this.detectCurrentPlatform();
        this.sessionData = {};
        this.crossPlatformState = {};
        this.syncQueue = [];
        this.syncInProgress = false;

        // Platform detection patterns
        this.platformPatterns = {
            snapitforms: ['snapitforms.com', 'forms.snapit', 'localhost:3001'],
            snapitanalytics: ['snapitanalytics.com', 'analytics.snapit'],
            snapitqr: ['snapitqr.com', 'qr.snapit'],
            snapiturl: ['snapiturl.com', 'url.snapit'],
            snapitsaas: ['snapitsaas.com', 'saas.snapit'],
            snapitagent: ['snapitagent.com', 'agent.snapit']
        };

        // Cross-platform mystery coordination
        this.platformSecrets = new Map();
        this.crossPlatformQuests = new Map();
        this.ecosystemEvents = new Map();

        this.init();
    }

    async init() {
        try {
            // Initialize platform detection
            this.currentPlatform = this.detectCurrentPlatform();

            // Load cross-platform state
            await this.loadCrossPlatformState();

            // Start session tracking
            this.startSessionTracking();

            // Initialize platform-specific features
            await this.initializePlatformFeatures();

            // Start synchronization
            this.startPeriodicSync();

            // Set up cross-platform communication
            this.setupCrossPlatformMessaging();

            console.log(`🌐 Cross-Platform Tracker initialized for ${this.currentPlatform}`);
        } catch (error) {
            console.error('Cross-Platform Tracker initialization failed:', error);
        }
    }

    detectCurrentPlatform() {
        const hostname = window.location.hostname.toLowerCase();
        const pathname = window.location.pathname.toLowerCase();

        // Check exact domain matches first
        for (const [platform, patterns] of Object.entries(this.platformPatterns)) {
            for (const pattern of patterns) {
                if (hostname.includes(pattern)) {
                    return platform;
                }
            }
        }

        // Check for subdomain patterns
        if (hostname.includes('forms')) return 'snapitforms';
        if (hostname.includes('analytics')) return 'snapitanalytics';
        if (hostname.includes('qr')) return 'snapitqr';
        if (hostname.includes('url')) return 'snapiturl';
        if (hostname.includes('saas')) return 'snapitsaas';
        if (hostname.includes('agent')) return 'snapitagent';

        // Default fallback
        return 'snapitsaas';
    }

    async loadCrossPlatformState() {
        try {
            // Load from localStorage first
            const localState = localStorage.getItem('snapit_cross_platform_state');
            if (localState) {
                this.crossPlatformState = JSON.parse(localState);
            }

            // Load from server
            const response = await fetch(`${this.config.apiBaseUrl}/mystery/cross-platform-state`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fingerprint: this.userFingerprint })
            });

            if (response.ok) {
                const serverState = await response.json();
                this.crossPlatformState = { ...this.crossPlatformState, ...serverState };
                this.saveCrossPlatformState();
            }

            // Initialize platform-specific data if missing
            if (!this.crossPlatformState.platforms) {
                this.crossPlatformState.platforms = {};
            }

            if (!this.crossPlatformState.platforms[this.currentPlatform]) {
                this.crossPlatformState.platforms[this.currentPlatform] = {
                    firstVisit: new Date().toISOString(),
                    visitCount: 0,
                    totalTimeSpent: 0,
                    secretsDiscovered: [],
                    achievementsUnlocked: [],
                    lastActivity: new Date().toISOString()
                };
            }

        } catch (error) {
            console.warn('Could not load cross-platform state:', error);
            this.initializeDefaultState();
        }
    }

    initializeDefaultState() {
        this.crossPlatformState = {
            platforms: {
                [this.currentPlatform]: {
                    firstVisit: new Date().toISOString(),
                    visitCount: 0,
                    totalTimeSpent: 0,
                    secretsDiscovered: [],
                    achievementsUnlocked: [],
                    lastActivity: new Date().toISOString()
                }
            },
            crossPlatformSecrets: [],
            ecosystemQuests: [],
            globalAchievements: [],
            lastSync: new Date().toISOString()
        };
    }

    startSessionTracking() {
        this.sessionData = {
            platform: this.currentPlatform,
            startTime: Date.now(),
            interactions: [],
            pagesVisited: [window.location.pathname],
            secretsDiscovered: [],
            timeSpent: 0,
            activityEvents: []
        };

        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseSessionTracking();
            } else {
                this.resumeSessionTracking();
            }
        });

        // Track page unload
        window.addEventListener('beforeunload', () => {
            this.endSession();
        });

        // Track route changes (for SPAs)
        this.setupRouteTracking();

        // Track user interactions
        this.setupInteractionTracking();

        // Update visit count
        this.crossPlatformState.platforms[this.currentPlatform].visitCount++;
        this.crossPlatformState.platforms[this.currentPlatform].lastActivity = new Date().toISOString();
    }

    setupRouteTracking() {
        // Track hash changes
        window.addEventListener('hashchange', () => {
            this.trackPageVisit(window.location.pathname + window.location.hash);
        });

        // Track pushState/popState for SPAs
        const originalPushState = history.pushState;
        const originalPopState = history.popState;

        history.pushState = function(state, title, url) {
            originalPushState.apply(history, arguments);
            setTimeout(() => {
                this.trackPageVisit(url || window.location.pathname);
            }, 0);
        }.bind(this);

        window.addEventListener('popstate', () => {
            this.trackPageVisit(window.location.pathname);
        });
    }

    trackPageVisit(path) {
        if (!this.sessionData.pagesVisited.includes(path)) {
            this.sessionData.pagesVisited.push(path);
            this.sessionData.activityEvents.push({
                type: 'page_visit',
                path: path,
                timestamp: Date.now()
            });

            // Check for platform-specific mysteries on new pages
            this.checkPageMysteries(path);
        }
    }

    setupInteractionTracking() {
        // Track clicks
        document.addEventListener('click', (e) => {
            this.trackInteraction('click', {
                element: e.target.tagName,
                className: e.target.className,
                id: e.target.id,
                coordinates: { x: e.clientX, y: e.clientY }
            });
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            this.trackInteraction('form_submit', {
                formId: e.target.id,
                formClass: e.target.className,
                fieldCount: e.target.elements.length
            });
        });

        // Track key interactions
        document.addEventListener('keydown', (e) => {
            // Only track special key combinations
            if (e.ctrlKey || e.metaKey || e.altKey) {
                this.trackInteraction('key_combination', {
                    key: e.key,
                    ctrlKey: e.ctrlKey,
                    metaKey: e.metaKey,
                    altKey: e.altKey
                });
            }
        });
    }

    trackInteraction(type, data) {
        this.sessionData.interactions.push({
            type: type,
            data: data,
            timestamp: Date.now(),
            platform: this.currentPlatform
        });

        this.sessionData.activityEvents.push({
            type: 'interaction',
            interactionType: type,
            timestamp: Date.now()
        });

        // Check for interaction-based mysteries
        this.checkInteractionMysteries(type, data);
    }

    async initializePlatformFeatures() {
        const platformFeatures = {
            snapitforms: () => this.initializeFormsFeatures(),
            snapitanalytics: () => this.initializeAnalyticsFeatures(),
            snapitqr: () => this.initializeQRFeatures(),
            snapiturl: () => this.initializeURLFeatures(),
            snapitsaas: () => this.initializeSaaSFeatures(),
            snapitagent: () => this.initializeAgentFeatures()
        };

        const initFunction = platformFeatures[this.currentPlatform];
        if (initFunction) {
            await initFunction();
        }
    }

    async initializeFormsFeatures() {
        // Forms-specific mystery features
        this.setupFormMysteries();
        this.setupTemplateTracking();
        this.setupFieldMysteries();

        // Check for cross-platform form clues
        this.loadCrossPlatformFormClues();
    }

    setupFormMysteries() {
        // Hidden form field mysteries
        const mysteriesConfig = {
            'hidden_field_coordinate': {
                trigger: 'form_field_id_pattern',
                pattern: /coord_(\d+)_(\d+)/,
                reward: 'coordinate_clue'
            },
            'submission_count_mystery': {
                trigger: 'form_submissions',
                threshold: 7,
                reward: 'analytics_portal_key'
            },
            'template_master': {
                trigger: 'templates_used',
                threshold: 5,
                reward: 'template_architect_badge'
            }
        };

        Object.entries(mysteriesConfig).forEach(([mysteryId, config]) => {
            this.platformSecrets.set(mysteryId, config);
        });

        // Monitor form creation
        this.observeFormActivity();
    }

    observeFormActivity() {
        // Watch for form creation/editing
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && (node.tagName === 'FORM' || node.querySelector('form'))) {
                        this.analyzeNewForm(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    analyzeNewForm(formElement) {
        const form = formElement.tagName === 'FORM' ? formElement : formElement.querySelector('form');
        if (!form) return;

        // Analyze form for mystery patterns
        const fields = Array.from(form.elements);
        const fieldIds = fields.map(field => field.id || field.name).filter(Boolean);

        // Check for coordinate patterns
        fieldIds.forEach(id => {
            const coordMatch = id.match(/coord_(\d+)_(\d+)/);
            if (coordMatch) {
                this.triggerPlatformSecret('hidden_field_coordinate', {
                    coordinates: [parseInt(coordMatch[1]), parseInt(coordMatch[2])],
                    formId: form.id
                });
            }
        });

        // Track form complexity
        this.trackInteraction('form_created', {
            fieldCount: fields.length,
            fieldTypes: fields.map(f => f.type).filter(Boolean),
            hasCoordinateFields: fieldIds.some(id => id.includes('coord'))
        });
    }

    async initializeAnalyticsFeatures() {
        this.setupAnalyticsMysteries();
        this.setupDataInsightTracking();
        this.setupChartMysteries();
    }

    setupAnalyticsMysteries() {
        const analyticsSecrets = {
            'data_prophet': {
                trigger: 'chart_prediction_accuracy',
                threshold: 0.9,
                reward: 'prophet_crown_logo'
            },
            'insight_master': {
                trigger: 'insights_generated',
                threshold: 10,
                reward: 'wisdom_aura_effect'
            },
            'dashboard_architect': {
                trigger: 'dashboards_created',
                threshold: 3,
                reward: 'architect_blueprint_overlay'
            }
        };

        Object.entries(analyticsSecrets).forEach(([secretId, config]) => {
            this.platformSecrets.set(secretId, config);
        });
    }

    async initializeQRFeatures() {
        this.setupQRMysteries();
        this.setupQRPatternDetection();
    }

    setupQRMysteries() {
        const qrSecrets = {
            'qr_artist': {
                trigger: 'qr_codes_created',
                threshold: 10,
                reward: 'pixel_art_logo_effect'
            },
            'url_magician': {
                trigger: 'urls_shortened',
                threshold: 25,
                reward: 'magic_wand_cursor'
            },
            'pattern_master': {
                trigger: 'qr_pattern_discovery',
                pattern: 'fibonacci_sequence',
                reward: 'mathematical_overlay'
            }
        };

        Object.entries(qrSecrets).forEach(([secretId, config]) => {
            this.platformSecrets.set(secretId, config);
        });
    }

    async initializeSaaSFeatures() {
        this.setupCommunityMysteries();
        this.setupForumTracking();
    }

    setupCommunityMysteries() {
        const communitySecrets = {
            'helpful_spirit': {
                trigger: 'helpful_votes_received',
                threshold: 10,
                reward: 'halo_effect_logo'
            },
            'wisdom_keeper': {
                trigger: 'forum_posts',
                threshold: 20,
                reward: 'wisdom_keeper_badge'
            },
            'community_champion': {
                trigger: 'users_helped',
                threshold: 5,
                reward: 'champion_crown'
            }
        };

        Object.entries(communitySecrets).forEach(([secretId, config]) => {
            this.platformSecrets.set(secretId, config);
        });
    }

    async initializeAgentFeatures() {
        this.setupAIMysteries();
        this.setupPromptTracking();
    }

    setupAIMysteries() {
        const aiSecrets = {
            'prompt_wizard': {
                trigger: 'successful_prompts',
                threshold: 50,
                reward: 'wizard_hat_logo'
            },
            'ai_whisperer': {
                trigger: 'agent_conversations',
                threshold: 100,
                reward: 'neural_network_overlay'
            },
            'automation_master': {
                trigger: 'workflows_created',
                threshold: 10,
                reward: 'gear_animation_effect'
            }
        };

        Object.entries(aiSecrets).forEach(([secretId, config]) => {
            this.platformSecrets.set(secretId, config);
        });
    }

    checkPageMysteries(path) {
        // Check for page-specific mysteries
        const pageMysteries = {
            '/dashboard': 'dashboard_explorer',
            '/templates': 'template_seeker',
            '/analytics': 'data_diver',
            '/settings': 'customization_expert',
            '/community': 'social_butterfly'
        };

        Object.entries(pageMysteries).forEach(([pagePath, mysteryId]) => {
            if (path.includes(pagePath)) {
                this.triggerPlatformSecret(mysteryId, { path: path });
            }
        });
    }

    checkInteractionMysteries(type, data) {
        // Check for interaction-based mysteries
        if (type === 'form_submit') {
            this.checkFormSubmissionMysteries(data);
        } else if (type === 'click') {
            this.checkClickMysteries(data);
        } else if (type === 'key_combination') {
            this.checkKeyboardMysteries(data);
        }
    }

    checkFormSubmissionMysteries(data) {
        // Count form submissions for platform
        const platformData = this.crossPlatformState.platforms[this.currentPlatform];
        platformData.formSubmissions = (platformData.formSubmissions || 0) + 1;

        // Check thresholds
        if (platformData.formSubmissions === 7) {
            this.triggerPlatformSecret('submission_count_mystery', {
                submissionCount: platformData.formSubmissions
            });
        }
    }

    checkClickMysteries(data) {
        // Pattern detection for click sequences
        this.sessionData.clickSequence = this.sessionData.clickSequence || [];
        this.sessionData.clickSequence.push({
            element: data.element,
            coordinates: data.coordinates,
            timestamp: Date.now()
        });

        // Keep only recent clicks
        if (this.sessionData.clickSequence.length > 10) {
            this.sessionData.clickSequence = this.sessionData.clickSequence.slice(-10);
        }

        // Check for special click patterns
        this.analyzeClickPatterns();
    }

    analyzeClickPatterns() {
        const sequence = this.sessionData.clickSequence;
        if (sequence.length < 5) return;

        // Check for geometric patterns
        const coordinates = sequence.slice(-5).map(click => click.coordinates);

        if (this.isCircularPattern(coordinates)) {
            this.triggerPlatformSecret('circular_click_pattern', { coordinates });
        } else if (this.isZigzagPattern(coordinates)) {
            this.triggerPlatformSecret('zigzag_click_pattern', { coordinates });
        }
    }

    isCircularPattern(coordinates) {
        // Simple circular pattern detection
        if (coordinates.length < 5) return false;

        const center = {
            x: coordinates.reduce((sum, coord) => sum + coord.x, 0) / coordinates.length,
            y: coordinates.reduce((sum, coord) => sum + coord.y, 0) / coordinates.length
        };

        const distances = coordinates.map(coord =>
            Math.sqrt(Math.pow(coord.x - center.x, 2) + Math.pow(coord.y - center.y, 2))
        );

        const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
        const variance = distances.reduce((sum, d) => sum + Math.pow(d - avgDistance, 2), 0) / distances.length;

        return variance < 200 && avgDistance > 20;
    }

    isZigzagPattern(coordinates) {
        // Check for alternating up/down pattern
        if (coordinates.length < 5) return false;

        const yDirections = [];
        for (let i = 1; i < coordinates.length; i++) {
            const direction = coordinates[i].y > coordinates[i - 1].y ? 'down' : 'up';
            yDirections.push(direction);
        }

        // Check if directions alternate
        for (let i = 1; i < yDirections.length; i++) {
            if (yDirections[i] === yDirections[i - 1]) {
                return false;
            }
        }

        return true;
    }

    triggerPlatformSecret(secretId, metadata) {
        if (this.crossPlatformState.platforms[this.currentPlatform].secretsDiscovered.includes(secretId)) {
            return; // Already discovered
        }

        // Add to discovered secrets
        this.crossPlatformState.platforms[this.currentPlatform].secretsDiscovered.push(secretId);
        this.sessionData.secretsDiscovered.push(secretId);

        // Trigger global mystery system if available
        if (window.SnapItMystery) {
            window.SnapItMystery.triggerCustomMystery(secretId, {
                ...metadata,
                platform: this.currentPlatform,
                source: 'cross_platform_tracker'
            });
        }

        // Queue for synchronization
        this.queueSync({
            type: 'secret_discovery',
            secretId: secretId,
            platform: this.currentPlatform,
            metadata: metadata,
            timestamp: Date.now()
        });

        // Check for cross-platform quest completion
        this.checkCrossPlatformQuestProgress(secretId);
    }

    checkCrossPlatformQuestProgress(secretId) {
        // Check if this secret contributes to any cross-platform quests
        this.crossPlatformQuests.forEach((quest, questId) => {
            if (quest.requiredSecrets.includes(secretId) && !quest.completed) {
                quest.discoveredSecrets = quest.discoveredSecrets || [];
                if (!quest.discoveredSecrets.includes(secretId)) {
                    quest.discoveredSecrets.push(secretId);

                    // Check if quest is complete
                    if (quest.discoveredSecrets.length >= quest.requiredSecrets.length) {
                        this.completeCrossPlatformQuest(questId, quest);
                    }
                }
            }
        });
    }

    completeCrossPlatformQuest(questId, quest) {
        quest.completed = true;
        quest.completedAt = new Date().toISOString();

        // Trigger quest completion rewards
        if (window.SnapItMystery) {
            window.SnapItMystery.triggerCustomMystery(`cross_platform_quest_${questId}`, {
                questId: questId,
                quest: quest,
                reward: quest.reward,
                source: 'cross_platform_quest'
            });
        }

        // Queue for synchronization
        this.queueSync({
            type: 'quest_completion',
            questId: questId,
            quest: quest,
            timestamp: Date.now()
        });
    }

    pauseSessionTracking() {
        if (this.sessionTrackingPaused) return;

        this.sessionTrackingPaused = true;
        this.sessionPauseTime = Date.now();
    }

    resumeSessionTracking() {
        if (!this.sessionTrackingPaused) return;

        this.sessionTrackingPaused = false;
        const pauseDuration = Date.now() - this.sessionPauseTime;

        // Don't count pause time as active time
        this.sessionData.pauseDuration = (this.sessionData.pauseDuration || 0) + pauseDuration;
    }

    endSession() {
        if (this.sessionEnded) return;

        this.sessionEnded = true;
        const sessionEnd = Date.now();
        const totalTime = sessionEnd - this.sessionData.startTime;
        const activeTime = totalTime - (this.sessionData.pauseDuration || 0);

        this.sessionData.endTime = sessionEnd;
        this.sessionData.totalTime = totalTime;
        this.sessionData.activeTime = activeTime;

        // Update platform data
        this.crossPlatformState.platforms[this.currentPlatform].totalTimeSpent += activeTime;

        // Queue final sync
        this.queueSync({
            type: 'session_end',
            sessionData: this.sessionData,
            timestamp: sessionEnd
        });

        // Perform immediate sync
        this.synchronize();
    }

    queueSync(data) {
        this.syncQueue.push(data);

        // Auto-sync after certain number of events
        if (this.syncQueue.length >= 10) {
            this.synchronize();
        }
    }

    async synchronize() {
        if (this.syncInProgress || this.syncQueue.length === 0) {
            return;
        }

        this.syncInProgress = true;

        try {
            // Save local state
            this.saveCrossPlatformState();

            // Sync to server
            const syncData = {
                userFingerprint: this.userFingerprint,
                platform: this.currentPlatform,
                crossPlatformState: this.crossPlatformState,
                syncQueue: [...this.syncQueue],
                timestamp: Date.now()
            };

            const response = await fetch(`${this.config.apiBaseUrl}/mystery/sync-cross-platform`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(syncData)
            });

            if (response.ok) {
                // Clear sync queue on successful sync
                this.syncQueue = [];
                this.crossPlatformState.lastSync = new Date().toISOString();
            }

        } catch (error) {
            console.warn('Cross-platform sync failed:', error);
        } finally {
            this.syncInProgress = false;
        }
    }

    saveCrossPlatformState() {
        try {
            localStorage.setItem('snapit_cross_platform_state', JSON.stringify(this.crossPlatformState));
        } catch (error) {
            console.warn('Could not save cross-platform state to localStorage:', error);
        }
    }

    startPeriodicSync() {
        // Sync every 30 seconds
        setInterval(() => {
            this.synchronize();
        }, 30000);
    }

    setupCrossPlatformMessaging() {
        // Listen for messages from other SnapIT platform tabs
        window.addEventListener('message', (event) => {
            if (event.origin !== window.location.origin) return;

            if (event.data.type === 'snapit_cross_platform_message') {
                this.handleCrossPlatformMessage(event.data);
            }
        });

        // Set up localStorage change listener for cross-tab communication
        window.addEventListener('storage', (event) => {
            if (event.key === 'snapit_cross_platform_state') {
                this.handleCrossPlatformStateChange(event);
            }
        });
    }

    handleCrossPlatformMessage(messageData) {
        // Handle messages from other platform tabs
        if (messageData.secretDiscovery) {
            this.processCrossPlatformSecretDiscovery(messageData.secretDiscovery);
        } else if (messageData.questUpdate) {
            this.processCrossPlatformQuestUpdate(messageData.questUpdate);
        }
    }

    handleCrossPlatformStateChange(event) {
        if (event.newValue) {
            try {
                const newState = JSON.parse(event.newValue);
                // Merge state changes from other tabs
                this.mergeCrossPlatformState(newState);
            } catch (error) {
                console.warn('Could not parse cross-platform state change:', error);
            }
        }
    }

    mergeCrossPlatformState(newState) {
        // Intelligent merging of cross-platform state
        Object.keys(newState.platforms || {}).forEach(platform => {
            if (!this.crossPlatformState.platforms[platform]) {
                this.crossPlatformState.platforms[platform] = newState.platforms[platform];
            } else {
                // Merge arrays and update counters
                const current = this.crossPlatformState.platforms[platform];
                const incoming = newState.platforms[platform];

                // Merge secret arrays
                if (incoming.secretsDiscovered) {
                    current.secretsDiscovered = [
                        ...new Set([...current.secretsDiscovered, ...incoming.secretsDiscovered])
                    ];
                }

                // Update visit count and time (take maximum)
                if (incoming.visitCount > current.visitCount) {
                    current.visitCount = incoming.visitCount;
                }

                if (incoming.totalTimeSpent > current.totalTimeSpent) {
                    current.totalTimeSpent = incoming.totalTimeSpent;
                }

                // Update last activity (take most recent)
                if (new Date(incoming.lastActivity) > new Date(current.lastActivity)) {
                    current.lastActivity = incoming.lastActivity;
                }
            }
        });
    }

    // Public API methods
    getCurrentPlatformData() {
        return this.crossPlatformState.platforms[this.currentPlatform];
    }

    getAllPlatformData() {
        return this.crossPlatformState.platforms;
    }

    getVisitedPlatforms() {
        return Object.keys(this.crossPlatformState.platforms);
    }

    getTotalSecretsDiscovered() {
        return Object.values(this.crossPlatformState.platforms)
            .reduce((total, platform) => total + platform.secretsDiscovered.length, 0);
    }

    getTotalTimeSpent() {
        return Object.values(this.crossPlatformState.platforms)
            .reduce((total, platform) => total + (platform.totalTimeSpent || 0), 0);
    }

    getCrossPlatformAchievements() {
        return this.crossPlatformState.globalAchievements || [];
    }

    // Analytics methods
    getEngagementMetrics() {
        return {
            totalPlatforms: this.getVisitedPlatforms().length,
            totalSecrets: this.getTotalSecretsDiscovered(),
            totalTime: this.getTotalTimeSpent(),
            currentSessionTime: Date.now() - this.sessionData.startTime,
            interactionsThisSession: this.sessionData.interactions.length,
            pagesVisitedThisSession: this.sessionData.pagesVisited.length,
            platform: this.currentPlatform
        };
    }
}

// Export for use by mystery engine
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CrossPlatformTracker;
}