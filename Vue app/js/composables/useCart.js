// useCart Composable
function useCart() {
    const { computed, ref } = Vue;
    const cartStore = useCartStore();

    // Computed properties
    const cartItems = computed(() => cartStore.cartItems);
    const totalItems = computed(() => cartStore.totalItems);
    const totalPrice = computed(() => cartStore.totalPrice);
    const formattedTotalPrice = computed(() => cartStore.formattedTotalPrice);
    const totalSavings = computed(() => cartStore.totalSavings);
    const formattedTotalSavings = computed(() => cartStore.formattedTotalSavings);
    const isEmpty = computed(() => cartStore.isEmpty);
    const isOpen = computed(() => cartStore.isOpen);
    const isLoading = computed(() => cartStore.loading);

    // Cart methods
    const addToCart = (product, quantity = 1) => {
        cartStore.addToCart(product, quantity);
    };

    const removeFromCart = (productId) => {
        cartStore.removeFromCart(productId);
    };

    const updateQuantity = (productId, quantity) => {
        cartStore.updateQuantity(productId, quantity);
    };

    const increaseQuantity = (productId) => {
        cartStore.increaseQuantity(productId);
    };

    const decreaseQuantity = (productId) => {
        cartStore.decreaseQuantity(productId);
    };

    const clearCart = () => {
        cartStore.clearCart();
    };

    const toggleCart = () => {
        cartStore.toggleCart();
    };

    const openCart = () => {
        cartStore.openCart();
    };

    const closeCart = () => {
        cartStore.closeCart();
    };

    // Utility methods
    const isInCart = (productId) => {
        return cartStore.isInCart(productId);
    };

    const getItemQuantity = (productId) => {
        return cartStore.getItemQuantity(productId);
    };

    const getCartItem = (productId) => {
        return cartStore.getCartItem(productId);
    };

    // Quick add with animation feedback
    const quickAddToCart = (product, buttonElement = null) => {
        cartStore.quickAddToCart(product);
        
        // Add visual feedback if button element is provided
        if (buttonElement) {
            buttonElement.classList.add('btn-success');
            buttonElement.innerHTML = '<i class="fas fa-check"></i> Dodano!';
            
            setTimeout(() => {
                buttonElement.classList.remove('btn-success');
                buttonElement.innerHTML = '<i class="fas fa-shopping-cart"></i> Dodaj u košaricu';
            }, 1500);
        }
    };

    // Add to cart with quantity selector
    const addToCartWithQuantity = (product, quantity) => {
        if (quantity <= 0) return;
        addToCart(product, quantity);
    };

    // Batch operations
    const addMultipleItems = (items) => {
        cartStore.addMultipleItems(items);
    };

    // Cart summary for checkout
    const getCartSummary = () => {
        return cartStore.getCartSummary();
    };

    // Checkout process
    const checkout = async () => {
        return await cartStore.checkout();
    };

    // Format item price
    const formatItemPrice = (item) => {
        const price = parseFloat(item.product.currentPrice.replace(/[^\d,]/g, '').replace(',', '.'));
        return new Intl.NumberFormat('hr-HR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
        }).format(price);
    };

    // Calculate item total
    const getItemTotal = (item) => {
        const price = parseFloat(item.product.currentPrice.replace(/[^\d,]/g, '').replace(',', '.'));
        return price * item.quantity;
    };

    // Format item total
    const formatItemTotal = (item) => {
        const total = getItemTotal(item);
        return new Intl.NumberFormat('hr-HR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
        }).format(total);
    };

    // Calculate item savings
    const getItemSavings = (item) => {
        if (!item.product.oldPrice || item.product.oldPrice === '') return 0;
        
        const currentPrice = parseFloat(item.product.currentPrice.replace(/[^\d,]/g, '').replace(',', '.'));
        const oldPrice = parseFloat(item.product.oldPrice.replace(/[^\d,]/g, '').replace(',', '.'));
        
        return (oldPrice - currentPrice) * item.quantity;
    };

    // Format item savings
    const formatItemSavings = (item) => {
        const savings = getItemSavings(item);
        return new Intl.NumberFormat('hr-HR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
        }).format(savings);
    };

    // Check if item is on sale
    const isItemOnSale = (item) => {
        return item.product.oldPrice && item.product.oldPrice !== '';
    };

    // Get recommended products based on cart
    const getRecommendedProducts = () => {
        return cartStore.getRecommendedProducts();
    };

    // Cart validation
    const validateCart = () => {
        const errors = [];
        
        if (isEmpty.value) {
            errors.push('Košarica je prazna');
        }
        
        cartItems.value.forEach(item => {
            if (!item.product.inStock) {
                errors.push(`${item.product.title} nije dostupan`);
            }
            
            if (item.quantity <= 0) {
                errors.push(`Neispravna količina za ${item.product.title}`);
            }
        });
        
        return {
            isValid: errors.length === 0,
            errors
        };
    };

    // Initialize cart
    const initializeCart = () => {
        cartStore.initializeCart();
    };

    // Cart statistics
    const getCartStats = computed(() => {
        const stats = {
            totalItems: totalItems.value,
            totalPrice: totalPrice.value,
            totalSavings: totalSavings.value,
            averageItemPrice: totalItems.value > 0 ? totalPrice.value / totalItems.value : 0,
            categoriesCount: new Set(cartItems.value.map(item => item.product.category)).size,
            brandsCount: new Set(cartItems.value.map(item => item.product.brand)).size,
            itemsOnSale: cartItems.value.filter(item => isItemOnSale(item)).length
        };
        
        return stats;
    });

    // Cart actions with confirmation
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

    // Cart persistence
    const exportCart = () => {
        const cartData = {
            items: cartItems.value,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };
        
        return JSON.stringify(cartData, null, 2);
    };

    const importCart = (cartDataString) => {
        try {
            const cartData = JSON.parse(cartDataString);
            
            if (cartData.items && Array.isArray(cartData.items)) {
                cartStore.items = cartData.items;
                cartStore.saveCart();
                return { success: true };
            } else {
                return { success: false, error: 'Neispravni podaci košarice' };
            }
        } catch (error) {
            return { success: false, error: 'Greška pri učitavanju košarice' };
        }
    };

    // Return all methods and computed properties
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
        getCartStats,

        // Methods
        addToCart,
        removeFromCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        isInCart,
        getItemQuantity,
        getCartItem,
        quickAddToCart,
        addToCartWithQuantity,
        addMultipleItems,
        getCartSummary,
        checkout,
        formatItemPrice,
        getItemTotal,
        formatItemTotal,
        getItemSavings,
        formatItemSavings,
        isItemOnSale,
        getRecommendedProducts,
        validateCart,
        initializeCart,
        clearCartWithConfirmation,
        removeItemWithConfirmation,
        exportCart,
        importCart
    };
}
