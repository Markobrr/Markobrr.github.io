// Vue Router Configuration
const { createRouter, createWebHashHistory } = VueRouter;

// Route definitions
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            title: 'NeoGears - Moderna Tehnologija',
            description: 'Najbolji izbor mobitela, laptopa, tableta i gaming opreme po pristupačnim cijenama.',
            transition: 'fade'
        }
    },
    {
        path: '/products',
        name: 'Products',
        component: Products,
        meta: {
            title: 'Proizvodi - NeoGears',
            description: 'Pregledajte našu široku ponudu tehnoloških proizvoda.',
            transition: 'slide-left'
        }
    },
    {
        path: '/cart',
        name: 'Cart',
        component: Cart,
        meta: {
            title: 'Košarica - NeoGears',
            description: 'Pregledajte proizvode u vašoj košarici.',
            transition: 'slide-up'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: {
            template: `
                <div class="not-found-page">
                    <div class="container">
                        <div class="not-found-content">
                            <div class="not-found-icon">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <h1 class="not-found-title">404</h1>
                            <h2 class="not-found-subtitle">Stranica nije pronađena</h2>
                            <p class="not-found-description">
                                Žao nam je, ali stranica koju tražite ne postoji ili je premještena.
                            </p>
                            <div class="not-found-actions">
                                <router-link to="/" class="btn btn-primary">
                                    <i class="fas fa-home"></i>
                                    Povratak na početnu
                                </router-link>
                                <router-link to="/products" class="btn btn-outline">
                                    <i class="fas fa-shopping-bag"></i>
                                    Pregledaj proizvode
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            setup() {
                const { onMounted } = Vue;
                
                onMounted(() => {
                    // Track 404 errors for analytics
                    console.warn('404 Error:', window.location.href);
                });

                return {};
            }
        },
        meta: {
            title: '404 - Stranica nije pronađena',
            description: 'Stranica koju tražite ne postoji.',
            transition: 'fade'
        }
    }
];

// Create router instance
const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // Always scroll to top when changing routes
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0, behavior: 'smooth' };
        }
    }
});

// Global navigation guards
router.beforeEach((to, from, next) => {
    // Update document title
    if (to.meta.title) {
        document.title = to.meta.title;
    }

    // Update meta description
    if (to.meta.description) {
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = to.meta.description;
    }

    next();
});

router.afterEach((to, from) => {
    // Log navigation for debugging
    console.log(`Navigated from ${from.path} to ${to.path}`);
});

// Handle router errors
router.onError((error) => {
    console.error('Router error:', error);
});

// Export router
window.router = router;
