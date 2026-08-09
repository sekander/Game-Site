// src/utils/scrollAnimations.js

export class ScrollAnimator {
  constructor() {
    this.observer = null;
    this.elements = new Set();
    this.animatedElements = new Set();
    this.init();
  }

  init() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: this.calculateThreshold()
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateIn(entry.target);
        }
      });
    }, options);
  }

  calculateThreshold() {
    return window.innerWidth < 768 ? 0.05 : 0.1;
  }

  animateIn(element) {
    if (this.animatedElements.has(element)) return;

    this.animatedElements.add(element);

    requestAnimationFrame(() => {
      element.classList.add('animate');
      void element.offsetHeight; // force reflow
      element.style.opacity = '1';
      element.style.transform = 'none';
    });
  }

  resetElement(element) {
    element.classList.remove('animate');
    this.animatedElements.delete(element);
    element.style.opacity = '0';

    if (element.classList.contains('fade-in-up')) element.style.transform = 'translateY(30px)';
    else if (element.classList.contains('fade-in-down')) element.style.transform = 'translateY(-30px)';
    else if (element.classList.contains('fade-in-left')) element.style.transform = 'translateX(-50px)';
    else if (element.classList.contains('fade-in-right')) element.style.transform = 'translateX(50px)';
    else if (element.classList.contains('scale-in')) element.style.transform = 'scale(0.9)';
    else if (element.classList.contains('section-fade')) element.style.transform = 'translateY(50px)';

    if (this.observer) {
      this.observer.unobserve(element);
      this.observer.observe(element);
    }
  }

  observeElement(element) {
    if (!element || !this.observer) return;
    this.resetElement(element);
    this.observer.observe(element);
    this.elements.add(element);
  }

  observeElements(selector) {
    document.querySelectorAll(selector).forEach(el => this.observeElement(el));
  }

  resetAllAnimations() {
    this.elements.forEach(el => this.resetElement(el));
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.elements.clear();
      this.animatedElements.clear();
    }
  }
}

// --- ONE-TIME GLOBAL ANIMATOR ---
let globalAnimator = null;
let animationsInitialized = false;

/**
 * Initialize scroll animations only once
 * Subsequent calls return the same animator instance
 */

let scrollAnimationInitCount = 0;

export const initScrollAnimationsOnce = () => {
  if (!animationsInitialized) {
    if (globalAnimator) globalAnimator.destroy();

    globalAnimator = new ScrollAnimator();

    const selectors = [
      '.fade-in-up',
      '.fade-in-down',
      '.fade-in-left',
      '.fade-in-right',
      '.scale-in',
      '.section-fade',
      '.animate-on-enter'
    ];

    selectors.forEach(selector => globalAnimator.observeElements(selector));

    animationsInitialized = true;
        // Increment the static counter
  scrollAnimationInitCount += 1;
  console.log(`Scroll animations initialized ${scrollAnimationInitCount} time(s)`);

  }

  return globalAnimator;
};

// Legacy export
export const initScrollAnimations = initScrollAnimationsOnce;

export const getScrollAnimationInitCount = () => scrollAnimationInitCount;

export const resetAnimations = () => {
  if (globalAnimator) globalAnimator.resetAllAnimations();
};

export const animateElement = (element, animationClass) => {
  if (!element || !animationClass) return;
  element.classList.add(animationClass);
  setTimeout(() => element.classList.add('animate'), 10);
};

export const staggerAnimation = (elements, baseDelay = 100) => {
  elements.forEach((el, i) => {
    setTimeout(() => {
      if (!el.classList.contains('animate')) el.classList.add('animate');
    }, i * baseDelay);
  });
};

export const initParallax = () => {
  const parallaxElements = document.querySelectorAll('.parallax-section');
  const handleScroll = () => {
    const scrolled = window.pageYOffset;
    parallaxElements.forEach(el => {
      el.style.transform = `translateY(${scrolled * -0.5}px)`;
    });
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
};

export { globalAnimator };

