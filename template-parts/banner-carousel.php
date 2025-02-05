<?php
/**
 * Template part for displaying the banner carousel
 *
 * @package Nuwarez
 */

// Get carousel slides from theme mods with defaults
$slides = array(
    array(
        'title' => get_theme_mod('carousel_slide1_title', 'Discover the Latest in Tech & Innovation'),
        'description' => get_theme_mod('carousel_slide1_desc', 'Stay ahead of the curve with our curated insights')
    ),
    array(
        'title' => get_theme_mod('carousel_slide2_title', 'Sustainable Living & Future Trends'),
        'description' => get_theme_mod('carousel_slide2_desc', 'Explore eco-friendly solutions for tomorrow')
    ),
    array(
        'title' => get_theme_mod('carousel_slide3_title', 'Wellness & Personal Growth'),
        'description' => get_theme_mod('carousel_slide3_desc', 'Transform your life with expert guidance')
    )
);
?>

<section class="banner-carousel">
    <div class="banner-carousel__container">
        <?php foreach ($slides as $slide) : ?>
            <div class="banner-carousel__slide">
                <h2><?php echo esc_html($slide['title']); ?></h2>
                <p><?php echo esc_html($slide['description']); ?></p>
            </div>
        <?php endforeach; ?>
    </div>
    <div class="banner-carousel__controls">
        <button class="banner-carousel__prev" aria-label="<?php esc_attr_e('Previous slide', 'nuwarez'); ?>">←</button>
        <button class="banner-carousel__next" aria-label="<?php esc_attr_e('Next slide', 'nuwarez'); ?>">→</button>
    </div>
</section>

<?php
// Enqueue carousel JavaScript
wp_enqueue_script(
    'nuwarez-carousel',
    get_template_directory_uri() . '/js/banner-carousel.js',
    array('jquery'),
    wp_get_theme()->get('Version'),
    true
);
?>
