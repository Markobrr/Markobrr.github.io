// ProductCard Component
const ProductCard = {
    props: {
        product: {
            type: Object,
            required: true
        },
        showQuickView: {
            type: Boolean,
            default: true
        },
        compact: {
            type: Boolean,
            default: false
        }
    },

    template: `
        <div class="product-card" :class="{ compact, 'out-of-stock': !product.inStock }">
            <!-- Product Badge -->
            <div class="product-badge" v-if="productBadge">
                <span class="badge" :class="'badge-' + productBadge.type">
                    {{ productBadge.text }}
                </span>
            </div>

            <!-- Product Image -->
            <div class="product-image-container" @click="openProductModal">
                <img 
                    :src="product.image" 
                    :alt="product.title"
                    class="product-image"
                    @error="handleImageError"
                    loading="lazy"
                >
                <div class="image-overlay">
                    <button class="quick-view-btn" v-if="showQuickView" @click.stop="openProductModal">
                        <i class="fas fa-eye"></i>
                        Brzi pregled
                    </button>
                </div>
            </div>

            <!-- Product Info -->
            <div class="product-info">
                <!-- Brand -->
                <div class="product-brand">{{ product.brand }}</div>
                
                <!-- Title -->
                <h3 class="product-title" @click="openProductModal">{{ product.title }}</h3>
                
                <!-- Specs (if not compact) -->
                <div class="product-specs" v-if="!compact && product.specs">
                    <span 
                        v-for="(spec, index) in product.specs.slice(0, 2)" 
                        :key="index"
                        class="spec-item"
                    >
                        {{ spec }}
                    </span>
                </div>

                <!-- Price -->
                <div class="product-price">
                    <span class="current-price">{{ product.currentPrice }}</span>
                    <span class="old-price" v-if="product.oldPrice">{{ product.oldPrice }}</span>
                    <span class="discount" v-if="discountPercentage > 0">
                        -{{ discountPercentage }}%
                    </span>
                </div>

                <!-- Stock Status -->
                <div class="stock-status" :class="{ 'in-stock': product.inStock, 'out-of-stock': !product.inStock }">
                    <i :class="product.inStock ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                    {{ product.inStock ? 'Na skladištu' : 'Nema na skladištu' }}
                </div>

                <!-- Actions -->
                <div class="product-actions">
                    <button 
                        class="btn btn-primary add-to-cart-btn"
                        :class="{ 'btn-success': isInCart }"
                        @click="handleAddToCart"
                        :disabled="!product.inStock"
                        ref="addToCartBtn"
                    >
                        <i :class="isInCart ? 'fas fa-check' : 'fas fa-shopping-cart'"></i>
                        {{ isInCart ? 'U košarici' : 'Dodaj u košaricu' }}
                    </button>
                    
                    <button 
                        class="btn btn-outline wishlist-btn"
                        @click="toggleWishlist"
                        :class="{ 'active': isInWishlist }"
                        :title="isInWishlist ? 'Ukloni iz liste želja' : 'Dodaj u listu želja'"
                    >
                        <i :class="isInWishlist ? 'fas fa-heart' : 'far fa-heart'"></i>
                    </button>
                </div>
            </div>
        </div>
    `,

    setup(props) {
        const { computed, ref } = Vue;
        const uiStore = useUIStore();
        const { addToCart, isInCart: checkIsInCart } = useCart();
        const { getDiscountPercentage, getProductBadge } = useProducts();
        const { success, error } = useNotifications();

        // Refs
        const addToCartBtn = ref(null);
        const isInWishlist = ref(false);

        // Computed properties
        const isInCart = computed(() => checkIsInCart(props.product.id));
        const discountPercentage = computed(() => 
            getDiscountPercentage(props.product.currentPrice, props.product.oldPrice)
        );
        const productBadge = computed(() => getProductBadge(props.product));

        // Methods
        const openProductModal = () => {
            uiStore.openProductModal(props.product);
        };

        const handleAddToCart = () => {
            if (!props.product.inStock) {
                error('Proizvod nije dostupan', 'Ovaj proizvod trenutno nije na skladištu');
                return;
            }

            if (isInCart.value) {
                // If already in cart, open cart sidebar
                const cartStore = useCartStore();
                cartStore.openCart();
                return;
            }

            // Add to cart with visual feedback
            addToCart(props.product, 1);
            
            // Visual feedback on button
            if (addToCartBtn.value) {
                const btn = addToCartBtn.value;
                const originalContent = btn.innerHTML;
                
                btn.classList.add('btn-success');
                btn.innerHTML = '<i class="fas fa-check"></i> Dodano!';
                
                setTimeout(() => {
                    btn.classList.remove('btn-success');
                    btn.innerHTML = originalContent;
                }, 1500);
            }
        };

        const toggleWishlist = () => {
            isInWishlist.value = !isInWishlist.value;
            
            if (isInWishlist.value) {
                success('Dodano u listu želja', `${props.product.title} je dodan u listu želja`);
            } else {
                success('Uklonjeno iz liste želja', `${props.product.title} je uklonjen iz liste želja`);
            }
        };

        const handleImageError = (event) => {
            // Fallback image if product image fails to load
            event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwQzEyNy45MSAxMDAgMTEwIDExNy45MSAxMTAgMTQwQzExMCAxNjIuMDkgMTI3LjkxIDE4MCAxNTAgMTgwQzE3Mi4wOSAxODAgMTkwIDE2Mi4wOSAxOTAgMTQwQzE5MCAxMTcuOTEgMTcyLjA5IDEwMCAxNTAgMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMjEwIDIwMEg5MFYyMTBIMjEwVjIwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
        };

        return {
            // Refs
            addToCartBtn,
            isInWishlist,

            // Computed
            isInCart,
            discountPercentage,
            productBadge,

            // Methods
            openProductModal,
            handleAddToCart,
            toggleWishlist,
            handleImageError
        };
    }
};
