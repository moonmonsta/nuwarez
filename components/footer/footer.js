class Footer {
    constructor() {
        this.footer = document.querySelector('.footer');
        this.socialLinks = document.querySelectorAll('.footer__social a');
        this.currentYear = new Date().getFullYear();

        this.init();
    }

    init() {
        // Update copyright year
        const copyrightElement = this.footer.querySelector('.footer__bottom p');
        copyrightElement.textContent = copyrightElement.textContent.replace('2025', this.currentYear);

        // Add hover animations to social links
        this.socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => this.animateSocialIcon(link));
            link.addEventListener('mouseleave', () => this.resetSocialIcon(link));
        });

        // Add smooth scroll behavior to footer links
        const footerLinks = this.footer.querySelectorAll('a[href^="#"]');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleSmoothScroll(e));
        });
    }

    animateSocialIcon(link) {
        link.style.transform = 'translateY(-2px) scale(1.1)';
    }

    resetSocialIcon(link) {
        link.style.transform = 'translateY(0) scale(1)';
    }

    handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Initialize footer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Footer();
});
