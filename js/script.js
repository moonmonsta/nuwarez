// Performance optimized script.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core functionality with performance optimizations
    initializeUI();
    initializeTheme();
    initializeSearch();
    initializeScrollEffects();
    initializeParticles();
});

// Debounced scroll handler
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function initializeUI() {
    // Mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navContainer = document.querySelector('.nav-container');
    
    if (mobileMenuBtn && navContainer) {
        mobileMenuBtn.addEventListener('click', () => {
            navContainer.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', 
                navContainer.classList.contains('active').toString());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navContainer.classList.contains('active') &&
                !navContainer.contains(e.target) &&
                !mobileMenuBtn.contains(e.target)) {
                navContainer.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Back to top button with IntersectionObserver
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        const observer = new IntersectionObserver(
            ([entry]) => {
                backToTopButton.classList.toggle('visible', !entry.isIntersecting);
            },
            { threshold: 0, rootMargin: '100px' }
        );

        const header = document.querySelector('.hero');
        if (header) observer.observe(header);
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            try {
                submitButton.disabled = true;
                submitButton.textContent = 'Processing...';
                
                // Simulate form submission (replace with actual API call)
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Thank you for subscribing!';
                form.appendChild(successMessage);
                
                // Reset form
                form.reset();
                
                // Remove success message after 3 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 3000);
            } catch (error) {
                console.error('Form submission error:', error);
                // Show error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Something went wrong. Please try again.';
                form.appendChild(errorMessage);
                
                // Remove error message after 3 seconds
                setTimeout(() => {
                    errorMessage.remove();
                }, 3000);
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    });
}

function initializeTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial theme
    document.documentElement.classList.toggle('dark-theme', 
        localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && prefersDark.matches));

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark-theme');
            localStorage.setItem('theme',
                document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light');
        });
    }

    // Listen for system theme changes
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.classList.toggle('dark-theme', e.matches);
        }
    });
}

function initializeSearch() {
    const searchInput = document.querySelector('.search-bar');
    if (!searchInput) return;

    // Debounced search function
    const performSearch = debounce((query) => {
        if (query.length < 2) return;
        console.log('Searching for:', query);
        // Implement actual search functionality here
    }, 300);

    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value.trim());
    });

    // Keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchInput.blur();
        }
    });
}

function initializeScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '50px'
        }
    );

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function initializeParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 - 1,
            life: Math.random() * 0.5 + 0.5
        };
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((particle, index) => {
            particle.life -= 0.001;
            
            if (particle.life <= 0) {
                particles[index] = createParticle();
                return;
            }

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${particle.life})`;
            ctx.fill();

            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        });

        animationFrameId = requestAnimationFrame(drawParticles);
    }

    // Initialize
    resizeCanvas();
    for (let i = 0; i < 50; i++) {
        particles.push(createParticle());
    }

    // Start animation
    drawParticles();

    // Handle resize
    window.addEventListener('resize', debounce(() => {
        cancelAnimationFrame(animationFrameId);
        resizeCanvas();
        drawParticles();
    }, 250));
}
