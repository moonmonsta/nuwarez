#!/bin/bash

# Start with the theme information and base styles
cat > styles.css << 'EOL'
/*
Theme Name: NuWarez
Theme URI: https://nuwarez.com
Author: NuWarez Team
Author URI: https://nuwarez.com
Description: A modern WordPress theme for tech, sustainability, and entrepreneurship content.
Version: 1.0.0
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: nuwarez
Tags: custom-logo, custom-menu, featured-images, threaded-comments, translation-ready
*/

/* Particle Canvas */
#particleCanvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-color: #000;
    pointer-events: none;
}

EOL

# Concatenate all component CSS files
cat components/navigation/navigation.css >> styles.css
cat components/hero/hero.css >> styles.css
cat components/featured/featured.css >> styles.css
cat components/about/about.css >> styles.css
cat components/articles/articles.css >> styles.css
cat components/banner-carousel/banner-carousel.css >> styles.css
cat components/newsletter/newsletter.css >> styles.css
cat components/footer/footer.css >> styles.css

# Add WordPress core styles
cat >> styles.css << 'EOL'

/* WordPress Core Styles */
.alignnone {
    margin: 5px 20px 20px 0;
}

.aligncenter,
div.aligncenter {
    display: block;
    margin: 5px auto 5px auto;
}

.alignright {
    float: right;
    margin: 5px 0 20px 20px;
}

.alignleft {
    float: left;
    margin: 5px 20px 20px 0;
}

.wp-caption {
    background: #fff;
    border: 1px solid #f0f0f0;
    max-width: 96%;
    padding: 5px 3px 10px;
    text-align: center;
}

.wp-caption.alignnone {
    margin: 5px 20px 20px 0;
}

.wp-caption.alignleft {
    margin: 5px 20px 20px 0;
}

.wp-caption.alignright {
    margin: 5px 0 20px 20px;
}

.wp-caption img {
    border: 0 none;
    height: auto;
    margin: 0;
    max-width: 98.5%;
    padding: 0;
    width: auto;
}

.wp-caption p.wp-caption-text {
    font-size: 11px;
    line-height: 17px;
    margin: 0;
    padding: 0 4px 5px;
}

.screen-reader-text {
    clip: rect(1px, 1px, 1px, 1px);
    position: absolute !important;
    height: 1px;
    width: 1px;
    overflow: hidden;
}

.screen-reader-text:focus {
    background-color: #f1f1f1;
    border-radius: 3px;
    box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.6);
    clip: auto !important;
    color: #21759b;
    display: block;
    font-size: 14px;
    font-weight: bold;
    height: auto;
    left: 5px;
    line-height: normal;
    padding: 15px 23px 14px;
    text-decoration: none;
    top: 5px;
    width: auto;
    z-index: 100000;
}

.sticky {
    display: block;
}

.bypostauthor {
    display: block;
}

/* Additional WordPress compatibility styles */
.wp-block-image img {
    max-width: 100%;
    height: auto;
}

.wp-block-gallery {
    margin: 0;
    padding: 0;
}

.wp-block-quote {
    border-left: 4px solid var(--primary);
    margin: 0 0 1.5em;
    padding-left: 1em;
}

.wp-block-code {
    background: var(--darker-bg);
    padding: 1.5em;
    border-radius: 4px;
}

.wp-block-table {
    width: 100%;
    margin-bottom: 1.5em;
}

.wp-block-table td,
.wp-block-table th {
    padding: 0.5em;
    border: 1px solid var(--border);
}

.wp-block-button__link {
    background-color: var(--primary);
    color: var(--text);
    padding: 0.5em 1em;
    border-radius: 4px;
    text-decoration: none;
}

.wp-block-button__link:hover {
    background-color: var(--primary-dark);
}

.wp-block-cover,
.wp-block-cover-image {
    position: relative;
    background-size: cover;
    min-height: 430px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1em;
    box-sizing: border-box;
}
EOL
