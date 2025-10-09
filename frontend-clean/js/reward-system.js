/* ===================================================================
   NON-INTRUSIVE REWARD SYSTEM
   Philosophy: Natural achievements that feel earned, not gamified
   Focus: Long-term user engagement through meaningful milestones
   ================================================================= */

class NonIntrusiveRewardSystem {
  constructor() {
    this.sessionStart = Date.now();
    this.sessionEvents = [];
    this.userProgress = this.loadUserProgress();
    this.rewardConfig = this.initializeRewardConfig();
    this.isFirstSession = this.checkFirstSession();
    this.surpriseDelayTimeout = null;

    this.init();
  }

  /* ===================================================================
     INITIALIZATION & CONFIGURATION
     ================================================================= */

  init() {
    this.trackSessionStart();
    this.bindEventListeners();
    this.checkForWelcomeBack();
    this.scheduleSessionRewards();
    this.checkMilestones();
  }

  initializeRewardConfig() {
    return {
      // Session Length Rewards (Natural Progressive Enhancement)
      sessionRewards: [
        { duration: 30000, type: 'interface_enhancement', message: 'Interface unlocked: Smoother animations' },
        { duration: 120000, type: 'productivity_boost', message: 'Productivity boost: Quick actions enabled' },
        { duration: 300000, type: 'power_user', message: 'Power user mode: Advanced features unlocked' },
        { duration: 600000, type: 'dedication', message: 'Dedication recognized: Premium theme unlocked' }
      ],

      // Form Creation Milestones (Achievement-Based)
      formMilestones: [
        { count: 1, type: 'first_form', message: 'First form created!', celebration: 'gentle' },
        { count: 5, type: 'getting_started', message: 'You\'re getting the hang of this!', celebration: 'subtle' },
        { count: 10, type: 'form_builder', message: 'Form builder achievement unlocked', celebration: 'medium' },
        { count: 25, type: 'power_creator', message: 'Power creator status achieved', celebration: 'enhanced' },
        { count: 50, type: 'form_master', message: 'Form mastery unlocked', celebration: 'special' }
      ],

      // Engagement Patterns (Behavioral Rewards)
      engagementRewards: [
        { pattern: 'consecutive_days', threshold: 3, message: 'Consistency bonus: Daily streak started' },
        { pattern: 'feature_explorer', threshold: 5, message: 'Explorer bonus: Feature discovery complete' },
        { pattern: 'perfectionist', threshold: 3, message: 'Quality focus: Error-free streak' },
        { pattern: 'efficient_user', threshold: 10, message: 'Efficiency master: Quick completion bonus' }
      ],

      // Easter Eggs (Surprise Discoveries)
      easterEggs: [
        { trigger: 'konami_code', unlocked: false, reward: 'secret_animation_set' },
        { trigger: 'long_idle_return', unlocked: false, reward: 'welcome_back_surprise' },
        { trigger: 'midnight_usage', unlocked: false, reward: 'night_owl_theme' },
        { trigger: 'form_name_easter', unlocked: false, reward: 'creative_recognition' }
      ]
    };
  }

  /* ===================================================================
     USER PROGRESS TRACKING
     ================================================================= */

  loadUserProgress() {
    const stored = localStorage.getItem('snapit_user_progress');
    const defaultProgress = {
      totalForms: 0,
      sessionsCount: 0,
      totalSessionTime: 0,
      lastVisit: null,
      achievements: [],
      unlockedFeatures: [],
      easterEggsFound: [],
      streaks: {
        consecutive_days: 0,
        error_free: 0,
        quick_completions: 0
      },
      preferences: {
        celebrationIntensity: 'medium',
        rewardsEnabled: true,
        animationLevel: 'full'
      }
    };

    return stored ? { ...defaultProgress, ...JSON.parse(stored) } : defaultProgress;
  }

  saveUserProgress() {
    localStorage.setItem('snapit_user_progress', JSON.stringify(this.userProgress));
  }

  /* ===================================================================
     SESSION MANAGEMENT
     ================================================================= */

  trackSessionStart() {
    this.userProgress.sessionsCount++;
    this.userProgress.lastVisit = Date.now();
    this.saveUserProgress();
  }

