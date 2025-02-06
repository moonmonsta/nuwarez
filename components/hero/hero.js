document.addEventListener('DOMContentLoaded', () => {
    // Add revealed class to hero elements
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        // Add revealed class to all direct children of hero-content
        const elements = heroContent.children;
        Array.from(elements).forEach(element => {
            element.classList.add('revealed');
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
