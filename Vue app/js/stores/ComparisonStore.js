// Comparison Store - Global state management for product comparison
class ComparisonStore {
    constructor() {
        this.items = new Set();
        this.maxItems = 3; // Maximum products to compare
        this.listeners = new Set();
        this.storageKey = 'neogears-comparison';
        
        // Load from sessionStorage (comparison is session-based)
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
            totalItems: this.items.size,
            canAddMore: this.items.size < this.maxItems
        });

        // Update reactive state when items change
        this.updateReactiveState();
    }

    // Update reactive state
    updateReactiveState() {
        this.state.items = Array.from(this.items);
        this.state.totalItems = this.items.size;
        this.state.canAddMore = this.items.size < this.maxItems;
    }

    // Add item to comparison
    addItem(productId) {
        if (!productId) return { success: false, reason: 'invalid_id' };

        // Check if already in comparison
        if (this.items.has(productId)) {
            return { success: false, reason: 'already_added' };
        }

        // Check if maximum reached
        if (this.items.size >= this.maxItems) {
            return { success: false, reason: 'max_reached', maxItems: this.maxItems };
        }

        this.items.add(productId);
        this.updateReactiveState();
        this.saveToStorage();
        this.notifyListeners('add', productId);
        
        // Dispatch custom event
        this.dispatchEvent('comparison:add', { productId });

        return { success: true };
    }

    // Remove item from comparison
    removeItem(productId) {
        if (!productId) return false;

        const wasRemoved = this.items.has(productId);
        this.items.delete(productId);
        
        if (wasRemoved) {
            this.updateReactiveState();
            this.saveToStorage();
            this.notifyListeners('remove', productId);
            
            // Dispatch custom event
            this.dispatchEvent('comparison:remove', { productId });
        }

        return wasRemoved;
    }

    // Toggle item in comparison
    toggleItem(productId) {
        if (this.isInComparison(productId)) {
            return { action: 'remove', success: this.removeItem(productId) };
        } else {
            const result = this.addItem(productId);
            return { action: 'add', ...result };
        }
    }

    // Check if item is in comparison
    isInComparison(productId) {
        return this.items.has(productId);
    }

    // Get all comparison items
    getItems() {
        return Array.from(this.items);
    }

    // Get comparison items with product details
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
            this.dispatchEvent('comparison:clear', { itemCount });
        }

        return itemCount;
    }

    // Get total items count
    get totalItems() {
        return this.items.size;
    }

    // Check if comparison is empty
    get isEmpty() {
        return this.items.size === 0;
    }

    // Check if can add more items
    get canAddMore() {
        return this.items.size < this.maxItems;
    }

    // Get remaining slots
    get remainingSlots() {
        return this.maxItems - this.items.size;
    }

    // Save to sessionStorage (comparison is session-based)
    saveToStorage() {
        try {
            const data = {
                items: Array.from(this.items),
                timestamp: Date.now()
            };
            sessionStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save comparison to storage:', error);
        }
    }

    // Load from sessionStorage
    loadFromStorage() {
        try {
            const stored = sessionStorage.getItem(this.storageKey);
            if (stored) {
                const data = JSON.parse(stored);
                if (data.items && Array.isArray(data.items)) {
                    // Only keep items up to maxItems limit
                    this.items = new Set(data.items.slice(0, this.maxItems));
                }
            }
        } catch (error) {
            console.error('Failed to load comparison from storage:', error);
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
                    canAddMore: this.canAddMore,
                    remainingSlots: this.remainingSlots,
                    items: this.getItems()
                });
            } catch (error) {
                console.error('Comparison listener error:', error);
            }
        });
    }

    // Dispatch custom DOM event
    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(eventName, {
            detail: {
                ...detail,
                totalItems: this.totalItems,
                canAddMore: this.canAddMore,
                remainingSlots: this.remainingSlots,
                items: this.getItems()
            }
        });
        window.dispatchEvent(event);
    }

    // Get comparison statistics
    getStats() {
        const items = this.getItemsWithDetails();
        const categories = {};
        const brands = {};
        const priceRange = { min: Infinity, max: -Infinity };
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

            // Calculate price range and total
            if (product.currentPrice) {
                const price = parseFloat(product.currentPrice.replace(/[^\d,]/g, '').replace(',', '.'));
                if (!isNaN(price)) {
                    totalValue += price;
                    priceRange.min = Math.min(priceRange.min, price);
                    priceRange.max = Math.max(priceRange.max, price);
                }
            }
        });

        // Reset price range if no valid prices
        if (priceRange.min === Infinity) {
            priceRange.min = 0;
            priceRange.max = 0;
        }

        return {
            totalItems: this.totalItems,
            maxItems: this.maxItems,
            remainingSlots: this.remainingSlots,
            totalValue: totalValue.toFixed(2),
            priceRange,
            categories,
            brands,
            items
        };
    }

    // Export comparison data
    exportData() {
        return {
            items: this.getItems(),
            itemsWithDetails: this.getItemsWithDetails(),
            stats: this.getStats(),
            exportDate: new Date().toISOString()
        };
    }

    // Get comparison summary for sharing
    getShareSummary() {
        const items = this.getItemsWithDetails();
        const summary = {
            count: items.length,
            products: items.map(p => ({
                title: p.title,
                brand: p.brand,
                price: p.currentPrice
            })),
            url: window.location.href
        };

        return summary;
    }
}

// Create global comparison store instance
if (typeof window !== 'undefined') {
    window.comparisonStore = new ComparisonStore();
    
    // Add to global scope for debugging
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.debugComparison = window.comparisonStore;
    }
}
