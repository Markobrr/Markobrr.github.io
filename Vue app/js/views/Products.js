// Products View Component
const Products = {
    template: `
        <div class="products-page">
            <!-- Page Header -->
            <div class="page-header">
                <div class="container">
                    <h1 class="page-title">Proizvodi</h1>
                    <p class="page-subtitle">Pronađite savršen proizvod za vaše potrebe</p>
                </div>
            </div>

            <!-- Products Content -->
            <div class="products-content">
                <div class="container">
                    <div class="products-layout">
                        <!-- Filters Sidebar -->
                        <aside class="filters-sidebar">
                            <div class="filters-header">
                                <h3>Filteri</h3>
                                <button 
                                    class="clear-filters-btn"
                                    @click="clearAllFilters"
                                    v-if="hasActiveFilters"
                                >
                                    <i class="fas fa-times"></i>
                                    Očisti
                                </button>
                            </div>

                            <!-- Category Filter -->
                            <div class="filter-group">
                                <h4 class="filter-title">Kategorija</h4>
                                <div class="filter-options">
                                    <label 
                                        v-for="category in categories" 
                                        :key="category"
                                        class="filter-option"
                                    >
                                        <input 
                                            type="radio" 
                                            :value="category"
                                            v-model="selectedCategory"
                                            @change="setCategory(category)"
                                        >
                                        <span class="filter-label">{{ getCategoryName(category) }}</span>
                                        <span class="filter-count">({{ getCategoryProductCount(category) }})</span>
                                    </label>
                                </div>
                            </div>

                            <!-- Brand Filter -->
                            <div class="filter-group">
                                <h4 class="filter-title">Brend</h4>
                                <div class="filter-options">
                                    <label 
                                        v-for="brand in brands" 
                                        :key="brand"
                                        class="filter-option"
                                    >
                                        <input 
                                            type="radio" 
                                            :value="brand"
                                            v-model="selectedBrand"
                                            @change="setBrand(brand)"
                                        >
                                        <span class="filter-label">{{ brand }}</span>
                                    </label>
                                </div>
                            </div>

                            <!-- Quick Filters -->
                            <div class="filter-group">
                                <h4 class="filter-title">Brzi filteri</h4>
                                <div class="quick-filters">
                                    <button 
                                        class="quick-filter-btn"
                                        :class="{ active: showOnlyInStock }"
                                        @click="toggleInStockFilter"
                                    >
                                        <i class="fas fa-check-circle"></i>
                                        Na skladištu
                                    </button>
                                    <button 
                                        class="quick-filter-btn"
                                        :class="{ active: showOnlyFeatured }"
                                        @click="toggleFeaturedFilter"
                                    >
                                        <i class="fas fa-star"></i>
                                        Istaknuto
                                    </button>
                                    <button 
                                        class="quick-filter-btn"
                                        :class="{ active: showOnlySale }"
                                        @click="toggleSaleFilter"
                                    >
                                        <i class="fas fa-tag"></i>
                                        Na akciji
                                    </button>
                                </div>
                            </div>
                        </aside>

                        <!-- Products Main -->
                        <main class="products-main">
                            <!-- Search and Sort -->
                            <div class="products-toolbar">
                                <div class="search-section">
                                    <div class="search-input-wrapper">
                                        <input 
                                            type="text" 
                                            v-model="searchQuery"
                                            @input="searchProducts"
                                            placeholder="Pretraži proizvode..."
                                            class="search-input"
                                        >
                                        <i class="fas fa-search search-icon"></i>
                                    </div>
                                </div>

                                <div class="sort-section">
                                    <label for="sort-select">Sortiraj po:</label>
                                    <select 
                                        id="sort-select"
                                        v-model="sortOption"
                                        @change="setSortOption(sortOption)"
                                        class="sort-select"
                                    >
                                        <option 
                                            v-for="option in sortOptions" 
                                            :key="option.value"
                                            :value="option.value"
                                        >
                                            {{ option.label }}
                                        </option>
                                    </select>
                                </div>

                                <div class="results-info">
                                    Prikazano {{ products.length }} od {{ totalProducts }} proizvoda
                                </div>
                            </div>

                            <!-- Products Grid -->
                            <div class="products-grid" v-if="!isLoading">
                                <product-card 
                                    v-for="product in products" 
                                    :key="product.id"
                                    :product="product"
                                />
                            </div>

                            <!-- Loading State -->
                            <div class="loading-grid" v-else>
                                <div v-for="n in 12" :key="n" class="product-skeleton"></div>
                            </div>

                            <!-- No Results -->
                            <div v-if="!isLoading && products.length === 0" class="no-results">
                                <div class="no-results-icon">
                                    <i class="fas fa-search"></i>
                                </div>
                                <h3>Nema rezultata</h3>
                                <p>Nismo pronašli proizvode koji odgovaraju vašim kriterijima.</p>
                                <button class="btn btn-primary" @click="clearAllFilters">
                                    <i class="fas fa-refresh"></i>
                                    Očisti filtere
                                </button>
                            </div>

                            <!-- Pagination -->
                            <div class="pagination-section" v-if="totalPages > 1">
                                <div class="pagination">
                                    <button 
                                        class="pagination-btn"
                                        @click="previousPage"
                                        :disabled="currentPage === 1"
                                    >
                                        <i class="fas fa-chevron-left"></i>
                                        Prethodna
                                    </button>

                                    <div class="pagination-pages">
                                        <button 
                                            v-for="page in visiblePages" 
                                            :key="page"
                                            class="pagination-page"
                                            :class="{ active: page === currentPage }"
                                            @click="setPage(page)"
                                        >
                                            {{ page }}
                                        </button>
                                    </div>

                                    <button 
                                        class="pagination-btn"
                                        @click="nextPage"
                                        :disabled="currentPage === totalPages"
                                    >
                                        Sljedeća
                                        <i class="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    `,

    setup() {
        const { computed, onMounted, watch } = Vue;
        const { useRoute } = VueRouter;
        
        const route = useRoute();
        const {
            products,
            categories,
            brands,
            totalProducts,
            totalPages,
            currentPage,
            isLoading,
            hasActiveFilters,
            searchQuery,
            selectedCategory,
            selectedBrand,
            sortOption,
            showOnlyInStock,
            showOnlyFeatured,
            showOnlySale,
            sortOptions,
            setCategory,
            setBrand,
            setSortOption,
            toggleInStockFilter,
            toggleFeaturedFilter,
            toggleSaleFilter,
            clearAllFilters,
            setPage,
            nextPage,
            previousPage,
            searchProducts,
            getProductsByCategory,
            initializeProducts
        } = useProducts();

        // Computed properties
        const visiblePages = computed(() => {
            const pages = [];
            const start = Math.max(1, currentPage.value - 2);
            const end = Math.min(totalPages.value, start + 4);
            
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

        const getCategoryProductCount = (category) => {
            return getProductsByCategory(category).length;
        };

        // Handle route query parameters
        const handleRouteQuery = () => {
            if (route.query.category) {
                setCategory(route.query.category);
            }
            if (route.query.brand) {
                setBrand(route.query.brand);
            }
            if (route.query.search) {
                searchQuery.value = route.query.search;
                searchProducts(route.query.search);
            }
        };

        // Watch for route changes
        watch(() => route.query, handleRouteQuery, { immediate: true });

        // Initialize on mount
        onMounted(async () => {
            await initializeProducts();
            handleRouteQuery();
        });

        return {
            // State
            searchQuery,
            selectedCategory,
            selectedBrand,
            sortOption,
            showOnlyInStock,
            showOnlyFeatured,
            showOnlySale,

            // Computed
            products,
            categories,
            brands,
            totalProducts,
            totalPages,
            currentPage,
            isLoading,
            hasActiveFilters,
            sortOptions,
            visiblePages,

            // Methods
            setCategory,
            setBrand,
            setSortOption,
            toggleInStockFilter,
            toggleFeaturedFilter,
            toggleSaleFilter,
            clearAllFilters,
            setPage,
            nextPage,
            previousPage,
            searchProducts,
            getCategoryName,
            getCategoryProductCount
        };
    }
};
