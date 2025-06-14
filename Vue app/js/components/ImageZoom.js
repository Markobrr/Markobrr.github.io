// Image Zoom Component
const ImageZoom = {
    props: {
        src: {
            type: String,
            required: true
        },
        alt: {
            type: String,
            default: ''
        },
        zoomLevel: {
            type: Number,
            default: 2
        },
        className: {
            type: String,
            default: ''
        }
    },

    template: `
        <div 
            class="image-zoom-container"
            :class="className"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
            @mousemove="handleMouseMove"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
            ref="containerRef"
        >
            <img 
                :src="src" 
                :alt="alt" 
                class="zoom-image"
                :class="{ 'zooming': isZooming }"
                :style="imageStyle"
                ref="imageRef"
                @load="handleImageLoad"
            >
            
            <!-- Zoom Lens -->
            <div 
                class="zoom-lens"
                v-if="isZooming && !isMobile"
                :style="lensStyle"
            ></div>
            
            <!-- Zoom Indicator -->
            <div class="zoom-indicator" v-if="!isMobile">
                <i class="fas fa-search-plus"></i>
                <span>Hover za zoom</span>
            </div>
            
            <!-- Mobile Zoom Indicator -->
            <div class="mobile-zoom-indicator" v-if="isMobile && !isZooming">
                <i class="fas fa-expand"></i>
                <span>Tap za zoom</span>
            </div>
            
            <!-- Mobile Zoom Overlay -->
            <div 
                class="mobile-zoom-overlay"
                v-if="isMobile && isZooming"
                @click="handleMobileZoomClose"
            >
                <div class="mobile-zoom-content" @click.stop>
                    <img 
                        :src="src" 
                        :alt="alt" 
                        class="mobile-zoom-image"
                        :style="mobileZoomStyle"
                        @touchstart="handleMobileImageTouchStart"
                        @touchmove="handleMobileImageTouchMove"
                        @touchend="handleMobileImageTouchEnd"
                    >
                    <button class="mobile-zoom-close" @click="handleMobileZoomClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    `,

    setup(props) {
        const { ref, computed, onMounted, onUnmounted } = Vue;

        // Reactive state
        const containerRef = ref(null);
        const imageRef = ref(null);
        const isZooming = ref(false);
        const mouseX = ref(0);
        const mouseY = ref(0);
        const imageLoaded = ref(false);
        const isMobile = ref(window.innerWidth <= 768);
        const mobileScale = ref(1);
        const mobileTranslateX = ref(0);
        const mobileTranslateY = ref(0);

        // Touch handling for mobile
        let lastTouchDistance = 0;
        let lastTouchX = 0;
        let lastTouchY = 0;
        let isDragging = false;

        // Computed styles
        const imageStyle = computed(() => {
            if (!isZooming.value || isMobile.value) return {};
            
            const container = containerRef.value;
            const image = imageRef.value;
            
            if (!container || !image || !imageLoaded.value) return {};
            
            const containerRect = container.getBoundingClientRect();
            const imageRect = image.getBoundingClientRect();
            
            // Calculate zoom position
            const x = ((mouseX.value - containerRect.left) / containerRect.width) * 100;
            const y = ((mouseY.value - containerRect.top) / containerRect.height) * 100;
            
            return {
                transform: `scale(${props.zoomLevel})`,
                transformOrigin: `${x}% ${y}%`,
                cursor: 'zoom-out'
            };
        });

        const lensStyle = computed(() => {
            if (!isZooming.value || isMobile.value) return {};
            
            const container = containerRef.value;
            if (!container) return {};
            
            const containerRect = container.getBoundingClientRect();
            const lensSize = 100; // px
            
            const x = mouseX.value - containerRect.left - lensSize / 2;
            const y = mouseY.value - containerRect.top - lensSize / 2;
            
            return {
                left: `${Math.max(0, Math.min(x, containerRect.width - lensSize))}px`,
                top: `${Math.max(0, Math.min(y, containerRect.height - lensSize))}px`,
                width: `${lensSize}px`,
                height: `${lensSize}px`
            };
        });

        const mobileZoomStyle = computed(() => {
            return {
                transform: `scale(${mobileScale.value}) translate(${mobileTranslateX.value}px, ${mobileTranslateY.value}px)`
            };
        });

        // Methods
        const handleMouseEnter = () => {
            if (isMobile.value || !imageLoaded.value) return;
            isZooming.value = true;
        };

        const handleMouseLeave = () => {
            if (isMobile.value) return;
            isZooming.value = false;
        };

        const handleMouseMove = (event) => {
            if (isMobile.value || !isZooming.value) return;
            mouseX.value = event.clientX;
            mouseY.value = event.clientY;
        };

        const handleTouchStart = (event) => {
            if (!isMobile.value) return;
            event.preventDefault();
            isZooming.value = true;
        };

        const handleTouchMove = (event) => {
            if (!isMobile.value) return;
            event.preventDefault();
        };

        const handleTouchEnd = (event) => {
            if (!isMobile.value) return;
            event.preventDefault();
        };

        const handleMobileImageTouchStart = (event) => {
            const touches = event.touches;
            
            if (touches.length === 1) {
                // Single touch - start dragging
                isDragging = true;
                lastTouchX = touches[0].clientX;
                lastTouchY = touches[0].clientY;
            } else if (touches.length === 2) {
                // Two touches - start pinch zoom
                isDragging = false;
                const distance = Math.sqrt(
                    Math.pow(touches[0].clientX - touches[1].clientX, 2) +
                    Math.pow(touches[0].clientY - touches[1].clientY, 2)
                );
                lastTouchDistance = distance;
            }
        };

        const handleMobileImageTouchMove = (event) => {
            event.preventDefault();
            const touches = event.touches;
            
            if (touches.length === 1 && isDragging) {
                // Single touch - drag
                const deltaX = touches[0].clientX - lastTouchX;
                const deltaY = touches[0].clientY - lastTouchY;
                
                mobileTranslateX.value += deltaX;
                mobileTranslateY.value += deltaY;
                
                lastTouchX = touches[0].clientX;
                lastTouchY = touches[0].clientY;
            } else if (touches.length === 2) {
                // Two touches - pinch zoom
                const distance = Math.sqrt(
                    Math.pow(touches[0].clientX - touches[1].clientX, 2) +
                    Math.pow(touches[0].clientY - touches[1].clientY, 2)
                );
                
                const scale = distance / lastTouchDistance;
                mobileScale.value = Math.max(1, Math.min(4, mobileScale.value * scale));
                
                lastTouchDistance = distance;
            }
        };

        const handleMobileImageTouchEnd = () => {
            isDragging = false;
        };

        const handleMobileZoomClose = () => {
            isZooming.value = false;
            mobileScale.value = 1;
            mobileTranslateX.value = 0;
            mobileTranslateY.value = 0;
        };

        const handleImageLoad = () => {
            imageLoaded.value = true;
        };

        const handleResize = () => {
            isMobile.value = window.innerWidth <= 768;
            if (!isMobile.value && isZooming.value) {
                handleMobileZoomClose();
            }
        };

        // Lifecycle
        onMounted(() => {
            window.addEventListener('resize', handleResize);
        });

        onUnmounted(() => {
            window.removeEventListener('resize', handleResize);
        });

        return {
            containerRef,
            imageRef,
            isZooming,
            isMobile,
            imageStyle,
            lensStyle,
            mobileZoomStyle,
            handleMouseEnter,
            handleMouseLeave,
            handleMouseMove,
            handleTouchStart,
            handleTouchMove,
            handleTouchEnd,
            handleMobileImageTouchStart,
            handleMobileImageTouchMove,
            handleMobileImageTouchEnd,
            handleMobileZoomClose,
            handleImageLoad
        };
    }
};
