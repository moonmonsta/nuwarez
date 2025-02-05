class Newsletter {
    constructor() {
        this.form = document.getElementById('newsletterForm');
        this.emailInput = document.getElementById('newsletterEmail');
        this.messageDiv = document.querySelector('.newsletter__message');
        this.submitButton = document.querySelector('.newsletter__submit');
        
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.emailInput.addEventListener('input', () => this.validateEmail());
    }

    validateEmail() {
        const email = this.emailInput.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            this.emailInput.style.borderColor = 'var(--color-error)';
            return false;
        } else {
            this.emailInput.style.borderColor = 'var(--color-success)';
            return true;
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateEmail()) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Disable form while submitting
        this.submitButton.disabled = true;
        this.submitButton.textContent = 'Subscribing...';

        try {
            // Simulate API call - replace with actual API endpoint
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Success handling
            this.showMessage('Thank you for subscribing! Please check your email to confirm.', 'success');
            this.form.reset();
            this.emailInput.style.borderColor = 'var(--color-light)';
            
        } catch (error) {
            // Error handling
            this.showMessage('An error occurred. Please try again later.', 'error');
            console.error('Newsletter submission error:', error);
            
        } finally {
            // Re-enable form
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = 'Subscribe <span class="newsletter__submit-icon">→</span>';
        }
    }

    showMessage(text, type) {
        this.messageDiv.textContent = text;
        this.messageDiv.className = 'newsletter__message ' + type;
        
        // Auto-hide error messages after 5 seconds
        if (type === 'error') {
            setTimeout(() => {
                this.messageDiv.textContent = '';
                this.messageDiv.className = 'newsletter__message';
            }, 5000);
        }
    }

    // Method to clear form state
    reset() {
        this.form.reset();
        this.emailInput.style.borderColor = 'var(--color-light)';
        this.messageDiv.textContent = '';
        this.messageDiv.className = 'newsletter__message';
    }
}

// Initialize newsletter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Newsletter();
});
