document.addEventListener('DOMContentLoaded', () => {
    // Add animation classes to hero elements
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
        // Add fade-in animation to hero content
        heroContent.classList.add('fade-in');
        
        // Add slide-in animation to hero elements
        const elements = {
            brand: heroContent.querySelector('.hero-brand'),
            heading: heroContent.querySelector('h1'),
            paragraph: heroContent.querySelector('p'),
            form: heroContent.querySelector('.hero__cta-form')
        };
        
        Object.entries(elements).forEach(([_, element], index) => {
            if (element) {
                if (index > 0) element.style.animationDelay = `${index * 0.2}s`;
                element.classList.add('slide-in-left');
            }
        });
    }

    // Handle form submission
    const emailForm = document.getElementById('hero-email-form');
    if (emailForm) {
        emailForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = emailForm.querySelector('input[type="email"]');
            const submitButton = emailForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                showFormMessage(emailForm, 'Please enter a valid email address', 'error');
                return;
            }

            // Disable form during submission
            emailInput.disabled = true;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            try {
                // TODO: Replace with actual API endpoint
                const response = await fetch('/api/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: emailInput.value }),
                });

                if (response.ok) {
                    showFormMessage(emailForm, 'Thank you for subscribing!', 'success');
                    emailInput.value = '';
                } else {
                    throw new Error('Subscription failed');
                }
            } catch (error) {
                console.error('Subscription error:', error);
                showFormMessage(emailForm, 'Something went wrong. Please try again.', 'error');
            } finally {
                // Re-enable form
                emailInput.disabled = false;
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
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

// Helper function to show form messages
function showFormMessage(form, message, type) {
    let messageElement = form.querySelector('.form-message');
    
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.className = 'form-message';
        form.appendChild(messageElement);
    }

    messageElement.textContent = message;
    messageElement.className = `form-message ${type}`;
    messageElement.style.opacity = '1';

    // Auto-hide message after 5 seconds
    setTimeout(() => {
        messageElement.style.opacity = '0';
        setTimeout(() => {
            messageElement.remove();
        }, 300);
    }, 5000);
}
