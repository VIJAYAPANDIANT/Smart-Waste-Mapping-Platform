/**
 * SmartWaste SPA Router
 * Intercepts nav clicks, fetches page HTML, and swaps <main> content
 * without a full page reload.
 */

const SpaRouter = (() => {
    // Page-specific external libraries
    const PAGE_DEPS = {
        'map.html': {
            css: ['https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'],
            js: ['https://unpkg.com/leaflet@1.9.4/dist/leaflet.js']
        },
        'admin.html': {
            css: [],
            js: ['https://cdn.jsdelivr.net/npm/chart.js']
        }
    };

    // Page-specific script paths and their init/cleanup functions
    const PAGE_SCRIPTS = {
        'app.html': { src: null, init: null, cleanup: null },
        'report.html': { src: 'report.js', init: 'initReport', cleanup: 'cleanupReport' },
        'map.html': { src: 'map.js', init: 'initMap', cleanup: 'cleanupMap' },
        'awareness.html': { src: 'awareness.js', init: 'initAwareness', cleanup: 'cleanupAwareness' },
        'admin.html': { src: 'admin.js', init: 'initAdmin', cleanup: 'cleanupAdmin' }
    };

    // Page titles
    const PAGE_TITLES = {
        'app.html': 'Smart Waste Mapping Platform | Clean City, Green Planet',
        'report.html': 'Report Waste | Smart Waste Mapping Platform',
        'map.html': 'Waste Map | Smart Waste Mapping Platform',
        'awareness.html': 'Waste Awareness | Smart Waste Mapping Platform',
        'admin.html': 'Overview Dashboard | Smart Waste Mapping Platform'
    };

    let currentPage = null;
    let isNavigating = false;
    let loadedScripts = {};
    let loadedDeps = {};
    const contentArea = () => document.getElementById('spa-content');

    /**
     * Initialize the router
     */
    function init() {
        // Determine initial page from URL
        const path = window.location.pathname;
        const page = path.substring(path.lastIndexOf('/') + 1) || 'app.html';
        currentPage = page;

        // Intercept all nav link clicks — use capture phase to beat Leaflet
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-route]');
            if (link) {
                e.preventDefault();
                e.stopPropagation();
                const route = link.getAttribute('data-route');
                if (route && route !== currentPage && !isNavigating) {
                    navigateTo(route);
                }
            }
        }, true);

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            const page = (e.state && e.state.page) ? e.state.page : 'app.html';
            if (page !== currentPage && !isNavigating) {
                loadPage(page, true);
            }
        });

        // Set initial history state
        history.replaceState({ page: currentPage }, '', currentPage);
        updateActiveNav(currentPage);
    }

    /**
     * Navigate to a page
     */
    function navigateTo(page) {
        if (page === currentPage) return;
        history.pushState({ page }, '', page);
        loadPage(page, true);
    }

    /**
     * Load a page's content into the SPA shell
     */
    async function loadPage(page, animate) {
        const content = contentArea();
        if (!content) return;

        isNavigating = true;

        // Cleanup current page
        cleanupCurrentPage();

        // Fade out
        if (animate) {
            content.classList.add('spa-fade-out');
            await sleep(200);
        }

        try {
            // Fetch the page HTML
            const response = await fetch(page);
            if (!response.ok) throw new Error(`Failed to fetch ${page}`);
            const html = await response.text();

            // Parse and extract <main> content
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const main = doc.querySelector('main');

            if (main) {
                content.innerHTML = main.innerHTML;
                // IMPORTANT: Always keep id='spa-content' so the router can find it
                // Copy the original page's classes but preserve our spa-content ID
                content.id = 'spa-content';
                if (main.className) {
                    content.className = main.className + ' spa-content';
                } else {
                    content.className = 'spa-content';
                }
                // Store original ID as data attribute for page scripts that need it
                if (main.id) {
                    content.setAttribute('data-original-id', main.id);
                }
            }

            // Update page state
            currentPage = page;
            document.title = PAGE_TITLES[page] || 'SmartWaste';
            updateActiveNav(page);

            // Load dependencies then page script
            await loadDependencies(page);
            await loadPageScript(page);

            // Re-initialize shared components for new DOM
            reinitSharedComponents();

        } catch (error) {
            console.error('SPA Router error:', error);
            content.innerHTML = '<div class="section-title"><h2>Error loading page</h2><p>Please try again.</p></div>';
        }

        // Fade in
        if (animate) {
            content.classList.remove('spa-fade-out');
            content.classList.add('spa-fade-in');
            await sleep(200);
            content.classList.remove('spa-fade-in');
        }

        isNavigating = false;
        // Scroll to top of page
        window.scrollTo(0, 0);
    }

    /**
     * Cleanup the current page (destroy map, chart, etc.)
     */
    function cleanupCurrentPage() {
        if (!currentPage) return;
        const config = PAGE_SCRIPTS[currentPage];
        if (config && config.cleanup && typeof window[config.cleanup] === 'function') {
            try {
                window[config.cleanup]();
            } catch (e) {
                console.warn('Cleanup error:', e);
            }
        }
    }

    /**
     * Load external dependencies (CSS/JS) for a page
     */
    async function loadDependencies(page) {
        const deps = PAGE_DEPS[page];
        if (!deps) return;

        // Load CSS
        for (const cssUrl of deps.css) {
            if (!loadedDeps[cssUrl]) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = cssUrl;
                document.head.appendChild(link);
                loadedDeps[cssUrl] = true;
            }
        }

        // Load JS
        for (const jsUrl of deps.js) {
            if (!loadedDeps[jsUrl]) {
                await loadScript(jsUrl);
                loadedDeps[jsUrl] = true;
            }
        }
    }

    /**
     * Load and initialize a page-specific script
     */
    async function loadPageScript(page) {
        const config = PAGE_SCRIPTS[page];
        if (!config || !config.src) return;

        if (!loadedScripts[config.src]) {
            await loadScript(config.src);
            loadedScripts[config.src] = true;
        }

        // Call the init function
        if (config.init && typeof window[config.init] === 'function') {
            window[config.init]();
        }
    }

    /**
     * Load a script file and return a promise
     */
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            const existing = document.querySelector(`script[src="${src}"]`);
            if (existing) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }

    /**
     * Re-initialize shared components that depend on DOM
     */
    function reinitSharedComponents() {
        // Re-init auth UI for the new DOM
        if (typeof initAuthUI === 'function') {
            initAuthUI();
        }
    }

    /**
     * Update the active nav link
     */
    function updateActiveNav(page) {
        document.querySelectorAll('nav [data-route]').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-route') === page);
        });
    }

    /**
     * Utility sleep
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Expose public API
    return { init, navigateTo };
})();

// Make navigateTo globally accessible for other scripts
function navigateTo(page) {
    SpaRouter.navigateTo(page);
}

// Initialize router when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    SpaRouter.init();
});
