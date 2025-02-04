<?php
/**
 * NuWarez Theme Functions
 */

if (!defined('ABSPATH')) exit;

/**
 * Enqueue scripts and styles
 */
function nuwarez_scripts() {
    // Enqueue styles
    wp_enqueue_style('nuwarez-style', get_stylesheet_uri(), array(), '1.0.0');
    wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap', array(), null);
    
    // Enqueue scripts
    wp_enqueue_script('nuwarez-script', get_template_directory_uri() . '/js/script.js', array('jquery'), '1.0.0', true);
    
    // Localize script for AJAX
    wp_localize_script('nuwarez-script', 'nuwarez_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('nuwarez-nonce')
    ));
}
add_action('wp_enqueue_scripts', 'nuwarez_scripts');

/**
 * Theme setup
 */
function nuwarez_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));
    
    // Register nav menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'nuwarez'),
        'footer' => __('Footer Menu', 'nuwarez')
    ));
    
    // Register custom post types
    register_post_type('featured_topic', array(
        'labels' => array(
            'name' => __('Featured Topics', 'nuwarez'),
            'singular_name' => __('Featured Topic', 'nuwarez')
        ),
        'public' => true,
        'has_archive' => true,
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
        'menu_icon' => 'dashicons-star-filled'
    ));
}
add_action('after_setup_theme', 'nuwarez_setup');

/**
 * Register widget areas
 */
function nuwarez_widgets_init() {
    register_sidebar(array(
        'name' => __('Footer Widget Area', 'nuwarez'),
        'id' => 'footer-widget-area',
        'description' => __('Add widgets here to appear in footer', 'nuwarez'),
        'before_widget' => '<div class="footer-section">',
        'after_widget' => '</div>',
        'before_title' => '<h4>',
        'after_title' => '</h4>'
    ));
}
add_action('widgets_init', 'nuwarez_widgets_init');

/**
 * Newsletter subscription AJAX handler
 */
function nuwarez_handle_subscription() {
    check_ajax_referer('nuwarez-nonce', 'nonce');
    
    $email = sanitize_email($_POST['email']);
    if (!is_email($email)) {
        wp_send_json_error('Invalid email address');
    }
    
    // Here you would typically integrate with your newsletter service
    // For example, Mailchimp, ConvertKit, etc.
    
    wp_send_json_success('Successfully subscribed!');
}
add_action('wp_ajax_nuwarez_subscribe', 'nuwarez_handle_subscription');
add_action('wp_ajax_nopriv_nuwarez_subscribe', 'nuwarez_handle_subscription');

/**
 * Custom template tags
 */
function nuwarez_posted_on() {
    $time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time>';
    
    $time_string = sprintf($time_string,
        esc_attr(get_the_date(DATE_W3C)),
        esc_html(get_the_date())
    );
    
    echo '<span class="date">' . $time_string . '</span>';
}

/**
 * Customize excerpt length
 */
function nuwarez_custom_excerpt_length($length) {
    return 20;
}
add_filter('excerpt_length', 'nuwarez_custom_excerpt_length');

/**
 * Add custom image sizes
 */
function nuwarez_add_image_sizes() {
    add_image_size('featured-article', 800, 450, true);
    add_image_size('article-card', 400, 225, true);
}
add_action('after_setup_theme', 'nuwarez_add_image_sizes');
