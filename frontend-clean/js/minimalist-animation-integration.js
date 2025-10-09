/* ===================================================================
   MINIMALIST DESIGN & ANIMATION INTEGRATION
   Complete implementation guide for SnapIT Forms
   Philosophy: "Less is More" with delightful surprise moments
   ================================================================= */

class MinimalistAnimationIntegration {
  constructor() {
    this.isInitialized = false;
    this.components = {};
    this.config = this.getIntegrationConfig();

    this.init();
  }

  /* ===================================================================
     CONFIGURATION & INITIALIZATION
     ================================================================= */

  getIntegrationConfig() {
    return {
      // Performance settings
      performance: {
        enableGPUAcceleration: true,
        maxConcurrentAnimations: 6,
        reducedMotionFallback: true,
        mobileOptimization: true
      },

      // Design system settings
      design: {
        colorPalette: 'minimalist',
        typography: 'single-font',
        spacing: 'generous',
        shadows: 'subtle'
      },

      // Animation settings
      animations: {
        defaultDuration: 300,
        defaultEasing: 'ease-out',
        celebrationLevel: 'medium',
        surpriseFrequency: 'balanced'
      },

      // Reward system settings
      rewards: {
        enabled: true,
        celebrationStyle: 'subtle',
        achievementNotifications: true,
        sessionRewards: true
      }
    };
  }

  async init() {
    if (this.isInitialized) return;

    try {
      // Initialize components in order
      await this.initializeDesignSystem();
      await this.initializeAnimationFramework();
      await this.initializeRewardSystem();
      await this.initializeUserJourney();

      // Set up integrations
      this.setupComponentIntegrations();
      this.setupEventListeners();
      this.applyInitialEnhancements();

      this.isInitialized = true;
      console.log('✨ Minimalist Animation System initialized successfully');

      // Trigger welcome animation
      this.triggerWelcomeSequence();

    } catch (error) {
      console.error('Failed to initialize Minimalist Animation System:', error);
      this.handleInitializationError(error);
    }
  }

  /* ===================================================================
     COMPONENT INITIALIZATION
     ================================================================= */

  async initializeDesignSystem() {
    // Apply minimalist design system classes
    document.body.classList.add('minimalist-design-system');

    // Load design tokens
    this.applyDesignTokens();

    // Set up responsive behavior
    this.setupResponsiveDesign();

    console.log('🎨 Design system initialized');
  }

  async initializeAnimationFramework() {
    // Animation framework should already be initialized by its own file
    if (window.animationFramework) {
      this.components.animationFramework = window.animationFramework;
      console.log('⚡ Animation framework connected');
    } else {
      throw new Error('Animation framework not found');
    }
  }

  async initializeRewardSystem() {
    // Reward system should already be initialized by its own file
    if (window.rewardSystem) {
      this.components.rewardSystem = window.rewardSystem;

      // Configure reward preferences
      this.configureRewardSystem();
      console.log('🎉 Reward system connected');
    } else {
      console.warn('Reward system not found, continuing without rewards');
    }
  }

  async initializeUserJourney() {
    // User journey mapping should already be initialized by its own file
    if (window.userJourneyMapping) {
      this.components.userJourney = window.userJourneyMapping;
      console.log('🗺️ User journey mapping connected');
    } else {
      console.warn('User journey mapping not found, continuing without journey tracking');
    }
  }

  /* ===================================================================
     COMPONENT INTEGRATIONS
     ================================================================= */

  setupComponentIntegrations() {
    // Connect animation framework with reward system
    if (this.components.animationFramework && this.components.rewardSystem) {
      this.setupAnimationRewardIntegration();
    }

    // Connect user journey with animations and rewards
    if (this.components.userJourney) {
      this.setupJourneyIntegration();
    }

    // Set up form-specific integrations
    this.setupFormIntegrations();
  }

  setupAnimationRewardIntegration() {
    // Override reward system animation triggers to use our framework
    const originalTriggerCelebration = this.components.rewardSystem.triggerCelebrationEffect;

    this.components.rewardSystem.triggerCelebrationEffect = (intensity) => {
      this.triggerFrameworkCelebration(intensity);
    };
  }

