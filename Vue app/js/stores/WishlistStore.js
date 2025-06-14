// Wishlist Store - Global state management for favorites
class WishlistStore {
    constructor() {
        this.items = new Set();
        this.listeners = new Set();
        this.storageKey = 'neogears-wishlist';
        
        // Load from localStorage
        this.loadFromStorage();
        
        // Make reactive
        this.makeReactive();
    }

    // Make the store reactive
    makeReactive() {
        const { reactive } = Vue;
        
        // Create reactive state
        this.state = reactive({
            items: Array.from(this.items),
            totalItems: this.items.size
        });

        // Update reactive state when items change
        this.updateReactiveState();
    }

    // Update reactive state
    updateReactiveState() {
        this.state.items = Array.from(this.items);
        this.state.totalItems = this.items.size;
    }

    // Add item to wishlist
    addItem(productId) {
        if (!productId) return false;

        const wasAdded = !this.items.has(productId);
        this.items.add(productId);
        
        if (wasAdded) {
            this.updateReactiveState();
            this.saveToStorage();
            this.notifyListeners('add', productId);
            
            // Dispatch custom event
            this.dispatchEvent('wishlist:add', { productId });
        }

        return wasAdded;
    }

    // Remove item from wishlist
    removeItem(productId) {
        if (!productId) return false;

        const wasRemoved = this.items.has(productId);
        this.items.delete(productId);
        
        if (wasRemoved) {
            this.updateReactiveState();
            this.saveToStorage();
            this.notifyListeners('remove', productId);
            
            // Dispatch custom event
            this.dispatchEvent('wishlist:remove', { productId });
        }

        return wasRemoved;
    }

    // Toggle item in wishlist
    toggleItem(productId) {
        if (this.isFavorite(productId)) {
            return this.removeItem(productId);
        } else {
            return this.addItem(productId);
        }
    }

    // Check if item is in wishlist
    isFavorite(productId) {
        return this.items.has(productId);
    }

    // Get all wishlist items
    getItems() {
        return Array.from(this.items);
    }

    // Get wishlist items with product details
    getItemsWithDetails() {
        if (!window.getAllProducts) return [];

        const allProducts = window.getAllProducts();
        return this.getItems()
            .map(productId => allProducts.find(p => p.id === productId))
            .filter(Boolean);
    }

    // Clear all items
    clearAll() {
        const itemCount = this.items.size;
        this.items.clear();
        
        if (itemCount > 0) {
            this.updateReactiveState();
            this.saveToStorage();
            this.notifyListeners('clear');
            
            // Dispatch custom event
            this.dispatchEvent('wishlist:clear', { itemCount });
        }

        return itemCount;
    }

    // Get total items count
    get totalItems() {
        return this.items.size;
    }

    // Check if wishlist is empty
    get isEmpty() {
        return this.items.size === 0;
    }

    // Save to localStorage
    saveToStorage() {
        try {
            const data = {
                items: Array.from(this.items),
                timestamp: Date.now()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save wishlist to storage:', error);
        }
    }

    // Load from localStorage
    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const data = JSON.parse(stored);
                if (data.items && Array.isArray(data.items)) {
                    this.items = new Set(data.items);
                }
            }
        } catch (error) {
            console.error('Failed to load wishlist from storage:', error);
            this.items = new Set();
        }
    }

    // Add event listener
    addListener(callback) {
        this.listeners.add(callback);
        
        // Return unsubscribe function
        return () => {
            this.listeners.delete(callback);
        };
    }

    // Notify all listeners
    notifyListeners(action, productId = null) {
        this.listeners.forEach(callback => {
            try {
                callback({
                    action,
                    productId,
                    totalItems: this.totalItems,
                    items: this.getItems()
                });
            } catch (error) {
                console.error('Wishlist listener error:', error);
            }
        });
    }

    // Dispatch custom DOM event
    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(eventName, {
            detail: {
                ...detail,
                totalItems: this.totalItems,
                items: this.getItems()
            }
        });
        window.dispatchEvent(event);
    }

    // Get wishlist statistics
    getStats() {
        const items = this.getItemsWithDetails();
        const categories = {};
        const brands = {};
        let totalValue = 0;

        items.forEach(product => {
            // Count by category
            if (product.category) {
                categories[product.category] = (categories[product.category] || 0) + 1;
            }

            // Count by brand
            if (product.brand) {
                brands[product.brand] = (brands[product.brand] || 0) + 1;
            }

            // Calculate total value
            if (product.currentPrice) {
                const price = parseFloat(product.currentPrice.replace(/[^\d,]/g, '').replace(',', '.'));
                if (!isNaN(price)) {
                    totalValue += price;
                }
            }
        });

        return {
            totalItems: this.totalItems,
            totalValue: totalValue.toFixed(2),
            categories,
            brands,
            items
        };
    }

    // Export wishlist data
    exportData() {
        return {
            items: this.getItems(),
            itemsWithDetails: this.getItemsWithDetails(),
            stats: this.getStats(),
            exportDate: new Date().toISOString()
        };
    }

    // Import wishlist data
    importData(data) {
        if (!data || !Array.isArray(data.items)) {
            throw new Error('Invalid wishlist data format');
        }

        this.items = new Set(data.items);
        this.updateReactiveState();
        this.saveToStorage();
        this.notifyListeners('import');
        
        return this.totalItems;
    }
}

// Create global wishlist store instance
if (typeof window !== 'undefined') {
    window.wishlistStore = new WishlistStore();
    
    // Add to global scope for debugging
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.debugWishlist = window.wishlistStore;
    }
}
