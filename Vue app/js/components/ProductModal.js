// ProductModal Component
const ProductModal = {
    template: `
        <div class="modal-overlay" :class="{ 'active': isOpen }" @click="closeModal">
            <div class="product-modal" :class="{ 'open': isOpen }" @click.stop v-if="product">
                <!-- Modal Header -->
                <div class="modal-header">
                    <h3 class="modal-title">{{ product.title }}</h3>
                    <button class="close-modal-btn" @click="closeModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Modal Content -->
                <div class="modal-content">
                    <div class="modal-grid">
                        <!-- Product Image -->
                        <div class="modal-image-section">
                            <div class="modal-image-container">
                                <img :src="product.image" :alt="product.title" class="modal-image">
                                <div class="product-badge" v-if="productBadge">
                                    <span class="badge" :class="'badge-' + productBadge.type">
                                        {{ productBadge.text }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Product Details -->
                        <div class="modal-details-section">
                            <div class="product-brand">{{ product.brand }}</div>
                            <h2 class="product-title">{{ product.title }}</h2>
                            
                            <!-- Price -->
                            <div class="product-price">
                                <span class="current-price">{{ product.currentPrice }}</span>
                                <span class="old-price" v-if="product.oldPrice">{{ product.oldPrice }}</span>
                                <span class="discount" v-if="discountPercentage > 0">
                                    -{{ discountPercentage }}%
                                </span>
                            </div>

                            <!-- Description -->
                            <div class="product-description">
                                <p>{{ product.description }}</p>
                            </div>

                            <!-- Specifications -->
                            <div class="product-specs" v-if="product.specs">
                                <h4>Specifikacije:</h4>
                                <ul class="specs-list">
                                    <li v-for="spec in product.specs" :key="spec">
                                        <i class="fas fa-check"></i>
                                        {{ spec }}
                                    </li>
                                </ul>
                            </div>

                            <!-- Stock Status -->
                            <div class="stock-status" :class="{ 'in-stock': product.inStock, 'out-of-stock': !product.inStock }">
                                <i :class="product.inStock ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                                {{ product.inStock ? 'Na skladištu' : 'Nema na skladištu' }}
                            </div>

                            <!-- Actions -->
                            <div class="modal-actions">
                                <div class="quantity-selector">
                                    <label>Količina:</label>
                                    <div class="quantity-controls">
                                        <button 
                                            class="quantity-btn"
                                            @click="decreaseQuantity"
                                            :disabled="selectedQuantity <= 1"
                                        >
                                            <i class="fas fa-minus"></i>
                                        </button>
                                        <span class="quantity">{{ selectedQuantity }}</span>
                                        <button 
                                            class="quantity-btn"
                                            @click="increaseQuantity"
                                        >
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>

                                <button 
                                    class="btn btn-primary btn-lg add-to-cart-btn"
                                    @click="handleAddToCart"
                                    :disabled="!product.inStock"
                                >
                                    <i class="fas fa-shopping-cart"></i>
                                    Dodaj u košaricu ({{ selectedQuantity }})
                                </button>

                                <button 
                                    class="btn btn-outline wishlist-btn"
                                    @click="toggleWishlist"
                                    :class="{ 'active': isInWishlist }"
                                >
                                    <i :class="isInWishlist ? 'fas fa-heart' : 'far fa-heart'"></i>
                                    {{ isInWishlist ? 'U listi želja' : 'Dodaj u listu želja' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    setup() {
        const { ref, computed } = Vue;
        const uiStore = useUIStore();
        const { addToCart, isInCart } = useCart();
        const { getDiscountPercentage, getProductBadge } = useProducts();
        const { success } = useNotifications();

        // Reactive state
        const selectedQuantity = ref(1);
        const isInWishlist = ref(false);

        // Computed properties
        const isOpen = computed(() => uiStore.isProductModalOpen);
        const product = computed(() => uiStore.currentModalProduct);
        const discountPercentage = computed(() => {
            if (!product.value) return 0;
            return getDiscountPercentage(product.value.currentPrice, product.value.oldPrice);
        });
        const productBadge = computed(() => {
            if (!product.value) return null;
            return getProductBadge(product.value);
        });

        // Methods
        const closeModal = () => {
            uiStore.closeProductModal();
            selectedQuantity.value = 1;
        };

        const increaseQuantity = () => {
            selectedQuantity.value++;
        };

        const decreaseQuantity = () => {
            if (selectedQuantity.value > 1) {
                selectedQuantity.value--;
            }
        };

        const handleAddToCart = () => {
            if (product.value) {
                addToCart(product.value, selectedQuantity.value);
                closeModal();
            }
        };

        const toggleWishlist = () => {
            isInWishlist.value = !isInWishlist.value;
            
            if (isInWishlist.value) {
                success('Dodano u listu želja', `${product.value.title} je dodan u listu želja`);
            } else {
                success('Uklonjeno iz liste želja', `${product.value.title} je uklonjen iz liste želja`);
            }
        };

        return {
            // State
            selectedQuantity,
            isInWishlist,

            // Computed
            isOpen,
            product,
            discountPercentage,
            productBadge,

            // Methods
            closeModal,
            increaseQuantity,
            decreaseQuantity,
            handleAddToCart,
            toggleWishlist
        };
    }
};
