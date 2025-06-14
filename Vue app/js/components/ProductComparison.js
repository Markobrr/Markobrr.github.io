// Product Comparison Component
const ProductComparison = {
    template: `
        <div class="product-comparison">
            <!-- Comparison Toggle Button -->
            <button 
                class="comparison-toggle-btn"
                :class="{ 'has-items': comparisonItems.length > 0 }"
                @click="toggleComparison"
                v-if="comparisonItems.length > 0"
            >
                <i class="fas fa-balance-scale"></i>
                <span class="comparison-count">{{ comparisonItems.length }}</span>
                <span class="comparison-text">Usporedi</span>
            </button>

            <!-- Comparison Modal -->
            <div class="comparison-modal" v-if="showComparison" @click="closeComparison">
                <div class="comparison-content" @click.stop>
                    <!-- Modal Header -->
                    <div class="comparison-header">
                        <h2 class="comparison-title">
                            <i class="fas fa-balance-scale"></i>
                            Usporedba proizvoda
                        </h2>
                        <button class="comparison-close" @click="closeComparison">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <!-- Comparison Table -->
                    <div class="comparison-table-container" v-if="comparisonItems.length > 0">
                        <table class="comparison-table">
                            <!-- Product Images and Names -->
                            <thead>
                                <tr class="product-row">
                                    <th class="feature-label">Proizvod</th>
                                    <td 
                                        v-for="product in comparisonItems" 
                                        :key="product.id"
                                        class="product-cell"
                                    >
                                        <div class="product-card-mini">
                                            <img 
                                                :src="product.image" 
                                                :alt="product.title"
                                                class="product-image-mini"
                                            >
                                            <h4 class="product-title-mini">{{ product.title }}</h4>
                                            <p class="product-brand-mini">{{ product.brand }}</p>
                                            <button 
                                                class="remove-from-comparison"
                                                @click="removeFromComparison(product.id)"
                                                title="Ukloni iz usporedbe"
                                            >
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </thead>

                            <!-- Comparison Features -->
                            <tbody>
                                <!-- Price -->
                                <tr class="feature-row">
                                    <th class="feature-label">Cijena</th>
                                    <td 
                                        v-for="product in comparisonItems" 
                                        :key="product.id"
                                        class="feature-cell price-cell"
                                    >
                                        <span class="current-price">{{ product.currentPrice }}</span>
                                        <span 
                                            v-if="product.originalPrice" 
                                            class="original-price"
                                        >
                                            {{ product.originalPrice }}
                                        </span>
                                    </td>
                                </tr>

                                <!-- Category -->
                                <tr class="feature-row">
                                    <th class="feature-label">Kategorija</th>
                                    <td 
                                        v-for="product in comparisonItems" 
                                        :key="product.id"
                                        class="feature-cell"
                                    >
                                        {{ getCategoryName(product.category) }}
                                    </td>
                                </tr>

                                <!-- Brand -->
                                <tr class="feature-row">
                                    <th class="feature-label">Brend</th>
                                    <td 
                                        v-for="product in comparisonItems" 
                                        :key="product.id"
                                        class="feature-cell"
                                    >
                                        {{ product.brand }}
                                    </td>
                                </tr>

                                <!-- Stock -->
                                <tr class="feature-row">
                                    <th class="feature-label">Dostupnost</th>
                                    <td 
                                        v-for="product in comparisonItems" 
                                        :key="product.id"
                                        class="feature-cell"
                                    >
                                        <stock-indicator
                                            :stock="product.stock || getRandomStock()"
                                            :low-stock-threshold="5"
                                            size="small"
                                        />
                                    </td>
                                </tr>

                                <!-- Specifications -->
                                <tr 
                                    v-for="(spec, index) in maxSpecs" 
                                    :key="'spec-' + index"
                                    class="feature-row"
                                >
                                    <th class="feature-label">{{ getSpecLabel(index) }}</th>
                                    <td 
                                        v-for="product in comparisonItems" 
                                        :key="product.id"
                                        class="feature-cell"
                                    >
                                        {{ getProductSpec(product, index) || '-' }}
                                    </td>
                                </tr>

                                <!-- Actions -->
                                <tr class="feature-row actions-row">
                                    <th class="feature-label">Akcije</th>
                                    <td 
                                        v-for="product in comparisonItems" 
                                        :key="product.id"
                                        class="feature-cell actions-cell"
                                    >
                                        <div class="comparison-actions">
                                            <button 
                                                class="btn btn-primary btn-sm"
                                                @click="addToCart(product)"
                                            >
                                                <i class="fas fa-shopping-cart"></i>
                                                Dodaj
                                            </button>
                                            <wishlist-manager
                                                :product-id="product.id"
                                                size="small"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Empty State -->
                    <div class="comparison-empty" v-else>
                        <i class="fas fa-balance-scale"></i>
                        <h3>Nema proizvoda za usporedbu</h3>
                        <p>Dodajte proizvode u usporedbu da biste ih mogli usporediti.</p>
                    </div>

                    <!-- Modal Footer -->
                    <div class="comparison-footer">
                        <button 
                            class="btn btn-outline"
                            @click="clearComparison"
                            v-if="comparisonItems.length > 0"
                        >
                            <i class="fas fa-trash"></i>
                            Očisti sve
                        </button>
                        <button class="btn btn-primary" @click="closeComparison">
                            <i class="fas fa-check"></i>
                            Gotovo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,

    setup() {
        const { ref, computed, onMounted, onUnmounted } = Vue;

        // Reactive state
        const showComparison = ref(false);

        // Computed properties
        const comparisonItems = computed(() => {
            return window.comparisonStore ? window.comparisonStore.getItemsWithDetails() : [];
        });

        const maxSpecs = computed(() => {
            let maxLength = 0;
            comparisonItems.value.forEach(product => {
                if (product.specs && product.specs.length > maxLength) {
                    maxLength = product.specs.length;
                }
            });
            return maxLength;
        });

        // Methods
        const toggleComparison = () => {
            showComparison.value = !showComparison.value;
        };

        const closeComparison = () => {
            showComparison.value = false;
        };

        const removeFromComparison = (productId) => {
            if (window.comparisonStore) {
                window.comparisonStore.removeItem(productId);
            }
        };

        const clearComparison = () => {
            if (window.comparisonStore) {
                window.comparisonStore.clearAll();
                
                if (window.toast) {
                    window.toast.info(
                        'Usporedba je očišćena',
                        'Usporedba proizvoda'
                    );
                }
            }
        };

        const addToCart = (product) => {
            if (window.cartStore) {
                window.cartStore.addItem(product);
                
                if (window.toast) {
                    window.toast.success(
                        `${product.title} je dodano u košaricu!`,
                        'Proizvod dodano'
                    );
                }
            }
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

        const getSpecLabel = (index) => {
            const labels = [
                'Specifikacija 1',
                'Specifikacija 2', 
                'Specifikacija 3',
                'Specifikacija 4',
                'Specifikacija 5'
            ];
            return labels[index] || `Spec ${index + 1}`;
        };

        const getProductSpec = (product, index) => {
            return product.specs && product.specs[index] ? product.specs[index] : null;
        };

        const getRandomStock = () => {
            const stockLevels = [0, 1, 2, 3, 4, 5, 8, 12, 15, 20, 25];
            return stockLevels[Math.floor(Math.random() * stockLevels.length)];
        };

        // Handle escape key
        const handleKeydown = (event) => {
            if (event.key === 'Escape' && showComparison.value) {
                closeComparison();
            }
        };

        // Lifecycle
        onMounted(() => {
            document.addEventListener('keydown', handleKeydown);
        });

        onUnmounted(() => {
            document.removeEventListener('keydown', handleKeydown);
        });

        return {
            showComparison,
            comparisonItems,
            maxSpecs,
            toggleComparison,
            closeComparison,
            removeFromComparison,
            clearComparison,
            addToCart,
            getCategoryName,
            getSpecLabel,
            getProductSpec,
            getRandomStock
        };
    }
};
