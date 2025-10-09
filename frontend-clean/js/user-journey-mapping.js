/* ===================================================================
   USER JOURNEY MAPPING WITH SURPRISE MOMENTS
   Strategic placement of delightful animations and rewards
   Philosophy: Surprise when least expected, add value always
   ================================================================= */

class UserJourneyMapping {
  constructor() {
    this.journeyStages = this.defineJourneyStages();
    this.surpriseMoments = this.defineSurpriseMoments();
    this.currentStage = 'discovery';
    this.userBehavior = this.initializeUserBehavior();
    this.timingEngine = this.initializeTimingEngine();

    this.init();
  }

  /* ===================================================================
     JOURNEY STAGE DEFINITIONS
     ================================================================= */

  defineJourneyStages() {
    return {
      // Stage 1: Discovery & First Impression (0-30 seconds)
      discovery: {
        duration: 30000,
        goals: ['understand_value', 'build_trust', 'encourage_signup'],
        userMindset: 'skeptical_but_curious',
        surpriseOpportunities: [
          'landing_page_micro_interactions',
          'feature_preview_animations',
          'subtle_hover_delights'
        ],
        keyMoments: [
          { trigger: 'page_load', delay: 1000, animation: 'hero_gentle_entrance' },
          { trigger: 'feature_card_hover', animation: 'subtle_glow_reveal' },
          { trigger: 'scroll_to_pricing', animation: 'pricing_cards_stagger' }
        ]
      },

      // Stage 2: Exploration & Learning (30 seconds - 3 minutes)
      exploration: {
        duration: 150000,
        goals: ['understand_features', 'see_templates', 'evaluate_pricing'],
        userMindset: 'interested_and_evaluating',
        surpriseOpportunities: [
          'template_preview_interactions',
          'feature_demonstration_animations',
          'progressive_disclosure_delights'
        ],
        keyMoments: [
          { trigger: 'template_card_click', animation: 'template_preview_slide' },
          { trigger: 'feature_tab_switch', animation: 'content_graceful_transition' },
          { trigger: 'pricing_tier_hover', animation: 'feature_highlight_reveal' }
        ]
      },

      // Stage 3: Decision & Signup (3-5 minutes)
      decision: {
        duration: 120000,
        goals: ['choose_plan', 'complete_signup', 'verify_email'],
        userMindset: 'ready_to_commit',
        surpriseOpportunities: [
          'signup_form_enhancements',
          'plan_selection_feedback',
          'welcome_sequence_celebration'
        ],
        keyMoments: [
          { trigger: 'google_signin_click', animation: 'signin_button_confidence' },
          { trigger: 'signup_success', animation: 'celebration_gentle_confetti' },
          { trigger: 'access_key_generated', animation: 'success_code_reveal' }
        ]
      },

      // Stage 4: First Success (5-10 minutes)
      first_success: {
        duration: 300000,
        goals: ['create_first_form', 'understand_dashboard', 'test_submission'],
        userMindset: 'excited_but_cautious',
        surpriseOpportunities: [
          'dashboard_welcome_tour',
          'form_builder_guidance',
          'first_form_milestone_celebration'
        ],
        keyMoments: [
          { trigger: 'dashboard_first_visit', animation: 'welcome_dashboard_tour' },
          { trigger: 'create_form_button_click', animation: 'form_builder_entrance' },
          { trigger: 'first_form_created', animation: 'milestone_achievement_celebration' },
          { trigger: 'first_test_submission', animation: 'test_success_feedback' }
        ]
      },

      // Stage 5: Mastery & Engagement (10+ minutes)
      mastery: {
        duration: Infinity,
        goals: ['create_multiple_forms', 'explore_advanced_features', 'optimize_workflows'],
        userMindset: 'confident_and_productive',
        surpriseOpportunities: [
          'productivity_enhancements',
          'advanced_feature_unlocks',
          'efficiency_recognition'
        ],
        keyMoments: [
          { trigger: 'form_count_milestone', animation: 'mastery_recognition' },
          { trigger: 'advanced_feature_used', animation: 'power_user_unlock' },
          { trigger: 'efficient_workflow_detected', animation: 'productivity_celebration' }
        ]
      },

      // Stage 6: Advocacy & Loyalty (Long-term)
      advocacy: {
        duration: Infinity,
        goals: ['share_with_others', 'provide_feedback', 'upgrade_plan'],
        userMindset: 'loyal_advocate',
        surpriseOpportunities: [
          'loyalty_rewards',
          'exclusive_feature_previews',
          'community_recognition'
        ],
        keyMoments: [
          { trigger: 'referral_sent', animation: 'sharing_appreciation' },
          { trigger: 'feedback_submitted', animation: 'feedback_gratitude' },
          { trigger: 'plan_upgrade', animation: 'loyalty_celebration' }
        ]
      }
    };
  }

