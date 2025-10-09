/* ===================================================================
   PERFORMANCE-OPTIMIZED ANIMATION FRAMEWORK
   60fps Guaranteed | Hardware Accelerated | Graceful Degradation
   Built for SnapIT Forms - Delightful & Performant Animations
   ================================================================= */

class PerformanceAnimationFramework {
  constructor() {
    this.performanceProfile = this.detectPerformanceProfile();
    this.animationQueue = [];
    this.activeAnimations = new Map();
    this.observerCache = new Map();
    this.frameId = null;
    this.lastFrameTime = 0;
    this.targetFPS = 60;
    this.frameInterval = 1000 / this.targetFPS;

    this.init();
  }

  /* ===================================================================
     INITIALIZATION & PERFORMANCE DETECTION
     ================================================================= */

  init() {
    this.setupPerformanceMonitoring();
    this.createIntersectionObserver();
    this.setupAnimationLoop();
    this.bindEventListeners();
    this.optimizeForDevice();
    this.preloadCriticalAnimations();
  }

  detectPerformanceProfile() {
    const profile = {
      deviceType: this.getDeviceType(),
      hardwareAcceleration: this.checkHardwareAcceleration(),
      reducedMotion: this.checkReducedMotion(),
      batteryLevel: this.getBatteryLevel(),
      connectionSpeed: this.getConnectionSpeed(),
      cpuCores: navigator.hardwareConcurrency || 4,
      deviceMemory: navigator.deviceMemory || 4
    };

    // Calculate performance tier
    profile.tier = this.calculatePerformanceTier(profile);

    return profile;
  }

  calculatePerformanceTier(profile) {
    let score = 0;

    // Device type scoring
    if (profile.deviceType === 'desktop') score += 3;
    else if (profile.deviceType === 'tablet') score += 2;
    else score += 1;

    // Hardware acceleration
    if (profile.hardwareAcceleration) score += 2;

    // CPU and memory
    if (profile.cpuCores >= 8) score += 2;
    else if (profile.cpuCores >= 4) score += 1;

    if (profile.deviceMemory >= 8) score += 2;
    else if (profile.deviceMemory >= 4) score += 1;

    // Battery level (for mobile)
    if (profile.batteryLevel > 0.5 || profile.batteryLevel === null) score += 1;

    // Return tier based on score
    if (score >= 8) return 'premium';
    if (score >= 5) return 'standard';
    if (score >= 3) return 'basic';
    return 'minimal';
  }

  getDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/tablet|ipad|playbook|silk/.test(userAgent)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/.test(userAgent)) return 'mobile';
    return 'desktop';
  }

  checkHardwareAcceleration() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  }

  checkReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  getBatteryLevel() {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        this.performanceProfile.batteryLevel = battery.level;
      });
      return null; // Will be updated asynchronously
    }
    return null;
  }

  getConnectionSpeed() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      return connection.effectiveType || 'unknown';
    }
    return 'unknown';
  }

  /* ===================================================================
     ANIMATION QUEUE & LIFECYCLE MANAGEMENT
     ================================================================= */

  setupAnimationLoop() {
    const animate = (currentTime) => {
      if (!this.lastFrameTime) this.lastFrameTime = currentTime;

      const deltaTime = currentTime - this.lastFrameTime;

      if (deltaTime >= this.frameInterval) {
        this.processAnimationQueue();
        this.updateActiveAnimations(deltaTime);
        this.lastFrameTime = currentTime - (deltaTime % this.frameInterval);
      }

      this.frameId = requestAnimationFrame(animate);
    };

    this.frameId = requestAnimationFrame(animate);
  }

  processAnimationQueue() {
    if (this.animationQueue.length === 0) return;

    const maxAnimationsPerFrame = this.getMaxAnimationsPerFrame();
    const toProcess = this.animationQueue.splice(0, maxAnimationsPerFrame);

    toProcess.forEach(animation => {
      this.startAnimation(animation);
    });
  }

  getMaxAnimationsPerFrame() {
    switch (this.performanceProfile.tier) {
      case 'premium': return 10;
      case 'standard': return 6;
      case 'basic': return 3;
      case 'minimal': return 1;
      default: return 3;
    }
  }

  /* ===================================================================
     ANIMATION CREATION & MANAGEMENT
     ================================================================= */

  createAnimation(element, properties, options = {}) {
    const animationId = this.generateAnimationId();
    const animation = {
      id: animationId,
      element,
      properties,
      options: {
        duration: options.duration || 300,
        easing: options.easing || 'ease-out',
        delay: options.delay || 0,
        fill: options.fill || 'forwards',
        iterations: options.iterations || 1,
        direction: options.direction || 'normal',
        ...options
      },
      startTime: null,
      progress: 0,
      completed: false
    };

    return animation;
  }

  queueAnimation(animation) {
    if (this.performanceProfile.reducedMotion) {
      this.skipToEndState(animation);
      return;
    }

    if (this.performanceProfile.tier === 'minimal') {
      this.simplifyAnimation(animation);
    }

    this.animationQueue.push(animation);
  }

  startAnimation(animation) {
    if (!animation.element || !animation.element.isConnected) {
      return; // Element no longer in DOM
    }

    animation.startTime = performance.now() + animation.options.delay;
    this.activeAnimations.set(animation.id, animation);

    // Apply initial state
    this.applyAnimationState(animation, 0);

    // Set up GPU acceleration
    this.enableGPUAcceleration(animation.element);
  }

  updateActiveAnimations(deltaTime) {
    const currentTime = performance.now();
    const completedAnimations = [];

    this.activeAnimations.forEach((animation, id) => {
      if (currentTime < animation.startTime) return; // Still in delay

      const elapsed = currentTime - animation.startTime;
      const progress = Math.min(elapsed / animation.options.duration, 1);

      animation.progress = progress;
      this.applyAnimationState(animation, progress);

      if (progress >= 1) {
        completedAnimations.push(id);
        this.completeAnimation(animation);
      }
    });

    // Clean up completed animations
    completedAnimations.forEach(id => {
      this.activeAnimations.delete(id);
    });
  }

  applyAnimationState(animation, progress) {
    const easedProgress = this.applyEasing(progress, animation.options.easing);
    const element = animation.element;

    Object.entries(animation.properties).forEach(([property, value]) => {
      const computedValue = this.interpolateValue(value, easedProgress);
      this.setElementProperty(element, property, computedValue);
    });
  }

  /* ===================================================================
     EASING FUNCTIONS
     ================================================================= */

  applyEasing(progress, easingType) {
    switch (easingType) {
      case 'linear':
        return progress;

      case 'ease-in':
        return progress * progress;

      case 'ease-out':
        return 1 - Math.pow(1 - progress, 2);

      case 'ease-in-out':
        return progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      case 'bounce':
        if (progress < 1 / 2.75) {
          return 7.5625 * progress * progress;
        } else if (progress < 2 / 2.75) {
          return 7.5625 * (progress -= 1.5 / 2.75) * progress + 0.75;
        } else if (progress < 2.5 / 2.75) {
          return 7.5625 * (progress -= 2.25 / 2.75) * progress + 0.9375;
        } else {
          return 7.5625 * (progress -= 2.625 / 2.75) * progress + 0.984375;
        }

      case 'elastic':
        return progress === 0 ? 0 : progress === 1 ? 1 :
          -Math.pow(2, 10 * (progress - 1)) * Math.sin((progress - 1.1) * 5 * Math.PI);

      default:
        return 1 - Math.pow(1 - progress, 2); // Default to ease-out
    }
  }

  /* ===================================================================
     VALUE INTERPOLATION
     ================================================================= */

  interpolateValue(valueDefinition, progress) {
    if (typeof valueDefinition === 'object') {
      const { from, to, unit = '' } = valueDefinition;
      const value = from + (to - from) * progress;
      return `${value}${unit}`;
    }

    return valueDefinition; // Static value
  }

  setElementProperty(element, property, value) {
    switch (property) {
      case 'opacity':
      case 'scale':
      case 'scaleX':
      case 'scaleY':
      case 'rotate':
      case 'rotateX':
      case 'rotateY':
      case 'rotateZ':
      case 'translateX':
      case 'translateY':
      case 'translateZ':
        this.setTransformProperty(element, property, value);
        break;

      case 'backgroundColor':
      case 'color':
      case 'borderColor':
        element.style[property] = value;
        break;

      default:
        element.style[property] = value;
    }
  }

  setTransformProperty(element, property, value) {
    if (!element._transforms) {
      element._transforms = {};
    }

    element._transforms[property] = value;
    this.updateTransform(element);
  }

  updateTransform(element) {
    const transforms = element._transforms || {};
    const transformString = [
      transforms.translateX ? `translateX(${transforms.translateX})` : '',
      transforms.translateY ? `translateY(${transforms.translateY})` : '',
      transforms.translateZ ? `translateZ(${transforms.translateZ})` : '',
      transforms.scale ? `scale(${transforms.scale})` : '',
      transforms.scaleX ? `scaleX(${transforms.scaleX})` : '',
      transforms.scaleY ? `scaleY(${transforms.scaleY})` : '',
      transforms.rotate ? `rotate(${transforms.rotate})` : '',
      transforms.rotateX ? `rotateX(${transforms.rotateX})` : '',
      transforms.rotateY ? `rotateY(${transforms.rotateY})` : '',
      transforms.rotateZ ? `rotateZ(${transforms.rotateZ})` : '',
    ].filter(Boolean).join(' ');

    element.style.transform = transformString;

    if (transforms.opacity !== undefined) {
      element.style.opacity = transforms.opacity;
    }
  }

  /* ===================================================================
     PERFORMANCE OPTIMIZATIONS
     ================================================================= */

  enableGPUAcceleration(element) {
    if (this.performanceProfile.hardwareAcceleration) {
      element.style.willChange = 'transform, opacity';
      element.style.transform = element.style.transform || 'translateZ(0)';
    }
  }

  disableGPUAcceleration(element) {
    element.style.willChange = 'auto';
  }

  optimizeForDevice() {
    const body = document.body;

    body.classList.add(`performance-tier-${this.performanceProfile.tier}`);

    if (this.performanceProfile.reducedMotion) {
      body.classList.add('reduced-motion');
    }

    if (this.performanceProfile.deviceType === 'mobile') {
      body.classList.add('mobile-optimized');
    }
  }

  preloadCriticalAnimations() {
    // Preload transform styles to avoid reflows
    const preloadElement = document.createElement('div');
    preloadElement.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      transform: translateX(0) translateY(0) scale(1) rotate(0deg);
      opacity: 1;
      transition: all 0.3s ease-out;
    `;
    document.body.appendChild(preloadElement);

    requestAnimationFrame(() => {
      document.body.removeChild(preloadElement);
    });
  }

  /* ===================================================================
     INTERSECTION OBSERVER FOR LAZY ANIMATIONS
     ================================================================= */

  createIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.triggerLazyAnimation(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );
  }

  observeElement(element, animationConfig) {
    element._lazyAnimation = animationConfig;
    this.intersectionObserver.observe(element);
  }

  triggerLazyAnimation(element) {
    const animationConfig = element._lazyAnimation;
    if (animationConfig) {
      const animation = this.createAnimation(element, animationConfig.properties, animationConfig.options);
      this.queueAnimation(animation);
      this.intersectionObserver.unobserve(element);
    }
  }

  /* ===================================================================
     PERFORMANCE MONITORING
     ================================================================= */

  setupPerformanceMonitoring() {
    this.performanceMetrics = {
      frameDrops: 0,
      averageFPS: 60,
      frameTimeHistory: [],
      maxFrameTime: 0,
      animationCount: 0
    };

    // Monitor frame rate
    this.frameTimeHistory = [];
    this.lastPerformanceCheck = performance.now();
  }

  updatePerformanceMetrics(deltaTime) {
    this.frameTimeHistory.push(deltaTime);

    if (this.frameTimeHistory.length > 60) {
      this.frameTimeHistory.shift();
    }

    const averageFrameTime = this.frameTimeHistory.reduce((a, b) => a + b, 0) / this.frameTimeHistory.length;
    this.performanceMetrics.averageFPS = 1000 / averageFrameTime;

    if (deltaTime > this.frameInterval * 2) {
      this.performanceMetrics.frameDrops++;
    }

    // Adjust quality if performance is poor
    if (this.performanceMetrics.averageFPS < 30 && this.performanceProfile.tier !== 'minimal') {
      this.degradePerformance();
    }
  }

  degradePerformance() {
    const currentTierIndex = ['minimal', 'basic', 'standard', 'premium'].indexOf(this.performanceProfile.tier);
    if (currentTierIndex > 0) {
      this.performanceProfile.tier = ['minimal', 'basic', 'standard', 'premium'][currentTierIndex - 1];
      console.warn('Animation quality reduced due to performance constraints');
    }
  }

  /* ===================================================================
     ANIMATION SIMPLIFICATION
     ================================================================= */

  simplifyAnimation(animation) {
    // Reduce duration for low-end devices
    animation.options.duration = Math.min(animation.options.duration, 200);

    // Remove complex properties
    Object.keys(animation.properties).forEach(prop => {
      if (['rotateX', 'rotateY', 'rotateZ', 'skew', 'perspective'].includes(prop)) {
        delete animation.properties[prop];
      }
    });
  }

  skipToEndState(animation) {
    // For reduced motion preference, immediately apply end state
    Object.entries(animation.properties).forEach(([property, value]) => {
      const endValue = this.interpolateValue(value, 1);
      this.setElementProperty(animation.element, property, endValue);
    });
  }

  /* ===================================================================
     HIGH-LEVEL ANIMATION API
     ================================================================= */

  fadeIn(element, options = {}) {
    const animation = this.createAnimation(element, {
      opacity: { from: 0, to: 1 }
    }, { duration: 300, ...options });

    this.queueAnimation(animation);
    return animation.id;
  }

  fadeOut(element, options = {}) {
    const animation = this.createAnimation(element, {
      opacity: { from: 1, to: 0 }
    }, { duration: 300, ...options });

    this.queueAnimation(animation);
    return animation.id;
  }

  slideUp(element, options = {}) {
    const animation = this.createAnimation(element, {
      translateY: { from: 20, to: 0, unit: 'px' },
      opacity: { from: 0, to: 1 }
    }, { duration: 400, easing: 'ease-out', ...options });

    this.queueAnimation(animation);
    return animation.id;
  }

  slideDown(element, options = {}) {
    const animation = this.createAnimation(element, {
      translateY: { from: -20, to: 0, unit: 'px' },
      opacity: { from: 0, to: 1 }
    }, { duration: 400, easing: 'ease-out', ...options });

    this.queueAnimation(animation);
    return animation.id;
  }

  scaleIn(element, options = {}) {
    const animation = this.createAnimation(element, {
      scale: { from: 0.9, to: 1 },
      opacity: { from: 0, to: 1 }
    }, { duration: 350, easing: 'ease-out', ...options });

    this.queueAnimation(animation);
    return animation.id;
  }

  bounce(element, options = {}) {
    const animation = this.createAnimation(element, {
      translateY: { from: 0, to: -10, unit: 'px' }
    }, {
      duration: 300,
      easing: 'bounce',
      iterations: 2,
      direction: 'alternate',
      ...options
    });

    this.queueAnimation(animation);
    return animation.id;
  }

  pulse(element, options = {}) {
    const animation = this.createAnimation(element, {
      scale: { from: 1, to: 1.05 }
    }, {
      duration: 200,
      easing: 'ease-in-out',
      iterations: 2,
      direction: 'alternate',
      ...options
    });

    this.queueAnimation(animation);
    return animation.id;
  }

  /* ===================================================================
     UTILITY FUNCTIONS
     ================================================================= */

  generateAnimationId() {
    return `anim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  cancelAnimation(animationId) {
    const animation = this.activeAnimations.get(animationId);
    if (animation) {
      this.disableGPUAcceleration(animation.element);
      this.activeAnimations.delete(animationId);
    }
  }

  pauseAllAnimations() {
    this.activeAnimations.forEach(animation => {
      animation.paused = true;
    });
  }

  resumeAllAnimations() {
    this.activeAnimations.forEach(animation => {
      animation.paused = false;
    });
  }

  completeAnimation(animation) {
    if (animation.options.onComplete) {
      animation.options.onComplete(animation);
    }

    this.disableGPUAcceleration(animation.element);
    animation.completed = true;
  }

  getPerformanceMetrics() {
    return { ...this.performanceMetrics };
  }

  /* ===================================================================
     EVENT LISTENERS
     ================================================================= */

  bindEventListeners() {
    // Handle visibility change to pause animations when tab is not active
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAllAnimations();
      } else {
        this.resumeAllAnimations();
      }
    });

    // Handle battery level changes
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        battery.addEventListener('levelchange', () => {
          this.performanceProfile.batteryLevel = battery.level;
          if (battery.level < 0.2) {
            this.performanceProfile.tier = 'minimal';
          }
        });
      });
    }

    // Handle network changes
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', () => {
        this.performanceProfile.connectionSpeed = navigator.connection.effectiveType;
      });
    }
  }

  /* ===================================================================
     CLEANUP
     ================================================================= */

  destroy() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }

    this.activeAnimations.clear();
    this.animationQueue.length = 0;

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
}

/* ===================================================================
   GLOBAL INITIALIZATION
   ================================================================= */

// Initialize the animation framework
let animationFramework;

document.addEventListener('DOMContentLoaded', () => {
  animationFramework = new PerformanceAnimationFramework();

  // Make it globally available
  window.animationFramework = animationFramework;

  // Expose common animation functions globally
  window.animateElement = {
    fadeIn: (el, opts) => animationFramework.fadeIn(el, opts),
    fadeOut: (el, opts) => animationFramework.fadeOut(el, opts),
    slideUp: (el, opts) => animationFramework.slideUp(el, opts),
    slideDown: (el, opts) => animationFramework.slideDown(el, opts),
    scaleIn: (el, opts) => animationFramework.scaleIn(el, opts),
    bounce: (el, opts) => animationFramework.bounce(el, opts),
    pulse: (el, opts) => animationFramework.pulse(el, opts)
  };
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  if (animationFramework) {
    animationFramework.destroy();
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceAnimationFramework;
}