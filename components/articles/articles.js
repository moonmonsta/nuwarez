class Articles {
    constructor() {
        this.carousel = document.querySelector('.articles-carousel');
        this.articles = document.querySelectorAll('.article-card');
        this.prevBtn = document.querySelector('.carousel-btn.prev');
        this.nextBtn = document.querySelector('.carousel-btn.next');
        this.filters = document.querySelectorAll('.filter-btn');
        
        this.currentIndex = 0;
        this.cardsPerView = this.calculateCardsPerView();
        this.totalCards = this.articles.length;
        
        this.init();
    }

    init() {
        // Set up intersection observer for animations
        this.setupScrollAnimations();
        
        // Add filter functionality
        this.setupFilters();
        
        // Initialize carousel
        this.setupCarousel();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.cardsPerView = this.calculateCardsPerView();
            this.updateCarouselPosition();
            this.updateButtons();
        });
    }

    calculateCardsPerView() {
        const containerWidth = this.carousel.parentElement.offsetWidth - 80; // Subtract padding
        const cardWidth = 300 + 32; // card width + gap
        return Math.floor(containerWidth / cardWidth);
    }

    setupScrollAnimations() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.articles.forEach(article => {
            observer.observe(article);
        });
    }

    setupFilters() {
        this.filters.forEach(filter => {
            filter.addEventListener('click', () => {
                // Update active filter
                this.filters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');

                // Get selected category
                const category = filter.dataset.filter;

                // Filter articles
                this.filterArticles(category);
            });
        });
    }

    filterArticles(category) {
        this.articles.forEach(article => {
            if (category === 'all' || article.dataset.topic === category) {
                article.style.display = 'block';
            } else {
                article.style.display = 'none';
            }
        });

        // Reset carousel position
        this.currentIndex = 0;
        this.updateCarouselPosition();
        this.updateButtons();
    }

    setupCarousel() {
        if (this.prevBtn && this.nextBtn) {
            this.prevBtn.addEventListener('click', () => this.slide('prev'));
            this.nextBtn.addEventListener('click', () => this.slide('next'));
            this.updateButtons();
        }
    }

    slide(direction) {
        if (direction === 'next' && this.currentIndex < this.totalCards - this.cardsPerView) {
            this.currentIndex++;
        } else if (direction === 'prev' && this.currentIndex > 0) {
            this.currentIndex--;
        }

        this.updateCarouselPosition();
        this.updateButtons();
    }

    updateCarouselPosition() {
        const cardWidth = 300 + 32; // card width + gap
        const offset = -this.currentIndex * cardWidth;
        this.carousel.style.transform = `translateX(${offset}px)`;
    }

    updateButtons() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex <= 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex >= this.totalCards - this.cardsPerView;
        }
    }
}

// Initialize articles section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Articles();
});