  checkFirstSession() {
    return this.userProgress.sessionsCount <= 1;
  }

  getSessionDuration() {
    return Date.now() - this.sessionStart;
  }

  scheduleSessionRewards() {
    this.rewardConfig.sessionRewards.forEach(reward => {
      setTimeout(() => {
        if (this.getSessionDuration() >= reward.duration) {
          this.triggerSessionReward(reward);
        }
      }, reward.duration);
    });
  }

  /* ===================================================================
     MILESTONE DETECTION & REWARDS
     ================================================================= */

  checkFormCreationMilestone(formCount) {
    const milestone = this.rewardConfig.formMilestones.find(
      m => m.count === formCount && !this.userProgress.achievements.includes(m.type)
    );

    if (milestone) {
      this.triggerMilestoneReward(milestone);
      this.userProgress.achievements.push(milestone.type);
      this.userProgress.totalForms = formCount;
      this.saveUserProgress();
    }
  }

  checkEngagementPattern(patternType, value) {
    const pattern = this.rewardConfig.engagementRewards.find(
      p => p.pattern === patternType && value >= p.threshold
    );

    if (pattern && !this.userProgress.achievements.includes(patternType)) {
      this.triggerEngagementReward(pattern);
      this.userProgress.achievements.push(patternType);
      this.saveUserProgress();
    }
  }

  checkMilestones() {
    // Check if any milestones should be displayed based on current progress
    const currentFormCount = this.getCurrentFormCount();

    if (currentFormCount !== this.userProgress.totalForms) {
      this.checkFormCreationMilestone(currentFormCount);
    }
  }

  getCurrentFormCount() {
    // This would integrate with the actual form data
    // For now, we'll use a placeholder
    const forms = JSON.parse(localStorage.getItem('user_forms') || '[]');
    return forms.length;
  }

  /* ===================================================================
     REWARD TRIGGERING SYSTEM
     ================================================================= */

  triggerSessionReward(reward) {
    if (!this.userProgress.preferences.rewardsEnabled) return;

    const rewardElement = this.createRewardNotification({
      type: 'session',
      title: 'Session Reward',
      message: reward.message,
      icon: this.getRewardIcon(reward.type),
      style: 'subtle'
    });

    this.applySessionEnhancement(reward.type);
    this.showRewardNotification(rewardElement);
  }

  triggerMilestoneReward(milestone) {
    if (!this.userProgress.preferences.rewardsEnabled) return;

    const rewardElement = this.createRewardNotification({
      type: 'milestone',
      title: 'Achievement Unlocked',
      message: milestone.message,
      icon: this.getMilestoneIcon(milestone.type),
      style: milestone.celebration
    });

    this.applyCelebrationEffect(milestone.celebration);
    this.showRewardNotification(rewardElement);
  }

  triggerEngagementReward(pattern) {
    if (!this.userProgress.preferences.rewardsEnabled) return;

    const rewardElement = this.createRewardNotification({
      type: 'engagement',
      title: 'Bonus Unlocked',
      message: pattern.message,
      icon: '⭐',
      style: 'gentle'
    });

    this.showRewardNotification(rewardElement);
  }

  triggerEasterEgg(easterEgg) {
    if (!this.userProgress.preferences.rewardsEnabled) return;

    const rewardElement = this.createRewardNotification({
      type: 'easter_egg',
      title: 'Secret Discovered!',
      message: 'You found a hidden feature!',
      icon: '🥚',
      style: 'special'
    });

    this.unlockEasterEgg(easterEgg);
    this.showRewardNotification(rewardElement);
  }

  /* ===================================================================
     UI ENHANCEMENT SYSTEM
     ================================================================= */

  applySessionEnhancement(enhancementType) {
    const body = document.body;

    switch (enhancementType) {
      case 'interface_enhancement':
        body.classList.add('enhanced-animations');
        this.unlockFeature('smooth_animations');
        break;

      case 'productivity_boost':
        body.classList.add('quick-actions-enabled');
        this.unlockFeature('keyboard_shortcuts');
        this.addQuickActionButtons();
        break;

      case 'power_user':
        body.classList.add('power-user-mode');
        this.unlockFeature('advanced_options');
        this.enableAdvancedFeatures();
        break;

      case 'dedication':
        body.classList.add('premium-theme');
        this.unlockFeature('premium_theme');
        this.applyPremiumTheme();
        break;
    }
  }

