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

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initScrollAnimations);
