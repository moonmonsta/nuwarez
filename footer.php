<?php
/**
 * Footer template
 */
?>
<footer class="site-footer">
    <div class="footer-content">
        <div class="footer-grid">
            <?php if (is_active_sidebar('footer-widget-area')): ?>
                <?php dynamic_sidebar('footer-widget-area'); ?>
            <?php else: ?>
                <div class="footer-section">
                    <h4><?php esc_html_e('About', 'nuwarez'); ?></h4>
                    <p><?php echo esc_html(get_theme_mod('footer_about', 'Empowering sustainable innovation and mindful living in the digital age.')); ?></p>
                </div>
                <div class="footer-section">
                    <h4><?php esc_html_e('Quick Links', 'nuwarez'); ?></h4>
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'footer',
                        'container' => false,
                        'fallback_cb' => false
                    ));
                    ?>
                </div>
                <div class="footer-section">
                    <h4><?php esc_html_e('Connect', 'nuwarez'); ?></h4>
                    <div class="social-links">
                        <?php if (get_theme_mod('social_twitter')): ?>
                            <a href="<?php echo esc_url(get_theme_mod('social_twitter')); ?>" class="social-link" target="_blank" rel="noopener">Twitter</a>
                        <?php endif; ?>
                        <?php if (get_theme_mod('social_instagram')): ?>
                            <a href="<?php echo esc_url(get_theme_mod('social_instagram')); ?>" class="social-link" target="_blank" rel="noopener">Instagram</a>
                        <?php endif; ?>
                        <?php if (get_theme_mod('social_linkedin')): ?>
                            <a href="<?php echo esc_url(get_theme_mod('social_linkedin')); ?>" class="social-link" target="_blank" rel="noopener">LinkedIn</a>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endif; ?>
        </div>
        <div class="footer-bottom">
            <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. <?php esc_html_e('All rights reserved.', 'nuwarez'); ?></p>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
