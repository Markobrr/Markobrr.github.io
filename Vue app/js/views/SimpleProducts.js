// Simple Products View Component without external dependencies
const Products = {
    template: `
        <div class="products-page">
            <div class="container">
                <div class="page-header">
                    <h1 class="page-title">Proizvodi</h1>
                    <p class="page-subtitle">Pronađite savršen proizvod za vaše potrebe</p>
                </div>

                <div class="products-content">
                    <!-- Mobile Filter Toggle Button -->
                    <button class="mobile-filter-toggle" @click="showFilters = !showFilters">
                        <i class="fas fa-filter"></i>
                        Filtri
                        <span class="filter-count" v-if="activeFiltersCount > 0">{{ activeFiltersCount }}</span>
                    </button>

                    <!-- Filters Sidebar -->
                    <aside class="filters-sidebar" :class="{ 'show': showFilters }">
                        <div class="filter-header">
                            <h3>Filtri</h3>
                            <button class="close-filters" @click="showFilters = false">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>

                        <div class="filter-section">
                            <h4 class="filter-title">Kategorije</h4>
                            <div class="filter-options">
                                <label class="filter-option" v-for="category in categories" :key="category">
                                    <input
                                        type="checkbox"
                                        :value="category"
                                        v-model="selectedCategories"
                                        @change="applyFilters"
                                    >
                                    <span class="checkmark"></span>
                                    {{ getCategoryName(category) }}
                                </label>
                            </div>
                        </div>

                        <div class="filter-section">
                            <h4 class="filter-title">Brendovi</h4>
                            <div class="filter-options">
                                <label class="filter-option" v-for="brand in brands" :key="brand">
                                    <input
                                        type="checkbox"
                                        :value="brand"
                                        v-model="selectedBrands"
                                        @change="applyFilters"
                                    >
                                    <span class="checkmark"></span>
                                    {{ brand }}
                                </label>
                            </div>
                        </div>

                        <div class="filter-section">
                            <h4 class="filter-title">Pretraživanje</h4>
                            <input
                                type="text"
                                v-model="searchQuery"
                                @input="applyFilters"
                                placeholder="Pretraži proizvode..."
                                class="search-input"
                            >
                        </div>

                        <button class="btn btn-outline clear-filters-btn" @click="clearFilters">
                            <i class="fas fa-times"></i>
                            Očisti filtere
                        </button>
                    </aside>

                    <!-- Products Grid -->
                    <main class="products-main">
                        <div class="products-header">
                            <div class="products-count">
                                Prikazano {{ filteredProducts.length }} od {{ allProducts.length }} proizvoda
                            </div>
                            <div class="sort-controls">
                                <select v-model="sortBy" @change="applySorting" class="sort-select">
                                    <option value="name-asc">Naziv A-Z</option>
                                    <option value="name-desc">Naziv Z-A</option>
                                    <option value="price-asc">Cijena ↑</option>
                                    <option value="price-desc">Cijena ↓</option>
                                </select>
                            </div>
                        </div>

                        <!-- Products Grid -->
                        <div class="products-grid" v-if="!isLoading && filteredProducts.length > 0">
                            <div
                                v-for="product in paginatedProducts"
                                :key="product.id"
                                class="product-card"
                                @click="addToCart(product)"
                            >
                                <div class="product-image">
                                    <img :src="product.image" :alt="product.title" loading="lazy">
                                </div>
                                <div class="product-info">
                                    <h3 class="product-title">{{ product.title }}</h3>
                                    <p class="product-brand">{{ product.brand }}</p>
                                    <div class="product-price">
                                        <span class="current-price">{{ product.currentPrice }}</span>
                                        <span v-if="product.originalPrice" class="original-price">{{ product.originalPrice }}</span>
                                    </div>
                                    <button class="btn btn-primary add-to-cart-btn">
                                        <i class="fas fa-shopping-cart"></i>
                                        Dodaj u košaricu
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Loading State -->
                        <div class="products-grid" v-else-if="isLoading">
                            <div class="product-card skeleton" v-for="n in 12" :key="n">
                                <div class="skeleton-image"></div>
                                <div class="skeleton-content">
                                    <div class="skeleton-line"></div>
                                    <div class="skeleton-line"></div>
                                    <div class="skeleton-line"></div>
                                </div>
                            </div>
                        </div>

                        <!-- No Products -->
                        <div class="no-products" v-else-if="!isLoading && filteredProducts.length === 0">
                            <i class="fas fa-search"></i>
                            <h3>Nema proizvoda</h3>
                            <p>Nema proizvoda koji odgovaraju vašim kriterijima pretrage.</p>
                            <button class="btn btn-primary" @click="clearFilters">Očisti filtere</button>
                        </div>

                        <!-- Pagination -->
                        <div class="pagination" v-if="totalPages > 1">
                            <button
                                class="btn btn-outline"
                                @click="goToPage(currentPage - 1)"
                                :disabled="currentPage === 1"
                            >
                                <i class="fas fa-chevron-left"></i>
                                Prethodna
                            </button>

                            <span class="page-info">
                                Stranica {{ currentPage }} od {{ totalPages }}
                            </span>

                            <button
                                class="btn btn-outline"
                                @click="goToPage(currentPage + 1)"
                                :disabled="currentPage === totalPages"
                            >
                                Sljedeća
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    `,

    setup() {
        const { ref, computed, onMounted, watch } = Vue;
        const route = window.router.currentRoute;

        // Reactive state
        const allProducts = ref([]);
        const selectedCategories = ref([]);
        const selectedBrands = ref([]);
        const searchQuery = ref('');
        const priceRange = ref([0, 5000]);
        const sortBy = ref('name-asc');
        const currentPage = ref(1);
        const isLoading = ref(false);
        const showFilters = ref(false);
        const productsPerPage = 12;

        // Get unique categories and brands
        const categories = computed(() => {
            return [...new Set(allProducts.value.map(p => p.category))];
        });

        const brands = computed(() => {
            return [...new Set(allProducts.value.map(p => p.brand))].sort();
        });

        // Active filters count for mobile
        const activeFiltersCount = computed(() => {
            let count = 0;
            count += selectedCategories.value.length;
            count += selectedBrands.value.length;
            if (searchQuery.value.trim()) count++;
            if (priceRange.value[0] > 0 || priceRange.value[1] < 5000) count++;
            return count;
        });

        // Filter and sort products
        const filteredProducts = computed(() => {
            let products = allProducts.value;

            // Filter by categories
            if (selectedCategories.value.length > 0) {
                products = products.filter(p => selectedCategories.value.includes(p.category));
            }

            // Filter by brands
            if (selectedBrands.value.length > 0) {
                products = products.filter(p => selectedBrands.value.includes(p.brand));
            }

            // Filter by price range
            products = products.filter(p => {
                const price = parseFloat(p.currentPrice.replace(/[^\d,]/g, '').replace(',', '.'));
                return price >= priceRange.value[0] && price <= priceRange.value[1];
            });

            // Filter by search query
            if (searchQuery.value) {
                const query = searchQuery.value.toLowerCase();
                products = products.filter(p =>
                    p.title.toLowerCase().includes(query) ||
                    p.brand.toLowerCase().includes(query) ||
                    p.category.toLowerCase().includes(query)
                );
            }

            // Sort products
            products.sort((a, b) => {
                switch (sortBy.value) {
                    case 'name-asc':
                        return a.title.localeCompare(b.title);
                    case 'name-desc':
                        return b.title.localeCompare(a.title);
                    case 'price-asc':
                        return parseFloat(a.currentPrice.replace(/[^\d,]/g, '').replace(',', '.')) - 
                               parseFloat(b.currentPrice.replace(/[^\d,]/g, '').replace(',', '.'));
                    case 'price-desc':
                        return parseFloat(b.currentPrice.replace(/[^\d,]/g, '').replace(',', '.')) - 
                               parseFloat(a.currentPrice.replace(/[^\d,]/g, '').replace(',', '.'));
                    default:
                        return 0;
                }
            });

            return products;
        });

        // Pagination
        const totalPages = computed(() => Math.ceil(filteredProducts.value.length / productsPerPage));
        
        const paginatedProducts = computed(() => {
            const start = (currentPage.value - 1) * productsPerPage;
            const end = start + productsPerPage;
            return filteredProducts.value.slice(start, end);
        });

        const visiblePages = computed(() => {
            const pages = [];
            const start = Math.max(1, currentPage.value - 2);
            const end = Math.min(totalPages.value, currentPage.value + 2);
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            return pages;
        });

        // Methods
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

        const applyFilters = () => {
            currentPage.value = 1;
        };

        const applySorting = () => {
            currentPage.value = 1;
        };

        const clearFilters = () => {
            selectedCategories.value = [];
            selectedBrands.value = [];
            searchQuery.value = '';
            priceRange.value = [0, 5000];
            currentPage.value = 1;
        };

        const removeCategory = (category) => {
            const index = selectedCategories.value.indexOf(category);
            if (index > -1) {
                selectedCategories.value.splice(index, 1);
                applyFilters();
            }
        };

        const removeBrand = (brand) => {
            const index = selectedBrands.value.indexOf(brand);
            if (index > -1) {
                selectedBrands.value.splice(index, 1);
                applyFilters();
            }
        };

        const clearSearch = () => {
            searchQuery.value = '';
            applyFilters();
        };

        const resetPrice = () => {
            priceRange.value = [0, 5000];
            applyFilters();
        };

        const goToPage = (page) => {
            currentPage.value = page;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        const addToCart = (product) => {
            if (window.cartStore) {
                window.cartStore.addItem(product);

                // Show toast notification
                if (window.toast) {
                    window.toast.success(
                        `${product.title} je dodano u košaricu!`,
                        'Proizvod dodano'
                    );
                }
            }
        };

        // Mobile-specific methods
        const refreshProducts = async () => {
            isLoading.value = true;

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Reload products
            if (typeof getAllProducts === 'function') {
                allProducts.value = getAllProducts();
            }

            isLoading.value = false;
        };

        const handleLoadMore = () => {
            // This is handled by the infinite scroll component
            // Just for compatibility with the component
        };

        // Initialize products function
        const initializeProducts = () => {
            console.log('🔄 Initializing products...');
            isLoading.value = true;

            setTimeout(() => {
                if (typeof getAllProducts === 'function') {
                    allProducts.value = getAllProducts();
                    console.log('✅ Products loaded:', allProducts.value.length);
                }

                // Apply URL filters
                const currentRoute = route.value;
                if (currentRoute.query.category) {
                    selectedCategories.value = [currentRoute.query.category];
                }
                if (currentRoute.query.search) {
                    searchQuery.value = currentRoute.query.search;
                }

                isLoading.value = false;
            }, 500);
        };

        // Watch for route changes
        watch(route, (newRoute, oldRoute) => {
            console.log('🔄 Route changed:', oldRoute?.path, '→', newRoute?.path);
            if (newRoute.path === '/products') {
                initializeProducts();
            }
        }, { immediate: false });

        // Initialize products on mount
        onMounted(() => {
            console.log('🚀 Products component mounted');
            initializeProducts();
        });

        return {
            allProducts,
            selectedCategories,
            selectedBrands,
            searchQuery,
            priceRange,
            sortBy,
            currentPage,
            isLoading,
            showFilters,
            productsPerPage,
            categories,
            brands,
            activeFiltersCount,
            filteredProducts,
            paginatedProducts,
            totalPages,
            visiblePages,
            getCategoryName,
            applyFilters,
            applySorting,
            clearFilters,
            removeCategory,
            removeBrand,
            clearSearch,
            resetPrice,
            goToPage,
            addToCart
        };
    }
};
