// Cart Store - Pinia
const { defineStore } = Pinia;

const useCartStore = defineStore('cart', {
    state: () => ({
        items: [],
        isOpen: false,
        loading: false
    }),

    getters: {
        // Get all cart items
        cartItems: (state) => state.items,

        // Get total items count
        totalItems: (state) => {
            return state.items.reduce((total, item) => total + item.quantity, 0);
        },

        // Get total price
        totalPrice: (state) => {
            return state.items.reduce((total, item) => {
                const price = parseFloat(item.product.currentPrice.replace(/[^\d,]/g, '').replace(',', '.'));
                return total + (price * item.quantity);
            }, 0);
        },

        // Get formatted total price
        formattedTotalPrice: (state) => {
            const total = state.totalPrice;
            return new Intl.NumberFormat('hr-HR', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 2
            }).format(total);
        },

        // Get total savings (if items have old prices)
        totalSavings: (state) => {
            return state.items.reduce((total, item) => {
                if (item.product.oldPrice && item.product.oldPrice !== '') {
                    const currentPrice = parseFloat(item.product.currentPrice.replace(/[^\d,]/g, '').replace(',', '.'));
                    const oldPrice = parseFloat(item.product.oldPrice.replace(/[^\d,]/g, '').replace(',', '.'));
                    const savings = (oldPrice - currentPrice) * item.quantity;
                    return total + savings;
                }
                return total;
            }, 0);
        },

        // Get formatted total savings
        formattedTotalSavings: (state) => {
            const savings = state.totalSavings;
            return new Intl.NumberFormat('hr-HR', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 2
            }).format(savings);
        },

        // Check if cart is empty
        isEmpty: (state) => state.items.length === 0,

        // Check if product is in cart
        isInCart: (state) => (productId) => {
            return state.items.some(item => item.product.id === productId);
        },

        // Get item quantity by product ID
        getItemQuantity: (state) => (productId) => {
            const item = state.items.find(item => item.product.id === productId);
            return item ? item.quantity : 0;
        },

        // Get cart item by product ID
        getCartItem: (state) => (productId) => {
            return state.items.find(item => item.product.id === productId);
        }
    },

    actions: {
        // Initialize cart from localStorage
        initializeCart() {
            try {
                const savedCart = localStorage.getItem('neogears-cart');
                if (savedCart) {
                    this.items = JSON.parse(savedCart);
                }
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
                this.items = [];
            }
        },

        // Save cart to localStorage
        saveCart() {
            try {
                localStorage.setItem('neogears-cart', JSON.stringify(this.items));
            } catch (error) {
                console.error('Error saving cart to localStorage:', error);
            }
        },

        // Add item to cart
        addToCart(product, quantity = 1) {
            const existingItem = this.items.find(item => item.product.id === product.id);

            if (existingItem) {
                // Update quantity if item already exists
                existingItem.quantity += quantity;
            } else {
                // Add new item
                this.items.push({
                    id: Date.now(), // Simple ID generation
                    product: { ...product }, // Clone product to avoid mutations
                    quantity: quantity,
                    addedAt: new Date().toISOString()
                });
            }

            this.saveCart();
            
            // Show notification
            const notificationStore = useNotificationStore();
            notificationStore.addNotification({
                type: 'success',
                title: 'Dodano u košaricu',
                message: `${product.title} je dodan u košaricu`,
                duration: 3000
            });
        },

        // Remove item from cart
        removeFromCart(productId) {
            const itemIndex = this.items.findIndex(item => item.product.id === productId);
            
            if (itemIndex > -1) {
                const removedItem = this.items[itemIndex];
                this.items.splice(itemIndex, 1);
                this.saveCart();

                // Show notification
                const notificationStore = useNotificationStore();
                notificationStore.addNotification({
                    type: 'info',
                    title: 'Uklonjeno iz košarice',
                    message: `${removedItem.product.title} je uklonjen iz košarice`,
                    duration: 3000
                });
            }
        },

        // Update item quantity
        updateQuantity(productId, quantity) {
            const item = this.items.find(item => item.product.id === productId);
            
            if (item) {
                if (quantity <= 0) {
                    this.removeFromCart(productId);
                } else {
                    item.quantity = quantity;
                    this.saveCart();
                }
            }
        },

        // Increase item quantity
        increaseQuantity(productId) {
            const item = this.items.find(item => item.product.id === productId);
            if (item) {
                item.quantity++;
                this.saveCart();
            }
        },

        // Decrease item quantity
        decreaseQuantity(productId) {
            const item = this.items.find(item => item.product.id === productId);
            if (item) {
                if (item.quantity > 1) {
                    item.quantity--;
                    this.saveCart();
                } else {
                    this.removeFromCart(productId);
                }
            }
        },

        // Clear entire cart
        clearCart() {
            this.items = [];
            this.saveCart();

            // Show notification
            const notificationStore = useNotificationStore();
            notificationStore.addNotification({
                type: 'info',
                title: 'Košarica očišćena',
                message: 'Svi proizvodi su uklonjeni iz košarice',
                duration: 3000
            });
        },

        // Toggle cart sidebar
        toggleCart() {
            this.isOpen = !this.isOpen;
        },

        // Open cart sidebar
        openCart() {
            this.isOpen = true;
        },

        // Close cart sidebar
        closeCart() {
            this.isOpen = false;
        },

        // Quick add to cart (with default quantity of 1)
        quickAddToCart(product) {
            this.addToCart(product, 1);
        },

        // Add multiple items at once
        addMultipleItems(items) {
            items.forEach(({ product, quantity }) => {
                this.addToCart(product, quantity);
            });
        },

        // Get cart summary for checkout
        getCartSummary() {
            return {
                items: this.items.map(item => ({
                    productId: item.product.id,
                    title: item.product.title,
                    price: item.product.currentPrice,
                    quantity: item.quantity,
                    total: parseFloat(item.product.currentPrice.replace(/[^\d,]/g, '').replace(',', '.')) * item.quantity
                })),
                totalItems: this.totalItems,
                totalPrice: this.totalPrice,
                totalSavings: this.totalSavings,
                formattedTotalPrice: this.formattedTotalPrice,
                formattedTotalSavings: this.formattedTotalSavings
            };
        },

        // Simulate checkout process
        async checkout() {
            this.loading = true;

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Clear cart after successful checkout
                this.clearCart();

                // Show success notification
                const notificationStore = useNotificationStore();
                notificationStore.addNotification({
                    type: 'success',
                    title: 'Narudžba uspješna!',
                    message: 'Vaša narudžba je uspješno poslana',
                    duration: 5000
                });

                return { success: true };
            } catch (error) {
                // Show error notification
                const notificationStore = useNotificationStore();
                notificationStore.addNotification({
                    type: 'error',
                    title: 'Greška pri narudžbi',
                    message: 'Došlo je do greške. Molimo pokušajte ponovo.',
                    duration: 5000
                });

                return { success: false, error };
            } finally {
                this.loading = false;
            }
        },

        // Check if cart has items with specific category
        hasItemsFromCategory(category) {
            return this.items.some(item => item.product.category === category);
        },

        // Get items from specific category
        getItemsByCategory(category) {
            return this.items.filter(item => item.product.category === category);
        },

        // Get recommended products based on cart items
        getRecommendedProducts() {
            if (this.isEmpty) return [];

            const productsStore = useProductsStore();
            const cartCategories = [...new Set(this.items.map(item => item.product.category))];
            const cartProductIds = this.items.map(item => item.product.id);

            // Get products from same categories that are not in cart
            const recommended = productsStore.allProducts
                .filter(product => 
                    cartCategories.includes(product.category) && 
                    !cartProductIds.includes(product.id)
                )
                .slice(0, 4);

            return recommended;
        }
    }
});
