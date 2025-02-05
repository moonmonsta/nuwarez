class BannerCarousel {
    constructor() {
        this.container = document.querySelector('.banner-carousel__container');
        this.slides = document.querySelectorAll('.banner-carousel__slide');
        this.prevButton = document.querySelector('.banner-carousel__prev');
        this.nextButton = document.querySelector('.banner-carousel__next');
        this.currentSlide = 0;
        this.slideCount = this.slides.length;
        this.autoplayInterval = null;

        this.init();
    }

    init() {
        // Add event listeners
        this.prevButton.addEventListener('click', () => this.prevSlide());
        this.nextButton.addEventListener('click', () => this.nextSlide());

        // Start autoplay
        this.startAutoplay();

        // Pause autoplay on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());

        // Add swipe support for mobile
        this.setupSwipeSupport();
    }

    updateSlidePosition() {
        this.container.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slideCount;
        this.updateSlidePosition();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slideCount) % this.slideCount;
        this.updateSlidePosition();
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => this.nextSlide(), 5000);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    setupSwipeSupport() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, false);

        const handleSwipe = () => {
            const swipeThreshold = 50;
            const difference = touchStartX - touchEndX;

            if (Math.abs(difference) > swipeThreshold) {
                if (difference > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        };
    }
}

// Initialize the carousel when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BannerCarousel();
});
