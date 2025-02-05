document.addEventListener('DOMContentLoaded', () => {
    // Newsletter form handling
    const newsletterForm = document.querySelector('.newsletter__form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input[type="email"]');
            const button = newsletterForm.querySelector('button');
            
            if (!input.value) {
                input.focus();
                return;
            }

            // Show success state
            button.textContent = 'Subscribed!';
            button.disabled = true;
            input.disabled = true;

            // Reset form after delay
            setTimeout(() => {
                button.textContent = 'Subscribe';
                button.disabled = false;
                input.disabled = false;
                input.value = '';
            }, 2000);
        });
    }
});
