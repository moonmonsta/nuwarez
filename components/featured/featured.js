document.addEventListener('DOMContentLoaded', () => {
    // Add 3D hover effect to niche cards
    const nicheCards = document.querySelectorAll('.niche-card');
    
    nicheCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            const rotateX = y * -10;
            const rotateY = x * 10;
            
            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateZ(10px)
            `;
            
            // Adjust icon position for enhanced 3D effect
            const icon = card.querySelector('.niche-card__icon');
            if (icon) {
                icon.style.transform = `
                    translateZ(30px)
                    translateX(${x * 15}px)
                    translateY(${y * 15}px)
                `;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            const icon = card.querySelector('.niche-card__icon');
            if (icon) {
                icon.style.transform = 'translateZ(20px)';
            }
        });
    });

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

    // Observe featured content and niche cards
    document.querySelectorAll('.featured-grid > *, .niche-card').forEach(el => {
        observer.observe(el);
    });
});
