// Products Store - Pinia
const { defineStore } = Pinia;

const useProductsStore = defineStore('products', {
    state: () => ({
        products: [],
        categories: [],
        brands: [],
        loading: false,
        error: null,
        filters: {
            category: '',
            brand: '',
            priceRange: [0, 5000],
            searchTerm: '',
            inStock: false,
            featured: false,
            onSale: false
        },
        sortBy: 'newest', // newest, oldest, price-low, price-high, name-a-z, name-z-a
        currentPage: 1,
        itemsPerPage: 12
    }),

    getters: {
        // Get all products
        allProducts: (state) => state.products,

        // Get filtered products
        filteredProducts: (state) => {
            let filtered = [...state.products];

            // Apply category filter
            if (state.filters.category) {
                filtered = filtered.filter(product => 
                    product.category === state.filters.category
                );
            }

            // Apply brand filter
            if (state.filters.brand) {
                filtered = filtered.filter(product => 
                    product.brand === state.filters.brand
                );
            }

            // Apply search filter
            if (state.filters.searchTerm) {
                const term = state.filters.searchTerm.toLowerCase();
                filtered = filtered.filter(product =>
                    product.title.toLowerCase().includes(term) ||
                    product.description.toLowerCase().includes(term) ||
                    product.brand.toLowerCase().includes(term) ||
                    product.category.toLowerCase().includes(term)
                );
            }

            // Apply price range filter
            filtered = filtered.filter(product => {
                const price = parseFloat(product.currentPrice.replace(/[^\d,]/g, '').replace(',', '.'));
                return price >= state.filters.priceRange[0] && price <= state.filters.priceRange[1];
            });

            // Apply stock filter
            if (state.filters.inStock) {
                filtered = filtered.filter(product => product.inStock);
            }

            // Apply featured filter
            if (state.filters.featured) {
                filtered = filtered.filter(product => product.featured);
            }

            // Apply sale filter
            if (state.filters.onSale) {
                filtered = filtered.filter(product => product.oldPrice && product.oldPrice !== '');
            }

            return filtered;
        },

        // Get sorted products
        sortedProducts: (state) => {
            const products = [...state.filteredProducts];

            switch (state.sortBy) {
                case 'newest':
                    return products; // Assuming products are already in newest order
                case 'oldest':
                    return products.reverse();
                case 'price-low':
                    return products.sort((a, b) => {
                        const priceA = parseFloat(a.currentPrice.replace(/[^\d,]/g, '').replace(',', '.'));
                        const priceB = parseFloat(b.currentPrice.replace(/[^\d,]/g, '').replace(',', '.'));
                        return priceA - priceB;
                    });
                case 'price-high':
                    return products.sort((a, b) => {
                        const priceA = parseFloat(a.currentPrice.replace(/[^\d,]/g, '').replace(',', '.'));
                        const priceB = parseFloat(b.currentPrice.replace(/[^\d,]/g, '').replace(',', '.'));
                        return priceB - priceA;
                    });
                case 'name-a-z':
                    return products.sort((a, b) => a.title.localeCompare(b.title));
                case 'name-z-a':
                    return products.sort((a, b) => b.title.localeCompare(a.title));
                default:
                    return products;
            }
        },

        // Get paginated products
        paginatedProducts: (state) => {
            const start = (state.currentPage - 1) * state.itemsPerPage;
            const end = start + state.itemsPerPage;
            return state.sortedProducts.slice(start, end);
        },

        // Get total pages
        totalPages: (state) => {
            return Math.ceil(state.sortedProducts.length / state.itemsPerPage);
        },

        // Get featured products
        featuredProducts: (state) => {
            return state.products.filter(product => product.featured);
        },

        // Get products by category
        getProductsByCategory: (state) => (category) => {
            return state.products.filter(product => product.category === category);
        },

        // Get product by ID
        getProductById: (state) => (id) => {
            return state.products.find(product => product.id === id);
        },

        // Get products on sale
        saleProducts: (state) => {
            return state.products.filter(product => product.oldPrice && product.oldPrice !== '');
        },

        // Get new products (with 'new' badge)
        newProducts: (state) => {
            return state.products.filter(product => product.badge === 'new');
        },

        // Get bestseller products
        bestsellerProducts: (state) => {
            return state.products.filter(product => product.badge === 'bestseller');
        },

        // Get total products count
        totalProducts: (state) => state.products.length,

        // Get filtered products count
        filteredProductsCount: (state) => state.filteredProducts.length,

        // Check if filters are active
        hasActiveFilters: (state) => {
            return state.filters.category !== '' ||
                   state.filters.brand !== '' ||
                   state.filters.searchTerm !== '' ||
                   state.filters.inStock ||
                   state.filters.featured ||
                   state.filters.onSale ||
                   state.filters.priceRange[0] !== 0 ||
                   state.filters.priceRange[1] !== 5000;
        }
    },

    actions: {
        // Initialize products
        async initializeProducts() {
            this.loading = true;
            this.error = null;

            try {
                // Load products from the global PRODUCT_DATABASE
                this.products = getAllProducts();
                this.categories = getCategories();
                this.brands = getBrands();
            } catch (error) {
                this.error = 'Greška pri učitavanju proizvoda';
                console.error('Error loading products:', error);
            } finally {
                this.loading = false;
            }
        },

        // Set category filter
        setCategoryFilter(category) {
            this.filters.category = category;
            this.currentPage = 1; // Reset to first page
        },

        // Set brand filter
        setBrandFilter(brand) {
            this.filters.brand = brand;
            this.currentPage = 1;
        },

        // Set search term
        setSearchTerm(term) {
            this.filters.searchTerm = term;
            this.currentPage = 1;
        },

        // Set price range
        setPriceRange(range) {
            this.filters.priceRange = range;
            this.currentPage = 1;
        },

        // Toggle stock filter
        toggleStockFilter() {
            this.filters.inStock = !this.filters.inStock;
            this.currentPage = 1;
        },

        // Toggle featured filter
        toggleFeaturedFilter() {
            this.filters.featured = !this.filters.featured;
            this.currentPage = 1;
        },

        // Toggle sale filter
        toggleSaleFilter() {
            this.filters.onSale = !this.filters.onSale;
            this.currentPage = 1;
        },

        // Clear all filters
        clearFilters() {
            this.filters = {
                category: '',
                brand: '',
                priceRange: [0, 5000],
                searchTerm: '',
                inStock: false,
                featured: false,
                onSale: false
            };
            this.currentPage = 1;
        },

        // Set sort option
        setSortBy(sortOption) {
            this.sortBy = sortOption;
            this.currentPage = 1;
        },

        // Set current page
        setCurrentPage(page) {
            this.currentPage = page;
        },

        // Set items per page
        setItemsPerPage(count) {
            this.itemsPerPage = count;
            this.currentPage = 1;
        },

        // Go to next page
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },

        // Go to previous page
        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },

        // Search products
        searchProducts(term) {
            this.setSearchTerm(term);
        },

        // Get random products
        getRandomProducts(count = 4) {
            const shuffled = [...this.products].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        },

        // Get related products (same category, different product)
        getRelatedProducts(productId, count = 4) {
            const product = this.getProductById(productId);
            if (!product) return [];

            const related = this.products
                .filter(p => p.category === product.category && p.id !== productId)
                .slice(0, count);

            // If not enough products in same category, fill with random products
            if (related.length < count) {
                const additional = this.products
                    .filter(p => p.id !== productId && !related.includes(p))
                    .slice(0, count - related.length);
                related.push(...additional);
            }

            return related;
        }
    }
});
