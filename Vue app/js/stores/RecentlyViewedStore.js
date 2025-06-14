// Recently Viewed Store - Global state management for recently viewed products
class RecentlyViewedStore {
    constructor() {
        this.items = new Map(); // Map of productId -> { productId, viewedAt, viewCount }
        this.maxItems = 20; // Maximum items to keep
        this.listeners = new Set();
        this.storageKey = 'neogears-recently-viewed';
        
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
            items: Array.from(this.items.values()),
            totalItems: this.items.size
        });

        // Update reactive state when items change
        this.updateReactiveState();
    }

    // Update reactive state
    updateReactiveState() {
        this.state.items = Array.from(this.items.values()).sort((a, b) => b.viewedAt - a.viewedAt);
        this.state.totalItems = this.items.size;
    }

    // Add item to recently viewed
    addItem(productId) {
        if (!productId) return false;

        const now = Date.now();
        const existing = this.items.get(productId);

        if (existing) {
            // Update existing item
            existing.viewedAt = now;
            existing.viewCount = (existing.viewCount || 1) + 1;
        } else {
            // Add new item
            this.items.set(productId, {
                productId,
                viewedAt: now,
                viewCount: 1
            });
        }

        // Remove oldest items if exceeding max
        this.enforceMaxItems();
        
        this.updateReactiveState();
        this.saveToStorage();
        this.notifyListeners('add', productId);
        
        // Dispatch custom event
        this.dispatchEvent('recently-viewed:add', { productId });

        return true;
    }

    // Remove item from recently viewed
    removeItem(productId) {
        if (!productId) return false;

        const wasRemoved = this.items.has(productId);
        this.items.delete(productId);
        
        if (wasRemoved) {
            this.updateReactiveState();
            this.saveToStorage();
            this.notifyListeners('remove', productId);
            
            // Dispatch custom event
            this.dispatchEvent('recently-viewed:remove', { productId });
        }

        return wasRemoved;
    }

    // Check if item is in recently viewed
    hasItem(productId) {
        return this.items.has(productId);
    }

    // Get all recently viewed items (sorted by most recent)
    getItems() {
        return Array.from(this.items.values()).sort((a, b) => b.viewedAt - a.viewedAt);
    }

    // Get recently viewed items with product details
    getItemsWithDetails() {
        if (!window.getAllProducts) return [];

        const allProducts = window.getAllProducts();
        const recentItems = this.getItems();
        
        return recentItems
            .map(item => {
                const product = allProducts.find(p => p.id === item.productId);
                if (product) {
                    return {
                        ...product,
                        viewedAt: item.viewedAt,
                        viewCount: item.viewCount
                    };
                }
                return null;
            })
            .filter(Boolean);
    }

    // Get recently viewed items by category
    getItemsByCategory(category) {
        const itemsWithDetails = this.getItemsWithDetails();
        return itemsWithDetails.filter(item => item.category === category);
    }

    // Get recently viewed items by brand
    getItemsByBrand(brand) {
        const itemsWithDetails = this.getItemsWithDetails();
        return itemsWithDetails.filter(item => item.brand === brand);
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
            this.dispatchEvent('recently-viewed:clear', { itemCount });
        }

        return itemCount;
    }

    // Clear old items (older than specified days)
    clearOldItems(daysOld = 30) {
        const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
        let removedCount = 0;

        for (const [productId, item] of this.items) {
            if (item.viewedAt < cutoffTime) {
                this.items.delete(productId);
                removedCount++;
            }
        }

        if (removedCount > 0) {
            this.updateReactiveState();
            this.saveToStorage();
            this.notifyListeners('cleanup', null, { removedCount });
        }

        return removedCount;
    }

    // Enforce maximum items limit
    enforceMaxItems() {
        if (this.items.size <= this.maxItems) return;

        // Sort by viewedAt and remove oldest
        const sortedItems = Array.from(this.items.entries())
            .sort(([, a], [, b]) => b.viewedAt - a.viewedAt);

        // Keep only the most recent maxItems
        const itemsToKeep = sortedItems.slice(0, this.maxItems);
        
        this.items.clear();
        itemsToKeep.forEach(([productId, item]) => {
            this.items.set(productId, item);
        });
    }

    // Get total items count
    get totalItems() {
        return this.items.size;
    }

    // Check if recently viewed is empty
    get isEmpty() {
        return this.items.size === 0;
    }

    // Save to localStorage
    saveToStorage() {
        try {
            const data = {
                items: Array.from(this.items.entries()),
                timestamp: Date.now()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save recently viewed to storage:', error);
        }
    }

    // Load from localStorage
    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const data = JSON.parse(stored);
                if (data.items && Array.isArray(data.items)) {
                    this.items = new Map(data.items);
                    
                    // Clean up old items on load
                    this.clearOldItems();
                    this.enforceMaxItems();
                }
            }
        } catch (error) {
            console.error('Failed to load recently viewed from storage:', error);
            this.items = new Map();
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
    notifyListeners(action, productId = null, extra = {}) {
        this.listeners.forEach(callback => {
            try {
                callback({
                    action,
                    productId,
                    totalItems: this.totalItems,
                    items: this.getItems(),
                    ...extra
                });
            } catch (error) {
                console.error('Recently viewed listener error:', error);
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

    // Get recently viewed statistics
    getStats() {
        const items = this.getItemsWithDetails();
        const categories = {};
        const brands = {};
        const viewCounts = items.map(item => item.viewCount || 1);
        
        let totalViews = 0;
        let oldestView = Date.now();
        let newestView = 0;

        items.forEach(item => {
            // Count by category
            if (item.category) {
                categories[item.category] = (categories[item.category] || 0) + 1;
            }

            // Count by brand
            if (item.brand) {
                brands[item.brand] = (brands[item.brand] || 0) + 1;
            }

            // Track view statistics
            totalViews += item.viewCount || 1;
            oldestView = Math.min(oldestView, item.viewedAt);
            newestView = Math.max(newestView, item.viewedAt);
        });

        return {
            totalItems: this.totalItems,
            totalViews,
            averageViews: totalViews / Math.max(this.totalItems, 1),
            oldestView: oldestView === Date.now() ? null : oldestView,
            newestView: newestView || null,
            categories,
            brands,
            items
        };
    }

    // Export recently viewed data
    exportData() {
        return {
            items: this.getItems(),
            itemsWithDetails: this.getItemsWithDetails(),
            stats: this.getStats(),
            exportDate: new Date().toISOString()
        };
    }

    // Get most viewed products
    getMostViewed(limit = 5) {
        return this.getItemsWithDetails()
            .sort((a, b) => (b.viewCount || 1) - (a.viewCount || 1))
            .slice(0, limit);
    }

    // Get recently viewed by time period
    getItemsByTimePeriod(hours = 24) {
        const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
        return this.getItemsWithDetails()
            .filter(item => item.viewedAt >= cutoffTime);
    }
}

// Create global recently viewed store instance
if (typeof window !== 'undefined') {
    window.recentlyViewedStore = new RecentlyViewedStore();
    
    // Add to global scope for debugging
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.debugRecentlyViewed = window.recentlyViewedStore;
    }
}
