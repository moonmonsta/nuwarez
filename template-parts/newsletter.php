<?php
/**
 * Template part for displaying the newsletter section
 *
 * @package Nuwarez
 */
?>

<section class="newsletter">
    <div class="newsletter__container">
        <div class="newsletter__content">
            <h2><?php echo esc_html(get_theme_mod('newsletter_title', 'Stay Updated')); ?></h2>
            <p><?php echo esc_html(get_theme_mod('newsletter_description', 'Get the latest insights on technology, sustainability, and modern entrepreneurship delivered to your inbox.')); ?></p>
        </div>
        
        <form class="newsletter__form" id="newsletterForm">
            <?php wp_nonce_field('newsletter_subscription', 'newsletter_nonce'); ?>
            <div class="newsletter__input-group">
                <input 
                    type="email" 
                    name="email" 
                    id="newsletterEmail" 
                    placeholder="<?php esc_attr_e('Enter your email address', 'nuwarez'); ?>"
                    required
                    aria-label="<?php esc_attr_e('Email address', 'nuwarez'); ?>"
                >
                <button type="submit" class="newsletter__submit">
                    <?php esc_html_e('Subscribe', 'nuwarez'); ?>
                    <span class="newsletter__submit-icon">→</span>
                </button>
            </div>
            <div class="newsletter__message" aria-live="polite"></div>
            <label class="newsletter__privacy">
                <input type="checkbox" name="privacy_consent" required>
                <span>
                    <?php 
                    $privacy_page = get_privacy_policy_url();
                    if ($privacy_page) {
                        printf(
                            wp_kses(
                                /* translators: %s: Privacy policy URL */
                                __('I agree to receive newsletters and accept the <a href="%s">data privacy statement</a>.', 'nuwarez'),
                                array('a' => array('href' => array()))
                            ),
                            esc_url($privacy_page)
                        );
                    } else {
                        esc_html_e('I agree to receive newsletters and accept the data privacy statement.', 'nuwarez');
                    }
                    ?>
                </span>
            </label>
        </form>
    </div>
</section>

<?php
// Enqueue newsletter script
wp_enqueue_script(
    'nuwarez-newsletter',
    get_template_directory_uri() . '/js/newsletter.js',
    array('jquery'),
    wp_get_theme()->get('Version'),
    true
);

// Localize script with AJAX URL and nonce
wp_localize_script(
    'nuwarez-newsletter',
    'nuwarezNewsletter',
    array(
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('newsletter_subscription'),
        'messages' => array(
            'success' => esc_html__('Thank you for subscribing!', 'nuwarez'),
            'error' => esc_html__('An error occurred. Please try again.', 'nuwarez'),
            'invalid_email' => esc_html__('Please enter a valid email address.', 'nuwarez'),
            'consent_required' => esc_html__('Please accept the privacy policy.', 'nuwarez')
        )
    )
);
?>
