document.addEventListener('DOMContentLoaded', () => {
    // Add animation classes to hero elements
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
        // Add fade-in animation to hero content
        heroContent.classList.add('fade-in');
        
        // Add slide-in animation to hero heading and paragraph
        const heading = heroContent.querySelector('h1');
        const paragraph = heroContent.querySelector('p');
        const cta = heroContent.querySelector('.hero__cta');
        
        if (heading) heading.classList.add('slide-in-left');
        if (paragraph) {
            paragraph.style.animationDelay = '0.2s';
            paragraph.classList.add('slide-in-left');
        }
        if (cta) {
            cta.style.animationDelay = '0.4s';
            cta.classList.add('slide-in-left');
        }
    }

    // Add hover animation to hero animation image
    const heroAnimation = document.querySelector('.hero__animation-img');
    if (heroAnimation) {
        heroAnimation.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = heroAnimation.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            
            heroAnimation.style.transform = `
                scale(1.02)
                rotateY(${x * 10}deg)
                rotateX(${-y * 10}deg)
            `;
        });

        heroAnimation.addEventListener('mouseleave', () => {
            heroAnimation.style.transform = 'scale(1) rotateY(0) rotateX(0)';
        });
    }
});
