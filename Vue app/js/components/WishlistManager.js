// Wishlist Manager Component
const WishlistManager = {
    template: `
        <div class="wishlist-manager">
            <!-- Wishlist Button -->
            <button 
                class="wishlist-btn"
                :class="{ 
                    'is-favorite': isFavorite,
                    'is-loading': isLoading 
                }"
                @click="toggleWishlist"
                :title="isFavorite ? 'Ukloni iz favorita' : 'Dodaj u favorite'"
            >
                <i 
                    :class="wishlistIcon"
                    class="wishlist-icon"
                ></i>
                <span class="wishlist-text" v-if="showText">
                    {{ wishlistText }}
                </span>
                
                <!-- Loading spinner -->
                <div class="wishlist-loading" v-if="isLoading">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
            </button>
            
            <!-- Wishlist count badge -->
            <span class="wishlist-count" v-if="showCount && wishlistCount > 0">
                {{ wishlistCount }}
            </span>
        </div>
    `,

    props: {
        productId: {
            type: String,
            required: true
        },
        showText: {
            type: Boolean,
            default: false
        },
        showCount: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: 'normal', // 'small', 'normal', 'large'
            validator: (value) => ['small', 'normal', 'large'].includes(value)
        }
    },

    setup(props) {
        const { ref, computed, onMounted } = Vue;

        // Reactive state
        const isLoading = ref(false);

        // Computed properties
        const isFavorite = computed(() => {
            return window.wishlistStore ? window.wishlistStore.isFavorite(props.productId) : false;
        });

        const wishlistCount = computed(() => {
            return window.wishlistStore ? window.wishlistStore.totalItems : 0;
        });

        const wishlistIcon = computed(() => {
            if (isLoading.value) return '';
            return isFavorite.value ? 'fas fa-heart' : 'far fa-heart';
        });

        const wishlistText = computed(() => {
            return isFavorite.value ? 'Ukloni iz favorita' : 'Dodaj u favorite';
        });

        // Methods
        const toggleWishlist = async () => {
            if (isLoading.value || !window.wishlistStore) return;

            isLoading.value = true;

            try {
                if (isFavorite.value) {
                    await removeFromWishlist();
                } else {
                    await addToWishlist();
                }

                // Haptic feedback
                if (navigator.vibrate) {
                    navigator.vibrate(isFavorite.value ? 50 : 30);
                }

            } catch (error) {
                console.error('Wishlist operation failed:', error);
                
                if (window.toast) {
                    window.toast.error(
                        'Greška pri ažuriranju favorita',
                        'Favoriti'
                    );
                }
            } finally {
                isLoading.value = false;
            }
        };

        const addToWishlist = async () => {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 300));

            window.wishlistStore.addItem(props.productId);

            if (window.toast) {
                window.toast.success(
                    'Proizvod je dodan u favorite!',
                    'Favoriti'
                );
            }
        };

        const removeFromWishlist = async () => {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 200));

            window.wishlistStore.removeItem(props.productId);

            if (window.toast) {
                window.toast.info(
                    'Proizvod je uklonjen iz favorita',
                    'Favoriti'
                );
            }
        };

        return {
            isLoading,
            isFavorite,
            wishlistCount,
            wishlistIcon,
            wishlistText,
            toggleWishlist
        };
    }
};
