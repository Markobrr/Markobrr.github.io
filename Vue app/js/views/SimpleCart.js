// Simple Cart View Component without external dependencies
const Cart = {
    template: `
        <div class="cart-page">
            <div class="container">
                <div class="page-header">
                    <h1 class="page-title">Košarica</h1>
                    <p class="page-subtitle" v-if="cartItems.length > 0">
                        Imate {{ cartItems.length }} {{ cartItems.length === 1 ? 'proizvod' : 'proizvoda' }} u košarici
                    </p>
                </div>

                <div class="cart-content" v-if="!isLoading && cartItems.length > 0">
                    <!-- Cart Items -->
                    <div class="cart-items">
                        <div 
                            v-for="item in cartItems" 
                            :key="item.id"
                            class="cart-item"
                        >
                            <div class="item-image">
                                <img :src="item.image" :alt="item.title" loading="lazy" style="max-width: 80px; max-height: 80px; object-fit: contain;">
                            </div>
                            
                            <div class="item-details">
                                <h3 class="item-title">{{ item.title }}</h3>
                                <p class="item-brand">{{ item.brand }}</p>
                                <p class="item-category">{{ getCategoryName(item.category) }}</p>
                            </div>

                            <div class="item-price">
                                <span class="current-price">{{ item.currentPrice }}</span>
                                <span v-if="item.originalPrice" class="original-price">{{ item.originalPrice }}</span>
                            </div>

                            <div class="item-quantity">
                                <button 
                                    class="quantity-btn decrease"
                                    @click="decreaseQuantity(item.id)"
                                    :disabled="item.quantity <= 1"
                                >
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="quantity-value">{{ item.quantity }}</span>
                                <button 
                                    class="quantity-btn increase"
                                    @click="increaseQuantity(item.id)"
                                >
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>

                            <div class="item-total">
                                {{ formatPrice(getItemTotal(item)) }}
                            </div>

                            <button 
                                class="remove-item-btn"
                                @click="removeItem(item.id)"
                                title="Ukloni iz košarice"
                            >
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Cart Summary -->
                    <div class="cart-summary">
                        <div class="summary-card">
                            <h3 class="summary-title">Sažetak narudžbe</h3>
                            
                            <div class="summary-row">
                                <span>Ukupno proizvoda:</span>
                                <span>{{ totalItems }}</span>
                            </div>
                            
                            <div class="summary-row">
                                <span>Međuzbroj:</span>
                                <span>{{ formatPrice(subtotal) }}</span>
                            </div>
                            
                            <div class="summary-row">
                                <span>Dostava:</span>
                                <span>{{ subtotal >= 500 ? 'Besplatno' : formatPrice(shippingCost) }}</span>
                            </div>
                            
                            <div class="summary-row total-row">
                                <span>Ukupno:</span>
                                <span class="total-price">{{ formatPrice(total) }}</span>
                            </div>

                            <div class="summary-actions">
                                <button class="btn btn-outline clear-cart-btn" @click="clearCart">
                                    <i class="fas fa-trash"></i>
                                    Očisti košaricu
                                </button>
                                <button class="btn btn-primary checkout-btn" @click="proceedToCheckout">
                                    <i class="fas fa-credit-card"></i>
                                    Nastavi na plaćanje
                                </button>
                            </div>

                            <div class="shipping-info" v-if="subtotal < 500">
                                <i class="fas fa-info-circle"></i>
                                Dodajte još {{ formatPrice(500 - subtotal) }} za besplatnu dostavu!
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Loading Cart -->
                <div class="cart-content" v-else-if="isLoading">
                    <div class="cart-items">
                        <loading-skeleton type="cart-item" :count="3"></loading-skeleton>
                    </div>
                </div>

                <!-- Empty Cart -->
                <div class="empty-cart" v-else-if="!isLoading && cartItems.length === 0">
                    <div class="empty-cart-content">
                        <i class="fas fa-shopping-cart"></i>
                        <h2>Vaša košarica je prazna</h2>
                        <p>Dodajte proizvode u košaricu da biste nastavili s kupovinom.</p>
                        <router-link to="/products" class="btn btn-primary">
                            <i class="fas fa-shopping-bag"></i>
                            Pregledaj proizvode
                        </router-link>
                    </div>
                </div>

                <!-- Continue Shopping -->
                <div class="continue-shopping" v-if="cartItems.length > 0">
                    <router-link to="/products" class="btn btn-outline">
                        <i class="fas fa-arrow-left"></i>
                        Nastavi kupovinu
                    </router-link>
                </div>
            </div>
        </div>
    `,

    setup() {
        const { ref, computed, onMounted } = Vue;
        const { useRouter } = VueRouter;
        
        const router = useRouter();
        
        // Reactive state
        const cartItems = ref([]);
        const isLoading = ref(false);
        const shippingCost = 25; // €25 shipping cost

        // Computed properties
        const totalItems = computed(() => {
            return cartItems.value.reduce((total, item) => total + item.quantity, 0);
        });

        const subtotal = computed(() => {
            return cartItems.value.reduce((total, item) => {
                const price = parseFloat(item.currentPrice.replace(/[^\d,]/g, '').replace(',', '.'));
                return total + (price * item.quantity);
            }, 0);
        });

        const total = computed(() => {
            const shipping = subtotal.value >= 500 ? 0 : shippingCost;
            return subtotal.value + shipping;
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
                currency: 'EUR'
            }).format(price);
        };

        const getItemTotal = (item) => {
            const price = parseFloat(item.currentPrice.replace(/[^\d,]/g, '').replace(',', '.'));
            return price * item.quantity;
        };

        const increaseQuantity = (productId) => {
            if (window.cartStore) {
                const item = cartItems.value.find(item => item.id === productId);
                if (item) {
                    const newQuantity = item.quantity + 1;
                    window.cartStore.updateQuantity(productId, newQuantity);
                    loadCartItems();

                    if (window.toast) {
                        window.toast.info(`Količina ažurirana na ${newQuantity}`);
                    }
                }
            }
        };

        const decreaseQuantity = (productId) => {
            if (window.cartStore) {
                const item = cartItems.value.find(item => item.id === productId);
                if (item && item.quantity > 1) {
                    const newQuantity = item.quantity - 1;
                    window.cartStore.updateQuantity(productId, newQuantity);
                    loadCartItems();

                    if (window.toast) {
                        window.toast.info(`Količina ažurirana na ${newQuantity}`);
                    }
                }
            }
        };

        const removeItem = (productId) => {
            if (window.cartStore) {
                const item = cartItems.value.find(item => item.id === productId);
                const itemName = item ? item.title : 'Proizvod';

                window.cartStore.removeItem(productId);
                loadCartItems();

                if (window.toast) {
                    window.toast.warning(`${itemName} je uklonjen iz košarice`, 'Proizvod uklonjen');
                }
            }
        };

        const clearCart = () => {
            if (window.cartStore && confirm('Jeste li sigurni da želite očistiti košaricu?')) {
                window.cartStore.items = [];
                window.cartStore.saveToStorage();
                loadCartItems();

                if (window.toast) {
                    window.toast.success('Košarica je uspješno očišćena', 'Košarica očišćena');
                }
            }
        };

        const proceedToCheckout = () => {
            alert('Checkout funkcionalnost će biti dostupna uskoro!');
        };

        const loadCartItems = () => {
            if (window.cartStore) {
                cartItems.value = [...window.cartStore.items];
            }
        };

        // Initialize cart
        onMounted(() => {
            isLoading.value = true;

            setTimeout(() => {
                loadCartItems();
                isLoading.value = false;
            }, 600);
        });

        return {
            cartItems,
            isLoading,
            totalItems,
            subtotal,
            total,
            shippingCost,
            getCategoryName,
            formatPrice,
            getItemTotal,
            increaseQuantity,
            decreaseQuantity,
            removeItem,
            clearCart,
            proceedToCheckout
        };
    }
};
