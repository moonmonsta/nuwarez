// Pattern Animation Controller
class PatternAnimationController {
  constructor() {
    try {
      this.blocks = document.querySelectorAll('.block-background');
      if (this.blocks.length > 0) {
        this.init();
      }
    } catch (error) {
      console.warn('Pattern Animation Controller initialization failed:', error);
    }
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    }
    this.setupScrollHandler();
    // Initial update
    this.updatePatternOpacity();
  }

  setupIntersectionObserver() {
    try {
      const options = {
        root: null,
        rootMargin: '50px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              entry.target.style.animation = 'patternShift 8s ease-in-out infinite';
            });
          } else {
            entry.target.style.animation = 'none';
          }
        });
      }, options);

      this.blocks.forEach(block => observer.observe(block));
    } catch (error) {
      console.warn('IntersectionObserver setup failed:', error);
    }
  }

  setupScrollHandler() {
    let ticking = false;
    let lastKnownScrollPosition = window.scrollY;
    
    window.addEventListener('scroll', () => {
      lastKnownScrollPosition = window.scrollY;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.updatePatternOpacity(lastKnownScrollPosition);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  updatePatternOpacity(scrollY = window.scrollY) {
    try {
      this.blocks.forEach(block => {
        const rect = block.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate how far the block is through the viewport
        const percentThrough = (viewportHeight - rect.top) / (viewportHeight + rect.height);
        
        // Clamp the value between 0 and 1
        const normalized = Math.max(0, Math.min(1, percentThrough));
        
        // Create a bell curve effect with smoother transition
        const opacity = 0.05 + (Math.sin(normalized * Math.PI) * 0.03);
        const accentOpacity = opacity * 0.6;
        
        requestAnimationFrame(() => {
          block.style.setProperty('--pattern-opacity-base', opacity.toFixed(3));
          block.style.setProperty('--pattern-opacity-accent', accentOpacity.toFixed(3));
        });
      });
    } catch (error) {
      console.warn('Pattern opacity update failed:', error);
    }
  }
}

// Initialize the controller when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--pattern-speed', '0s');
  }
  
  // Initialize controller
  const controller = new PatternAnimationController();
  
  // Handle reduced motion preference changes
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
    document.documentElement.style.setProperty('--pattern-speed', e.matches ? '0s' : '30s');
  });
});
