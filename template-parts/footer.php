<?php
/**
 * Template part for displaying the footer
 *
 * @package Nuwarez
 */
?>

<footer class="footer">
    <div class="footer__container">
        <div class="footer__section">
            <h3><?php echo esc_html(get_theme_mod('footer_about_title', 'About NuWarez')); ?></h3>
            <p><?php echo esc_html(get_theme_mod('footer_about_text', 'Exploring the intersection of technology, sustainability, wellness, and modern entrepreneurship.')); ?></p>
        </div>
        
        <div class="footer__section">
            <h3><?php esc_html_e('Quick Links', 'nuwarez'); ?></h3>
            <?php
            if (has_nav_menu('footer-quick-links')) {
                wp_nav_menu(array(
                    'theme_location' => 'footer-quick-links',
                    'container' => false,
                    'depth' => 1,
                    'fallback_cb' => false
                ));
            } else {
            ?>
                <ul>
                    <li><a href="<?php echo esc_url(get_permalink(get_page_by_path('about'))); ?>"><?php esc_html_e('About Us', 'nuwarez'); ?></a></li>
                    <li><a href="#articles"><?php esc_html_e('Articles', 'nuwarez'); ?></a></li>
                    <li><a href="<?php echo esc_url(get_permalink(get_page_by_path('contact'))); ?>"><?php esc_html_e('Contact', 'nuwarez'); ?></a></li>
                    <li><a href="<?php echo esc_url(get_privacy_policy_url()); ?>"><?php esc_html_e('Privacy Policy', 'nuwarez'); ?></a></li>
                </ul>
            <?php } ?>
        </div>
        
        <div class="footer__section">
            <h3><?php esc_html_e('Categories', 'nuwarez'); ?></h3>
            <?php
            $categories = get_categories(array(
                'hide_empty' => true,
                'exclude' => array(1), // Excludes 'Uncategorized'
                'number' => 4
            ));
            if (!empty($categories)) :
            ?>
                <ul>
                    <?php foreach ($categories as $category) : ?>
                        <li>
                            <a href="<?php echo esc_url(get_category_link($category->term_id)); ?>">
                                <?php echo esc_html($category->name); ?>
                            </a>
                        </li>
                    <?php endforeach; ?>
                </ul>
            <?php endif; ?>
        </div>
        
        <div class="footer__section">
            <h3><?php esc_html_e('Connect', 'nuwarez'); ?></h3>
            <div class="footer__social">
                <?php
                $social_links = array(
                    'twitter' => array(
                        'url' => get_theme_mod('social_twitter'),
                        'icon' => 'fab fa-twitter',
                        'label' => 'Twitter'
                    ),
                    'linkedin' => array(
                        'url' => get_theme_mod('social_linkedin'),
                        'icon' => 'fab fa-linkedin',
                        'label' => 'LinkedIn'
                    ),
                    'instagram' => array(
                        'url' => get_theme_mod('social_instagram'),
                        'icon' => 'fab fa-instagram',
                        'label' => 'Instagram'
                    )
                );

                foreach ($social_links as $platform => $data) :
                    if ($data['url']) :
                ?>
                    <a href="<?php echo esc_url($data['url']); ?>" 
                       aria-label="<?php echo esc_attr($data['label']); ?>"
                       target="_blank"
                       rel="noopener noreferrer">
                        <i class="<?php echo esc_attr($data['icon']); ?>"></i>
                    </a>
                <?php
                    endif;
                endforeach;
                ?>
            </div>
        </div>
    </div>
    
    <div class="footer__bottom">
        <p>
            &copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. 
            <?php esc_html_e('All rights reserved.', 'nuwarez'); ?>
        </p>
    </div>
</footer>

<?php
// Enqueue Font Awesome for social icons
wp_enqueue_style(
    'font-awesome',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
    array(),
    '5.15.4'
);
?>
