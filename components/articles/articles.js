class Articles {
    constructor() {
        this.grid = document.querySelector('.articles__grid');
        this.filters = document.querySelectorAll('.articles__filter');
        this.loadMoreBtn = document.querySelector('.articles__load-more');
        this.articles = document.querySelectorAll('.article-card');
        this.currentPage = 1;
        this.articlesPerPage = 4;
        this.currentCategory = 'all';
        
        this.init();
    }

    init() {
        // Set up intersection observer for animations
        this.setupScrollAnimations();
        
        // Add filter functionality
        this.setupFilters();
        
        // Add load more functionality
        this.setupLoadMore();
        
        // Initialize masonry layout
        this.setupMasonryLayout();
    }

    setupScrollAnimations() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.articles.forEach(article => {
            observer.observe(article);
        });
    }

    setupFilters() {
        this.filters.forEach(filter => {
            filter.addEventListener('click', () => {
                // Update active filter
                this.filters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');

                // Get selected category
                const category = filter.dataset.category;
                this.currentCategory = category;

                // Filter articles
                this.filterArticles(category);
            });
        });
    }

    filterArticles(category) {
        this.articles.forEach(article => {
            if (category === 'all' || article.dataset.category === category) {
                article.style.display = 'block';
                // Reset animation
                article.classList.remove('animate-in');
                void article.offsetWidth; // Trigger reflow
                article.classList.add('animate-in');
            } else {
                article.style.display = 'none';
            }
        });

        // Reset masonry layout
        this.setupMasonryLayout();
        
        // Reset pagination
        this.currentPage = 1;
        this.updateLoadMoreButton();
    }

    setupLoadMore() {
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => this.loadMoreArticles());
            this.updateLoadMoreButton();
        }
    }

    loadMoreArticles() {
        // Simulate loading more articles
        const startIndex = this.currentPage * this.articlesPerPage;
        const endIndex = startIndex + this.articlesPerPage;
        const visibleArticles = Array.from(this.articles).filter(article => 
            this.currentCategory === 'all' || article.dataset.category === this.currentCategory
        );

        visibleArticles.slice(startIndex, endIndex).forEach(article => {
            article.style.display = 'block';
            // Animate new articles
            article.classList.remove('animate-in');
            void article.offsetWidth; // Trigger reflow
            article.classList.add('animate-in');
        });

        this.currentPage++;
        this.updateLoadMoreButton();
        this.setupMasonryLayout();
    }

    updateLoadMoreButton() {
        const visibleArticles = Array.from(this.articles).filter(article => 
            this.currentCategory === 'all' || article.dataset.category === this.currentCategory
        );
        
        const hasMoreArticles = this.currentPage * this.articlesPerPage < visibleArticles.length;
        
        if (this.loadMoreBtn) {
            this.loadMoreBtn.style.display = hasMoreArticles ? 'inline-block' : 'none';
        }
    }

    setupMasonryLayout() {
        // Simple masonry-like layout using CSS Grid
        if (window.innerWidth > 768) {
            const gridItems = this.grid.children;
            let maxHeight = 0;
            
            Array.from(gridItems).forEach(item => {
                const height = item.getBoundingClientRect().height;
                maxHeight = Math.max(maxHeight, height);
            });
            
            this.grid.style.gridAutoRows = maxHeight + 'px';
        } else {
            this.grid.style.gridAutoRows = 'auto';
        }
    }
}

// Initialize articles section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Articles();
});
