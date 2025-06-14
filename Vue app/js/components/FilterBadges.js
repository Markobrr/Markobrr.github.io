// Filter Badges Component
const FilterBadges = {
    props: {
        selectedCategories: {
            type: Array,
            default: () => []
        },
        selectedBrands: {
            type: Array,
            default: () => []
        },
        searchQuery: {
            type: String,
            default: ''
        },
        priceRange: {
            type: Array,
            default: () => [0, 5000]
        },
        minPrice: {
            type: Number,
            default: 0
        },
        maxPrice: {
            type: Number,
            default: 5000
        }
    },

    emits: ['remove-category', 'remove-brand', 'clear-search', 'reset-price', 'clear-all'],

    template: `
        <div class="filter-badges" v-if="hasActiveFilters">
            <div class="filter-badges-header">
                <span class="filter-badges-title">
                    <i class="fas fa-filter"></i>
                    Aktivni filteri:
                </span>
                <button class="clear-all-btn" @click="clearAll">
                    <i class="fas fa-times"></i>
                    Očisti sve
                </button>
            </div>
            
            <div class="filter-badges-list">
                <!-- Category badges -->
                <div 
                    v-for="category in selectedCategories" 
                    :key="'category-' + category"
                    class="filter-badge filter-badge-category"
                >
                    <span class="filter-badge-icon">
                        <i class="fas fa-tag"></i>
                    </span>
                    <span class="filter-badge-text">{{ getCategoryName(category) }}</span>
                    <button class="filter-badge-remove" @click="removeCategory(category)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Brand badges -->
                <div 
                    v-for="brand in selectedBrands" 
                    :key="'brand-' + brand"
                    class="filter-badge filter-badge-brand"
                >
                    <span class="filter-badge-icon">
                        <i class="fas fa-copyright"></i>
                    </span>
                    <span class="filter-badge-text">{{ brand }}</span>
                    <button class="filter-badge-remove" @click="removeBrand(brand)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Search badge -->
                <div 
                    v-if="searchQuery"
                    class="filter-badge filter-badge-search"
                >
                    <span class="filter-badge-icon">
                        <i class="fas fa-search"></i>
                    </span>
                    <span class="filter-badge-text">"{{ searchQuery }}"</span>
                    <button class="filter-badge-remove" @click="clearSearch">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Price range badge -->
                <div 
                    v-if="hasPriceFilter"
                    class="filter-badge filter-badge-price"
                >
                    <span class="filter-badge-icon">
                        <i class="fas fa-euro-sign"></i>
                    </span>
                    <span class="filter-badge-text">
                        {{ formatPrice(priceRange[0]) }} - {{ formatPrice(priceRange[1]) }}
                    </span>
                    <button class="filter-badge-remove" @click="resetPrice">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    `,

    setup(props, { emit }) {
        const { computed } = Vue;

        // Computed properties
        const hasActiveFilters = computed(() => {
            return props.selectedCategories.length > 0 ||
                   props.selectedBrands.length > 0 ||
                   props.searchQuery.length > 0 ||
                   hasPriceFilter.value;
        });

        const hasPriceFilter = computed(() => {
            return props.priceRange[0] !== props.minPrice || 
                   props.priceRange[1] !== props.maxPrice;
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

        const formatPrice = (price) => {
            return new Intl.NumberFormat('hr-HR', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(price);
        };

        const removeCategory = (category) => {
            emit('remove-category', category);
        };

        const removeBrand = (brand) => {
            emit('remove-brand', brand);
        };

        const clearSearch = () => {
            emit('clear-search');
        };

        const resetPrice = () => {
            emit('reset-price');
        };

        const clearAll = () => {
            emit('clear-all');
        };

        return {
            hasActiveFilters,
            hasPriceFilter,
            getCategoryName,
            formatPrice,
            removeCategory,
            removeBrand,
            clearSearch,
            resetPrice,
            clearAll
        };
    }
};
