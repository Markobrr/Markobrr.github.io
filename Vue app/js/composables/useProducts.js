// useProducts Composable
function useProducts() {
    const { computed, ref, watch } = Vue;
    const productsStore = useProductsStore();

    // Reactive references
    const searchQuery = ref('');
    const selectedCategory = ref('');
    const selectedBrand = ref('');
    const priceRange = ref([0, 5000]);
    const sortOption = ref('newest');
    const showOnlyInStock = ref(false);
    const showOnlyFeatured = ref(false);
    const showOnlySale = ref(false);

    // Computed properties
    const products = computed(() => productsStore.paginatedProducts);
    const allProducts = computed(() => productsStore.allProducts);
    const featuredProducts = computed(() => productsStore.featuredProducts);
    const categories = computed(() => productsStore.categories);
    const brands = computed(() => productsStore.brands);
    const totalPages = computed(() => productsStore.totalPages);
    const currentPage = computed(() => productsStore.currentPage);
    const totalProducts = computed(() => productsStore.filteredProductsCount);
    const isLoading = computed(() => productsStore.loading);
    const hasActiveFilters = computed(() => productsStore.hasActiveFilters);

    // Filter methods
    const setCategory = (category) => {
        selectedCategory.value = category;
        productsStore.setCategoryFilter(category);
    };

    const setBrand = (brand) => {
        selectedBrand.value = brand;
        productsStore.setBrandFilter(brand);
    };

    const setSearchQuery = (query) => {
        searchQuery.value = query;
        productsStore.setSearchTerm(query);
    };

    const setPriceRange = (range) => {
        priceRange.value = range;
        productsStore.setPriceRange(range);
    };

    const setSortOption = (option) => {
        sortOption.value = option;
        productsStore.setSortBy(option);
    };

    const toggleInStockFilter = () => {
        showOnlyInStock.value = !showOnlyInStock.value;
        productsStore.toggleStockFilter();
    };

    const toggleFeaturedFilter = () => {
        showOnlyFeatured.value = !showOnlyFeatured.value;
        productsStore.toggleFeaturedFilter();
    };

    const toggleSaleFilter = () => {
        showOnlySale.value = !showOnlySale.value;
        productsStore.toggleSaleFilter();
    };

    const clearAllFilters = () => {
        searchQuery.value = '';
        selectedCategory.value = '';
        selectedBrand.value = '';
        priceRange.value = [0, 5000];
        showOnlyInStock.value = false;
        showOnlyFeatured.value = false;
        showOnlySale.value = false;
        productsStore.clearFilters();
    };

    // Pagination methods
    const setPage = (page) => {
        productsStore.setCurrentPage(page);
    };

    const nextPage = () => {
        productsStore.nextPage();
    };

    const previousPage = () => {
        productsStore.previousPage();
    };

    // Product methods
    const getProductById = (id) => {
        return productsStore.getProductById(id);
    };

    const getProductsByCategory = (category) => {
        return productsStore.getProductsByCategory(category);
    };

    const getRelatedProducts = (productId, count = 4) => {
        return productsStore.getRelatedProducts(productId, count);
    };

    const getRandomProducts = (count = 4) => {
        return productsStore.getRandomProducts(count);
    };

    // Search with debouncing
    const debouncedSearch = ref(null);
    const searchProducts = (query) => {
        clearTimeout(debouncedSearch.value);
        debouncedSearch.value = setTimeout(() => {
            setSearchQuery(query);
        }, 300);
    };

    // Format price helper
    const formatPrice = (price) => {
        if (typeof price === 'string') {
            return price;
        }
        return new Intl.NumberFormat('hr-HR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
        }).format(price);
    };

    // Calculate discount percentage
    const getDiscountPercentage = (currentPrice, oldPrice) => {
        if (!oldPrice || oldPrice === '') return 0;
        
        const current = parseFloat(currentPrice.replace(/[^\d,]/g, '').replace(',', '.'));
        const old = parseFloat(oldPrice.replace(/[^\d,]/g, '').replace(',', '.'));
        
        if (old === 0) return 0;
        
        return Math.round(((old - current) / old) * 100);
    };

    // Check if product is on sale
    const isOnSale = (product) => {
        return product.oldPrice && product.oldPrice !== '';
    };

    // Get product badge info
    const getProductBadge = (product) => {
        if (product.badge && product.badgeText) {
            return {
                type: product.badge,
                text: product.badgeText
            };
        }
        
        if (isOnSale(product)) {
            const discount = getDiscountPercentage(product.currentPrice, product.oldPrice);
            return {
                type: 'sale',
                text: `-${discount}%`
            };
        }
        
        return null;
    };

    // Sort options
    const sortOptions = [
        { value: 'newest', label: 'Najnovije' },
        { value: 'oldest', label: 'Najstarije' },
        { value: 'price-low', label: 'Cijena: niska → visoka' },
        { value: 'price-high', label: 'Cijena: visoka → niska' },
        { value: 'name-a-z', label: 'Naziv: A → Z' },
        { value: 'name-z-a', label: 'Naziv: Z → A' }
    ];

    // Initialize products on mount
    const initializeProducts = async () => {
        await productsStore.initializeProducts();
    };

    // Watch for filter changes and update store
    watch(searchQuery, (newValue) => {
        if (newValue !== productsStore.filters.searchTerm) {
            productsStore.setSearchTerm(newValue);
        }
    });

    watch(selectedCategory, (newValue) => {
        if (newValue !== productsStore.filters.category) {
            productsStore.setCategoryFilter(newValue);
        }
    });

    watch(selectedBrand, (newValue) => {
        if (newValue !== productsStore.filters.brand) {
            productsStore.setBrandFilter(newValue);
        }
    });

    watch(priceRange, (newValue) => {
        if (JSON.stringify(newValue) !== JSON.stringify(productsStore.filters.priceRange)) {
            productsStore.setPriceRange(newValue);
        }
    }, { deep: true });

    watch(sortOption, (newValue) => {
        if (newValue !== productsStore.sortBy) {
            productsStore.setSortBy(newValue);
        }
    });

    // Return all methods and computed properties
    return {
        // State
        searchQuery,
        selectedCategory,
        selectedBrand,
        priceRange,
        sortOption,
        showOnlyInStock,
        showOnlyFeatured,
        showOnlySale,

        // Computed
        products,
        allProducts,
        featuredProducts,
        categories,
        brands,
        totalPages,
        currentPage,
        totalProducts,
        isLoading,
        hasActiveFilters,
        sortOptions,

        // Methods
        setCategory,
        setBrand,
        setSearchQuery,
        setPriceRange,
        setSortOption,
        toggleInStockFilter,
        toggleFeaturedFilter,
        toggleSaleFilter,
        clearAllFilters,
        setPage,
        nextPage,
        previousPage,
        getProductById,
        getProductsByCategory,
        getRelatedProducts,
        getRandomProducts,
        searchProducts,
        formatPrice,
        getDiscountPercentage,
        isOnSale,
        getProductBadge,
        initializeProducts
    };
}
