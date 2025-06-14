// NavHeader Component
const NavHeader = {
    template: `
        <header class="nav-header" :class="{ 'scrolled': isScrolled, 'menu-open': isMobileMenuOpen }">
            <div class="container">
                <div class="nav-content">
                    <!-- Logo -->
                    <router-link to="/" class="logo" @click="closeMobileMenu">
                        <i class="fas fa-bolt"></i>
                        <span>NeoGears</span>
                    </router-link>

                    <!-- Desktop Navigation -->
                    <nav class="desktop-nav" v-if="!isMobile">
                        <router-link to="/" class="nav-link" active-class="active">
                            <i class="fas fa-home"></i>
                            Početna
                        </router-link>
                        <router-link to="/products" class="nav-link" active-class="active">
                            <i class="fas fa-shopping-bag"></i>
                            Proizvodi
                        </router-link>
                        <div class="nav-dropdown" @mouseenter="showCategoriesDropdown = true" @mouseleave="showCategoriesDropdown = false">
                            <button class="nav-link dropdown-trigger">
                                <i class="fas fa-th-large"></i>
                                Kategorije
                                <i class="fas fa-chevron-down"></i>
                            </button>
                            <div class="dropdown-menu" v-show="showCategoriesDropdown">
                                <router-link 
                                    v-for="category in categories" 
                                    :key="category"
                                    :to="{ path: '/products', query: { category } }"
                                    class="dropdown-item"
                                    @click="showCategoriesDropdown = false"
                                >
                                    <i :class="getCategoryIcon(category)"></i>
                                    {{ getCategoryName(category) }}
                                </router-link>
                            </div>
                        </div>
                    </nav>

                    <!-- Search Bar -->
                    <div class="search-container" v-if="!isMobile">
                        <div class="search-input-wrapper">
                            <input 
                                type="text" 
                                v-model="searchQuery"
                                @input="onSearchInput"
                                @focus="showSearchSuggestions = true"
                                @blur="hideSearchSuggestions"
                                placeholder="Pretraži proizvode..."
                                class="search-input"
                            >
                            <button class="search-btn" @click="performSearch">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                        
                        <!-- Search Suggestions -->
                        <div class="search-suggestions" v-show="showSearchSuggestions && searchSuggestions.length > 0">
                            <div 
                                v-for="suggestion in searchSuggestions" 
                                :key="suggestion.id"
                                class="suggestion-item"
                                @mousedown="selectSuggestion(suggestion)"
                            >
                                <img :src="suggestion.image" :alt="suggestion.title" class="suggestion-image">
                                <div class="suggestion-content">
                                    <div class="suggestion-title">{{ suggestion.title }}</div>
                                    <div class="suggestion-price">{{ suggestion.currentPrice }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="nav-actions">
                        <!-- Theme Toggle -->
                        <button class="action-btn theme-toggle" @click="toggleTheme" :title="isDarkMode ? 'Prebaci na svijetli način' : 'Prebaci na tamni način'">
                            <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
                        </button>

                        <!-- Mobile Search -->
                        <button class="action-btn mobile-search" v-if="isMobile" @click="toggleMobileSearch">
                            <i class="fas fa-search"></i>
                        </button>

                        <!-- Cart Button -->
                        <button class="action-btn cart-btn" @click="toggleCart" :class="{ 'has-items': totalItems > 0 }">
                            <i class="fas fa-shopping-cart"></i>
                            <span class="cart-badge" v-if="totalItems > 0">{{ totalItems }}</span>
                        </button>

                        <!-- Mobile Menu Toggle -->
                        <button class="action-btn mobile-menu-toggle" v-if="isMobile" @click="toggleMobileMenu">
                            <i :class="isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
                        </button>
                    </div>
                </div>

                <!-- Mobile Search Bar -->
                <div class="mobile-search-bar" v-if="isMobile && showMobileSearch">
                    <div class="search-input-wrapper">
                        <input 
                            type="text" 
                            v-model="searchQuery"
                            @input="onSearchInput"
                            @keyup.enter="performSearch"
                            placeholder="Pretraži proizvode..."
                            class="search-input"
                            ref="mobileSearchInput"
                        >
                        <button class="search-btn" @click="performSearch">
                            <i class="fas fa-search"></i>
                        </button>
                        <button class="close-search-btn" @click="closeMobileSearch">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <!-- Mobile Navigation Menu -->
                <nav class="mobile-nav" v-if="isMobile && isMobileMenuOpen">
                    <div class="mobile-nav-content">
                        <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">
                            <i class="fas fa-home"></i>
                            Početna
                        </router-link>
                        <router-link to="/products" class="mobile-nav-link" @click="closeMobileMenu">
                            <i class="fas fa-shopping-bag"></i>
                            Proizvodi
                        </router-link>
                        
                        <div class="mobile-nav-section">
                            <div class="mobile-nav-title">Kategorije</div>
                            <router-link 
                                v-for="category in categories" 
                                :key="category"
                                :to="{ path: '/products', query: { category } }"
                                class="mobile-nav-link category-link"
                                @click="closeMobileMenu"
                            >
                                <i :class="getCategoryIcon(category)"></i>
                                {{ getCategoryName(category) }}
                            </router-link>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    `,

    setup() {
        const { ref, computed, watch, nextTick, onMounted, onUnmounted } = Vue;
        const { useRouter } = VueRouter;
        
        const router = useRouter();
        const uiStore = useUIStore();
        const { categories } = useProducts();
        const { totalItems, toggleCart } = useCart();

        // Reactive state
        const searchQuery = ref('');
        const showSearchSuggestions = ref(false);
        const showCategoriesDropdown = ref(false);
        const showMobileSearch = ref(false);
        const searchSuggestions = ref([]);
        const mobileSearchInput = ref(null);

        // Computed properties
        const isScrolled = computed(() => uiStore.isScrolled);
        const isMobile = computed(() => uiStore.isMobile);
        const isMobileMenuOpen = computed(() => uiStore.mobileMenuOpen);
        const isDarkMode = computed(() => uiStore.isDarkMode);

        // Methods
        const toggleTheme = () => {
            uiStore.toggleTheme();
        };

        const toggleMobileMenu = () => {
            uiStore.toggleMobileMenu();
        };

        const closeMobileMenu = () => {
            uiStore.closeMobileMenu();
        };

        const toggleMobileSearch = () => {
            showMobileSearch.value = !showMobileSearch.value;
            if (showMobileSearch.value) {
                nextTick(() => {
                    if (mobileSearchInput.value) {
                        mobileSearchInput.value.focus();
                    }
                });
            }
        };

        const closeMobileSearch = () => {
            showMobileSearch.value = false;
            searchQuery.value = '';
        };

        const onSearchInput = () => {
            if (searchQuery.value.length >= 2) {
                updateSearchSuggestions();
            } else {
                searchSuggestions.value = [];
            }
        };

        const updateSearchSuggestions = () => {
            const query = searchQuery.value.toLowerCase();
            const allProducts = getAllProducts();
            
            searchSuggestions.value = allProducts
                .filter(product => 
                    product.title.toLowerCase().includes(query) ||
                    product.brand.toLowerCase().includes(query) ||
                    product.category.toLowerCase().includes(query)
                )
                .slice(0, 5);
        };

        const selectSuggestion = (product) => {
            searchQuery.value = product.title;
            showSearchSuggestions.value = false;
            router.push(`/products?search=${encodeURIComponent(product.title)}`);
        };

        const performSearch = () => {
            if (searchQuery.value.trim()) {
                showSearchSuggestions.value = false;
                showMobileSearch.value = false;
                router.push(`/products?search=${encodeURIComponent(searchQuery.value.trim())}`);
            }
        };

        const hideSearchSuggestions = () => {
            setTimeout(() => {
                showSearchSuggestions.value = false;
            }, 200);
        };

        const getCategoryIcon = (category) => {
            const icons = {
                'MOBITELI': 'fas fa-mobile-alt',
                'LAPTOPI': 'fas fa-laptop',
                'TABLETI': 'fas fa-tablet-alt',
                'GAMING': 'fas fa-gamepad',
                'DODACI': 'fas fa-headphones'
            };
            return icons[category] || 'fas fa-tag';
        };

        const getCategoryName = (category) => {
            const names = {
                'MOBITELI': 'Mobiteli',
                'LAPTOPI': 'Laptopi',
                'TABLETI': 'Tableti',
                'GAMING': 'Gaming',
                'DODACI': 'Dodaci'
            };
            return names[category] || category;
        };

        // Close dropdowns when clicking outside
        const handleClickOutside = (event) => {
            if (!event.target.closest('.nav-dropdown')) {
                showCategoriesDropdown.value = false;
            }
            if (!event.target.closest('.search-container')) {
                showSearchSuggestions.value = false;
            }
        };

        onMounted(() => {
            document.addEventListener('click', handleClickOutside);
        });

        onUnmounted(() => {
            document.removeEventListener('click', handleClickOutside);
        });

        return {
            // State
            searchQuery,
            showSearchSuggestions,
            showCategoriesDropdown,
            showMobileSearch,
            searchSuggestions,
            mobileSearchInput,

            // Computed
            isScrolled,
            isMobile,
            isMobileMenuOpen,
            isDarkMode,
            categories,
            totalItems,

            // Methods
            toggleTheme,
            toggleMobileMenu,
            closeMobileMenu,
            toggleMobileSearch,
            closeMobileSearch,
            onSearchInput,
            selectSuggestion,
            performSearch,
            hideSearchSuggestions,
            getCategoryIcon,
            getCategoryName,
            toggleCart
        };
    }
};
