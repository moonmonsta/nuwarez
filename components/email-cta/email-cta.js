class EmailCTA {
    constructor() {
        this.form = document.querySelector('.email-cta__form');
        this.input = this.form.querySelector('.email-cta__input');
        this.button = this.form.querySelector('.email-cta__button');
        this.errorDiv = this.form.querySelector('.email-cta__error');
        this.statusDiv = this.form.querySelector('.email-cta__status');
        this.checkbox = this.form.querySelector('.email-cta__checkbox');
        
        this.bindEvents();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.input.addEventListener('input', () => this.validateEmail());
        this.input.addEventListener('blur', () => this.validateEmail(true));
    }

    validateEmail(showError = false) {
        const email = this.input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);

        this.input.classList.remove('is-valid', 'is-invalid');
        this.errorDiv.classList.remove('is-visible');
        
        if (email === '') {
            if (showError) {
                this.showError('Please enter your email address');
            }
            return false;
        }

        if (!isValid) {
            if (showError) {
                this.showError('Please enter a valid email address');
            }
            this.input.classList.add('is-invalid');
            return false;
        }

        this.input.classList.add('is-valid');
        return true;
    }

    showError(message) {
        this.errorDiv.textContent = message;
        this.errorDiv.classList.add('is-visible');
        this.input.classList.add('is-invalid');
    }

    showStatus(message, type = 'success') {
        this.statusDiv.textContent = message;
        this.statusDiv.className = 'email-cta__status is-visible is-' + type;
    }

    setLoading(isLoading) {
        this.button.disabled = isLoading;
        this.button.classList.toggle('is-loading', isLoading);
        this.input.disabled = isLoading;
        this.checkbox.disabled = isLoading;
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateEmail(true)) {
            this.form.classList.add('is-error');
            setTimeout(() => this.form.classList.remove('is-error'), 500);
            return;
        }

        if (!this.checkbox.checked) {
            this.showStatus('Please accept the privacy policy to continue', 'error');
            return;
        }

        this.setLoading(true);
        this.showStatus('');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Here you would typically make an API call to your WordPress backend
            // const response = await fetch('/wp-json/newsletter/v1/subscribe', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email: this.input.value.trim() })
            // });
            
            this.showStatus('Thank you for subscribing! Please check your email to confirm.');
            this.form.reset();
            this.input.classList.remove('is-valid');
        } catch (error) {
            this.showStatus('Sorry, something went wrong. Please try again later.', 'error');
        } finally {
            this.setLoading(false);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new EmailCTA();
});