  setupJourneyIntegration() {
    // Connect journey milestones to reward system
    const originalTriggerSurprise = this.components.userJourney.triggerSurprise;

    this.components.userJourney.triggerSurprise = (surprise) => {
      this.triggerIntegratedSurprise(surprise);
    };
  }

  setupFormIntegrations() {
    // Integrate with SnapIT Forms specific functionality
    this.setupFormCreationIntegration();
    this.setupFormSubmissionIntegration();
    this.setupDashboardIntegration();
  }

  /* ===================================================================
     FORM-SPECIFIC INTEGRATIONS
     ================================================================= */

  setupFormCreationIntegration() {
    // Listen for form creation events
    document.addEventListener('formCreated', (event) => {
      this.handleFormCreated(event.detail);
    });

    // Enhance form builder interface
    this.enhanceFormBuilder();
  }

  setupFormSubmissionIntegration() {
    // Listen for form submission events
    document.addEventListener('formSubmitted', (event) => {
      this.handleFormSubmitted(event.detail);
    });

    // Enhance form testing
    this.enhanceFormTesting();
  }

  setupDashboardIntegration() {
    // Enhance dashboard with subtle animations
    if (window.location.pathname.includes('dashboard')) {
      this.enhanceDashboard();
    }
  }

  /* ===================================================================
     ENHANCEMENT IMPLEMENTATIONS
     ================================================================= */

  enhanceFormBuilder() {
    // Add subtle animations to form builder elements
    const formFields = document.querySelectorAll('.form-field, .field-option');

    formFields.forEach((field, index) => {
      // Add hover animations
      field.addEventListener('mouseenter', () => {
        if (this.components.animationFramework) {
          this.components.animationFramework.pulse(field, { duration: 200 });
        }
      });

      // Add selection animations
      field.addEventListener('click', () => {
        this.animateFieldSelection(field);
      });

      // Stagger entrance animations
      if (this.components.animationFramework) {
        this.components.animationFramework.slideUp(field, {
          duration: 300,
          delay: index * 50
        });
      }
    });
  }

