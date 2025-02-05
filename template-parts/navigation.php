<?php
/**
 * Template part for displaying the main navigation
 *
 * @package Nuwarez
 */
?>

<header class="main-header">
    <nav class="main-nav">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="logo">
            <?php 
            $custom_logo_id = get_theme_mod('custom_logo');
            if ($custom_logo_id) {
                echo wp_get_attachment_image($custom_logo_id, 'full', false, array(
                    'width' => 40,
                    'height' => 40,
                    'alt' => get_bloginfo('name')
                ));
            } else {
                ?>
                <img src="<?php echo esc_url(get_template_directory_uri() . '/favicon.svg'); ?>" alt="<?php echo esc_attr(get_bloginfo('name')); ?>" width="40" height="40">
            <?php } ?>
            <?php bloginfo('name'); ?>
        </a>
        <?php
        if (has_nav_menu('primary')) {
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'menu_class' => 'nav-links',
                'container' => false,
                'fallback_cb' => false,
                'items_wrap' => '<ul class="%2$s">%3$s</ul>'
            ));
        } else {
        ?>
            <ul class="nav-links">
                <li><a href="#featured"><?php esc_html_e('Featured', 'nuwarez'); ?></a></li>
                <li><a href="#about"><?php esc_html_e('About', 'nuwarez'); ?></a></li>
                <li><a href="#articles"><?php esc_html_e('Articles', 'nuwarez'); ?></a></li>
                <li><a href="#newsletter" class="cta-button"><?php esc_html_e('Subscribe', 'nuwarez'); ?></a></li>
            </ul>
        <?php } ?>
    </nav>
</header>
