<?php
/**
 * Front page template
 */

get_header();
?>

<section id="featured" class="featured-section fade-in">
    <h2 class="section-title"><?php echo esc_html(get_theme_mod('featured_title', 'Featured Topics')); ?></h2>
    <div class="featured-container">
        <?php
        $featured_topics = new WP_Query(array(
            'post_type' => 'featured_topic',
            'posts_per_page' => 6,
            'orderby' => 'menu_order',
            'order' => 'ASC'
        ));

        if ($featured_topics->have_posts()): 
            $counter = 0;
            while ($featured_topics->have_posts()): $featured_topics->the_post();
                if ($counter % 3 == 0):
                    if ($counter > 0) echo '</div></div>';
                    echo '<div class="featured-row"><div class="featured-content">';
                endif;
                ?>
                <article class="featured-card" data-topic="<?php echo esc_attr(get_post_meta(get_the_ID(), 'topic_tag', true)); ?>">
                    <span class="topic-tag"><?php echo esc_html(get_post_meta(get_the_ID(), 'topic_tag', true)); ?></span>
                    <h3><?php the_title(); ?></h3>
                    <?php the_excerpt(); ?>
                    <a href="<?php the_permalink(); ?>" class="read-more"><?php echo esc_html(get_post_meta(get_the_ID(), 'cta_text', true)); ?> →</a>
                </article>
                <?php
                $counter++;
            endwhile;
            echo '</div>';
            if ($featured_topics->post_count > 0): ?>
                <div class="featured-image" style="background-image: url('<?php echo esc_url(get_theme_mod('featured_image', get_template_directory_uri() . '/placeholder.svg')); ?>')"></div>
            </div>
            <?php
            endif;
            wp_reset_postdata();
        endif;
        ?>
    </div>
</section>

<section id="about" class="about-section fade-in">
    <h2 class="section-title"><?php echo esc_html(get_theme_mod('about_title', 'About Nuwarez')); ?></h2>
    <div class="about-content">
        <div class="about-image" style="background: url('<?php echo esc_url(get_theme_mod('about_image', get_template_directory_uri() . '/placeholder.svg')); ?>') center/cover">
        </div>
        <div class="about-text">
            <h3><?php echo esc_html(get_theme_mod('about_subtitle', 'Your Guide to Innovation')); ?></h3>
            <?php echo wpautop(wp_kses_post(get_theme_mod('about_content', 'Nuwarez is your premier destination for exploring the intersection of technology, sustainability, and mindful living. We curate cutting-edge insights on AI advancements, sustainable practices, and conscious entrepreneurship.'))); ?>
            <p><?php echo wp_kses_post(get_theme_mod('about_cta_text', 'Join our community in discovering how we can leverage innovation for positive change while maintaining digital wellness.')); ?> 
            <a href="<?php echo esc_url(get_theme_mod('about_link', '/about')); ?>" class="about-link"><?php esc_html_e('Learn more about our mission', 'nuwarez'); ?> →</a></p>
        </div>
    </div>
</section>

<section id="latest-articles" class="articles-section fade-in">
    <h2 class="section-title"><?php echo esc_html(get_theme_mod('articles_title', 'Latest Articles')); ?></h2>
    <div class="carousel-container">
        <button class="carousel-btn prev">‹</button>
        <div class="articles-carousel">
            <?php
            $articles = new WP_Query(array(
                'post_type' => 'post',
                'posts_per_page' => 8,
                'orderby' => 'date',
                'order' => 'DESC'
            ));

            if ($articles->have_posts()):
                while ($articles->have_posts()): $articles->the_post();
                    $category = get_the_category();
                    $category_name = $category ? esc_html($category[0]->name) : '';
                    ?>
                    <article class="article-card" data-topic="<?php echo esc_attr(strtolower($category_name)); ?>">
                        <div class="article-image" style="background: url('<?php echo esc_url(get_the_post_thumbnail_url(get_the_ID(), 'article-card')); ?>') center/cover">
                            <span class="category-tag"><?php echo $category_name; ?></span>
                        </div>
                        <div class="article-content">
                            <h3><?php the_title(); ?></h3>
                            <?php the_excerpt(); ?>
                            <div class="article-meta">
                                <?php nuwarez_posted_on(); ?>
                                <a href="<?php the_permalink(); ?>" class="read-more"><?php esc_html_e('Learn More', 'nuwarez'); ?> →</a>
                            </div>
                        </div>
                    </article>
                    <?php
                endwhile;
                wp_reset_postdata();
            endif;
            ?>
        </div>
        <button class="carousel-btn next">›</button>
    </div>
</section>

<section id="newsletter" class="newsletter-section fade-in">
    <div class="newsletter-content">
        <h2><?php echo esc_html(get_theme_mod('newsletter_title', 'Stay Ahead of Tech Trends')); ?></h2>
        <p><?php echo esc_html(get_theme_mod('newsletter_description', 'Join our community of innovators and get weekly insights delivered to your inbox.')); ?></p>
        <form id="newsletter-form" class="newsletter-form">
            <?php wp_nonce_field('nuwarez-subscribe', 'subscribe_nonce'); ?>
            <input type="email" placeholder="<?php esc_attr_e('Your email address', 'nuwarez'); ?>" required>
            <button type="submit"><?php esc_html_e('Subscribe Now', 'nuwarez'); ?></button>
        </form>
        <div class="newsletter-features">
            <?php
            $features = get_theme_mod('newsletter_features', array(
                array('icon' => '📱', 'text' => 'Weekly Tech Updates'),
                array('icon' => '🔒', 'text' => 'No Spam Promise'),
                array('icon' => '🎁', 'text' => 'Exclusive Content')
            ));
            foreach ($features as $feature): ?>
                <div class="feature">
                    <span class="feature-icon"><?php echo esc_html($feature['icon']); ?></span>
                    <span><?php echo esc_html($feature['text']); ?></span>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<?php get_footer(); ?>