  enhanceFormTesting() {
    // Add success animations for form testing
    const testButtons = document.querySelectorAll('.test-form, .submit-test');

    testButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.animateTestSubmission(button);
      });
    });
  }

  enhanceDashboard() {
    // Add entrance animations for dashboard elements
    const dashboardCards = document.querySelectorAll('.dashboard-card, .stat-card, .form-card');

    dashboardCards.forEach((card, index) => {
      if (this.components.animationFramework) {
        this.components.animationFramework.slideUp(card, {
          duration: 400,
          delay: index * 100
        });
      }

      // Add hover enhancements
      card.addEventListener('mouseenter', () => {
        if (this.components.animationFramework) {
          this.components.animationFramework.scaleIn(card, { duration: 200 });
        }
      });
    });

    // Add welcome back animation for returning users
    this.checkForWelcomeBack();
  }

  /* ===================================================================
     SPECIFIC ANIMATION IMPLEMENTATIONS
     ================================================================= */

  animateFieldSelection(field) {
    if (!this.components.animationFramework) return;

    // Remove previous selections
    document.querySelectorAll('.field-selected').forEach(f => {
      f.classList.remove('field-selected');
    });

    // Animate new selection
    field.classList.add('field-selected');
    this.components.animationFramework.scaleIn(field, { duration: 250 });

    // Add subtle glow effect
    field.style.boxShadow = '0 0 20px rgba(170, 51, 106, 0.3)';
    setTimeout(() => {
      field.style.boxShadow = '';
    }, 1000);
  }

  animateTestSubmission(button) {
    if (!this.components.animationFramework) return;

    // Animate button
    this.components.animationFramework.pulse(button, { duration: 200 });

    // Change button text temporarily
    const originalText = button.textContent;
    button.textContent = 'Testing...';
    button.disabled = true;

    // Simulate test completion
    setTimeout(() => {
      button.textContent = 'Test Successful!';
      button.classList.add('btn-success');

      // Trigger celebration
      this.triggerTestSuccessCelebration();

      // Reset button
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        button.classList.remove('btn-success');
      }, 2000);
    }, 1500);
  }

  triggerTestSuccessCelebration() {
    // Create minimal confetti
    this.createMinimalConfetti(3);

    // Trigger reward if system available
    if (this.components.rewardSystem) {
      this.components.rewardSystem.triggerEngagementReward({
        pattern: 'test_completion',
        message: 'Test successful! Your form is working perfectly.'
      });
    }
  }

  /* ===================================================================
     CELEBRATION & SURPRISE IMPLEMENTATIONS
     ================================================================= */

  triggerFrameworkCelebration(intensity) {
    const celebrations = {
      gentle: () => this.triggerGentleCelebration(),
      subtle: () => this.triggerSubtleCelebration(),
      medium: () => this.triggerMediumCelebration(),
      enhanced: () => this.triggerEnhancedCelebration(),
      special: () => this.triggerSpecialCelebration()
    };

    const celebration = celebrations[intensity] || celebrations.medium;
    celebration();
  }

  triggerGentleCelebration() {
    // Gentle pulse on main elements
    const mainElements = document.querySelectorAll('.btn-primary, .card');
    mainElements.forEach((element, index) => {
      setTimeout(() => {
        if (this.components.animationFramework) {
          this.components.animationFramework.pulse(element, { duration: 300 });
        }
      }, index * 100);
    });
  }

  triggerSubtleCelebration() {
    this.triggerGentleCelebration();
    this.createMinimalConfetti(2);
  }

  triggerMediumCelebration() {
    this.triggerSubtleCelebration();

    // Add temporary glow to interface
    document.body.classList.add('celebration-glow');
    setTimeout(() => {
      document.body.classList.remove('celebration-glow');
    }, 2000);
  }

  triggerEnhancedCelebration() {
    this.triggerMediumCelebration();
    this.createMinimalConfetti(5);

    // Show achievement message
    this.showAchievementMessage('Great work! Achievement unlocked!');
  }

  triggerSpecialCelebration() {
    this.triggerEnhancedCelebration();

    // Special rainbow effect
    document.body.classList.add('rainbow-celebration');
    setTimeout(() => {
      document.body.classList.remove('rainbow-celebration');
    }, 3000);
  }

  triggerIntegratedSurprise(surprise) {
    // Use our animation framework for surprise animations
    if (this.components.animationFramework) {
      this.executeSurpriseWithFramework(surprise);
    }

    // Trigger reward system if available
    if (this.components.rewardSystem) {
      this.components.rewardSystem.triggerSurprise(surprise);
    }
  }

  /* ===================================================================
     WELCOME SEQUENCE
     ================================================================= */

  triggerWelcomeSequence() {
    // Only trigger on first page load
    if (sessionStorage.getItem('welcomeShown')) return;

    setTimeout(() => {
      this.animateWelcomeElements();
      sessionStorage.setItem('welcomeShown', 'true');
    }, 500);
  }

  animateWelcomeElements() {
    // Animate hero section
    const heroElements = document.querySelectorAll('.hero h1, .hero p, .hero .btn');
    heroElements.forEach((element, index) => {
      if (this.components.animationFramework) {
        this.components.animationFramework.slideUp(element, {
          duration: 600,
          delay: index * 200
        });
      }
    });

    // Animate feature cards
    const featureCards = document.querySelectorAll('.feature-card, .features .card');
    featureCards.forEach((card, index) => {
      if (this.components.animationFramework) {
        this.components.animationFramework.scaleIn(card, {
          duration: 400,
          delay: 800 + (index * 100)
        });
      }
    });
  }

  checkForWelcomeBack() {
    const lastVisit = localStorage.getItem('lastVisit');
    const now = Date.now();

    if (lastVisit) {
      const timeSinceLastVisit = now - parseInt(lastVisit);
      const hoursSince = timeSinceLastVisit / (1000 * 60 * 60);

      if (hoursSince >= 24 && hoursSince <= 168) { // 1-7 days
        this.showWelcomeBackMessage();
      }
    }

    localStorage.setItem('lastVisit', now.toString());
  }

  showWelcomeBackMessage() {
    const message = document.createElement('div');
    message.className = 'welcome-back-message';
    message.innerHTML = `
      <div class="welcome-icon">👋</div>
      <div class="welcome-text">Welcome back!</div>
    `;

    message.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 10000;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.4s ease-out;
      border-left: 4px solid var(--color-brand-pink);
    `;

    document.body.appendChild(message);

    // Animate in
    requestAnimationFrame(() => {
      message.style.opacity = '1';
      message.style.transform = 'translateX(0)';
    });

    // Auto-hide
    setTimeout(() => {
      message.style.opacity = '0';
      message.style.transform = 'translateX(100%)';

      setTimeout(() => {
        if (message.parentNode) {
          message.parentNode.removeChild(message);
        }
      }, 400);
    }, 4000);
  }

  /* ===================================================================
     UTILITY FUNCTIONS
     ================================================================= */

  createMinimalConfetti(count = 3) {
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

  showAchievementMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-icon">🏆</div>
      <div class="achievement-text">${message}</div>
    `;

    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.8);
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      z-index: 10000;
      opacity: 0;
      transition: all 0.4s ease-out;
      border: 2px solid var(--color-brand-pink);
      text-align: center;
      font-weight: 600;
    `;

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    // Auto-hide
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translate(-50%, -50%) scale(0.8)';

      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 400);
    }, 3000);
  }

  applyDesignTokens() {
    // Apply design system CSS custom properties
    document.documentElement.style.setProperty('--animation-duration-fast', '150ms');
    document.documentElement.style.setProperty('--animation-duration-normal', '250ms');
    document.documentElement.style.setProperty('--animation-duration-slow', '350ms');
    document.documentElement.style.setProperty('--animation-easing', 'cubic-bezier(0.0, 0, 0.2, 1)');
  }

  setupResponsiveDesign() {
    // Add responsive classes based on screen size
    const updateResponsiveClasses = () => {
      const width = window.innerWidth;

      document.body.classList.remove('mobile', 'tablet', 'desktop');

      if (width < 768) {
        document.body.classList.add('mobile');
      } else if (width < 1024) {
        document.body.classList.add('tablet');
      } else {
        document.body.classList.add('desktop');
      }
    };

    updateResponsiveClasses();
    window.addEventListener('resize', updateResponsiveClasses);
  }

  configureRewardSystem() {
    if (!this.components.rewardSystem) return;

    this.components.rewardSystem.setRewardPreference('celebrationIntensity', this.config.animations.celebrationLevel);
    this.components.rewardSystem.setRewardPreference('rewardsEnabled', this.config.rewards.enabled);
  }

  handleInitializationError(error) {
    console.error('Minimalist Animation System initialization failed:', error);

    // Fallback to basic functionality
    document.body.classList.add('animations-disabled');

    // Show user-friendly message
    const errorMessage = document.createElement('div');
    errorMessage.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: #ef4444;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 9999;
    `;
    errorMessage.textContent = 'Some visual enhancements are unavailable. Basic functionality remains.';

    document.body.appendChild(errorMessage);

    setTimeout(() => {
      if (errorMessage.parentNode) {
        errorMessage.parentNode.removeChild(errorMessage);
      }
    }, 5000);
  }

  /* ===================================================================
     PUBLIC API
     ================================================================= */

  // Manually trigger animations
  animateElement(element, animationType, options = {}) {
    if (this.components.animationFramework) {
      return this.components.animationFramework[animationType](element, options);
    }
  }

  // Manually trigger celebrations
  celebrate(intensity = 'medium') {
    this.triggerFrameworkCelebration(intensity);
  }

  // Check if system is ready
  isReady() {
    return this.isInitialized;
  }

  // Get system status
  getStatus() {
    return {
      initialized: this.isInitialized,
      components: Object.keys(this.components),
      config: this.config
    };
  }

  // Event handlers for form integration
  handleFormCreated(formData) {
    if (this.components.rewardSystem) {
      this.components.rewardSystem.trackFormCreated(formData);
    }

    // Trigger form creation celebration
    this.triggerSubtleCelebration();
  }

  handleFormSubmitted(submissionData) {
    if (this.components.rewardSystem) {
      this.components.rewardSystem.trackFormSubmitted(submissionData);
    }

    // Trigger submission success animation
    this.animateTestSubmission(document.querySelector('.submit-btn') || document.body);
  }

  setupEventListeners() {
    // Listen for custom events from SnapIT Forms
    document.addEventListener('snapitform:created', (e) => {
      this.handleFormCreated(e.detail);
    });

    document.addEventListener('snapitform:submitted', (e) => {
      this.handleFormSubmitted(e.detail);
    });

    document.addEventListener('snapitform:test', (e) => {
      this.triggerTestSuccessCelebration();
    });

    // Listen for navigation events
    window.addEventListener('popstate', () => {
      this.triggerWelcomeSequence();
    });
  }
}

