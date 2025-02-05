<?php
/**
 * Template part for displaying the main navigation
 *
 * @package Nuwarez
 */
?>

<nav>
    <div class="logo"><?php bloginfo('name'); ?></div>
    <button class="mobile-menu-btn">☰</button>
    <div class="nav-container">
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
                <li><a href="#tech"><?php esc_html_e('Tech', 'nuwarez'); ?></a></li>
                <li><a href="#sustainability"><?php esc_html_e('Sustainability', 'nuwarez'); ?></a></li>
                <li><a href="#entrepreneurship"><?php esc_html_e('Entrepreneurship', 'nuwarez'); ?></a></li>
                <li><a href="#wellness"><?php esc_html_e('Wellness', 'nuwarez'); ?></a></li>
                <li><a href="#nufinds"><?php esc_html_e('NuFinds', 'nuwarez'); ?></a></li>
                <li><a href="#articles"><?php esc_html_e('Articles', 'nuwarez'); ?></a></li>
            </ul>
        <?php } ?>
        <div class="search-container">
            <span class="search-icon">🔍</span>
            <input type="search" class="search-bar" placeholder="<?php esc_attr_e('Search...', 'nuwarez'); ?>">
            <div class="search-results" style="display: none;"></div>
        </div>
        <button class="theme-toggle" aria-label="<?php esc_attr_e('Toggle dark mode', 'nuwarez'); ?>">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
            </svg>
        </button>
    </div>
</nav>
