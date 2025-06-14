// Swipeable Product Card Component
const SwipeableProductCard = {
    props: {
        product: {
            type: Object,
            required: true
        }
    },

    emits: ['add-to-cart'],

    template: `
        <div 
            class="swipeable-product-card"
            :class="{ 'swiping': isSwipeActive, 'swipe-success': showSwipeSuccess }"
            ref="cardElement"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
            @click="handleClick"
            :style="{ transform: \`translateX(\${swipeOffset}px)\` }"
        >
            <!-- Swipe Action Background -->
            <div class="swipe-action-bg" :class="{ visible: Math.abs(swipeOffset) > 50 }">
                <div class="swipe-action-content" v-if="swipeOffset > 50">
                    <i class="fas fa-shopping-cart"></i>
                    <span>Dodaj u košaricu</span>
                </div>
                <div class="swipe-action-content" v-else-if="swipeOffset < -50">
                    <i class="fas fa-heart"></i>
                    <span>Dodaj u favorite</span>
                </div>
            </div>

            <!-- Product Card Content -->
            <div class="product-card-content">
                <div class="product-image-container">
                    <!-- Image Gallery or Single Image -->
                    <image-gallery
                        v-if="productImages.length > 1"
                        :images="productImages"
                        :current-index="currentImageIndex"
                        :show-thumbnails="false"
                        @image-changed="handleImageChange"
                    />
                    <image-zoom
                        v-else
                        :src="product.image"
                        :alt="product.title"
                        class-name="product-image"
                        :zoom-level="2.5"
                    />

                    <!-- Stock Indicator -->
                    <div class="stock-indicator-overlay">
                        <stock-indicator
                            :stock="product.stock || getRandomStock()"
                            :low-stock-threshold="5"
                            size="small"
                        />
                    </div>

                    <!-- Swipe Hint -->
                    <div class="swipe-hint" v-if="showSwipeHint">
                        <div class="swipe-hint-arrow">
                            <i class="fas fa-chevron-left"></i>
                            <span>Swipe</span>
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                </div>
                
                <div class="product-info">
                    <h3 class="product-title">{{ product.title }}</h3>
                    <p class="product-brand">{{ product.brand }}</p>
                    <div class="product-price">
                        <span class="current-price">{{ product.currentPrice }}</span>
                        <span v-if="product.originalPrice" class="original-price">{{ product.originalPrice }}</span>
                    </div>

                    <!-- Color Variants -->
                    <color-variants
                        v-if="productColors.length > 0"
                        :colors="productColors"
                        :selected-color="selectedColor"
                        size="small"
                        @color-selected="handleColorChange"
                    />

                    <!-- Mobile Action Buttons -->
                    <div class="mobile-actions">
                        <button
                            class="btn btn-primary add-to-cart-btn"
                            @click.stop="addToCart"
                        >
                            <i class="fas fa-shopping-cart"></i>
                            Dodaj
                        </button>

                        <wishlist-manager
                            :product-id="product.id"
                            size="small"
                            @click.stop
                        />

                        <button
                            class="btn btn-outline comparison-btn"
                            @click.stop="addToComparison"
                            :disabled="!canAddToComparison"
                            :title="canAddToComparison ? 'Dodaj u usporedbu' : 'Maksimalno 3 proizvoda'"
                        >
                            <i class="fas fa-balance-scale"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Swipe Success Feedback -->
            <div class="swipe-success-feedback" v-if="showSwipeSuccess">
                <i class="fas fa-check-circle"></i>
                <span>Dodano u košaricu!</span>
            </div>
        </div>
    `,

    setup(props, { emit }) {
        const { ref, computed, onMounted, onUnmounted } = Vue;

        // Reactive state
        const cardElement = ref(null);
        const isSwipeActive = ref(false);
        const swipeOffset = ref(0);
        const showSwipeSuccess = ref(false);
        const showSwipeHint = ref(false);
        const currentImageIndex = ref(0);
        const selectedColor = ref('');
        
        // Touch handling
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let isDragging = false;
        let swipeThreshold = 80;

        // Computed properties
        const productImages = computed(() => {
            const images = [];

            // Main product image
            images.push({
                src: props.product.image,
                alt: props.product.title,
                thumbnail: props.product.image
            });

            // Additional images if available
            if (props.product.gallery && props.product.gallery.length > 0) {
                props.product.gallery.forEach(img => {
                    images.push({
                        src: img.src || img,
                        alt: img.alt || props.product.title,
                        thumbnail: img.thumbnail || img.src || img
                    });
                });
            }

            return images;
        });

        const productColors = computed(() => {
            if (!props.product.colors) return [];

            return props.product.colors.map(color => ({
                code: color.code || color,
                name: color.name || color,
                gradient: color.gradient,
                pattern: color.pattern
            }));
        });

        const canAddToComparison = computed(() => {
            return window.comparisonStore ? window.comparisonStore.canAddMore : false;
        });

        // Methods
        const handleTouchStart = (event) => {
            if (window.innerWidth > 768) return; // Only on mobile
            
            const touch = event.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            isDragging = true;
            isSwipeActive.value = true;
        };

        const handleTouchMove = (event) => {
            if (!isDragging || window.innerWidth > 768) return;
            
            event.preventDefault();
            const touch = event.touches[0];
            currentX = touch.clientX;
            const deltaX = currentX - startX;
            const deltaY = touch.clientY - startY;
            
            // Only horizontal swipes
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                return;
            }
            
            // Limit swipe distance
            const maxSwipe = 120;
            swipeOffset.value = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX));
        };

        const handleTouchEnd = () => {
            if (!isDragging || window.innerWidth > 768) return;
            
            isDragging = false;
            isSwipeActive.value = false;
            
            // Check if swipe threshold is met
            if (swipeOffset.value > swipeThreshold) {
                // Swipe right - Add to cart
                addToCart();
                showSwipeSuccessAnimation();
            } else if (swipeOffset.value < -swipeThreshold) {
                // Swipe left - Add to favorites
                toggleFavorite();
                showSwipeSuccessAnimation();
            }
            
            // Reset swipe offset
            setTimeout(() => {
                swipeOffset.value = 0;
            }, 100);
        };

        const handleClick = () => {
            if (Math.abs(swipeOffset.value) > 10) {
                // Prevent click if swiping
                return;
            }
            // Handle normal click (could navigate to product detail)
        };

        const addToCart = () => {
            emit('add-to-cart', props.product);
            
            // Haptic feedback simulation
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        };

        const addToComparison = () => {
            if (!window.comparisonStore) return;

            const result = window.comparisonStore.addItem(props.product.id);

            if (result.success) {
                if (window.toast) {
                    window.toast.success(
                        `${props.product.title} je dodano u usporedbu!`,
                        'Usporedba proizvoda'
                    );
                }

                // Haptic feedback
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            } else {
                let message = 'Greška pri dodavanju u usporedbu';

                switch (result.reason) {
                    case 'already_added':
                        message = 'Proizvod je već u usporedbi';
                        break;
                    case 'max_reached':
                        message = `Možete usporediti maksimalno ${result.maxItems} proizvoda`;
                        break;
                }

                if (window.toast) {
                    window.toast.warning(message, 'Usporedba proizvoda');
                }
            }
        };

        const showSwipeSuccessAnimation = () => {
            showSwipeSuccess.value = true;
            setTimeout(() => {
                showSwipeSuccess.value = false;
            }, 1500);
        };

        const showSwipeHintAnimation = () => {
            if (window.innerWidth <= 768) {
                showSwipeHint.value = true;
                setTimeout(() => {
                    showSwipeHint.value = false;
                }, 3000);
            }
        };

        const getRandomStock = () => {
            // Generate random stock for demo purposes
            const stockLevels = [0, 1, 2, 3, 4, 5, 8, 12, 15, 20, 25];
            return stockLevels[Math.floor(Math.random() * stockLevels.length)];
        };

        const handleImageChange = (index) => {
            currentImageIndex.value = index;
        };

        const handleColorChange = (color) => {
            selectedColor.value = color.code;

            // Update product image if color has specific image
            if (color.image) {
                // This would typically update the main product image
                // For demo purposes, we'll just show a toast
                if (window.toast) {
                    window.toast.info(
                        `Prikazuje se ${color.name} varijanta`,
                        'Boja proizvoda'
                    );
                }
            }
        };

        // Lifecycle
        onMounted(() => {
            // Initialize default color
            if (productColors.value.length > 0) {
                selectedColor.value = productColors.value[0].code;
            }

            // Track product view
            if (window.recentlyViewedStore) {
                window.recentlyViewedStore.addItem(props.product.id);
            }

            // Show swipe hint after a delay for first-time users
            setTimeout(showSwipeHintAnimation, 2000);
        });

        return {
            cardElement,
            isSwipeActive,
            swipeOffset,
            showSwipeSuccess,
            showSwipeHint,
            currentImageIndex,
            selectedColor,
            productImages,
            productColors,
            canAddToComparison,
            handleTouchStart,
            handleTouchMove,
            handleTouchEnd,
            handleClick,
            addToCart,
            addToComparison,
            getRandomStock,
            handleImageChange,
            handleColorChange
        };
    }
};
