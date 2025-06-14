// CartSidebar Component
const CartSidebar = {
    template: `
        <div class="cart-sidebar-overlay" :class="{ 'active': isOpen }" @click="closeCart">
            <div class="cart-sidebar" :class="{ 'open': isOpen }" @click.stop>
                <!-- Cart Header -->
                <div class="cart-header">
                    <h3 class="cart-title">
                        <i class="fas fa-shopping-cart"></i>
                        Košarica ({{ totalItems }})
                    </h3>
                    <button class="close-cart-btn" @click="closeCart">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Cart Content -->
                <div class="cart-content">
                    <!-- Empty Cart -->
                    <div v-if="isEmpty" class="empty-cart">
                        <div class="empty-cart-icon">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        <h4 class="empty-cart-title">Vaša košarica je prazna</h4>
                        <p class="empty-cart-text">Dodajte proizvode u košaricu da biste nastavili s kupovinom.</p>
                        <router-link to="/products" class="btn btn-primary" @click="closeCart">
                            <i class="fas fa-shopping-bag"></i>
                            Pregledaj proizvode
                        </router-link>
                    </div>

                    <!-- Cart Items -->
                    <div v-else class="cart-items">
                        <div 
                            v-for="item in cartItems" 
                            :key="item.id"
                            class="cart-item"
                        >
                            <div class="item-image">
                                <img :src="item.product.image" :alt="item.product.title">
                            </div>
                            <div class="item-details">
                                <h4 class="item-title">{{ item.product.title }}</h4>
                                <p class="item-brand">{{ item.product.brand }}</p>
                                <div class="item-price">
                                    <span class="current-price">{{ item.product.currentPrice }}</span>
                                    <span v-if="item.product.oldPrice" class="old-price">{{ item.product.oldPrice }}</span>
                                </div>
                            </div>
                            <div class="item-actions">
                                <div class="quantity-controls">
                                    <button 
                                        class="quantity-btn"
                                        @click="decreaseQuantity(item.product.id)"
                                        :disabled="item.quantity <= 1"
                                    >
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <span class="quantity">{{ item.quantity }}</span>
                                    <button 
                                        class="quantity-btn"
                                        @click="increaseQuantity(item.product.id)"
                                    >
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                                <button 
                                    class="remove-item-btn"
                                    @click="removeFromCart(item.product.id)"
                                    title="Ukloni iz košarice"
                                >
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cart Footer -->
                <div v-if="!isEmpty" class="cart-footer">
                    <!-- Cart Summary -->
                    <div class="cart-summary">
                        <div class="summary-row" v-if="totalSavings > 0">
                            <span class="summary-label">Ušteda:</span>
                            <span class="summary-value savings">{{ formattedTotalSavings }}</span>
                        </div>
                        <div class="summary-row total">
                            <span class="summary-label">Ukupno:</span>
                            <span class="summary-value">{{ formattedTotalPrice }}</span>
                        </div>
                    </div>

                    <!-- Cart Actions -->
                    <div class="cart-actions">
                        <router-link 
                            to="/cart" 
                            class="btn btn-outline btn-block"
                            @click="closeCart"
                        >
                            <i class="fas fa-eye"></i>
                            Pogledaj košaricu
                        </router-link>
                        <button 
                            class="btn btn-primary btn-block"
                            @click="proceedToCheckout"
                            :disabled="isLoading"
                        >
                            <i class="fas fa-credit-card" v-if="!isLoading"></i>
                            <i class="fas fa-spinner fa-spin" v-else></i>
                            {{ isLoading ? 'Obrađuje se...' : 'Naruči' }}
                        </button>
                    </div>

                    <!-- Clear Cart -->
                    <div class="cart-clear">
                        <button 
                            class="clear-cart-btn"
                            @click="clearCartWithConfirmation"
                        >
                            <i class="fas fa-trash"></i>
                            Očisti košaricu
                        </button>
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
            isOpen,
            isLoading,
            closeCart,
            removeFromCart,
            increaseQuantity,
            decreaseQuantity,
            clearCart,
            checkout
        } = useCart();
        const { success, error } = useNotifications();

        // Methods
        const clearCartWithConfirmation = () => {
            if (confirm('Jeste li sigurni da želite ukloniti sve proizvode iz košarice?')) {
                clearCart();
            }
        };

        const proceedToCheckout = async () => {
            try {
                const result = await checkout();
                
                if (result.success) {
                    closeCart();
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
            isOpen,
            isLoading,

            // Methods
            closeCart,
            removeFromCart,
            increaseQuantity,
            decreaseQuantity,
            clearCartWithConfirmation,
            proceedToCheckout
        };
    }
};
