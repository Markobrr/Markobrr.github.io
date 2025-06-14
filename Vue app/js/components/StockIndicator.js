// Stock Indicator Component
const StockIndicator = {
    props: {
        stock: {
            type: Number,
            required: true
        },
        lowStockThreshold: {
            type: Number,
            default: 5
        },
        showExactCount: {
            type: Boolean,
            default: true
        },
        size: {
            type: String,
            default: 'normal', // 'small', 'normal', 'large'
            validator: (value) => ['small', 'normal', 'large'].includes(value)
        }
    },

    template: `
        <div 
            class="stock-indicator"
            :class="[stockStatusClass, sizeClass]"
            v-if="shouldShowIndicator"
        >
            <div class="stock-content">
                <i :class="stockIcon"></i>
                <span class="stock-text">{{ stockText }}</span>
                <div class="stock-bar" v-if="showStockBar">
                    <div 
                        class="stock-fill"
                        :style="{ width: stockPercentage + '%' }"
                    ></div>
                </div>
            </div>
            
            <!-- Pulse animation for very low stock -->
            <div class="stock-pulse" v-if="isVeryLowStock"></div>
        </div>
    `,

    setup(props) {
        const { computed } = Vue;

        // Computed properties
        const stockStatus = computed(() => {
            if (props.stock <= 0) return 'out-of-stock';
            if (props.stock <= 2) return 'very-low';
            if (props.stock <= props.lowStockThreshold) return 'low';
            return 'in-stock';
        });

        const stockStatusClass = computed(() => {
            return `stock-${stockStatus.value}`;
        });

        const sizeClass = computed(() => {
            return `stock-${props.size}`;
        });

        const shouldShowIndicator = computed(() => {
            // Always show if out of stock or low stock
            return props.stock <= props.lowStockThreshold || props.stock <= 0;
        });

        const isVeryLowStock = computed(() => {
            return props.stock > 0 && props.stock <= 2;
        });

        const showStockBar = computed(() => {
            return props.stock > 0 && props.stock <= props.lowStockThreshold;
        });

        const stockPercentage = computed(() => {
            if (props.stock <= 0) return 0;
            return Math.min(100, (props.stock / props.lowStockThreshold) * 100);
        });

        const stockIcon = computed(() => {
            switch (stockStatus.value) {
                case 'out-of-stock':
                    return 'fas fa-times-circle';
                case 'very-low':
                    return 'fas fa-exclamation-triangle';
                case 'low':
                    return 'fas fa-exclamation-circle';
                default:
                    return 'fas fa-check-circle';
            }
        });

        const stockText = computed(() => {
            switch (stockStatus.value) {
                case 'out-of-stock':
                    return 'Rasprodano';
                case 'very-low':
                    return props.showExactCount 
                        ? `Samo ${props.stock} ostalo!` 
                        : 'Vrlo malo ostalo!';
                case 'low':
                    return props.showExactCount 
                        ? `${props.stock} ostalo` 
                        : 'Malo ostalo';
                default:
                    return 'Na stanju';
            }
        });

        return {
            stockStatus,
            stockStatusClass,
            sizeClass,
            shouldShowIndicator,
            isVeryLowStock,
            showStockBar,
            stockPercentage,
            stockIcon,
            stockText
        };
    }
};
