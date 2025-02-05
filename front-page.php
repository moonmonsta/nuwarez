<?php
/**
 * Front page template
 *
 * @package Nuwarez
 */

get_header();

// Hero Section
get_template_part('template-parts/hero');

// Banner Carousel
get_template_part('template-parts/banner-carousel');

// Featured Section
get_template_part('template-parts/featured');

// About Section
get_template_part('template-parts/about');

// Articles Section
get_template_part('template-parts/articles');

// Newsletter Section
get_template_part('template-parts/newsletter');

get_footer();
