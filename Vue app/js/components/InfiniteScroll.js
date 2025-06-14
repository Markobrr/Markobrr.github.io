// Infinite Scroll Component
const InfiniteScroll = {
    props: {
        items: {
            type: Array,
            required: true
        },
        itemsPerPage: {
            type: Number,
            default: 12
        },
        loading: {
            type: Boolean,
            default: false
        },
        hasMore: {
            type: Boolean,
            default: true
        },
        threshold: {
            type: Number,
            default: 200
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    emits: ['load-more'],

    template: `
        <div class="infinite-scroll-container">
            <!-- Items Slot -->
            <slot :visible-items="visibleItems"></slot>

            <!-- Load More Button (Fallback) -->
            <div class="load-more-section" v-if="showLoadMore">
                <button 
                    class="btn btn-outline load-more-btn"
                    @click="loadMore"
                    :disabled="loading"
                >
                    <i class="fas fa-plus" v-if="!loading"></i>
                    <i class="fas fa-spinner fa-spin" v-else></i>
                    {{ loading ? 'Učitavanje...' : 'Učitaj više' }}
                </button>
                <p class="load-more-info">
                    Prikazano {{ visibleItems.length }} od {{ items.length }} proizvoda
                </p>
            </div>

            <!-- Infinite Scroll Trigger -->
            <div 
                class="scroll-trigger"
                ref="scrollTrigger"
                v-if="isMobile && hasMore && !showLoadMore"
            >
                <div class="scroll-loading" v-if="loading">
                    <loading-skeleton type="product" :count="4"></loading-skeleton>
                </div>
            </div>

            <!-- End of Results -->
            <div class="end-of-results" v-if="!hasMore && visibleItems.length > 0">
                <div class="end-message">
                    <i class="fas fa-check-circle"></i>
                    <h4>To je sve!</h4>
                    <p>Prikazali ste sve dostupne proizvode ({{ items.length }})</p>
                </div>
            </div>
        </div>
    `,

    setup(props, { emit }) {
        const { ref, computed, onMounted, onUnmounted, watch } = Vue;

        // Reactive state
        const scrollTrigger = ref(null);
        const currentPage = ref(1);
        const isMobile = ref(window.innerWidth <= 768);
        const isIntersecting = ref(false);
        const observer = ref(null);

        // Computed properties
        const visibleItems = computed(() => {
            const endIndex = currentPage.value * props.itemsPerPage;
            return props.items.slice(0, endIndex);
        });

        const hasMore = computed(() => {
            return visibleItems.value.length < props.items.length;
        });

        const showLoadMore = computed(() => {
            return !isMobile.value && hasMore.value && !props.disabled;
        });

        // Methods
        const loadMore = () => {
            if (props.loading || !hasMore.value) return;
            
            currentPage.value++;
            emit('load-more');
            
            // Smooth scroll animation for better UX
            if (isMobile.value) {
                setTimeout(() => {
                    const newItems = document.querySelectorAll('.product-card:nth-last-child(-n+4)');
                    if (newItems.length > 0) {
                        newItems[0].scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'nearest' 
                        });
                    }
                }, 100);
            }
        };

        const handleResize = () => {
            isMobile.value = window.innerWidth <= 768;
        };

        const setupIntersectionObserver = () => {
            if (!scrollTrigger.value || !isMobile.value) return;

            observer.value = new IntersectionObserver(
                (entries) => {
                    const entry = entries[0];
                    isIntersecting.value = entry.isIntersecting;
                    
                    if (entry.isIntersecting && hasMore.value && !props.loading && !props.disabled) {
                        loadMore();
                    }
                },
                {
                    rootMargin: `${props.threshold}px`,
                    threshold: 0.1
                }
            );

            observer.value.observe(scrollTrigger.value);
        };

        const cleanupObserver = () => {
            if (observer.value) {
                observer.value.disconnect();
                observer.value = null;
            }
        };

        const resetPagination = () => {
            currentPage.value = 1;
        };

        // Watch for items changes to reset pagination
        watch(() => props.items.length, () => {
            // Reset to first page when items change (e.g., after filtering)
            if (currentPage.value > 1) {
                resetPagination();
            }
        });

        // Watch for mobile state changes
        watch(isMobile, (newValue) => {
            if (newValue) {
                setupIntersectionObserver();
            } else {
                cleanupObserver();
            }
        });

        // Watch for scroll trigger element
        watch(scrollTrigger, (newElement) => {
            if (newElement && isMobile.value) {
                setupIntersectionObserver();
            }
        });

        // Lifecycle
        onMounted(() => {
            window.addEventListener('resize', handleResize);
            
            // Setup intersection observer for mobile
            if (isMobile.value) {
                // Delay to ensure DOM is ready
                setTimeout(setupIntersectionObserver, 100);
            }
        });

        onUnmounted(() => {
            window.removeEventListener('resize', handleResize);
            cleanupObserver();
        });

        // Expose methods for parent component
        const scrollToTop = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        const scrollToItem = (index) => {
            const items = document.querySelectorAll('.product-card');
            if (items[index]) {
                items[index].scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        };

        return {
            scrollTrigger,
            currentPage,
            isMobile,
            isIntersecting,
            visibleItems,
            hasMore,
            showLoadMore,
            loadMore,
            resetPagination,
            scrollToTop,
            scrollToItem
        };
    }
};
