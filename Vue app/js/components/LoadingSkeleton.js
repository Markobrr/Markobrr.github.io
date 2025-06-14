// Loading Skeleton Component
const LoadingSkeleton = {
    props: {
        type: {
            type: String,
            default: 'product',
            validator: value => ['product', 'category', 'cart-item', 'text', 'image'].includes(value)
        },
        count: {
            type: Number,
            default: 1
        },
        height: {
            type: String,
            default: null
        },
        width: {
            type: String,
            default: null
        }
    },

    template: `
        <div class="skeleton-container">
            <!-- Product Card Skeleton -->
            <div v-if="type === 'product'" v-for="n in count" :key="'product-' + n" class="skeleton-product-card">
                <div class="skeleton-image"></div>
                <div class="skeleton-content">
                    <div class="skeleton-line skeleton-title"></div>
                    <div class="skeleton-line skeleton-brand"></div>
                    <div class="skeleton-line skeleton-price"></div>
                    <div class="skeleton-button"></div>
                </div>
            </div>

            <!-- Category Card Skeleton -->
            <div v-else-if="type === 'category'" v-for="n in count" :key="'category-' + n" class="skeleton-category-card">
                <div class="skeleton-category-icon"></div>
                <div class="skeleton-line skeleton-category-name"></div>
                <div class="skeleton-line skeleton-category-count"></div>
            </div>

            <!-- Cart Item Skeleton -->
            <div v-else-if="type === 'cart-item'" v-for="n in count" :key="'cart-item-' + n" class="skeleton-cart-item">
                <div class="skeleton-cart-image"></div>
                <div class="skeleton-cart-content">
                    <div class="skeleton-line skeleton-cart-title"></div>
                    <div class="skeleton-line skeleton-cart-brand"></div>
                    <div class="skeleton-line skeleton-cart-category"></div>
                </div>
                <div class="skeleton-cart-price"></div>
                <div class="skeleton-cart-quantity"></div>
                <div class="skeleton-cart-total"></div>
                <div class="skeleton-cart-remove"></div>
            </div>

            <!-- Text Skeleton -->
            <div v-else-if="type === 'text'" v-for="n in count" :key="'text-' + n"
                 class="skeleton-line"
                 :style="{ height: height || '1rem', width: width || '100%' }">
            </div>

            <!-- Image Skeleton -->
            <div v-else-if="type === 'image'" v-for="n in count" :key="'image-' + n"
                 class="skeleton-image"
                 :style="{ height: height || '200px', width: width || '100%' }">
            </div>
        </div>
    `,

    setup() {
        return {};
    }
};
