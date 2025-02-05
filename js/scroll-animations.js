// Optimized scroll animations
(() => {
    // Animation configuration
    const config = {
        fadeIn: {
            threshold: 0.1,
            rootMargin: '50px',
            classNames: {
                visible: 'visible',
                hidden: 'hidden'
            }
        },
        parallax: {
            threshold: Array.from({ length: 100 }, (_, i) => i / 100),
            rootMargin: '50px'
        }
    };

    // Utility function to handle element animations
    function handleAnimation(element, ratio, animationType = 'fade') {
        if (animationType === 'fade') {
            element.classList.toggle(config.fadeIn.classNames.visible, ratio > config.fadeIn.threshold);
        } else if (animationType === 'parallax') {
            const speed = element.dataset.parallaxSpeed || 0.5;
            const yOffset = (1 - ratio) * 100 * speed;
            element.style.transform = `translate3d(0, ${yOffset}px, 0)`;
            element.style.opacity = ratio;
        }
    }

    // Create observers
    const fadeObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    handleAnimation(entry.target, entry.intersectionRatio);
                    // Unobserve after animation is complete for better performance
                    if (entry.intersectionRatio > config.fadeIn.threshold) {
                        fadeObserver.unobserve(entry.target);
                    }
                }
            });
        },
        {
            threshold: config.fadeIn.threshold,
            rootMargin: config.fadeIn.rootMargin
        }
    );

    const parallaxObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting || entry.intersectionRatio > 0) {
                    handleAnimation(entry.target, entry.intersectionRatio, 'parallax');
                }
            });
        },
        {
            threshold: config.parallax.threshold,
            rootMargin: config.parallax.rootMargin
        }
    );

    // Initialize animations
    function initializeAnimations() {
        // Fade in animations
        document.querySelectorAll('.fade-in:not(.initialized)').forEach(element => {
            element.classList.add('initialized');
            fadeObserver.observe(element);
        });

        // Parallax animations
        document.querySelectorAll('[data-parallax]:not(.initialized)').forEach(element => {
            element.classList.add('initialized');
            parallaxObserver.observe(element);
        });
    }

    // Initialize on DOM content loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAnimations);
    } else {
        initializeAnimations();
    }

    // Re-initialize animations when new content is loaded
    document.addEventListener('contentLoaded', initializeAnimations);

    // Cleanup function
    function cleanup() {
        fadeObserver.disconnect();
        parallaxObserver.disconnect();
    }

    // Export cleanup function for potential use
    window.cleanupScrollAnimations = cleanup;
})();
