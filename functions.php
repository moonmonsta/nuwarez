<?php
/**
 * Analytics Integration
 */
function nuwarez_enqueue_analytics() {
    // Enqueue web-vitals for Core Web Vitals tracking
    wp_enqueue_script(
        'web-vitals',
        'https://unpkg.com/web-vitals/dist/web-vitals.iife.js',
        array(),
        '3.0.0',
        true
    );

    // Enqueue our analytics script
    wp_enqueue_script(
        'nuwarez-analytics',
        get_template_directory_uri() . '/js/analytics/analytics.js',
        array('web-vitals'),
        '1.0.0',
        true
    );

    // Pass nonce to JavaScript
    wp_localize_script(
        'nuwarez-analytics',
        'analyticsNonce',
        wp_create_nonce('nuwarez_analytics_nonce')
    );
}
add_action('wp_enqueue_scripts', 'nuwarez_enqueue_analytics');

/**
 * Handle analytics data logging
 */
function nuwarez_log_analytics() {
    check_ajax_referer('nuwarez_analytics_nonce', 'nonce');

    $type = sanitize_text_field($_POST['type']);
    $data = json_decode(stripslashes($_POST['data']), true);
    
    if (!$data) {
        wp_send_json_error('Invalid data format');
        return;
    }

    // Sanitize the data recursively
    function sanitize_analytics_data($data) {
        if (is_array($data)) {
            return array_map('sanitize_analytics_data', $data);
        }
        return is_string($data) ? sanitize_text_field($data) : $data;
    }
    
    $sanitized_data = sanitize_analytics_data($data);
    
    // Add timestamp and request metadata
    $log_entry = array(
        'type' => $type,
        'data' => $sanitized_data,
        'timestamp' => current_time('mysql'),
        'ip' => sanitize_text_field($_SERVER['REMOTE_ADDR']),
        'user_agent' => sanitize_text_field($_SERVER['HTTP_USER_AGENT'])
    );
    
    // Log to database or file
    $log_file = WP_CONTENT_DIR . '/analytics/analytics-' . date('Y-m-d') . '.log';
    
    // Ensure directory exists
    wp_mkdir_p(dirname($log_file));
    
    // Append to log file
    file_put_contents(
        $log_file,
        json_encode($log_entry) . "\n",
        FILE_APPEND | LOCK_EX
    );
    
    wp_send_json_success();
}
add_action('wp_ajax_log_analytics', 'nuwarez_log_analytics');
add_action('wp_ajax_nopriv_log_analytics', 'nuwarez_log_analytics');

/**
 * Add meta description
 */
function nuwarez_meta_description() {
    if (is_front_page()) {
        echo '<meta name="description" content="Discover sustainable tech solutions and mindful entrepreneurship resources at NuWarez. Get practical insights for smart living and purposeful innovation.">';
    }
}
add_action('wp_head', 'nuwarez_meta_description', 1);

/**
 * Add Schema.org markup
 */
function nuwarez_schema_markup() {
    if (!is_front_page()) return;

    $schema_org = array(
        array(
            "@context" => "https://schema.org",
            "@type" => "Organization",
            "name" => get_bloginfo('name'),
            "description" => "Discover sustainable tech solutions and mindful entrepreneurship resources at NuWarez. Get practical insights for smart living and purposeful innovation.",
            "url" => home_url(),
            "sameAs" => array(
                "https://twitter.com/nuwarez",
                "https://linkedin.com/company/nuwarez"
            )
        ),
        array(
            "@context" => "https://schema.org",
            "@type" => "WebSite",
            "name" => get_bloginfo('name'),
            "url" => home_url(),
            "potentialAction" => array(
                "@type" => "SearchAction",
                "target" => home_url('/?s={search_term_string}'),
                "query-input" => "required name=search_term_string"
            )
        )
    );

    if (have_posts()) {
        $post = get_post();
        $schema_org[] = array(
            "@context" => "https://schema.org",
            "@type" => "NewsArticle",
            "headline" => "Smart Living. Sustainable Future.",
            "description" => "Discover sustainable tech solutions and mindful entrepreneurship resources at NuWarez. Get practical insights for smart living and purposeful innovation.",
            "image" => get_theme_file_uri('images/hero-image.jpg'),
            "author" => array(
                "@type" => "Organization",
                "name" => get_bloginfo('name')
            ),
            "publisher" => array(
                "@type" => "Organization",
                "name" => get_bloginfo('name'),
                "logo" => array(
                    "@type" => "ImageObject",
                    "url" => get_theme_file_uri('images/logo.png')
                )
            ),
            "datePublished" => get_the_date('c'),
            "dateModified" => get_the_modified_date('c')
        );
    }

    foreach ($schema_org as $schema) {
        echo '<script type="application/ld+json">' . wp_json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>' . "\n";
    }
}
add_action('wp_footer', 'nuwarez_schema_markup');

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
    wp_enqueue_script('nuwarez-email-cta', get_template_directory_uri() . '/components/email-cta/email-cta.js', array('jquery', 'nuwarez-script'), '1.0.0', true);
    wp_enqueue_script('nuwarez-featured', get_template_directory_uri() . '/components/featured/featured.js', array('jquery', 'nuwarez-script'), '1.0.0', true);
    
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