  applyCelebrationEffect(intensity) {
    const body = document.body;

    switch (intensity) {
      case 'gentle':
        this.triggerGentleCelebration();
        break;

      case 'subtle':
        this.triggerSubtleCelebration();
        break;

      case 'medium':
        this.triggerMediumCelebration();
        break;

      case 'enhanced':
        this.triggerEnhancedCelebration();
        break;

      case 'special':
        this.triggerSpecialCelebration();
        break;
    }
  }

  /* ===================================================================
     CELEBRATION EFFECTS
     ================================================================= */

  triggerGentleCelebration() {
    const mainContent = document.querySelector('main, .main-content, body');
    if (mainContent) {
      mainContent.classList.add('celebrate-bounce');
      setTimeout(() => mainContent.classList.remove('celebrate-bounce'), 1000);
    }
  }

  triggerSubtleCelebration() {
    this.createFloatingEmoji('✨', 3);
    this.addTemporaryGlow('.btn-primary');
  }

  triggerMediumCelebration() {
    this.createFloatingEmoji('🎉', 5);
    this.addTemporaryGlow('.card, .btn');
    this.playSubtleSound('success');
  }

  triggerEnhancedCelebration() {
    this.createConfettiEffect(10);
    this.addTemporaryGlow('button, .card, .form-group');
    this.createSuccessMessage('Great work! Keep building amazing forms!');
  }

  triggerSpecialCelebration() {
    this.createConfettiEffect(20);
    this.addTemporaryGlow('*');
    this.createSpecialEffectOverlay();
    this.playSubtleSound('achievement');
  }

  /* ===================================================================
     VISUAL EFFECTS IMPLEMENTATION
     ================================================================= */

  createFloatingEmoji(emoji, count = 3) {
    for (let i = 0; i < count; i++) {
      const emojiElement = document.createElement('div');
      emojiElement.textContent = emoji;
      emojiElement.className = 'floating-emoji';
      emojiElement.style.cssText = `
        position: fixed;
        font-size: 24px;
        pointer-events: none;
        z-index: 9999;
        animation: floatUp 2s ease-out forwards;
        left: ${Math.random() * window.innerWidth}px;
        top: ${window.innerHeight}px;
      `;

      document.body.appendChild(emojiElement);

      setTimeout(() => {
        if (emojiElement.parentNode) {
          emojiElement.parentNode.removeChild(emojiElement);
        }
      }, 2000);
    }
  }

