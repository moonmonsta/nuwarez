// Performance monitoring
const perfMetrics = {
    firstPaint: 0,
    firstContentfulPaint: 0,
    timeToInteractive: 0
};

// Record performance metrics
const recordPerfMetrics = () => {
    const paint = performance.getEntriesByType('paint');
    paint.forEach(entry => {
        if (entry.name === 'first-paint') {
            perfMetrics.firstPaint = entry.startTime;
        }
        if (entry.name === 'first-contentful-paint') {
            perfMetrics.firstContentfulPaint = entry.startTime;
        }
    });
    perfMetrics.timeToInteractive = performance.now();
    console.debug('Performance metrics:', perfMetrics);
};

// Intersection Observer for reveal animations
const observeHeroElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '50px'
    });

    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        Array.from(heroContent.children).forEach(element => {
            observer.observe(element);
        });
    }
};

// Particle Canvas Implementation
class ParticleCanvas {
    constructor() {
        this.canvas = document.getElementById('heroParticleCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationFrame = null;
        this.isSupported = this.checkSupport();
        
        if (this.isSupported) {
            this.init();
        } else {
            this.showFallback();
        }
    }

    checkSupport() {
        return !!(this.canvas && this.ctx && window.requestAnimationFrame);
    }

    showFallback() {
        this.canvas.style.display = 'none';
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize(), { passive: true });
        this.createParticles();
        this.animate();
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    createParticles() {
        const particleCount = Math.min(50, Math.floor(this.canvas.width * 0.05));
        this.particles = Array.from({ length: particleCount }, () => ({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 2 + 1,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.5 + 0.25
        }));
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 255, 157, ${particle.opacity})`;
            this.ctx.fill();
        });

        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    cleanup() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

// Form handling with improved validation and accessibility
class HeroForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;

        this.emailInput = this.form.querySelector('input[type="email"]');
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.statusElement = document.getElementById('form-status');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.emailInput?.addEventListener('input', () => this.validateEmail());
    }

    validateEmail() {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.emailInput.value);
        this.emailInput.setAttribute('aria-invalid', (!isValid).toString());
        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateEmail()) {
            this.showMessage('Please enter a valid email address', 'error');
            return;
        }

        this.setLoading(true);

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: this.emailInput.value })
            });

            if (response.ok) {
                this.showMessage('Thank you for subscribing!', 'success');
                this.emailInput.value = '';
            } else {
                throw new Error('Subscription failed');
            }
        } catch (error) {
            console.error('Subscription error:', error);
            this.showMessage('Something went wrong. Please try again.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(isLoading) {
        this.emailInput.disabled = isLoading;
        this.submitButton.disabled = isLoading;
        this.submitButton.textContent = isLoading ? 'Sending...' : 'Get Started';
        
        if (isLoading) {
            this.submitButton.setAttribute('aria-busy', 'true');
        } else {
            this.submitButton.removeAttribute('aria-busy');
        }
    }

    showMessage(message, type) {
        if (!this.statusElement) return;
        
        this.statusElement.textContent = message;
        this.statusElement.className = `form-message ${type}`;
        this.statusElement.style.opacity = '1';

        setTimeout(() => {
            this.statusElement.style.opacity = '0';
        }, 5000);
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    observeHeroElements();
    const particles = new ParticleCanvas();
    const form = new HeroForm('hero-email-form');

    // Record performance metrics
    if (window.performance && window.performance.getEntriesByType) {
        recordPerfMetrics();
    }

    // Cleanup on page unload
    window.addEventListener('unload', () => {
        particles?.cleanup();
    });
});
