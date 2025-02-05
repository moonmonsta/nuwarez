<?php
/**
 * Template part for displaying the about section
 *
 * @package Nuwarez
 */
?>

<section id="about" class="about-section fade-in">
    <h2 class="section-title"><?php echo esc_html(get_theme_mod('about_title', 'About Nuwarez')); ?></h2>
    <div class="about-content">
        <div class="about-image" style="background: url('<?php echo esc_url(get_theme_mod('about_image', get_template_directory_uri() . '/placeholder.svg')); ?>') center/cover">
        </div>
        <div class="about-text">
            <h3><?php echo esc_html(get_theme_mod('about_subtitle', 'Your Guide to Innovation')); ?></h3>
            <?php echo wpautop(wp_kses_post(get_theme_mod('about_content', 'Nuwarez is your premier destination for exploring the intersection of technology, sustainability, and mindful living. We curate cutting-edge insights on AI advancements, sustainable practices, and conscious entrepreneurship.'))); ?>
            <p>
                <?php echo wp_kses_post(get_theme_mod('about_cta_text', 'Join our community in discovering how we can leverage innovation for positive change while maintaining digital wellness.')); ?> 
                <a href="<?php echo esc_url(get_theme_mod('about_link', '/about')); ?>" class="about-link">
                    <?php esc_html_e('Learn more about our mission', 'nuwarez'); ?> →
                </a>
            </p>
        </div>
    </div>
</section>
