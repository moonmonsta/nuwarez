<?php
/**
 * Template part for displaying featured post content
 *
 * @package Nuwarez
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class('featured-item'); ?>>
    <?php if (has_post_thumbnail()) : ?>
        <div class="featured-image">
            <?php the_post_thumbnail('featured-thumbnail'); ?>
        </div>
    <?php endif; ?>

    <div class="featured-content">
        <?php
        $categories = get_the_category();
        if (!empty($categories)) :
            echo '<span class="featured-category">' . esc_html($categories[0]->name) . '</span>';
        endif;
        ?>

        <h3 class="featured-title">
            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
        </h3>

        <div class="featured-excerpt">
            <?php the_excerpt(); ?>
        </div>

        <div class="featured-meta">
            <?php nuwarez_posted_on(); ?>
            <a href="<?php the_permalink(); ?>" class="read-more">
                <?php esc_html_e('Read More', 'nuwarez'); ?> →
            </a>
        </div>
    </div>
</article>
