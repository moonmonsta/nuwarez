<?php
/**
 * Template part for displaying the featured section and niche cards
 *
 * @package Nuwarez
 */

$niche_cards = array(
    'tech' => array(
        'icon' => 'tech-icon.svg',
        'title' => 'Tech',
        'description' => 'Explore cutting-edge technology trends, innovations, and digital transformation insights.',
    ),
    'sustainability' => array(
        'icon' => 'sustainability-icon.svg',
        'title' => 'Sustainability',
        'description' => 'Discover eco-friendly initiatives, sustainable practices, and environmental innovations.',
    ),
    'wellness' => array(
        'icon' => 'wellness-icon.svg',
        'title' => 'Wellness',
        'description' => 'Find holistic health approaches, mental wellness strategies, and lifestyle balance tips.',
    ),
    'entrepreneurship' => array(
        'icon' => 'entrepreneurship-icon.svg',
        'title' => 'Entrepreneurship',
        'description' => 'Learn startup strategies, business insights, and innovation frameworks.',
    ),
    'remote' => array(
        'icon' => 'remote-icon.svg',
        'title' => 'Remote Work',
        'description' => 'Master remote collaboration, digital productivity, and virtual team management.',
    ),
    'nufinds' => array(
        'icon' => 'nufinds-icon.svg',
        'title' => 'NuFinds',
        'description' => 'Discover curated innovations, emerging trends, and breakthrough discoveries.',
    )
);
?>

<section id="featured" class="featured">
    <h2><?php echo esc_html(get_theme_mod('featured_title', 'Featured Insights')); ?></h2>
    <div class="featured-grid">
        <?php
        // Featured posts query
        $featured_posts = new WP_Query(array(
            'post_type' => 'post',
            'posts_per_page' => 3,
            'meta_key' => '_is_featured',
            'meta_value' => 'yes'
        ));

        if ($featured_posts->have_posts()) :
            while ($featured_posts->have_posts()) : $featured_posts->the_post();
                get_template_part('template-parts/content', 'featured');
            endwhile;
            wp_reset_postdata();
        endif;
        ?>
    </div>
</section>

<section id="niches" class="niche-grid">
    <?php foreach ($niche_cards as $key => $card) : 
        // Get the latest post for this niche
        $latest_post = get_posts(array(
            'posts_per_page' => 1,
            'category_name' => $key
        ));
        $latest_title = !empty($latest_post) ? $latest_post[0]->post_title : '';
        $category_link = get_category_link(get_category_by_slug($key)->term_id);
    ?>
        <article class="niche-card niche-card--<?php echo esc_attr($key); ?>">
            <img src="<?php echo esc_url(get_template_directory_uri() . '/images/' . $card['icon']); ?>"
                 alt="<?php echo esc_attr($card['title']); ?> Icon"
                 class="niche-card__icon"
                 loading="lazy"
                 width="48"
                 height="48">
            <h2 class="niche-card__title"><?php echo esc_html($card['title']); ?></h2>
            <p class="niche-card__description">
                <?php echo esc_html($card['description']); ?>
            </p>
            <?php if ($latest_title) : ?>
                <p class="niche-card__post">
                    <?php echo esc_html__('Latest: ', 'nuwarez') . esc_html($latest_title); ?>
                </p>
            <?php endif; ?>
            <a href="<?php echo esc_url($category_link); ?>" class="niche-card__cta">
                <?php echo esc_html__('Explore ', 'nuwarez') . esc_html($card['title']); ?>
            </a>
        </article>
    <?php endforeach; ?>
</section>