  /* ===================================================================
     SURPRISE MOMENT DEFINITIONS
     ================================================================= */

  defineSurpriseMoments() {
    return {
      // Time-based surprises
      temporal: [
        {
          id: 'session_30s_reward',
          trigger: 'session_duration',
          threshold: 30000,
          frequency: 'once_per_session',
          animation: 'interface_enhancement_unlock',
          message: 'Enjoying your visit? Interface enhanced for smoother experience!'
        },
        {
          id: 'session_2min_reward',
          trigger: 'session_duration',
          threshold: 120000,
          frequency: 'once_per_session',
          animation: 'productivity_boost_unlock',
          message: 'You\'re focused! Quick actions enabled for faster workflow.'
        },
        {
          id: 'midnight_owl_easter_egg',
          trigger: 'time_of_day',
          threshold: { start: 23, end: 5 },
          frequency: 'once_per_day',
          animation: 'night_owl_theme_unlock',
          message: 'Night owl detected! Special dark theme unlocked.'
        }
      ],

      // Behavior-based surprises
      behavioral: [
        {
          id: 'perfectionist_reward',
          trigger: 'error_free_streak',
          threshold: 5,
          frequency: 'once_per_streak',
          animation: 'perfectionist_glow',
          message: 'Flawless execution! Error-free streak bonus activated.'
        },
        {
          id: 'explorer_reward',
          trigger: 'features_explored',
          threshold: 3,
          frequency: 'once_per_session',
          animation: 'explorer_badge_reveal',
          message: 'Feature explorer! You\'ve discovered hidden capabilities.'
        },
        {
          id: 'speed_demon_reward',
          trigger: 'quick_completion',
          threshold: 3,
          frequency: 'once_per_session',
          animation: 'speed_celebration',
          message: 'Lightning fast! Speed bonus unlocked.'
        }
      ],

      // Milestone-based surprises
      achievements: [
        {
          id: 'first_form_magic',
          trigger: 'form_created',
          threshold: 1,
          frequency: 'once_ever',
          animation: 'first_form_celebration',
          message: 'First form created! 🎉 You\'re officially a form builder!'
        },
        {
          id: 'form_builder_status',
          trigger: 'form_created',
          threshold: 5,
          frequency: 'once_ever',
          animation: 'form_builder_unlock',
          message: 'Form Builder status achieved! Advanced templates unlocked.'
        },
        {
          id: 'power_creator_rank',
          trigger: 'form_created',
          threshold: 10,
          frequency: 'once_ever',
          animation: 'power_creator_celebration',
          message: 'Power Creator rank unlocked! Premium features enabled.'
        }
      ],

      // Easter eggs and hidden delights
      hidden: [
        {
          id: 'konami_code_easter_egg',
          trigger: 'konami_code',
          threshold: 1,
          frequency: 'once_ever',
          animation: 'secret_animation_set_unlock',
          message: 'Konami code detected! Secret animation set unlocked!'
        },
        {
          id: 'creative_form_name',
          trigger: 'form_name_pattern',
          threshold: ['hello world', 'test form', '42', 'easter egg'],
          frequency: 'once_per_pattern',
          animation: 'creative_recognition',
          message: 'Creative naming detected! Bonus style unlocked.'
        },
        {
          id: 'return_user_surprise',
          trigger: 'return_after_absence',
          threshold: 24 * 60 * 60 * 1000, // 24 hours
          frequency: 'once_per_return',
          animation: 'welcome_back_surprise',
          message: 'Welcome back! We missed you. Here\'s a little surprise!'
        }
      ],

      // Contextual surprises
      contextual: [
        {
          id: 'form_completion_celebration',
          trigger: 'form_submission_test',
          threshold: 1,
          frequency: 'once_per_form',
          animation: 'form_test_success',
          message: 'Test successful! Your form is working perfectly.'
        },
        {
          id: 'template_discovery',
          trigger: 'template_browse',
          threshold: 5,
          frequency: 'once_per_session',
          animation: 'template_appreciation',
          message: 'Template explorer! You have great taste in design.'
        },
        {
          id: 'feedback_appreciation',
          trigger: 'feedback_submitted',
          threshold: 1,
          frequency: 'once_per_feedback',
          animation: 'gratitude_expression',
          message: 'Thank you for your feedback! It helps us improve.'
        }
      ]
    };
  }

