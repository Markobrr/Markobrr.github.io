// Cart View Component
const Cart = {
    template: `
        <div class="cart-page">
            <!-- Page Header -->
            <div class="page-header">
                <div class="container">
                    <h1 class="page-title">Košarica</h1>
                    <p class="page-subtitle">Pregledajte i uredite proizvode u vašoj košarici</p>
                </div>
            </div>

            <!-- Cart Content -->
            <div class="cart-content">
                <div class="container">
                    <!-- Empty Cart -->
                    <div v-if="isEmpty" class="empty-cart-page">
                        <div class="empty-cart-icon">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        <h2 class="empty-cart-title">Vaša košarica je prazna</h2>
                        <p class="empty-cart-text">
                            Izgleda da još niste dodali proizvode u košaricu. 
                            Pregledajte našu ponudu i pronađite nešto što vam se sviđa!
                        </p>
                        <div class="empty-cart-actions">
                            <router-link to="/products" class="btn btn-primary btn-lg">
                                <i class="fas fa-shopping-bag"></i>
                                Pregledaj proizvode
                            </router-link>
                            <router-link to="/" class="btn btn-outline btn-lg">
                                <i class="fas fa-home"></i>
                                Povratak na početnu
                            </router-link>
                        </div>
                    </div>

                    <!-- Cart Items -->
                    <div v-else class="cart-layout">
                        <!-- Cart Items List -->
                        <div class="cart-items-section">
                            <div class="cart-items-header">
                                <h2>Proizvodi u košarici ({{ totalItems }})</h2>
                                <button 
                                    class="clear-cart-btn"
                                    @click="clearCartWithConfirmation"
                                >
                                    <i class="fas fa-trash"></i>
                                    Očisti košaricu
                                </button>
                            </div>

                            <div class="cart-items-list">
                                <div 
                                    v-for="item in cartItems" 
                                    :key="item.id"
                                    class="cart-item-card"
                                >
                                    <div class="item-image">
                                        <img :src="item.product.image" :alt="item.product.title">
                                        <div class="item-badge" v-if="isItemOnSale(item)">
                                            <span class="badge badge-sale">AKCIJA</span>
                                        </div>
                                    </div>

                                    <div class="item-details">
                                        <div class="item-brand">{{ item.product.brand }}</div>
                                        <h3 class="item-title">{{ item.product.title }}</h3>
                                        <div class="item-specs" v-if="item.product.specs">
                                            <span 
                                                v-for="(spec, index) in item.product.specs.slice(0, 2)" 
                                                :key="index"
                                                class="spec-item"
                                            >
                                                {{ spec }}
                                            </span>
                                        </div>
                                        <div class="item-stock-status" :class="{ 'in-stock': item.product.inStock }">
                                            <i :class="item.product.inStock ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                                            {{ item.product.inStock ? 'Na skladištu' : 'Nema na skladištu' }}
                                        </div>
                                    </div>

                                    <div class="item-price-section">
                                        <div class="item-price">
                                            <span class="current-price">{{ formatItemPrice(item) }}</span>
                                            <span v-if="item.product.oldPrice" class="old-price">{{ item.product.oldPrice }}</span>
                                        </div>
                                        <div v-if="getItemSavings(item) > 0" class="item-savings">
                                            Ušteda: {{ formatItemSavings(item) }}
                                        </div>
                                    </div>

                                    <div class="item-quantity-section">
                                        <label class="quantity-label">Količina:</label>
                                        <div class="quantity-controls">
                                            <button 
                                                class="quantity-btn"
                                                @click="decreaseQuantity(item.product.id)"
                                                :disabled="item.quantity <= 1"
                                            >
                                                <i class="fas fa-minus"></i>
                                            </button>
                                            <input 
                                                type="number" 
                                                :value="item.quantity"
                                                @change="updateQuantity(item.product.id, $event.target.value)"
                                                class="quantity-input"
                                                min="1"
                                                max="99"
                                            >
                                            <button 
                                                class="quantity-btn"
                                                @click="increaseQuantity(item.product.id)"
                                            >
                                                <i class="fas fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div class="item-total-section">
                                        <div class="item-total-label">Ukupno:</div>
                                        <div class="item-total-price">{{ formatItemTotal(item) }}</div>
                                    </div>

                                    <div class="item-actions">
                                        <button 
                                            class="remove-item-btn"
                                            @click="removeItemWithConfirmation(item.product.id, item.product.title)"
                                            title="Ukloni iz košarice"
                                        >
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Cart Summary -->
                        <div class="cart-summary-section">
                            <div class="cart-summary-card">
                                <h3 class="summary-title">Sažetak narudžbe</h3>
                                
                                <div class="summary-details">
                                    <div class="summary-row">
                                        <span class="summary-label">Proizvodi ({{ totalItems }}):</span>
                                        <span class="summary-value">{{ formattedTotalPrice }}</span>
                                    </div>
                                    
                                    <div class="summary-row" v-if="totalSavings > 0">
                                        <span class="summary-label">Ušteda:</span>
                                        <span class="summary-value savings">-{{ formattedTotalSavings }}</span>
                                    </div>
                                    
                                    <div class="summary-row">
                                        <span class="summary-label">Dostava:</span>
                                        <span class="summary-value">
                                            {{ totalPrice >= 500 ? 'Besplatno' : '25,00 €' }}
                                        </span>
                                    </div>
                                    
                                    <div class="summary-divider"></div>
                                    
                                    <div class="summary-row total">
                                        <span class="summary-label">Ukupno:</span>
                                        <span class="summary-value">
                                            {{ formatPrice(totalPrice + (totalPrice >= 500 ? 0 : 25)) }}
                                        </span>
                                    </div>
                                </div>

                                <div class="summary-actions">
                                    <button 
                                        class="btn btn-primary btn-lg btn-block checkout-btn"
                                        @click="proceedToCheckout"
                                        :disabled="isLoading || !hasValidItems"
                                    >
                                        <i class="fas fa-credit-card" v-if="!isLoading"></i>
                                        <i class="fas fa-spinner fa-spin" v-else></i>
                                        {{ isLoading ? 'Obrađuje se...' : 'Nastavi na naplatu' }}
                                    </button>
                                    
                                    <router-link to="/products" class="btn btn-outline btn-block">
                                        <i class="fas fa-shopping-bag"></i>
                                        Nastavi kupovinu
                                    </router-link>
                                </div>

                                <div class="summary-info">
                                    <div class="info-item">
                                        <i class="fas fa-shield-alt"></i>
                                        <span>Sigurna kupovina</span>
                                    </div>
                                    <div class="info-item">
                                        <i class="fas fa-truck"></i>
                                        <span>Brza dostava</span>
                                    </div>
                                    <div class="info-item">
                                        <i class="fas fa-undo"></i>
                                        <span>30 dana za povrat</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    setup() {
        const { computed } = Vue;
        const { useRouter } = VueRouter;
        
        const router = useRouter();
        const {
            cartItems,
            totalItems,
            totalPrice,
            formattedTotalPrice,
            totalSavings,
            formattedTotalSavings,
            isEmpty,
            isLoading,
            removeFromCart,
            updateQuantity,
            increaseQuantity,
            decreaseQuantity,
            clearCart,
            checkout,
            formatItemPrice,
            getItemTotal,
            formatItemTotal,
            getItemSavings,
            formatItemSavings,
            isItemOnSale,
            validateCart
        } = useCart();
        const { success, error } = useNotifications();

        // Computed properties
        const hasValidItems = computed(() => {
            const validation = validateCart();
            return validation.isValid;
        });

        // Methods
        const formatPrice = (price) => {
            return new Intl.NumberFormat('hr-HR', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 2
            }).format(price);
        };

        const clearCartWithConfirmation = () => {
            if (confirm('Jeste li sigurni da želite ukloniti sve proizvode iz košarice?')) {
                clearCart();
            }
        };

        const removeItemWithConfirmation = (productId, productTitle) => {
            if (confirm(`Jeste li sigurni da želite ukloniti "${productTitle}" iz košarice?`)) {
                removeFromCart(productId);
            }
        };

        const proceedToCheckout = async () => {
            const validation = validateCart();
            
            if (!validation.isValid) {
                error('Greška u košarici', validation.errors.join(', '));
                return;
            }

            try {
                const result = await checkout();
                
                if (result.success) {
                    router.push('/');
                    success('Narudžba uspješna!', 'Vaša narudžba je uspješno poslana');
                } else {
                    error('Greška pri narudžbi', 'Došlo je do greške. Molimo pokušajte ponovo.');
                }
            } catch (err) {
                error('Greška pri narudžbi', 'Došlo je do greške. Molimo pokušajte ponovo.');
            }
        };

        return {
            // Computed
            cartItems,
            totalItems,
            totalPrice,
            formattedTotalPrice,
            totalSavings,
            formattedTotalSavings,
            isEmpty,
            isLoading,
            hasValidItems,

            // Methods
            removeFromCart,
            updateQuantity,
            increaseQuantity,
            decreaseQuantity,
            clearCartWithConfirmation,
            removeItemWithConfirmation,
            proceedToCheckout,
            formatItemPrice,
            getItemTotal,
            formatItemTotal,
            getItemSavings,
            formatItemSavings,
            isItemOnSale,
            formatPrice
        };
    }
};