  createConfettiEffect(pieces = 10) {
    const colors = ['#aa336a', '#ff0077', '#10b981', '#3b82f6', '#f59e0b'];

    for (let i = 0; i < pieces; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        pointer-events: none;
        z-index: 9999;
        left: ${Math.random() * window.innerWidth}px;
        top: -10px;
        animation: confettiFall 3s linear forwards;
        animation-delay: ${Math.random() * 1000}ms;
      `;

      document.body.appendChild(confetti);

      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 4000);
    }
  }

  addTemporaryGlow(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.classList.add('success-glow');
      setTimeout(() => element.classList.remove('success-glow'), 1000);
    });
  }

  /* ===================================================================
     NOTIFICATION SYSTEM
     ================================================================= */

  createRewardNotification({ type, title, message, icon, style }) {
    const notification = document.createElement('div');
    notification.className = `reward-notification reward-${type} reward-${style}`;
    notification.innerHTML = `
      <div class="reward-icon">${icon}</div>
      <div class="reward-content">
        <div class="reward-title">${title}</div>
        <div class="reward-message">${message}</div>
      </div>
      <button class="reward-close" aria-label="Close notification">&times;</button>
    `;

    notification.style.cssText = `
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
      max-width: 350px;
      z-index: 10000;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.4s ease-out;
      border-left: 4px solid var(--color-brand-pink);
    `;

    return notification;
  }

  showRewardNotification(notification) {
    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    });

    // Add close functionality
    const closeBtn = notification.querySelector('.reward-close');
    closeBtn.addEventListener('click', () => this.hideNotification(notification));

    // Auto-hide after delay
    setTimeout(() => {
      if (notification.parentNode) {
        this.hideNotification(notification);
      }
    }, 5000);
  }

  hideNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 400);
  }

  /* ===================================================================
     FEATURE UNLOCKING SYSTEM
     ================================================================= */

  unlockFeature(featureName) {
    if (!this.userProgress.unlockedFeatures.includes(featureName)) {
      this.userProgress.unlockedFeatures.push(featureName);
      this.saveUserProgress();
      this.activateFeature(featureName);
    }
  }

  activateFeature(featureName) {
    switch (featureName) {
      case 'smooth_animations':
        document.body.classList.add('smooth-animations-enabled');
        break;

      case 'keyboard_shortcuts':
        this.enableKeyboardShortcuts();
        break;

      case 'advanced_options':
        this.showAdvancedOptions();
        break;

      case 'premium_theme':
        this.applyPremiumTheme();
        break;
    }
  }

  /* ===================================================================
     EASTER EGG SYSTEM
     ================================================================= */

  initializeEasterEggs() {
    // Konami Code
    this.konamiCode = [];
    this.konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

    // Long idle detection
    this.idleTimer = null;
    this.isIdle = false;

    // Midnight usage detection
    this.checkMidnightUsage();

    // Creative form name detection
    this.setupFormNameEasterEggs();
  }

  setupFormNameEasterEggs() {
    const creativeNames = ['hello world', 'test form', '42', 'the answer', 'easter egg', 'surprise me'];

    document.addEventListener('input', (e) => {
      if (e.target.name === 'formName' || e.target.id === 'formName') {
        const value = e.target.value.toLowerCase();
        if (creativeNames.includes(value)) {
          this.triggerEasterEgg({ trigger: 'form_name_easter', reward: 'creative_recognition' });
        }
      }
    });
  }

  checkMidnightUsage() {
    const now = new Date();
    if (now.getHours() >= 23 || now.getHours() <= 5) {
      setTimeout(() => {
        this.triggerEasterEgg({ trigger: 'midnight_usage', reward: 'night_owl_theme' });
      }, 30000); // After 30 seconds of midnight usage
    }
  }

  unlockEasterEgg(easterEgg) {
    if (!this.userProgress.easterEggsFound.includes(easterEgg.trigger)) {
      this.userProgress.easterEggsFound.push(easterEgg.trigger);
      this.saveUserProgress();
      this.applyEasterEggReward(easterEgg.reward);
    }
  }

  /* ===================================================================
     EVENT LISTENERS
     ================================================================= */

  bindEventListeners() {
    // Form creation tracking
    document.addEventListener('formCreated', (e) => {
      this.handleFormCreated(e.detail);
    });

    // Form submission tracking
    document.addEventListener('formSubmitted', (e) => {
      this.handleFormSubmitted(e.detail);
    });

    // User interaction tracking
    document.addEventListener('click', (e) => {
      this.trackUserInteraction('click', e.target);
    });

    // Idle detection
    this.setupIdleDetection();

    // Konami code detection
    document.addEventListener('keydown', (e) => {
      this.handleKonamiCode(e.code);
    });

    // Welcome back detection
    window.addEventListener('focus', () => {
      this.handleWindowFocus();
    });
  }

  setupIdleDetection() {
    const idleTime = 300000; // 5 minutes
    let idleTimer;

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      this.isIdle = false;
      idleTimer = setTimeout(() => {
        this.isIdle = true;
      }, idleTime);
    };

    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, resetIdleTimer, true);
    });

    resetIdleTimer();
  }

  handleKonamiCode(keyCode) {
    this.konamiCode.push(keyCode);

    if (this.konamiCode.length > this.konamiSequence.length) {
      this.konamiCode.shift();
    }

    if (this.konamiCode.join(',') === this.konamiSequence.join(',')) {
      this.triggerEasterEgg({ trigger: 'konami_code', reward: 'secret_animation_set' });
      this.konamiCode = [];
    }
  }

  handleWindowFocus() {
    if (this.isIdle) {
      this.triggerEasterEgg({ trigger: 'long_idle_return', reward: 'welcome_back_surprise' });
      this.isIdle = false;
    }
  }

  /* ===================================================================
     UTILITY FUNCTIONS
     ================================================================= */

  getRewardIcon(type) {
    const icons = {
      interface_enhancement: '✨',
      productivity_boost: '⚡',
      power_user: '🚀',
      dedication: '👑'
    };
    return icons[type] || '🎉';
  }

  getMilestoneIcon(type) {
    const icons = {
      first_form: '🎯',
      getting_started: '📈',
      form_builder: '🏗️',
      power_creator: '⭐',
      form_master: '🏆'
    };
    return icons[type] || '🎉';
  }

  playSubtleSound(type) {
    // Only play if user hasn't disabled sounds
    if (this.userProgress.preferences.soundEnabled !== false) {
      // Implement subtle sound effects
      // This would integrate with a sound library or Web Audio API
    }
  }

  /* ===================================================================
     WELCOME BACK SYSTEM
     ================================================================= */

  checkForWelcomeBack() {
    const lastVisit = this.userProgress.lastVisit;
    const now = Date.now();
    const daysSinceLastVisit = (now - lastVisit) / (1000 * 60 * 60 * 24);

    if (lastVisit && daysSinceLastVisit >= 1 && daysSinceLastVisit <= 7) {
      setTimeout(() => {
        this.showWelcomeBackMessage(Math.floor(daysSinceLastVisit));
      }, 2000); // Show after 2 seconds
    }
  }

  showWelcomeBackMessage(daysAway) {
    const message = daysAway === 1 ?
      'Welcome back! Ready to create something amazing?' :
      `Welcome back! It's been ${daysAway} days. Let's build something great!`;

    const welcomeElement = this.createRewardNotification({
      type: 'welcome_back',
      title: 'Welcome Back!',
      message: message,
      icon: '👋',
      style: 'gentle'
    });

    welcomeElement.classList.add('welcome-back');
    this.showRewardNotification(welcomeElement);
  }

  /* ===================================================================
     PUBLIC API
     ================================================================= */

  // Public methods for integration with the main application
  trackFormCreated(formData) {
    this.handleFormCreated(formData);
  }

  trackFormSubmitted(submissionData) {
    this.handleFormSubmitted(submissionData);
  }

  trackFeatureUsed(featureName) {
    this.sessionEvents.push({
      type: 'feature_used',
      feature: featureName,
      timestamp: Date.now()
    });
  }

  setRewardPreference(preference, value) {
    this.userProgress.preferences[preference] = value;
    this.saveUserProgress();
  }

  getUserProgress() {
    return { ...this.userProgress };
  }

  resetProgress() {
    localStorage.removeItem('snapit_user_progress');
    this.userProgress = this.loadUserProgress();
  }
}

/* ===================================================================
   FLOATING ANIMATION KEYFRAMES
   ================================================================= */

const rewardSystemStyles = document.createElement('style');
rewardSystemStyles.textContent = `
  @keyframes floatUp {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(-200px) rotate(360deg);
      opacity: 0;
    }
  }

  .reward-notification {
    font-family: var(--font-family, 'Inter', sans-serif);
    animation: slideInFromRight 0.4s ease-out;
  }

  @keyframes slideInFromRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .enhanced-animations * {
    transition-duration: 0.3s !important;
  }

  .smooth-animations-enabled {
    scroll-behavior: smooth;
  }

  .smooth-animations-enabled * {
    transition: all 0.2s ease-out;
  }

  .premium-theme {
    filter: saturate(1.1) brightness(1.02);
  }
`;

document.head.appendChild(rewardSystemStyles);

/* ===================================================================
   INITIALIZATION
   ================================================================= */

// Initialize the reward system when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (typeof window !== 'undefined') {
    window.rewardSystem = new NonIntrusiveRewardSystem();
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NonIntrusiveRewardSystem;
}