  /* ===================================================================
     USER BEHAVIOR TRACKING
     ================================================================= */

  initializeUserBehavior() {
    return {
      sessionStart: Date.now(),
      totalTime: 0,
      pageViews: [],
      interactions: [],
      formsCreated: 0,
      featuresUsed: new Set(),
      errors: 0,
      successActions: 0,
      currentStreak: {
        errorFree: 0,
        quickCompletions: 0,
        consecutiveDays: 0
      },
      preferences: {
        animationLevel: 'full',
        celebrationStyle: 'medium',
        surprisesEnabled: true
      }
    };
  }

  initializeTimingEngine() {
    return {
      intervals: new Map(),
      timeouts: new Map(),
      observers: new Map()
    };
  }

  /* ===================================================================
     JOURNEY PROGRESSION TRACKING
     ================================================================= */

  trackJourneyProgression() {
    const sessionDuration = Date.now() - this.userBehavior.sessionStart;
    const currentStageConfig = this.journeyStages[this.currentStage];

    // Check if we should advance to next stage
    if (sessionDuration > currentStageConfig.duration) {
      this.advanceJourneyStage();
    }

    // Check for stage-specific surprise moments
    this.checkStageSurprises();
  }

  advanceJourneyStage() {
    const stageOrder = ['discovery', 'exploration', 'decision', 'first_success', 'mastery', 'advocacy'];
    const currentIndex = stageOrder.indexOf(this.currentStage);

    if (currentIndex < stageOrder.length - 1) {
      this.currentStage = stageOrder[currentIndex + 1];
      this.onStageTransition(this.currentStage);
    }
  }

  onStageTransition(newStage) {
    console.log(`Journey stage advanced to: ${newStage}`);

    // Trigger stage-specific setup
    this.setupStageSpecificFeatures(newStage);

    // Trigger subtle transition animation
    if (window.animationFramework && this.userBehavior.preferences.surprisesEnabled) {
      this.triggerStageTransitionAnimation(newStage);
    }
  }

  setupStageSpecificFeatures(stage) {
    const stageConfig = this.journeyStages[stage];

    stageConfig.keyMoments.forEach(moment => {
      this.setupMomentListener(moment);
    });
  }

  /* ===================================================================
     SURPRISE MOMENT DETECTION & TRIGGERING
     ================================================================= */

  checkStageSurprises() {
    const allSurprises = [
      ...this.surpriseMoments.temporal,
      ...this.surpriseMoments.behavioral,
      ...this.surpriseMoments.achievements,
      ...this.surpriseMoments.contextual
    ];

    allSurprises.forEach(surprise => {
      if (this.shouldTriggerSurprise(surprise)) {
        this.triggerSurprise(surprise);
      }
    });
  }

  shouldTriggerSurprise(surprise) {
    // Check if already triggered based on frequency
    const triggeredKey = `surprise_${surprise.id}`;
    const lastTriggered = localStorage.getItem(triggeredKey);

    switch (surprise.frequency) {
      case 'once_ever':
        return !lastTriggered;

      case 'once_per_session':
        const sessionId = `session_${this.userBehavior.sessionStart}`;
        return lastTriggered !== sessionId;

      case 'once_per_day':
        const today = new Date().toDateString();
        return lastTriggered !== today;

      default:
        return true;
    }
  }

