<?php
/**
 * Template part for displaying the hero section
 *
 * @package Nuwarez
 */
?>

<section class="hero">
    <div class="hero__content">
        <h1><?php echo esc_html(get_theme_mod('hero_title', 'Discover Tomorrow\'s Innovations Today')); ?></h1>
        <p><?php echo esc_html(get_theme_mod('hero_subtitle', 'Exploring the intersection of technology, sustainability, and human progress')); ?></p>
        <a href="<?php echo esc_url(get_theme_mod('hero_cta_link', '#featured')); ?>" class="hero__cta">
            <?php echo esc_html(get_theme_mod('hero_cta_text', 'Explore Latest')); ?>
        </a>
    </div>
    <div class="hero__animation">
        <img src="<?php echo esc_url(get_theme_mod('hero_animation', get_template_directory_uri() . '/placeholder-animation.svg')); ?>"
             alt="<?php echo esc_attr(get_theme_mod('hero_animation_alt', 'Innovation Animation')); ?>"
             class="hero__animation-img"
             width="600"
             height="400">
    </div>
</section>
