// Particle Animation
class Particle {
    constructor(canvas, isHero = false) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.isHero = isHero;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + (isHero ? 1 : 2);
        this.baseSize = this.size;
        this.speedX = Math.random() * 0.2 - 0.1;
        this.speedY = Math.random() * 0.2 - 0.1;
        this.mouseDistance = 0;
        
        this.colors = [
            'rgba(147, 112, 219, 0.4)',
            'rgba(64, 190, 169, 0.4)',
            'rgba(59, 129, 192, 0.4)',
            'rgba(0, 191, 255, 0.4)',
            'rgba(72, 209, 204, 0.4)'
        ];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.baseColor = this.color;
    }

    update(mouse = { x: null, y: null }) {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.isHero && mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            this.mouseDistance = Math.hypot(dx, dy);
            
            if (this.mouseDistance < 100) {
                const angle = Math.atan2(dy, dx);
                const force = (100 - this.mouseDistance) / 100;
                this.speedX -= Math.cos(angle) * force * 0.2;
                this.speedY -= Math.sin(angle) * force * 0.2;
                
                this.size = this.baseSize * (1 + force);
                const opacity = 0.4 + force * 0.3;
                this.color = this.baseColor.replace(/[\d.]+\)$/g, `${opacity})`);
            } else {
                this.size = this.baseSize;
                this.color = this.baseColor;
            }
        }

        // Add subtle wave motion
        this.speedY += Math.sin(this.x * 0.01) * 0.001;
        this.speedX += Math.cos(this.y * 0.01) * 0.001;

        // Clamp speeds
        this.speedX = Math.min(Math.max(this.speedX, -0.5), 0.5);
        this.speedY = Math.min(Math.max(this.speedY, -0.5), 0.5);

        // Bounce off edges
        if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}

