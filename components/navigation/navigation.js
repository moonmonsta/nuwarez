document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navContainer = document.querySelector('.nav-container');
    
    if (mobileMenuBtn && navContainer) {
        mobileMenuBtn.addEventListener('click', () => {
            navContainer.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navContainer.classList.contains('active') &&
                !navContainer.contains(e.target) &&
                !mobileMenuBtn.contains(e.target)) {
                navContainer.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });
    }

    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    function setTheme(isDark) {
        document.documentElement.classList.toggle('light-mode', !isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme === 'dark');
    } else {
        setTheme(prefersDark.matches);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            setTheme(!document.documentElement.classList.contains('light-mode'));
        });
    }

    // Search functionality
    const searchBar = document.querySelector('.search-bar');
    const searchResults = document.querySelector('.search-results');
    let searchTimeout;

    if (searchBar && searchResults) {
        searchBar.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();

            if (query.length > 2) {
                searchTimeout = setTimeout(() => {
                    // TODO: Implement search functionality
                    // For now, just show/hide the results container
                    searchResults.style.display = 'block';
                    searchResults.innerHTML = `<div class="search-message">Searching for "${query}"...</div>`;
                }, 300);
            } else {
                searchResults.style.display = 'none';
            }
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchBar.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });

        // Prevent clicks within search results from closing the container
        searchResults.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (navContainer) {
                    navContainer.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }
            }
        });
    });

    // Set active nav item based on scroll position
    const sections = document.querySelectorAll('section[id]');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Show/hide navigation on scroll
        if (Math.abs(scrollY - lastScrollY) > 50) {
            document.querySelector('nav')?.classList.toggle('nav-hidden', scrollY > lastScrollY);
            lastScrollY = scrollY;
        }
        
        // Update active section
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector(`.nav-links a[href="#${id}"]`)?.classList.add('active');
            } else {
                document.querySelector(`.nav-links a[href="#${id}"]`)?.classList.remove('active');
            }
        });
    }, { passive: true });
});
