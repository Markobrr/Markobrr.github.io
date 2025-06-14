// UI Store - Pinia
const { defineStore } = Pinia;

const useUIStore = defineStore('ui', {
    state: () => ({
        // Theme
        theme: 'light', // 'light' or 'dark'
        
        // Loading states
        isLoading: false,
        pageLoading: false,
        
        // Modal states
        productModal: {
            isOpen: false,
            product: null
        },
        
        // Mobile menu
        mobileMenuOpen: false,
        
        // Filter sidebar (mobile)
        filterSidebarOpen: false,
        
        // Notifications
        notifications: [],
        
        // Search
        searchOpen: false,
        
        // Scroll position
        scrollY: 0,
        
        // Viewport size
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
            isMobile: window.innerWidth < 768,
            isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
            isDesktop: window.innerWidth >= 1024
        }
    }),

    getters: {
        // Theme getters
        isDarkMode: (state) => state.theme === 'dark',
        isLightMode: (state) => state.theme === 'light',
        
        // Device type getters
        isMobile: (state) => state.viewport.isMobile,
        isTablet: (state) => state.viewport.isTablet,
        isDesktop: (state) => state.viewport.isDesktop,
        isMobileOrTablet: (state) => state.viewport.isMobile || state.viewport.isTablet,
        
        // Modal getters
        isProductModalOpen: (state) => state.productModal.isOpen,
        currentModalProduct: (state) => state.productModal.product,
        
        // Loading getters
        isAnyLoading: (state) => state.isLoading || state.pageLoading,
        
        // Notification getters
        hasNotifications: (state) => state.notifications.length > 0,
        latestNotification: (state) => state.notifications[state.notifications.length - 1],
        
        // Scroll getters
        isScrolled: (state) => state.scrollY > 50,
        
        // Sidebar getters
        isAnySidebarOpen: (state) => {
            const cartStore = useCartStore();
            return state.mobileMenuOpen || state.filterSidebarOpen || cartStore.isOpen;
        }
    },

    actions: {
        // Theme actions
        toggleTheme() {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
            this.saveTheme();
            this.applyTheme();
        },

        setTheme(theme) {
            this.theme = theme;
            this.saveTheme();
            this.applyTheme();
        },

        saveTheme() {
            try {
                localStorage.setItem('neogears-theme', this.theme);
            } catch (error) {
                console.error('Error saving theme:', error);
            }
        },

        loadTheme() {
            try {
                const savedTheme = localStorage.getItem('neogears-theme');
                if (savedTheme) {
                    this.theme = savedTheme;
                } else {
                    // Use system preference
                    this.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                this.applyTheme();
            } catch (error) {
                console.error('Error loading theme:', error);
            }
        },

        applyTheme() {
            document.documentElement.setAttribute('data-theme', this.theme);
            document.documentElement.classList.toggle('dark', this.theme === 'dark');
        },

        // Loading actions
        setLoading(loading) {
            this.isLoading = loading;
        },

        setPageLoading(loading) {
            this.pageLoading = loading;
        },

        // Product modal actions
        openProductModal(product) {
            this.productModal.isOpen = true;
            this.productModal.product = product;
            document.body.style.overflow = 'hidden';
        },

        closeProductModal() {
            this.productModal.isOpen = false;
            this.productModal.product = null;
            document.body.style.overflow = '';
        },

        // Mobile menu actions
        toggleMobileMenu() {
            this.mobileMenuOpen = !this.mobileMenuOpen;
            if (this.mobileMenuOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        },

        closeMobileMenu() {
            this.mobileMenuOpen = false;
            document.body.style.overflow = '';
        },

        // Filter sidebar actions
        toggleFilterSidebar() {
            this.filterSidebarOpen = !this.filterSidebarOpen;
            if (this.filterSidebarOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        },

        closeFilterSidebar() {
            this.filterSidebarOpen = false;
            document.body.style.overflow = '';
        },

        // Search actions
        toggleSearch() {
            this.searchOpen = !this.searchOpen;
        },

        openSearch() {
            this.searchOpen = true;
        },

        closeSearch() {
            this.searchOpen = false;
        },

        // Close all overlays
        closeAllOverlays() {
            this.closeMobileMenu();
            this.closeFilterSidebar();
            this.closeProductModal();
            this.closeSearch();
            
            const cartStore = useCartStore();
            cartStore.closeCart();
            
            document.body.style.overflow = '';
        },

        // Scroll actions
        updateScrollPosition(y) {
            this.scrollY = y;
        },

        // Viewport actions
        updateViewport() {
            this.viewport.width = window.innerWidth;
            this.viewport.height = window.innerHeight;
            this.viewport.isMobile = window.innerWidth < 768;
            this.viewport.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
            this.viewport.isDesktop = window.innerWidth >= 1024;
        },

        // Initialize UI
        initializeUI() {
            this.loadTheme();
            this.updateViewport();
            
            // Listen for viewport changes
            window.addEventListener('resize', () => {
                this.updateViewport();
                
                // Close mobile menu on desktop
                if (this.viewport.isDesktop && this.mobileMenuOpen) {
                    this.closeMobileMenu();
                }
                
                // Close filter sidebar on desktop
                if (this.viewport.isDesktop && this.filterSidebarOpen) {
                    this.closeFilterSidebar();
                }
            });

            // Listen for scroll events
            window.addEventListener('scroll', () => {
                this.updateScrollPosition(window.scrollY);
            });

            // Listen for escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeAllOverlays();
                }
            });

            // Listen for system theme changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('neogears-theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        },

        // Smooth scroll to element
        scrollToElement(elementId, offset = 0) {
            const element = document.getElementById(elementId);
            if (element) {
                const top = element.offsetTop - offset;
                window.scrollTo({
                    top,
                    behavior: 'smooth'
                });
            }
        },

        // Scroll to top
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        },

        // Show loading overlay
        showLoading(message = 'Učitavanje...') {
            this.setLoading(true);
            // You can extend this to show a custom loading message
        },

        // Hide loading overlay
        hideLoading() {
            this.setLoading(false);
        },

        // Debounced search
        debouncedSearch: null,

        setupDebouncedSearch(callback, delay = 300) {
            return (...args) => {
                clearTimeout(this.debouncedSearch);
                this.debouncedSearch = setTimeout(() => callback.apply(this, args), delay);
            };
        }
    }
});