// Modern JavaScript implementation using async/await and IntersectionObserver
document.addEventListener('DOMContentLoaded', async () => {
    const state = {
        lastScrollTop: 0,
        scrollThreshold: 5,
        isScrollingTimeout: null,
        autoScrollInterval: null,
        isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches
    };

    // Theme toggle functionality
    const initThemeToggle = () => {
        const themeToggle = document.querySelector('.theme-toggle');
        const root = document.documentElement;
        
        const updateThemeIcon = () => {
            themeToggle.innerHTML = state.isDarkMode ? 
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>' : 
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
        };

        const toggleTheme = () => {
            state.isDarkMode = !state.isDarkMode;
            root.classList.toggle('light-mode');
            localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');
            updateThemeIcon();
        };

        // Initialize theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            state.isDarkMode = savedTheme === 'dark';
            if (!state.isDarkMode) root.classList.add('light-mode');
        }
        updateThemeIcon();

        themeToggle.addEventListener('click', toggleTheme);
    };

    // Search functionality
    const initSearch = () => {
        const searchBar = document.querySelector('.search-bar');
        const searchResults = document.createElement('div');
        searchResults.className = 'search-results';
        searchBar.parentNode.appendChild(searchResults);

        const performSearch = debounce(async (query) => {
            if (!query.trim()) {
                searchResults.style.display = 'none';
                return;
            }

            try {
                const response = await fetch(`${window.location.origin}/api/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                
                searchResults.innerHTML = data.results.length ? 
                    data.results.map(result => `
                        <a href="${result.url}" class="search-result">
                            <h4>${result.title}</h4>
                            <p>${result.excerpt}</p>
                        </a>
                    `).join('') : 
                    '<div class="search-no-results">No results found</div>';
                
                searchResults.style.display = 'block';
            } catch (error) {
                console.error('Search error:', error);
            }
        }, 300);

        searchBar.addEventListener('input', (e) => performSearch(e.target.value));
        searchBar.addEventListener('focus', () => {
            if (searchBar.value.trim()) searchResults.style.display = 'block';
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                searchResults.style.display = 'none';
            }
        });
    };

    // Back to top functionality
    const initBackToTop = () => {
        const backToTop = document.querySelector('.back-to-top');
        
        const updateBackToTop = () => {
            const scrollPosition = window.scrollY;
            backToTop.classList.toggle('visible', scrollPosition > window.innerHeight / 2);
        };

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', throttle(updateBackToTop, 100), { passive: true });
    };


    // Utility functions
    const debounce = (fn, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    };

    const throttle = (fn, delay) => {
        let lastCall = 0;
        return (...args) => {
            const now = Date.now();
            if (now - lastCall >= delay) {
                fn(...args);
                lastCall = now;
            }
        };
    };

    // Particle system initialization
    const initParticles = () => {
        const bgCanvas = document.getElementById('particleCanvas');
        if (!bgCanvas) return;
        
        const bgCtx = bgCanvas.getContext('2d');
        const bgParticles = new Set();
        
        const heroCanvas = document.createElement('canvas');
        heroCanvas.id = 'heroParticleCanvas';
        const hero = document.querySelector('.hero');
        
        if (hero) {
            hero.insertBefore(heroCanvas, hero.firstChild);
            const heroCtx = heroCanvas.getContext('2d');
            const heroParticles = new Set();
            const mouse = { x: null, y: null };

            const resizeCanvas = () => {
                bgCanvas.width = window.innerWidth;
                bgCanvas.height = window.innerHeight;
                heroCanvas.width = hero.offsetWidth;
                heroCanvas.height = hero.offsetHeight;
            };

            // Event listeners with performance optimizations
            heroCanvas.addEventListener('mousemove', throttle(e => {
                const rect = heroCanvas.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            }, 16));

            heroCanvas.addEventListener('mouseleave', () => {
                mouse.x = null;
                mouse.y = null;
            });

            window.addEventListener('resize', debounce(resizeCanvas, 250));
            resizeCanvas();

            // Initialize particles
            for (let i = 0; i < 100; i++) {
                bgParticles.add(new Particle(bgCanvas));
            }
            
            for (let i = 0; i < 50; i++) {
                heroParticles.add(new Particle(heroCanvas, true));
            }

            // Optimized animation loop
            let animationId;
            const animate = () => {
                bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
                heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
                
                bgParticles.forEach(particle => {
                    particle.update();
                    particle.draw();
                });

                heroParticles.forEach(particle => {
                    particle.update(mouse);
                    particle.draw();
                });

                animationId = requestAnimationFrame(animate);
            };

            animate();

            // Cleanup function
            return () => {
                cancelAnimationFrame(animationId);
                bgParticles.clear();
                heroParticles.clear();
            };
        }
    };

    // Intersection Observer for lazy loading and animations
    const createObserver = (options) => {
        return new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    entry.target.loading = 'eager'; // Switch to eager loading when visible
                    observer.unobserve(entry.target);
                }
            });
        }, options);
    };

    const observer = createObserver({
        threshold: 0.1,
        rootMargin: '50px'
    });

    // Observe elements
    document.querySelectorAll('.fade-in, img[loading="lazy"]').forEach(el => observer.observe(el));

    // Modern form handling with async/await
    const handleFormSubmit = async (form) => {
        const button = form.querySelector('button');
        const input = form.querySelector('input[type="email"]');
        const originalText = button.textContent;

        const showError = (message) => {
            input.style.border = '2px solid var(--accent)';
            input.style.backgroundColor = 'rgba(255, 0, 255, 0.1)';
            button.textContent = message;
        };

        const resetForm = () => {
            input.style.border = '';
            input.style.backgroundColor = '';
            button.textContent = originalText;
            button.disabled = false;
            input.disabled = false;
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!input.value) {
                showError('Email required');
                input.focus();
                return;
            }

            button.textContent = 'Subscribing...';
            button.disabled = true;
            input.disabled = true;

            try {
                const response = await fetch(nuwarez_ajax.ajax_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        action: 'nuwarez_subscribe',
                        email: input.value,
                        nonce: nuwarez_ajax.nonce
                    })
                });

                const data = await response.json();
                if (data.success) {
                    button.textContent = '✓ Subscribed!';
                    form.reset();
                } else {
                    showError('Error - Try Again');
                }
            } catch (error) {
                showError('Network Error');
                console.error('Subscription error:', error);
            } finally {
                setTimeout(resetForm, 2000);
            }
        });
    };

    // Initialize forms
    document.querySelectorAll('#hero-email-form, #newsletter-form')
        .forEach(form => handleFormSubmit(form));

    // Smooth scrolling with native behavior
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

    // Optimized scroll handling
    const handleScroll = throttle(() => {
        const currentScroll = window.scrollY;
        const nav = document.querySelector('nav');
        const scrollDifference = Math.abs(currentScroll - state.lastScrollTop);

            // Navbar background
        nav.style.background = currentScroll > 50 ? 
            'rgba(0, 0, 0, 0.98)' : 
            'rgba(0, 0, 0, 0.95)';
        nav.style.boxShadow = currentScroll > 50 ? 
            '0 2px 10px rgba(0, 0, 0, 0.3)' : 
            'none';

    }, 16);

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Mobile menu handling
    const initMobileMenu = () => {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');

        const toggleMenu = () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        };

        mobileMenuBtn.addEventListener('click', toggleMenu);

        document.addEventListener('click', (e) => {
            if (!e.target.closest('nav') && navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    };

    // Article carousel with touch support and IntersectionObserver
    const initCarousel = () => {
        const carousel = document.querySelector('.articles-carousel');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        
        if (!carousel) return;

        const cardWidth = carousel.querySelector('.article-card')?.offsetWidth || 350;
        const gap = 24;
        const scrollAmount = cardWidth + gap;
        let isScrolling = false;
        
        const updateButtonStates = () => {
            const isAtStart = carousel.scrollLeft <= 10;
            const isAtEnd = carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth - 10;
            
            prevBtn.style.opacity = isAtStart ? '0.5' : '1';
            prevBtn.style.cursor = isAtStart ? 'not-allowed' : 'pointer';
            nextBtn.style.opacity = isAtEnd ? '0.5' : '1';
            nextBtn.style.cursor = isAtEnd ? 'not-allowed' : 'pointer';
        };

        const scroll = (direction) => {
            if (isScrolling) return;
            isScrolling = true;
            
            carousel.scrollTo({
                left: carousel.scrollLeft + (direction * scrollAmount),
                behavior: 'smooth'
            });

            // Reset isScrolling after animation completes
            setTimeout(() => {
                isScrolling = false;
            }, 500);
        };

        // Touch handling with improved snap
        let touchStart = null;
        let touchX = null;
        let touchStartTime = null;

        carousel.addEventListener('touchstart', (e) => {
            touchStart = e.touches[0].clientX;
            touchX = carousel.scrollLeft;
            touchStartTime = Date.now();
            clearInterval(state.autoScrollInterval);
        }, { passive: true });

        carousel.addEventListener('touchmove', (e) => {
            if (!touchStart) return;
            const diff = touchStart - e.touches[0].clientX;
            carousel.scrollLeft = touchX + diff;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            if (!touchStart) return;
            
            const touchDuration = Date.now() - touchStartTime;
            const touchDiff = touchStart - e.changedTouches[0].clientX;
            const velocity = Math.abs(touchDiff / touchDuration);
            
            // Determine scroll direction based on swipe velocity
            if (velocity > 0.5) {
                const direction = touchDiff > 0 ? 1 : -1;
                scroll(direction);
            } else {
                // Snap to nearest card if slow swipe
                const remainder = carousel.scrollLeft % scrollAmount;
                carousel.scrollTo({
                    left: carousel.scrollLeft + (remainder > scrollAmount / 2 ? 
                        scrollAmount - remainder : -remainder),
                    behavior: 'smooth'
                });
            }
            
            touchStart = null;
            touchStartTime = null;
        });

        // Button handlers with debounce
        const handleButtonClick = debounce((direction) => {
            if ((direction === -1 && carousel.scrollLeft > 0) || 
                (direction === 1 && carousel.scrollLeft + carousel.offsetWidth < carousel.scrollWidth)) {
                scroll(direction);
            }
        }, 250);

        prevBtn.addEventListener('click', () => handleButtonClick(-1));
        nextBtn.addEventListener('click', () => handleButtonClick(1));

        // Auto-scroll with improved timing
        const startAutoScroll = () => {
            clearInterval(state.autoScrollInterval);
            state.autoScrollInterval = setInterval(() => {
                if (!document.hidden && !isScrolling) {
                    if (carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth - 10) {
                        carousel.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        scroll(1);
                    }
                }
            }, 8000); // Increased to 8 seconds for better readability
        };

        // Pause auto-scroll when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(state.autoScrollInterval);
            } else {
                startAutoScroll();
            }
        });

        carousel.addEventListener('mouseenter', () => clearInterval(state.autoScrollInterval));
        carousel.addEventListener('mouseleave', startAutoScroll);
        carousel.addEventListener('scroll', throttle(updateButtonStates, 100), { passive: true });
        window.addEventListener('resize', debounce(() => {
            updateButtonStates();
            // Recalculate card width on resize
            const newCardWidth = carousel.querySelector('.article-card')?.offsetWidth || 350;
            if (newCardWidth !== cardWidth) {
                const remainder = carousel.scrollLeft % (newCardWidth + gap);
                carousel.scrollTo({
                    left: carousel.scrollLeft - remainder,
                    behavior: 'smooth'
                });
            }
        }, 250));

        updateButtonStates();
        startAutoScroll();

        // Enhanced lazy loading
        const carouselObserver = createObserver({
            threshold: 0.1,
            root: carousel,
            rootMargin: '100px'
        });

        carousel.querySelectorAll('img[loading="lazy"]').forEach(img => {
            carouselObserver.observe(img);
        });
    };

    // Initialize everything
    initParticles();
    initMobileMenu();
    initCarousel();
    initThemeToggle();
    initSearch();
    initBackToTop();
});
