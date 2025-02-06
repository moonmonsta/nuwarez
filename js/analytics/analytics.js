/**
 * NuWarez Analytics Module
 * Comprehensive analytics tracking implementation for WordPress
 */

const NuWarezAnalytics = {
    /**
     * Analytics Configuration
     */
    config: {
        scrollDepthMarkers: [25, 50, 75, 100],
        performanceMetricsInterval: 5000, // Check performance every 5 seconds
        heatmapResolution: { x: 50, y: 50 }, // Grid size for interaction heatmap
    },

    /**
     * Initialize all analytics tracking
     */
    init() {
        this.initializeEventTracking();
        this.initializeFormAnalytics();
        this.initializePerformanceTracking();
        this.initializeHeatmap();
        
        // Log initialization
        this.logEvent('analytics', 'initialization', {
            timestamp: new Date().toISOString(),
            url: window.location.href
        });
    },

    /**
     * Event Tracking Implementation
     */
    initializeEventTracking() {
        // Scroll Depth Tracking
        let lastScrollDepth = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
            
            this.config.scrollDepthMarkers.forEach(marker => {
                if (scrollPercent >= marker && lastScrollDepth < marker) {
                    this.logEvent('scroll', 'depth_reached', {
                        depth: marker,
                        url: window.location.href
                    });
                }
            });
            
            lastScrollDepth = scrollPercent;
        });

        // Time on Page Tracking
        const startTime = Date.now();
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                const timeSpent = Math.round((Date.now() - startTime) / 1000);
                this.logEvent('engagement', 'time_on_page', {
                    seconds: timeSpent,
                    url: window.location.href
                });
            }
        });

        // Click Tracking
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button, input[type="submit"]');
            if (target) {
                this.logEvent('interaction', 'click', {
                    element: target.tagName.toLowerCase(),
                    id: target.id || 'none',
                    class: target.className || 'none',
                    text: target.textContent?.trim() || target.value || 'none'
                });
            }
        });
    },

    /**
     * Form Analytics Implementation
     */
    initializeFormAnalytics() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Form Start Tracking
            form.addEventListener('focusin', (e) => {
                if (!form.dataset.analyticsStarted) {
                    form.dataset.analyticsStarted = Date.now();
                    this.logEvent('form', 'start', {
                        formId: form.id || 'unnamed_form'
                    });
                }
            });

            // Field Completion Tracking
            form.addEventListener('change', (e) => {
                if (e.target.type !== 'submit') {
                    this.logEvent('form', 'field_complete', {
                        formId: form.id || 'unnamed_form',
                        field: e.target.name || 'unnamed_field',
                        type: e.target.type
                    });
                }
            });

            // Form Error Tracking
            form.addEventListener('invalid', (e) => {
                this.logEvent('form', 'error', {
                    formId: form.id || 'unnamed_form',
                    field: e.target.name || 'unnamed_field',
                    error: e.target.validationMessage
                }, true);
            }, true);

            // Form Submission/Conversion Tracking
            form.addEventListener('submit', (e) => {
                const timeToComplete = form.dataset.analyticsStarted ? 
                    Date.now() - parseInt(form.dataset.analyticsStarted) : 0;

                this.logEvent('form', 'submit', {
                    formId: form.id || 'unnamed_form',
                    timeToComplete: Math.round(timeToComplete / 1000)
                });
            });

            // Form Abandonment Tracking
            window.addEventListener('beforeunload', () => {
                if (form.dataset.analyticsStarted && !form.dataset.analyticsSubmitted) {
                    this.logEvent('form', 'abandon', {
                        formId: form.id || 'unnamed_form',
                        timeSpent: Math.round((Date.now() - parseInt(form.dataset.analyticsStarted)) / 1000)
                    });
                }
            });
        });
    },

    /**
     * Performance Metrics Tracking
     */
    initializePerformanceTracking() {
        // Core Web Vitals
        if ('web-vital' in window) {
            webVitals.getCLS(metric => this.logPerformance('CLS', metric.value));
            webVitals.getFID(metric => this.logPerformance('FID', metric.value));
            webVitals.getLCP(metric => this.logPerformance('LCP', metric.value));
        }

        // Performance Timeline
        if (window.performance && window.performance.getEntriesByType) {
            // Load Time Tracking
            window.addEventListener('load', () => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                this.logPerformance('page_load', pageLoadTime);
            });

            // Resource Timing
            const resourceObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    this.logPerformance('resource_timing', {
                        name: entry.name,
                        duration: entry.duration,
                        transferSize: entry.transferSize,
                        type: entry.initiatorType
                    });
                });
            });
            resourceObserver.observe({ entryTypes: ['resource'] });

            // Animation Performance
            const animationObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    this.logPerformance('animation', {
                        name: entry.name,
                        duration: entry.duration,
                        startTime: entry.startTime
                    });
                });
            });
            animationObserver.observe({ entryTypes: ['animation'] });
        }
    },

    /**
     * Interaction Heatmap Implementation
     */
    initializeHeatmap() {
        const heatmapData = Array(this.config.heatmapResolution.y).fill()
            .map(() => Array(this.config.heatmapResolution.x).fill(0));

        document.addEventListener('click', (e) => {
            const x = Math.floor(e.clientX / window.innerWidth * this.config.heatmapResolution.x);
            const y = Math.floor(e.clientY / window.innerHeight * this.config.heatmapResolution.y);
            
            if (x >= 0 && x < this.config.heatmapResolution.x && 
                y >= 0 && y < this.config.heatmapResolution.y) {
                heatmapData[y][x]++;
                
                // Log heatmap data periodically
                if (this.shouldLogHeatmap()) {
                    this.logEvent('heatmap', 'interaction_data', {
                        data: heatmapData,
                        resolution: this.config.heatmapResolution
                    });
                }
            }
        });
    },

    /**
     * Utility Methods
     */
    logEvent(category, action, data = {}, immediate = false) {
        const event = {
            category,
            action,
            data,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        // Send to WordPress backend
        this.sendToBackend('event', event);
        
        // Optional: Console logging for development
        if (window.debugAnalytics) {
            console.log('Analytics Event:', event);
        }
    },

    logPerformance(metric, value) {
        const perfData = {
            metric,
            value,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };

        this.sendToBackend('performance', perfData);
    },

    sendToBackend(type, data) {
        fetch('/wp-admin/admin-ajax.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                action: 'log_analytics',
                type: type,
                data: JSON.stringify(data),
                nonce: window.analyticsNonce // Will be set via WordPress
            })
        }).catch(error => {
            console.error('Analytics logging error:', error);
        });
    },

    shouldLogHeatmap() {
        // Log heatmap data every 100 interactions or on page unload
        return true; // Implement actual logic based on requirements
    }
};

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => NuWarezAnalytics.init());
