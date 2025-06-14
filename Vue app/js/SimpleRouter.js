// Simple Router Configuration without external dependencies
const { createRouter, createWebHashHistory } = VueRouter;

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            title: 'NeoGears - Početna'
        }
    },
    {
        path: '/products',
        name: 'Products',
        component: Products,
        meta: {
            title: 'NeoGears - Proizvodi'
        }
    },
    {
        path: '/cart',
        name: 'Cart',
        component: Cart,
        meta: {
            title: 'NeoGears - Košarica'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    }
});

// Navigation guards
router.beforeEach((to, from, next) => {
    // Update document title
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    
    // Close mobile menu if open
    if (window.uiStore && window.uiStore.mobileMenuOpen) {
        window.uiStore.mobileMenuOpen = false;
    }
    
    next();
});

router.afterEach((to, from) => {
    // Track page views (placeholder for analytics)
    console.log(`Navigated to: ${to.path}`);
});

// Export router
window.router = router;
