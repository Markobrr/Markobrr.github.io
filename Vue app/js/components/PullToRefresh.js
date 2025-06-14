// Pull to Refresh Component
const PullToRefresh = {
    props: {
        onRefresh: {
            type: Function,
            required: true
        },
        threshold: {
            type: Number,
            default: 80
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    template: `
        <div 
            class="pull-to-refresh-container"
            ref="containerElement"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
        >
            <!-- Pull to Refresh Indicator -->
            <div 
                class="pull-refresh-indicator"
                :class="{ 
                    visible: pullDistance > 0,
                    active: pullDistance >= threshold,
                    refreshing: isRefreshing
                }"
                :style="{ transform: \`translateY(\${Math.min(pullDistance, threshold + 20)}px)\` }"
            >
                <div class="refresh-icon-container">
                    <i 
                        class="refresh-icon"
                        :class="{
                            'fas fa-arrow-down': pullDistance < threshold && !isRefreshing,
                            'fas fa-sync-alt': pullDistance >= threshold && !isRefreshing,
                            'fas fa-spinner fa-spin': isRefreshing
                        }"
                    ></i>
                </div>
                <div class="refresh-text">
                    <span v-if="!isRefreshing && pullDistance < threshold">Povuci za osvježavanje</span>
                    <span v-else-if="!isRefreshing && pullDistance >= threshold">Otpusti za osvježavanje</span>
                    <span v-else>Osvježavanje...</span>
                </div>
                <div class="refresh-progress">
                    <div 
                        class="progress-bar"
                        :style="{ width: \`\${Math.min((pullDistance / threshold) * 100, 100)}%\` }"
                    ></div>
                </div>
            </div>

            <!-- Content Slot -->
            <div 
                class="pull-refresh-content"
                :style="{ transform: \`translateY(\${pullDistance}px)\` }"
            >
                <slot></slot>
            </div>
        </div>
    `,

    setup(props) {
        const { ref, onMounted, onUnmounted } = Vue;

        // Reactive state
        const containerElement = ref(null);
        const pullDistance = ref(0);
        const isRefreshing = ref(false);
        const isPulling = ref(false);

        // Touch handling
        let startY = 0;
        let currentY = 0;
        let startScrollTop = 0;

        // Methods
        const handleTouchStart = (event) => {
            if (props.disabled || window.innerWidth > 768) return;
            
            const touch = event.touches[0];
            startY = touch.clientY;
            startScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Only allow pull to refresh when at the top of the page
            if (startScrollTop > 0) return;
            
            isPulling.value = true;
        };

        const handleTouchMove = (event) => {
            if (!isPulling.value || props.disabled || window.innerWidth > 768) return;
            
            const touch = event.touches[0];
            currentY = touch.clientY;
            const deltaY = currentY - startY;
            
            // Only allow pulling down
            if (deltaY <= 0) {
                pullDistance.value = 0;
                return;
            }
            
            // Check if we're still at the top
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScrollTop > 0) {
                isPulling.value = false;
                pullDistance.value = 0;
                return;
            }
            
            // Prevent default scrolling when pulling
            event.preventDefault();
            
            // Apply resistance to the pull
            const resistance = 0.5;
            const maxPull = props.threshold + 40;
            pullDistance.value = Math.min(deltaY * resistance, maxPull);
        };

        const handleTouchEnd = async () => {
            if (!isPulling.value || props.disabled) return;
            
            isPulling.value = false;
            
            // Check if threshold is met
            if (pullDistance.value >= props.threshold && !isRefreshing.value) {
                await triggerRefresh();
            } else {
                // Reset pull distance
                animateReset();
            }
        };

        const triggerRefresh = async () => {
            isRefreshing.value = true;
            
            try {
                // Call the refresh function
                await props.onRefresh();
                
                // Show success feedback
                if (window.toast) {
                    window.toast.success('Proizvodi su osvježeni!', 'Osvježavanje');
                }
                
                // Haptic feedback
                if (navigator.vibrate) {
                    navigator.vibrate([50, 100, 50]);
                }
                
            } catch (error) {
                console.error('Refresh failed:', error);
                
                if (window.toast) {
                    window.toast.error('Greška pri osvježavanju', 'Osvježavanje');
                }
            } finally {
                // Reset state
                setTimeout(() => {
                    isRefreshing.value = false;
                    animateReset();
                }, 500);
            }
        };

        const animateReset = () => {
            const startDistance = pullDistance.value;
            const duration = 300;
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOut = 1 - Math.pow(1 - progress, 3);
                
                pullDistance.value = startDistance * (1 - easeOut);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    pullDistance.value = 0;
                }
            };
            
            requestAnimationFrame(animate);
        };

        // Handle scroll events to disable pull when not at top
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 0 && isPulling.value) {
                isPulling.value = false;
                pullDistance.value = 0;
            }
        };

        // Lifecycle
        onMounted(() => {
            window.addEventListener('scroll', handleScroll, { passive: true });
        });

        onUnmounted(() => {
            window.removeEventListener('scroll', handleScroll);
        });

        return {
            containerElement,
            pullDistance,
            isRefreshing,
            isPulling,
            handleTouchStart,
            handleTouchMove,
            handleTouchEnd
        };
    }
};
