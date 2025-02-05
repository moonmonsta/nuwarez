// Scroll Animation Handler
const initScrollAnimations = () => {
  // Options for the Intersection Observer
  const options = {
    root: null, // Use viewport as root
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of element is visible
  };

  // Callback function when elements intersect
  const handleIntersect = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Once revealed, no need to observe anymore
        observer.unobserve(entry.target);
      }
    });
  };

  // Create observer
  const observer = new IntersectionObserver(handleIntersect, options);

  // Get all elements to animate
  const elements = document.querySelectorAll('section, .content-block, .hero-content > *, .section-title');

  // Add scroll-reveal class and observe each element
  elements.forEach(element => {
    // Skip elements that should not be animated in reduced motion mode
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.classList.add('revealed');
      return;
    }

    element.classList.add('scroll-reveal');
    observer.observe(element);
  });
};

// Sticky Header Handler
const initStickyHeader = () => {
  const nav = document.querySelector('nav');
  let lastScrollY = window.scrollY;
  let ticking = false;

  // Throttled scroll handler
  const updateNav = () => {
    const scrollY = window.scrollY;

    // Add scrolled class when page is scrolled
    if (scrollY > 0) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }

    // Hide nav when scrolling down, show when scrolling up
    if (scrollY > lastScrollY && scrollY > 100) {
      nav.classList.add('nav-hidden');
    } else {
      nav.classList.remove('nav-hidden');
    }

    lastScrollY = scrollY;
    ticking = false;
  };

  // Throttle scroll events
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  };

  // Use Intersection Observer for better performance
  const headerObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }
    },
    {
      rootMargin: '-100px 0px 0px 0px',
      threshold: 0
    }
  );

  // Observe the header
  const header = document.querySelector('.hero');
  if (header) {
    headerObserver.observe(header);
  }

  // Add scroll listener with passive option for better performance
  window.addEventListener('scroll', onScroll, { passive: true });
};

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initStickyHeader();
});
