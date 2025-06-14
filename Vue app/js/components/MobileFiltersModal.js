// Mobile Filters Modal Component
const MobileFiltersModal = {
    props: {
        isOpen: {
            type: Boolean,
            default: false
        },
        categories: {
            type: Array,
            default: () => []
        },
        brands: {
            type: Array,
            default: () => []
        },
        selectedCategories: {
            type: Array,
            default: () => []
        },
        selectedBrands: {
            type: Array,
            default: () => []
        },
        priceRange: {
            type: Array,
            default: () => [0, 5000]
        },
        searchQuery: {
            type: String,
            default: ''
        }
    },

    emits: [
        'close',
        'update:selectedCategories',
        'update:selectedBrands',
        'update:priceRange',
        'update:searchQuery',
        'apply-filters',
        'clear-filters'
    ],

    template: `
        <div class="mobile-filters-overlay" v-if="isOpen" @click="closeModal">
            <div class="mobile-filters-modal" @click.stop>
                <!-- Modal Header -->
                <div class="modal-header">
                    <h3 class="modal-title">
                        <i class="fas fa-filter"></i>
                        Filteri
                    </h3>
                    <button class="modal-close-btn" @click="closeModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Modal Content -->
                <div class="modal-content">
                    <!-- Search Section -->
                    <div class="filter-section">
                        <h4 class="filter-section-title">
                            <i class="fas fa-search"></i>
                            Pretraživanje
                        </h4>
                        <div class="mobile-search-wrapper">
                            <input
                                type="text"
                                :value="searchQuery"
                                @input="updateSearch"
                                placeholder="Pretraži proizvode..."
                                class="mobile-filter-search"
                            >
                            <button class="clear-search-btn" v-if="searchQuery" @click="clearSearch">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Categories Section -->
                    <div class="filter-section">
                        <h4 class="filter-section-title">
                            <i class="fas fa-tags"></i>
                            Kategorije
                        </h4>
                        <div class="filter-chips">
                            <button
                                v-for="category in categories"
                                :key="category"
                                class="filter-chip"
                                :class="{ active: selectedCategories.includes(category) }"
                                @click="toggleCategory(category)"
                            >
                                {{ getCategoryName(category) }}
                                <i class="fas fa-check" v-if="selectedCategories.includes(category)"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Brands Section -->
                    <div class="filter-section">
                        <h4 class="filter-section-title">
                            <i class="fas fa-building"></i>
                            Brendovi
                        </h4>
                        <div class="filter-chips">
                            <button
                                v-for="brand in brands"
                                :key="brand"
                                class="filter-chip"
                                :class="{ active: selectedBrands.includes(brand) }"
                                @click="toggleBrand(brand)"
                            >
                                {{ brand }}
                                <i class="fas fa-check" v-if="selectedBrands.includes(brand)"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Price Range Section -->
                    <div class="filter-section">
                        <h4 class="filter-section-title">
                            <i class="fas fa-euro-sign"></i>
                            Cijena
                        </h4>
                        <div class="price-range-wrapper">
                            <price-range-slider
                                :min="0"
                                :max="5000"
                                :step="50"
                                :model-value="priceRange"
                                @update:model-value="updatePriceRange"
                            ></price-range-slider>
                        </div>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="modal-footer">
                    <button class="btn btn-outline clear-btn" @click="clearAllFilters">
                        <i class="fas fa-trash"></i>
                        Očisti sve
                    </button>
                    <button class="btn btn-primary apply-btn" @click="applyFilters">
                        <i class="fas fa-check"></i>
                        Primijeni ({{ activeFiltersCount }})
                    </button>
                </div>
            </div>
        </div>
    `,

    setup(props, { emit }) {
        const { computed } = Vue;

        // Computed properties
        const activeFiltersCount = computed(() => {
            let count = 0;
            count += props.selectedCategories.length;
            count += props.selectedBrands.length;
            if (props.searchQuery.trim()) count++;
            if (props.priceRange[0] > 0 || props.priceRange[1] < 5000) count++;
            return count;
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

        const closeModal = () => {
            emit('close');
        };

        const updateSearch = (event) => {
            emit('update:searchQuery', event.target.value);
        };

        const clearSearch = () => {
            emit('update:searchQuery', '');
        };

        const toggleCategory = (category) => {
            const newCategories = [...props.selectedCategories];
            const index = newCategories.indexOf(category);
            
            if (index > -1) {
                newCategories.splice(index, 1);
            } else {
                newCategories.push(category);
            }
            
            emit('update:selectedCategories', newCategories);
        };

        const toggleBrand = (brand) => {
            const newBrands = [...props.selectedBrands];
            const index = newBrands.indexOf(brand);
            
            if (index > -1) {
                newBrands.splice(index, 1);
            } else {
                newBrands.push(brand);
            }
            
            emit('update:selectedBrands', newBrands);
        };

        const updatePriceRange = (newRange) => {
            emit('update:priceRange', newRange);
        };

        const clearAllFilters = () => {
            emit('clear-filters');
        };

        const applyFilters = () => {
            emit('apply-filters');
            closeModal();
        };

        return {
            activeFiltersCount,
            getCategoryName,
            closeModal,
            updateSearch,
            clearSearch,
            toggleCategory,
            toggleBrand,
            updatePriceRange,
            clearAllFilters,
            applyFilters
        };
    }
};