  triggerSurprise(surprise) {
    if (!this.userBehavior.preferences.surprisesEnabled) return;

    console.log(`Triggering surprise: ${surprise.id}`);

    // Mark as triggered
    this.markSurpriseTriggered(surprise);

    // Execute the surprise animation
    this.executeSurpriseAnimation(surprise);

    // Show message if applicable
    if (surprise.message && window.rewardSystem) {
      window.rewardSystem.showSurpriseMessage(surprise.message, surprise.animation);
    }

    // Track for analytics
    this.trackSurpriseEvent(surprise);
  }

  markSurpriseTriggered(surprise) {
    const triggeredKey = `surprise_${surprise.id}`;

    switch (surprise.frequency) {
      case 'once_ever':
        localStorage.setItem(triggeredKey, 'true');
        break;

      case 'once_per_session':
        const sessionId = `session_${this.userBehavior.sessionStart}`;
        localStorage.setItem(triggeredKey, sessionId);
        break;

      case 'once_per_day':
        const today = new Date().toDateString();
        localStorage.setItem(triggeredKey, today);
        break;
    }
  }

  executeSurpriseAnimation(surprise) {
    if (!window.animationFramework) return;

    const animationMap = {
      // Interface enhancements
      'interface_enhancement_unlock': () => this.animateInterfaceEnhancement(),
      'productivity_boost_unlock': () => this.animateProductivityBoost(),
      'night_owl_theme_unlock': () => this.animateNightOwlTheme(),

      // Achievement celebrations
      'first_form_celebration': () => this.animateFirstFormCelebration(),
      'form_builder_unlock': () => this.animateFormBuilderUnlock(),
      'power_creator_celebration': () => this.animatePowerCreatorCelebration(),

      // Behavioral rewards
      'perfectionist_glow': () => this.animatePerfectionistGlow(),
      'explorer_badge_reveal': () => this.animateExplorerBadge(),
      'speed_celebration': () => this.animateSpeedCelebration(),

      // Easter eggs
      'secret_animation_set_unlock': () => this.animateSecretUnlock(),
      'creative_recognition': () => this.animateCreativeRecognition(),
      'welcome_back_surprise': () => this.animateWelcomeBackSurprise(),

      // Contextual animations
      'form_test_success': () => this.animateFormTestSuccess(),
      'template_appreciation': () => this.animateTemplateAppreciation(),
      'gratitude_expression': () => this.animateGratitudeExpression()
    };

    const animationFunction = animationMap[surprise.animation];
    if (animationFunction) {
      animationFunction();
    }
  }

  /* ===================================================================
     SPECIFIC SURPRISE ANIMATIONS
     ================================================================= */

