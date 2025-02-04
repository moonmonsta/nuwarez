<?php
/**
 * Header template
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<button class="back-to-top" aria-label="Scroll to top">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 19V5m-7 7 7-7 7 7"/>
    </svg>
</button>

<canvas id="particleCanvas"></canvas>
<header class="hero">
    <nav>
        <div class="logo">
            <?php if (has_custom_logo()): ?>
                <?php the_custom_logo(); ?>
            <?php else: ?>
                <a href="<?php echo esc_url(home_url('/')); ?>"><?php bloginfo('name'); ?></a>
            <?php endif; ?>
        </div>
        <div class="nav-container">
            <?php
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'container' => false,
                'menu_class' => 'nav-links',
                'fallback_cb' => false
            ));
            ?>
            <div class="search-container">
                <input type="search" class="search-bar" placeholder="Search..." aria-label="Search">
                <span class="search-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.3-4.3"/>
                    </svg>
                </span>
            </div>
            <button class="theme-toggle" aria-label="Toggle theme">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"/>
                    <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
            </button>
        </div>
        <button class="mobile-menu-btn">☰</button>
    </nav>
    
    <?php if (is_front_page()): ?>
    <div class="hero-content">
        <div class="hero-brand"><?php bloginfo('name'); ?></div>
        <h1 data-text="<?php echo esc_attr(get_theme_mod('hero_title', 'Innovation Meets Purpose')); ?>">
            <?php echo esc_html(get_theme_mod('hero_title', 'Innovation Meets Purpose')); ?>
        </h1>
        <p><?php echo esc_html(get_theme_mod('hero_description', 'Empowering innovators to thrive mindfully and live sustainably.')); ?></p>
        <form id="hero-email-form" class="hero-email-form">
            <?php wp_nonce_field('nuwarez-subscribe', 'subscribe_nonce'); ?>
            <input type="email" placeholder="<?php esc_attr_e('Enter your email for tech insights', 'nuwarez'); ?>" required>
            <button type="submit" class="cta"><?php esc_html_e('Get Started', 'nuwarez'); ?></button>
        </form>
    </div>
    <?php endif; ?>
</header>