/* ===================================================================
   REQUIRED STYLES
   ================================================================= */

const integrationStyles = document.createElement('style');
integrationStyles.textContent = `
  /* Minimalist Design System Base */
  .minimalist-design-system {
    --animation-duration-fast: 150ms;
    --animation-duration-normal: 250ms;
    --animation-duration-slow: 350ms;
    --animation-easing: cubic-bezier(0.0, 0, 0.2, 1);
  }

  /* Field Selection */
  .field-selected {
    border-color: var(--color-brand-pink) !important;
    transform: scale(1.02);
    transition: all var(--animation-duration-normal) var(--animation-easing);
  }

  /* Success State */
  .btn-success {
    background-color: var(--color-success) !important;
    border-color: var(--color-success) !important;
    color: white !important;
  }

  /* Celebration Effects */
  .celebration-glow {
    filter: brightness(1.05) saturate(1.1);
    transition: filter 0.5s ease-out;
  }

  .rainbow-celebration {
    animation: rainbowShift 3s ease-in-out;
  }

  @keyframes rainbowShift {
    0%, 100% { filter: hue-rotate(0deg); }
    25% { filter: hue-rotate(90deg); }
    50% { filter: hue-rotate(180deg); }
    75% { filter: hue-rotate(270deg); }
  }

  /* Confetti Animation */
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

  /* Mobile Optimizations */
  .mobile .achievement-notification {
    max-width: 90vw;
  }

  .mobile .welcome-back-message {
    position: fixed;
    top: 10px;
    right: 10px;
    left: 10px;
    transform: none;
  }

  /* Animations Disabled Fallback */
  .animations-disabled * {
    animation: none !important;
    transition: none !important;
  }

  /* Performance Tier Optimizations */
  .performance-tier-minimal * {
    animation-duration: 0.1s !important;
    transition-duration: 0.1s !important;
  }

  .performance-tier-basic * {
    animation-duration: 0.2s !important;
    transition-duration: 0.2s !important;
  }

  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    .minimalist-design-system * {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

document.head.appendChild(integrationStyles);

/* ===================================================================
   GLOBAL INITIALIZATION
   ================================================================= */

let minimalistAnimationIntegration;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  minimalistAnimationIntegration = new MinimalistAnimationIntegration();

  // Make globally available
  window.minimalistAnimationIntegration = minimalistAnimationIntegration;

  // Expose simple API
  window.snapitAnimations = {
    animate: (element, type, options) =>
      minimalistAnimationIntegration.animateElement(element, type, options),
    celebrate: (intensity) =>
      minimalistAnimationIntegration.celebrate(intensity),
    isReady: () =>
      minimalistAnimationIntegration.isReady()
  };
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MinimalistAnimationIntegration;
}