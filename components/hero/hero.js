// Performance Monitoring & Component Initialization
document.addEventListener('DOMContentLoaded', () => {
    initHero();
    recordPerformanceMetrics();
});

const initHero = () => {
    initParticles();
    initFormHandling();
    initRevealAnimations();
};

// Performance Metrics
const recordPerformanceMetrics = () => {
    if (!window.performance || !window.performance.getEntriesByType) return;
    
    const paint = performance.getEntriesByType('paint');
    const metrics = {
        firstPaint: 0,
        firstContentfulPaint: 0,
        timeToInteractive: performance.now()
    };

    paint.forEach(entry => {
        if (entry.name === 'first-paint') {
            metrics.firstPaint = entry.startTime;
        }
        if (entry.name === 'first-contentful-paint') {
            metrics.firstContentfulPaint = entry.startTime;
        }
    });

    console.debug('Performance metrics:', metrics);
};

// Optimized Intersection Observer
const initRevealAnimations = () => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2, rootMargin: '50px' }
    );

    document.querySelectorAll('.hero-content > *').forEach(el => observer.observe(el));
};

// Form Handling with Error States
const initFormHandling = () => {
    const form = document.getElementById('hero-email-form');
    if (!form) return;

    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('button[type="submit"]');
    const statusElement = document.getElementById('form-status');

    const validateEmail = () => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
        emailInput.setAttribute('aria-invalid', (!isValid).toString());
        return isValid;
    };

    const setLoading = (isLoading) => {
        emailInput.disabled = isLoading;
        submitButton.disabled = isLoading;
        submitButton.textContent = isLoading ? 'Sending...' : 'Start Your Journey';
        submitButton.setAttribute('aria-busy', isLoading.toString());
    };

    const showStatus = (message, type) => {
        if (!statusElement) return;
        statusElement.textContent = message;
        statusElement.className = `form-message ${type}`;
        statusElement.style.opacity = '1';
        setTimeout(() => statusElement.style.opacity = '0', 5000);
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateEmail()) {
            showStatus('Please enter a valid email address', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput.value })
            });

            if (response.ok) {
                showStatus('Thank you for subscribing!', 'success');
                emailInput.value = '';
            } else {
                throw new Error('Subscription failed');
            }
        } catch (error) {
            console.error('Subscription error:', error);
            showStatus('Something went wrong. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    });

    emailInput.addEventListener('input', validateEmail);
};

// Particle Animation with Performance Optimizations
const initParticles = () => {
    const canvas = document.getElementById('heroParticleCanvas');
    if (!canvas || !canvas.getContext) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    let animationFrame = null;
    let mouseX = null;
    let mouseY = null;
    let isHovered = false;

    const resize = () => {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    };

    const createParticles = () => {
        const particleCount = 30; // Optimized count
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 0.3 - 0.15,
                speedY: Math.random() * 0.3 - 0.15,
                opacity: Math.random() * 0.5 + 0.25,
                baseSpeedX: 0,
                baseSpeedY: 0
            });
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            if (particle.baseSpeedX === 0) {
                particle.baseSpeedX = particle.speedX;
                particle.baseSpeedY = particle.speedY;
            }

            if (isHovered && mouseX !== null) {
                const dx = mouseX - particle.x;
                const dy = mouseY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 100;

                if (distance < maxDistance) {
                    const force = (1 - distance / maxDistance) * 0.2;
                    particle.speedX = particle.baseSpeedX + (dx / distance) * force;
                    particle.speedY = particle.baseSpeedY + (dy / distance) * force;
                } else {
                    particle.speedX = particle.speedX * 0.95 + particle.baseSpeedX * 0.05;
                    particle.speedY = particle.speedY * 0.95 + particle.baseSpeedY * 0.05;
                }
            }

            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 255, 157, ${particle.opacity})`;
            ctx.fill();
        });

        animationFrame = requestAnimationFrame(animate);
    };

    // Event Listeners
    window.addEventListener('resize', resize, { passive: true });
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        isHovered = true;
    }, { passive: true });

    canvas.addEventListener('mouseleave', () => {
        isHovered = false;
        mouseX = null;
        mouseY = null;
    }, { passive: true });

    // Cleanup function
    window.addEventListener('unload', () => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    });

    // Initialize
    resize();
    createParticles();
    animate();
};
