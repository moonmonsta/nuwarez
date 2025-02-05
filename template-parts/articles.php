<?php
/**
 * Template part for displaying the articles section
 *
 * @package Nuwarez
 */

$categories = get_categories(array(
    'hide_empty' => true,
    'exclude' => array(1) // Excludes 'Uncategorized'
));
?>

<section class="articles" id="articles">
    <div class="articles__container">
        <header class="articles__header">
            <h2><?php echo esc_html(get_theme_mod('articles_title', 'Latest Articles')); ?></h2>
            <div class="articles__filters">
                <button class="articles__filter active" data-category="all">
                    <?php esc_html_e('All', 'nuwarez'); ?>
                </button>
                <?php foreach ($categories as $category) : ?>
                    <button class="articles__filter" data-category="<?php echo esc_attr($category->slug); ?>">
                        <?php echo esc_html($category->name); ?>
                    </button>
                <?php endforeach; ?>
            </div>
        </header>

        <div class="articles__grid">
            <?php
            $args = array(
                'post_type' => 'post',
                'posts_per_page' => get_option('posts_per_page'),
                'paged' => 1
            );
            $articles_query = new WP_Query($args);

            if ($articles_query->have_posts()) :
                while ($articles_query->have_posts()) : $articles_query->the_post();
                    $categories = get_the_category();
                    $category = !empty($categories) ? $categories[0] : null;
                    ?>
                    <article class="article-card" data-category="<?php echo $category ? esc_attr($category->slug) : ''; ?>">
                        <div class="article-card__image">
                            <?php if (has_post_thumbnail()) : ?>
                                <?php the_post_thumbnail('article-thumbnail', array('loading' => 'lazy')); ?>
                            <?php else : ?>
                                <img src="<?php echo esc_url(get_template_directory_uri() . '/placeholder.svg'); ?>" 
                                     alt="<?php esc_attr_e('Article thumbnail', 'nuwarez'); ?>" 
                                     loading="lazy">
                            <?php endif; ?>
                            <?php if ($category) : ?>
                                <span class="article-card__category"><?php echo esc_html($category->name); ?></span>
                            <?php endif; ?>
                        </div>
                        <div class="article-card__content">
                            <h3 class="article-card__title">
                                <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                            </h3>
                            <p class="article-card__excerpt">
                                <?php echo wp_trim_words(get_the_excerpt(), 20); ?>
                            </p>
                            <div class="article-card__meta">
                                <span class="article-card__date"><?php echo get_the_date(); ?></span>
                                <span class="article-card__read-time">
                                    <?php
                                    $content = get_the_content();
                                    $word_count = str_word_count(strip_tags($content));
                                    $reading_time = ceil($word_count / 200); // Assuming 200 words per minute
                                    printf(
                                        esc_html__('%d min read', 'nuwarez'),
                                        $reading_time
                                    );
                                    ?>
                                </span>
                            </div>
                        </div>
                    </article>
                <?php
                endwhile;
                wp_reset_postdata();
            endif;
            ?>
        </div>

        <?php if ($articles_query->max_num_pages > 1) : ?>
            <div class="articles__pagination">
                <button class="articles__load-more" data-page="1" data-max-pages="<?php echo esc_attr($articles_query->max_num_pages); ?>">
                    <?php esc_html_e('Load More Articles', 'nuwarez'); ?>
                </button>
            </div>
        <?php endif; ?>
    </div>
</section>

<?php
// Enqueue articles scripts
wp_enqueue_script(
    'nuwarez-articles',
    get_template_directory_uri() . '/js/articles.js',
    array('jquery'),
    wp_get_theme()->get('Version'),
    true
);

// Localize script with AJAX URL and nonce
wp_localize_script(
    'nuwarez-articles',
    'nuwarezArticles',
    array(
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('nuwarez_articles_nonce'),
    )
);
?>