// Notification Store
const useNotificationStore = defineStore('notifications', {
    state: () => ({
        notifications: []
    }),

    getters: {
        allNotifications: (state) => state.notifications,
        hasNotifications: (state) => state.notifications.length > 0
    },

    actions: {
        addNotification(notification) {
            const id = Date.now();
            const newNotification = {
                id,
                type: notification.type || 'info', // success, error, warning, info
                title: notification.title || '',
                message: notification.message || '',
                duration: notification.duration || 5000,
                persistent: notification.persistent || false,
                createdAt: new Date().toISOString()
            };

            this.notifications.push(newNotification);

            // Auto remove notification after duration (unless persistent)
            if (!newNotification.persistent && newNotification.duration > 0) {
                setTimeout(() => {
                    this.removeNotification(id);
                }, newNotification.duration);
            }

            return id;
        },

        removeNotification(id) {
            const index = this.notifications.findIndex(n => n.id === id);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        },

        clearAllNotifications() {
            this.notifications = [];
        },

        // Convenience methods for different notification types
        success(title, message, duration = 3000) {
            return this.addNotification({
                type: 'success',
                title,
                message,
                duration
            });
        },

        error(title, message, duration = 5000) {
            return this.addNotification({
                type: 'error',
                title,
                message,
                duration
            });
        },

        warning(title, message, duration = 4000) {
            return this.addNotification({
                type: 'warning',
                title,
                message,
                duration
            });
        },

        info(title, message, duration = 3000) {
            return this.addNotification({
                type: 'info',
                title,
                message,
                duration
            });
        }
    }
});
