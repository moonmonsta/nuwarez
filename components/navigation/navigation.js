document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    const hero = document.querySelector('.hero');
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    let lastScrollY = window.scrollY;
    let isHovering = false;

    // Handle scroll behavior
    const handleScroll = () => {
        const heroBottom = hero?.getBoundingClientRect().bottom + window.scrollY;
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > heroBottom) {
            // Past hero section
            if (currentScrollY > lastScrollY && !isHovering) {
                nav.classList.add('hidden');
                nav.classList.remove('scroll-up');
            } else {
                nav.classList.remove('hidden');
                nav.classList.add('scroll-up');
            }
        } else {
            // Within hero section
            nav.classList.remove('hidden', 'scroll-up', 'hover-visible');
        }
        
        lastScrollY = currentScrollY;
    };

    // Handle hover behavior
    nav.addEventListener('mouseenter', () => {
        isHovering = true;
        if (window.scrollY > (hero?.getBoundingClientRect().bottom + window.scrollY)) {
            nav.classList.add('hover-visible');
            nav.classList.remove('hidden');
        }
    });

    nav.addEventListener('mouseleave', () => {
        isHovering = false;
        if (window.scrollY > (hero?.getBoundingClientRect().bottom + window.scrollY)) {
            nav.classList.remove('hover-visible');
            if (window.scrollY > lastScrollY) {
                nav.classList.add('hidden');
            }
        }
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Get saved theme from localStorage or use system preference
    const getSavedTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        return prefersDarkScheme.matches ? 'dark' : 'light';
    };

    // Apply theme to document
    const applyTheme = (theme) => {
        document.body.dataset.theme = theme;
        localStorage.setItem('theme', theme);
    };

    // Initialize theme
    applyTheme(getSavedTheme());

    // Toggle theme
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.dataset.theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);

        // Animate the toggle
        themeToggle.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0)';
        }, 300);
    });

    // Handle system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        const savedTheme = localStorage.getItem('theme');
        if (!savedTheme) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navContainer = document.querySelector('.nav-container');

    mobileMenuBtn.addEventListener('click', () => {
        navContainer.classList.toggle('active');
        mobileMenuBtn.textContent = navContainer.classList.contains('active') ? '×' : '☰';
    });
});
