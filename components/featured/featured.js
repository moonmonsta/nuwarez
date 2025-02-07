document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    class CardAnimator {
        constructor(card) {
            this.card = card;
            this.rect = card.getBoundingClientRect();
            this.mouseX = 50;
            this.mouseY = 50;
            this.rotateX = 0;
            this.rotateY = 0;
            this.glowIntensity = 0;
            this.velocity = { x: 0, y: 0 };
            this.lastMousePos = { x: 0, y: 0 };
            this.isHovered = false;
            this.rafId = null;

            // Bind methods
            this.onMouseMove = this.onMouseMove.bind(this);
            this.onMouseLeave = this.onMouseLeave.bind(this);
            this.animate = this.animate.bind(this);
            this.onTouchMove = this.onTouchMove.bind(this);

            // Initialize
            this.addEventListeners();
        }

        addEventListeners() {
            if (!prefersReducedMotion) {
                this.card.addEventListener('mousemove', this.onMouseMove, { passive: true });
                this.card.addEventListener('mouseleave', this.onMouseLeave, { passive: true });
                this.card.addEventListener('touchmove', this.onTouchMove, { passive: true });
                this.card.addEventListener('touchend', this.onMouseLeave, { passive: true });
            }
        }

        onMouseMove(e) {
            this.rect = this.card.getBoundingClientRect();
            const mouseX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const mouseY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

            // Calculate velocity
            this.velocity = {
                x: mouseX - this.lastMousePos.x,
                y: mouseY - this.lastMousePos.y
            };
            this.lastMousePos = { x: mouseX, y: mouseY };

            // Calculate normalized positions
            const x = ((mouseX - this.rect.left) / this.rect.width);
            const y = ((mouseY - this.rect.top) / this.rect.height);

            this.mouseX = x * 100;
            this.mouseY = y * 100;
            this.targetRotateX = (y - 0.5) * -10;
            this.targetRotateY = (x - 0.5) * 10;

            if (!this.isHovered) {
                this.isHovered = true;
                this.startAnimation();
            }
        }

        onTouchMove(e) {
            e.preventDefault();
            this.onMouseMove(e);
        }

        onMouseLeave() {
            this.isHovered = false;
            this.velocity = { x: 0, y: 0 };
            this.targetRotateX = 0;
            this.targetRotateY = 0;
            this.mouseX = 50;
            this.mouseY = 50;
        }

        startAnimation() {
            if (this.rafId === null) {
                this.rafId = requestAnimationFrame(this.animate);
            }
        }

        animate() {
            // Calculate glow intensity based on velocity and hover state
            const speed = Math.sqrt(
                this.velocity.x * this.velocity.x + 
                this.velocity.y * this.velocity.y
            );
            const baseGlowIntensity = this.isHovered ? 0.8 : 0;
            const velocityBoost = Math.min(speed * 0.005, 0.2);
            const targetGlowIntensity = baseGlowIntensity + velocityBoost;
            this.glowIntensity += (targetGlowIntensity - this.glowIntensity) * 0.15;

            // Smooth rotation transitions
            this.rotateX += (this.targetRotateX - this.rotateX) * 0.1;
            this.rotateY += (this.targetRotateY - this.rotateY) * 0.1;

            // Apply transforms
            const transform = `
                perspective(1000px)
                rotateX(${this.rotateX}deg)
                rotateY(${this.rotateY}deg)
                translateZ(${this.isHovered ? 15 : 0}px)
            `;

            // Update styles
            this.card.style.setProperty('--mouse-x', `${this.mouseX}%`);
            this.card.style.setProperty('--mouse-y', `${this.mouseY}%`);
            this.card.style.setProperty('--glow-opacity', this.glowIntensity);
            this.card.style.transform = transform;

            // Continue animation if needed
            if (
                Math.abs(this.rotateX) > 0.01 || 
                Math.abs(this.rotateY) > 0.01 || 
                Math.abs(this.glowIntensity) > 0.001 ||
                this.isHovered
            ) {
                this.rafId = requestAnimationFrame(this.animate);
            } else {
                this.rafId = null;
            }
        }
    }

    // Initialize card animators
    const featuredCards = document.querySelectorAll('.featured-card');
    featuredCards.forEach(card => new CardAnimator(card));

    // Intersection Observer for fade-in animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    // Observe featured content
    document.querySelectorAll('.featured-content > *').forEach(el => {
        observer.observe(el);
    });
});
