// Recently Viewed Component
const RecentlyViewed = {
    props: {
        maxItems: {
            type: Number,
            default: 6
        },
        showTitle: {
            type: Boolean,
            default: true
        },
        layout: {
            type: String,
            default: 'horizontal', // 'horizontal', 'vertical', 'grid'
            validator: (value) => ['horizontal', 'vertical', 'grid'].includes(value)
        }
    },

    template: `
        <div class="recently-viewed" v-if="recentItems.length > 0">
            <!-- Section Title -->
            <div class="recently-viewed-header" v-if="showTitle">
                <h3 class="recently-viewed-title">
                    <i class="fas fa-history"></i>
                    Nedavno pregledano
                </h3>
                <button 
                    class="clear-recent-btn"
                    @click="clearRecentlyViewed"
                    title="Očisti povijest"
                >
                    <i class="fas fa-trash"></i>
                </button>
            </div>

            <!-- Recently Viewed Items -->
            <div class="recently-viewed-container" :class="layoutClass">
                <div 
                    v-for="product in displayItems"
                    :key="product.id"
                    class="recent-item"
                    @click="viewProduct(product)"
                >
                    <div class="recent-item-image">
                        <img 
                            :src="product.image" 
                            :alt="product.title"
                            loading="lazy"
                        >
                        
                        <!-- Remove from recent -->
                        <button 
                            class="remove-recent-btn"
                            @click.stop="removeFromRecent(product.id)"
                            title="Ukloni iz povijesti"
                        >
                            <i class="fas fa-times"></i>
                        </button>
                        
                        <!-- View timestamp -->
                        <div class="recent-timestamp">
                            {{ formatTimestamp(product.viewedAt) }}
                        </div>
                    </div>
                    
                    <div class="recent-item-info">
                        <h4 class="recent-item-title">{{ product.title }}</h4>
                        <p class="recent-item-brand">{{ product.brand }}</p>
                        <div class="recent-item-price">
                            <span class="current-price">{{ product.currentPrice }}</span>
                            <span 
                                v-if="product.originalPrice" 
                                class="original-price"
                            >
                                {{ product.originalPrice }}
                            </span>
                        </div>
                        
                        <!-- Quick Actions -->
                        <div class="recent-item-actions">
                            <button 
                                class="btn btn-sm btn-primary"
                                @click.stop="addToCart(product)"
                                title="Dodaj u košaricu"
                            >
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                            
                            <wishlist-manager
                                :product-id="product.id"
                                size="small"
                            />
                            
                            <button 
                                class="btn btn-sm btn-outline"
                                @click.stop="addToComparison(product)"
                                :disabled="!canAddToComparison"
                                title="Dodaj u usporedbu"
                            >
                                <i class="fas fa-balance-scale"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Show More Button -->
                <div 
                    class="show-more-recent"
                    v-if="recentItems.length > maxItems"
                >
                    <button 
                        class="btn btn-outline"
                        @click="showAllRecent = !showAllRecent"
                    >
                        <i :class="showAllRecent ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
                        {{ showAllRecent ? 'Prikaži manje' : 'Prikaži sve (' + recentItems.length + ')' }}
                    </button>
                </div>
            </div>
        </div>
    `,

    setup(props) {
        const { ref, computed, onMounted } = Vue;

        // Reactive state
        const showAllRecent = ref(false);

        // Computed properties
        const recentItems = computed(() => {
            return window.recentlyViewedStore ? window.recentlyViewedStore.getItemsWithDetails() : [];
        });

        const displayItems = computed(() => {
            if (showAllRecent.value) {
                return recentItems.value;
            }
            return recentItems.value.slice(0, props.maxItems);
        });

        const layoutClass = computed(() => {
            return `layout-${props.layout}`;
        });

        const canAddToComparison = computed(() => {
            return window.comparisonStore ? window.comparisonStore.canAddMore : false;
        });

        // Methods
        const viewProduct = (product) => {
            // Navigate to product detail or trigger product view
            if (window.toast) {
                window.toast.info(
                    `Pregledavanje: ${product.title}`,
                    'Proizvod'
                );
            }
            
            // Track the view again
            if (window.recentlyViewedStore) {
                window.recentlyViewedStore.addItem(product.id);
            }
        };

        const removeFromRecent = (productId) => {
            if (window.recentlyViewedStore) {
                window.recentlyViewedStore.removeItem(productId);
                
                if (window.toast) {
                    window.toast.info(
                        'Proizvod uklonjen iz povijesti',
                        'Nedavno pregledano'
                    );
                }
            }
        };

        const clearRecentlyViewed = () => {
            if (window.recentlyViewedStore) {
                const count = window.recentlyViewedStore.clearAll();
                
                if (window.toast) {
                    window.toast.success(
                        `Uklonjen${count === 1 ? '' : 'o'} ${count} proizvod${count === 1 ? '' : 'a'} iz povijesti`,
                        'Povijest očišćena'
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

        const addToComparison = (product) => {
            if (window.comparisonStore) {
                const result = window.comparisonStore.addItem(product.id);
                
                if (result.success) {
                    if (window.toast) {
                        window.toast.success(
                            `${product.title} je dodano u usporedbu!`,
                            'Usporedba proizvoda'
                        );
                    }
                } else {
                    let message = 'Greška pri dodavanju u usporedbu';
                    
                    switch (result.reason) {
                        case 'already_added':
                            message = 'Proizvod je već u usporedbi';
                            break;
                        case 'max_reached':
                            message = `Možete usporediti maksimalno ${result.maxItems} proizvoda`;
                            break;
                    }
                    
                    if (window.toast) {
                        window.toast.warning(message, 'Usporedba proizvoda');
                    }
                }
            }
        };

        const formatTimestamp = (timestamp) => {
            if (!timestamp) return '';
            
            const now = Date.now();
            const diff = now - timestamp;
            
            // Less than 1 minute
            if (diff < 60000) {
                return 'Upravo sada';
            }
            
            // Less than 1 hour
            if (diff < 3600000) {
                const minutes = Math.floor(diff / 60000);
                return `Prije ${minutes} min`;
            }
            
            // Less than 1 day
            if (diff < 86400000) {
                const hours = Math.floor(diff / 3600000);
                return `Prije ${hours}h`;
            }
            
            // Less than 1 week
            if (diff < 604800000) {
                const days = Math.floor(diff / 86400000);
                return `Prije ${days} dan${days === 1 ? '' : 'a'}`;
            }
            
            // Format as date
            const date = new Date(timestamp);
            return date.toLocaleDateString('hr-HR', {
                day: 'numeric',
                month: 'short'
            });
        };

        return {
            showAllRecent,
            recentItems,
            displayItems,
            layoutClass,
            canAddToComparison,
            viewProduct,
            removeFromRecent,
            clearRecentlyViewed,
            addToCart,
            addToComparison,
            formatTimestamp
        };
    }
};
