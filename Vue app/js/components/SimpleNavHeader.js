// Simple NavHeader Component without external dependencies
const NavHeader = {
    template: `
        <header class="nav-header" :class="{ 'scrolled': isScrolled }">
            <div class="container">
                <div class="nav-content">
                    <!-- Logo -->
                    <router-link to="/" class="logo">
                        <i class="fas fa-bolt"></i>
                        <span>NeoGears</span>
                    </router-link>

                    <!-- Desktop Navigation -->
                    <nav class="desktop-nav">
                        <router-link to="/" class="nav-link" active-class="active">
                            <i class="fas fa-home"></i>
                            Početna
                        </router-link>
                        <router-link to="/products" class="nav-link" active-class="active">
                            <i class="fas fa-shopping-bag"></i>
                            Proizvodi
                        </router-link>
                        <router-link to="/cart" class="nav-link" active-class="active">
                            <i class="fas fa-shopping-cart"></i>
                            Košarica
                            <span class="cart-badge" v-if="cartItemsCount > 0">{{ cartItemsCount }}</span>
                        </router-link>
                    </nav>

                    <!-- Search Bar -->
                    <div class="search-container">
                        <div class="search-input-wrapper">
                            <input
                                type="text"
                                v-model="searchQuery"
                                @keyup.enter="performSearch"
                                placeholder="Pretraži proizvode..."
                                class="search-input"
                            >
                            <button class="search-btn" @click="performSearch">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Dark Mode Toggle -->
                    <dark-mode-toggle></dark-mode-toggle>

                    <!-- Mobile Search Toggle -->
                    <button class="mobile-search-toggle" @click="toggleMobileSearch">
                        <i class="fas fa-search"></i>
                    </button>

                    <!-- Mobile Cart Badge -->
                    <router-link to="/cart" class="mobile-cart-link">
                        <i class="fas fa-shopping-cart"></i>
                        <span class="cart-badge" v-if="cartItemsCount > 0">{{ cartItemsCount }}</span>
                    </router-link>

                    <!-- Mobile Menu Toggle -->
                    <button class="mobile-menu-toggle" @click="toggleMobileMenu">
                        <i :class="isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
                    </button>
                </div>

                <!-- Mobile Search Bar -->
                <div class="mobile-search-bar" v-if="isMobileSearchOpen">
                    <div class="mobile-search-input-wrapper">
                        <input
                            type="text"
                            v-model="searchQuery"
                            @keyup.enter="performSearch"
                            placeholder="Pretraži proizvode..."
                            class="mobile-search-input"
                            ref="mobileSearchInput"
                        >
                        <button class="mobile-search-btn" @click="performSearch">
                            <i class="fas fa-search"></i>
                        </button>
                        <button class="mobile-search-close" @click="closeMobileSearch">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <!-- Mobile Navigation Menu -->
                <nav class="mobile-nav" v-if="isMobileMenuOpen">
                    <div class="mobile-nav-content">
                        <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">
                            <i class="fas fa-home"></i>
                            Početna
                        </router-link>
                        <router-link to="/products" class="mobile-nav-link" @click="closeMobileMenu">
                            <i class="fas fa-shopping-bag"></i>
                            Proizvodi
                        </router-link>
                        <router-link to="/cart" class="mobile-nav-link" @click="closeMobileMenu">
                            <i class="fas fa-shopping-cart"></i>
                            Košarica
                            <span class="cart-badge" v-if="cartItemsCount > 0">{{ cartItemsCount }}</span>
                        </router-link>
                    </div>
                </nav>
            </div>
        </header>

        <!-- Bottom Navigation for Mobile -->
        <nav class="bottom-nav">
            <router-link to="/" class="bottom-nav-item" active-class="active">
                <i class="fas fa-home"></i>
                <span>Početna</span>
            </router-link>
            <router-link to="/products" class="bottom-nav-item" active-class="active">
                <i class="fas fa-shopping-bag"></i>
                <span>Proizvodi</span>
            </router-link>
            <button class="bottom-nav-item search-btn" @click="toggleMobileSearch">
                <i class="fas fa-search"></i>
                <span>Pretraži</span>
            </button>
            <router-link to="/cart" class="bottom-nav-item" active-class="active">
                <i class="fas fa-shopping-cart"></i>
                <span>Košarica</span>
                <span class="cart-badge" v-if="cartItemsCount > 0">{{ cartItemsCount }}</span>
            </router-link>
        </nav>
    `,

    setup() {
        const { ref, computed, onMounted, onUnmounted, nextTick } = Vue;
        const { useRouter } = VueRouter;

        const router = useRouter();

        // Reactive state
        const searchQuery = ref('');
        const isScrolled = ref(false);
        const isMobileMenuOpen = ref(false);
        const isMobileSearchOpen = ref(false);
        const mobileSearchInput = ref(null);

        // Computed properties
        const cartItemsCount = computed(() => {
            return window.cartStore ? window.cartStore.totalItems : 0;
        });

        // Methods
        const handleScroll = () => {
            isScrolled.value = window.scrollY > 50;
        };

        const toggleMobileMenu = () => {
            isMobileMenuOpen.value = !isMobileMenuOpen.value;
            // Close search if menu is opened
            if (isMobileMenuOpen.value) {
                isMobileSearchOpen.value = false;
            }
        };

        const closeMobileMenu = () => {
            isMobileMenuOpen.value = false;
        };

        const toggleMobileSearch = async () => {
            isMobileSearchOpen.value = !isMobileSearchOpen.value;
            // Close menu if search is opened
            if (isMobileSearchOpen.value) {
                isMobileMenuOpen.value = false;
                // Focus on search input
                await nextTick();
                if (mobileSearchInput.value) {
                    mobileSearchInput.value.focus();
                }
            }
        };

        const closeMobileSearch = () => {
            isMobileSearchOpen.value = false;
            searchQuery.value = '';
        };

        const performSearch = () => {
            if (searchQuery.value.trim()) {
                router.push(`/products?search=${encodeURIComponent(searchQuery.value.trim())}`);
                searchQuery.value = '';
                closeMobileMenu();
                closeMobileSearch();
            }
        };

        // Close mobile overlays when clicking outside
        const handleClickOutside = (event) => {
            const target = event.target;
            const mobileNav = document.querySelector('.mobile-nav');
            const mobileSearch = document.querySelector('.mobile-search-bar');
            const toggleButtons = document.querySelectorAll('.mobile-menu-toggle, .mobile-search-toggle');

            // Check if click is on toggle buttons
            let isToggleButton = false;
            toggleButtons.forEach(button => {
                if (button.contains(target)) {
                    isToggleButton = true;
                }
            });

            if (!isToggleButton) {
                if (mobileNav && !mobileNav.contains(target)) {
                    closeMobileMenu();
                }
                if (mobileSearch && !mobileSearch.contains(target)) {
                    closeMobileSearch();
                }
            }
        };

        // Lifecycle
        onMounted(() => {
            window.addEventListener('scroll', handleScroll);
            document.addEventListener('click', handleClickOutside);
        });

        onUnmounted(() => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('click', handleClickOutside);
        });

        return {
            searchQuery,
            isScrolled,
            isMobileMenuOpen,
            isMobileSearchOpen,
            mobileSearchInput,
            cartItemsCount,
            toggleMobileMenu,
            closeMobileMenu,
            toggleMobileSearch,
            closeMobileSearch,
            performSearch
        };
    }
};
