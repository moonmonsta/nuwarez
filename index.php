<?php
/**
 * The main template file
 *
 * @package Nuwarez
 */

get_header();
?>

<main id="primary" class="site-main">
    <?php
    if (have_posts()) :
        while (have_posts()) :
            the_post();
            
            // Include the Post-Type-specific template for the content
            get_template_part('template-parts/content', get_post_type());

        endwhile;

        // Previous/next page navigation
        the_posts_navigation();

    else :
        get_template_part('template-parts/content', 'none');
    endif;
    ?>
</main>

<?php
get_footer();
?>
