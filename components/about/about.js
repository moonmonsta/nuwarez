class About {
    constructor() {
        this.stats = document.querySelectorAll('.about__stat');
        this.values = document.querySelectorAll('.about__value');
        this.image = document.querySelector('.about__team-image');
        
        this.init();
    }

    init() {
        // Add intersection observer for animation on scroll
        this.setupScrollAnimations();
        
        // Add hover effects
        this.setupHoverEffects();
        
        // Add lazy loading for image
        if (this.image) {
            this.setupLazyLoading();
        }
    }

    setupScrollAnimations() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe stats
        this.stats.forEach((stat, index) => {
            stat.style.opacity = '0';
            stat.style.transform = 'translateY(20px)';
            stat.style.transition = `all 0.5s ease ${index * 0.1}s`;
            observer.observe(stat);
        });

        // Observe values
        this.values.forEach((value, index) => {
            value.style.opacity = '0';
            value.style.transform = 'translateY(20px)';
            value.style.transition = `all 0.5s ease ${index * 0.1}s`;
            observer.observe(value);
        });
    }

    setupHoverEffects() {
        // Add hover effect for stats
        this.stats.forEach(stat => {
            stat.addEventListener('mouseenter', () => {
                stat.style.transform = 'translateY(-5px)';
            });
            
            stat.addEventListener('mouseleave', () => {
                stat.style.transform = 'translateY(0)';
            });
        });

        // Add hover effect for values
        this.values.forEach(value => {
            value.addEventListener('mouseenter', () => {
                value.style.transform = 'translateY(-5px)';
            });
            
            value.addEventListener('mouseleave', () => {
                value.style.transform = 'translateY(0)';
            });
        });
    }

    setupLazyLoading() {
        // Add lazy loading for the team image
        if ('loading' in HTMLImageElement.prototype) {
            // Browser supports native lazy loading
            this.image.loading = 'lazy';
        } else {
            // Fallback for browsers that don't support native lazy loading
            const lazyImageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            lazyImageObserver.observe(this.image);
        }
    }

    // Helper method to animate counting for stats
    animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            element.textContent = current + '+';
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
}

// Initialize about section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new About();
});