  animateInterfaceEnhancement() {
    document.body.classList.add('interface-enhanced');

    // Subtle improvement to all interactive elements
    const interactiveElements = document.querySelectorAll('button, .card, .form-input');
    interactiveElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('enhanced-interaction');
        window.animationFramework.pulse(element, { duration: 200 });
      }, index * 100);
    });
  }

  animateProductivityBoost() {
    // Add quick action hints
    this.showProductivityHints();

    // Animate main content area
    const mainContent = document.querySelector('main, .main-content');
    if (mainContent) {
      window.animationFramework.scaleIn(mainContent, { duration: 400 });
    }
  }

  animateFirstFormCelebration() {
    // Gentle confetti effect
    this.createMinimalConfetti(5);

    // Highlight the created form
    const formElement = document.querySelector('.form-card:last-child, .created-form');
    if (formElement) {
      formElement.classList.add('celebration-highlight');
      window.animationFramework.bounce(formElement, { duration: 600 });
    }
  }

  animatePerfectionistGlow() {
    const allElements = document.querySelectorAll('*');
    const elementsToGlow = Array.from(allElements).filter(el =>
      el.offsetWidth > 0 && el.offsetHeight > 0
    ).slice(0, 10); // Limit to prevent performance issues

    elementsToGlow.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('perfectionist-glow');
        setTimeout(() => element.classList.remove('perfectionist-glow'), 2000);
      }, index * 100);
    });
  }

  animateSecretUnlock() {
    // Create special effect overlay
    const overlay = document.createElement('div');
    overlay.className = 'secret-unlock-overlay';
    overlay.innerHTML = `
      <div class="secret-message">
        <div class="secret-icon">🎮</div>
        <div class="secret-text">Secret Mode Unlocked!</div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Animate in and auto-remove
    window.animationFramework.fadeIn(overlay, { duration: 500 });

    setTimeout(() => {
      window.animationFramework.fadeOut(overlay, { duration: 500 });
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 500);
    }, 3000);
  }

  /* ===================================================================
     MOMENT LISTENER SETUP
     ================================================================= */

  setupMomentListener(moment) {
    switch (moment.trigger) {
      case 'page_load':
        if (moment.delay) {
          setTimeout(() => this.triggerMomentAnimation(moment), moment.delay);
        } else {
          this.triggerMomentAnimation(moment);
        }
        break;

      case 'element_hover':
        this.setupHoverListener(moment);
        break;

      case 'element_click':
        this.setupClickListener(moment);
        break;

      case 'scroll_to_element':
        this.setupScrollListener(moment);
        break;

      case 'form_created':
        this.setupFormCreatedListener(moment);
        break;

      case 'form_submitted':
        this.setupFormSubmittedListener(moment);
        break;
    }
  }

  triggerMomentAnimation(moment) {
    if (!window.animationFramework) return;

    const animationMap = {
      'hero_gentle_entrance': () => this.animateHeroEntrance(),
      'subtle_glow_reveal': () => this.animateSubtleGlow(),
      'pricing_cards_stagger': () => this.animatePricingCardsStagger(),
      'template_preview_slide': () => this.animateTemplatePreview(),
      'content_graceful_transition': () => this.animateContentTransition(),
      'feature_highlight_reveal': () => this.animateFeatureHighlight()
    };

    const animationFunction = animationMap[moment.animation];
    if (animationFunction) {
      animationFunction();
    }
  }

  /* ===================================================================
     JOURNEY-SPECIFIC ANIMATIONS
     ================================================================= */

  animateHeroEntrance() {
    const heroTitle = document.querySelector('.hero-title, h1');
    const heroSubtitle = document.querySelector('.hero-subtitle, .hero p');
    const heroCTA = document.querySelector('.hero-cta, .cta');

    if (heroTitle) {
      window.animationFramework.slideUp(heroTitle, { duration: 600, delay: 200 });
    }

    if (heroSubtitle) {
      window.animationFramework.slideUp(heroSubtitle, { duration: 600, delay: 400 });
    }

    if (heroCTA) {
      window.animationFramework.scaleIn(heroCTA, { duration: 500, delay: 600 });
    }
  }

  animatePricingCardsStagger() {
    const pricingCards = document.querySelectorAll('.pricing-card');

    pricingCards.forEach((card, index) => {
      window.animationFramework.slideUp(card, {
        duration: 400,
        delay: index * 100
      });
    });
  }

  animateTemplatePreview() {
    const templates = document.querySelectorAll('.template-card');

    templates.forEach((template, index) => {
      if (index < 4) { // Only animate first 4 for performance
        window.animationFramework.scaleIn(template, {
          duration: 300,
          delay: index * 50
        });
      }
    });
  }

  /* ===================================================================
     UTILITY FUNCTIONS
     ================================================================= */

  createMinimalConfetti(count = 5) {
    const colors = ['#aa336a', '#ff0077', '#10b981', '#3b82f6'];

    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: ${colors[i % colors.length]};
        pointer-events: none;
        z-index: 9999;
        border-radius: 50%;
        left: ${Math.random() * window.innerWidth}px;
        top: -10px;
        animation: confettiFall 2s ease-out forwards;
      `;

      document.body.appendChild(confetti);

      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 2000);
    }
  }

  showProductivityHints() {
    const hints = [
      'Tip: Use Ctrl+S to quickly save your form',
      'Hint: Double-click any element to edit',
      'Pro tip: Use Tab to navigate between fields'
    ];

    const hint = hints[Math.floor(Math.random() * hints.length)];

    const hintElement = document.createElement('div');
    hintElement.className = 'productivity-hint';
    hintElement.textContent = hint;
    hintElement.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--color-gray-700);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 9999;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease-out;
    `;

    document.body.appendChild(hintElement);

    // Animate in
    requestAnimationFrame(() => {
      hintElement.style.opacity = '1';
      hintElement.style.transform = 'translateY(0)';
    });

    // Auto-remove
    setTimeout(() => {
      hintElement.style.opacity = '0';
      hintElement.style.transform = 'translateY(20px)';

      setTimeout(() => {
        if (hintElement.parentNode) {
          hintElement.parentNode.removeChild(hintElement);
        }
      }, 300);
    }, 4000);
  }

  trackSurpriseEvent(surprise) {
    // Send to analytics if available
    if (window.gtag) {
      gtag('event', 'surprise_moment', {
        event_category: 'engagement',
        event_label: surprise.id,
        value: 1
      });
    }

    // Store in local analytics
    const surpriseEvents = JSON.parse(localStorage.getItem('surprise_events') || '[]');
    surpriseEvents.push({
      id: surprise.id,
      timestamp: Date.now(),
      stage: this.currentStage
    });

    // Keep only last 100 events
    if (surpriseEvents.length > 100) {
      surpriseEvents.shift();
    }

    localStorage.setItem('surprise_events', JSON.stringify(surpriseEvents));
  }

  /* ===================================================================
     PUBLIC API
     ================================================================= */

  getCurrentStage() {
    return this.currentStage;
  }

  triggerManualSurprise(surpriseId) {
    const allSurprises = [
      ...this.surpriseMoments.temporal,
      ...this.surpriseMoments.behavioral,
      ...this.surpriseMoments.achievements,
      ...this.surpriseMoments.contextual,
      ...this.surpriseMoments.hidden
    ];

    const surprise = allSurprises.find(s => s.id === surpriseId);
    if (surprise) {
      this.triggerSurprise(surprise);
    }
  }

  updateUserBehavior(behaviorData) {
    Object.assign(this.userBehavior, behaviorData);
  }

  getSurpriseAnalytics() {
    const surpriseEvents = JSON.parse(localStorage.getItem('surprise_events') || '[]');
    return {
      totalSurprises: surpriseEvents.length,
      recentSurprises: surpriseEvents.slice(-10),
      mostTriggeredStage: this.getMostTriggeredStage(surpriseEvents),
      currentStage: this.currentStage
    };
  }

  getMostTriggeredStage(events) {
    const stageCounts = {};
    events.forEach(event => {
      stageCounts[event.stage] = (stageCounts[event.stage] || 0) + 1;
    });

    return Object.keys(stageCounts).reduce((a, b) =>
      stageCounts[a] > stageCounts[b] ? a : b
    );
  }

  /* ===================================================================
     INITIALIZATION
     ================================================================= */

  start() {
    // Begin journey tracking
    this.trackJourneyProgression();

    // Set up periodic checks
    setInterval(() => {
      this.trackJourneyProgression();
    }, 10000); // Check every 10 seconds

    console.log('User journey mapping started');
  }
}

/* ===================================================================
   REQUIRED CSS FOR SURPRISE ANIMATIONS
   ================================================================= */

const journeyStyles = document.createElement('style');
journeyStyles.textContent = `
  @keyframes confettiFall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }

  .celebration-highlight {
    box-shadow: 0 0 20px rgba(170, 51, 106, 0.4);
    border: 2px solid rgba(170, 51, 106, 0.3);
    animation: celebrationPulse 2s ease-in-out;
  }

  @keyframes celebrationPulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
  }

  .perfectionist-glow {
    box-shadow: 0 0 15px rgba(16, 185, 129, 0.3) !important;
    transition: box-shadow 0.3s ease-out !important;
  }

  .interface-enhanced .enhanced-interaction {
    transition: all 0.2s ease-out !important;
  }

  .interface-enhanced .enhanced-interaction:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .secret-unlock-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    pointer-events: none;
  }

  .secret-message {
    text-align: center;
    color: white;
    font-size: 24px;
    font-weight: bold;
  }

  .secret-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .productivity-hint {
    font-family: var(--font-family, 'Inter', sans-serif);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

document.head.appendChild(journeyStyles);

/* ===================================================================
   GLOBAL INITIALIZATION
   ================================================================= */

let userJourneyMapping;

document.addEventListener('DOMContentLoaded', () => {
  userJourneyMapping = new UserJourneyMapping();

  // Start journey tracking after a brief delay
  setTimeout(() => {
    userJourneyMapping.start();
  }, 1000);

  // Make globally available
  window.userJourneyMapping = userJourneyMapping;
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UserJourneyMapping;
}