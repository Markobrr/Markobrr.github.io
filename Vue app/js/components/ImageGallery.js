// Image Gallery Component
const ImageGallery = {
    props: {
        images: {
            type: Array,
            required: true
        },
        currentIndex: {
            type: Number,
            default: 0
        },
        showThumbnails: {
            type: Boolean,
            default: true
        },
        autoPlay: {
            type: Boolean,
            default: false
        },
        autoPlayInterval: {
            type: Number,
            default: 3000
        }
    },

    emits: ['image-changed'],

    template: `
        <div class="image-gallery" v-if="images.length > 0">
            <!-- Main Image Display -->
            <div class="gallery-main">
                <div class="main-image-container">
                    <image-zoom
                        :src="currentImage.src"
                        :alt="currentImage.alt || 'Product image'"
                        class-name="gallery-main-image"
                        :zoom-level="3"
                    />
                    
                    <!-- Navigation Arrows -->
                    <button 
                        class="gallery-nav gallery-prev"
                        @click="previousImage"
                        v-if="images.length > 1"
                        :disabled="currentImageIndex === 0 && !isLooping"
                    >
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    
                    <button 
                        class="gallery-nav gallery-next"
                        @click="nextImage"
                        v-if="images.length > 1"
                        :disabled="currentImageIndex === images.length - 1 && !isLooping"
                    >
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    
                    <!-- Image Counter -->
                    <div class="image-counter" v-if="images.length > 1">
                        {{ currentImageIndex + 1 }} / {{ images.length }}
                    </div>
                    
                    <!-- Auto-play Controls -->
                    <div class="autoplay-controls" v-if="autoPlay">
                        <button 
                            class="autoplay-toggle"
                            @click="toggleAutoPlay"
                            :title="isAutoPlaying ? 'Zaustavi automatsko prebacivanje' : 'Pokreni automatsko prebacivanje'"
                        >
                            <i :class="isAutoPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Thumbnails -->
            <div class="gallery-thumbnails" v-if="showThumbnails && images.length > 1">
                <div class="thumbnails-container">
                    <button
                        v-for="(image, index) in images"
                        :key="index"
                        class="thumbnail"
                        :class="{ active: index === currentImageIndex }"
                        @click="selectImage(index)"
                    >
                        <img 
                            :src="image.thumbnail || image.src" 
                            :alt="image.alt || \`Thumbnail \${index + 1}\`"
                            loading="lazy"
                        >
                        <div class="thumbnail-overlay"></div>
                    </button>
                </div>
                
                <!-- Thumbnail Navigation -->
                <button 
                    class="thumbnail-nav thumbnail-nav-left"
                    @click="scrollThumbnails('left')"
                    v-if="showThumbnailNav"
                >
                    <i class="fas fa-chevron-left"></i>
                </button>
                
                <button 
                    class="thumbnail-nav thumbnail-nav-right"
                    @click="scrollThumbnails('right')"
                    v-if="showThumbnailNav"
                >
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            
            <!-- Dots Indicator (Alternative to thumbnails) -->
            <div class="gallery-dots" v-if="!showThumbnails && images.length > 1">
                <button
                    v-for="(image, index) in images"
                    :key="index"
                    class="gallery-dot"
                    :class="{ active: index === currentImageIndex }"
                    @click="selectImage(index)"
                ></button>
            </div>
        </div>
    `,

    setup(props, { emit }) {
        const { ref, computed, onMounted, onUnmounted, watch } = Vue;

        // Reactive state
        const currentImageIndex = ref(props.currentIndex);
        const isAutoPlaying = ref(props.autoPlay);
        const autoPlayTimer = ref(null);
        const showThumbnailNav = ref(false);
        const isLooping = ref(true);

        // Computed properties
        const currentImage = computed(() => {
            return props.images[currentImageIndex.value] || props.images[0];
        });

        // Methods
        const selectImage = (index) => {
            if (index >= 0 && index < props.images.length) {
                currentImageIndex.value = index;
                emit('image-changed', index);
                
                // Reset auto-play timer
                if (isAutoPlaying.value) {
                    resetAutoPlay();
                }
            }
        };

        const nextImage = () => {
            let nextIndex = currentImageIndex.value + 1;
            
            if (nextIndex >= props.images.length) {
                nextIndex = isLooping.value ? 0 : props.images.length - 1;
            }
            
            selectImage(nextIndex);
        };

        const previousImage = () => {
            let prevIndex = currentImageIndex.value - 1;
            
            if (prevIndex < 0) {
                prevIndex = isLooping.value ? props.images.length - 1 : 0;
            }
            
            selectImage(prevIndex);
        };

        const toggleAutoPlay = () => {
            isAutoPlaying.value = !isAutoPlaying.value;
            
            if (isAutoPlaying.value) {
                startAutoPlay();
            } else {
                stopAutoPlay();
            }
        };

        const startAutoPlay = () => {
            if (props.images.length <= 1) return;
            
            autoPlayTimer.value = setInterval(() => {
                nextImage();
            }, props.autoPlayInterval);
        };

        const stopAutoPlay = () => {
            if (autoPlayTimer.value) {
                clearInterval(autoPlayTimer.value);
                autoPlayTimer.value = null;
            }
        };

        const resetAutoPlay = () => {
            stopAutoPlay();
            if (isAutoPlaying.value) {
                startAutoPlay();
            }
        };

        const scrollThumbnails = (direction) => {
            const container = document.querySelector('.thumbnails-container');
            if (!container) return;
            
            const scrollAmount = 120;
            const currentScroll = container.scrollLeft;
            
            if (direction === 'left') {
                container.scrollTo({
                    left: currentScroll - scrollAmount,
                    behavior: 'smooth'
                });
            } else {
                container.scrollTo({
                    left: currentScroll + scrollAmount,
                    behavior: 'smooth'
                });
            }
        };

        const handleKeyboard = (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    previousImage();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    nextImage();
                    break;
                case ' ':
                    event.preventDefault();
                    if (props.autoPlay) {
                        toggleAutoPlay();
                    }
                    break;
            }
        };

        // Watch for prop changes
        watch(() => props.currentIndex, (newIndex) => {
            currentImageIndex.value = newIndex;
        });

        watch(() => props.autoPlay, (newValue) => {
            isAutoPlaying.value = newValue;
            if (newValue) {
                startAutoPlay();
            } else {
                stopAutoPlay();
            }
        });

        // Lifecycle
        onMounted(() => {
            if (props.autoPlay) {
                startAutoPlay();
            }
            
            // Add keyboard navigation
            document.addEventListener('keydown', handleKeyboard);
            
            // Check if thumbnail navigation is needed
            setTimeout(() => {
                const container = document.querySelector('.thumbnails-container');
                if (container) {
                    showThumbnailNav.value = container.scrollWidth > container.clientWidth;
                }
            }, 100);
        });

        onUnmounted(() => {
            stopAutoPlay();
            document.removeEventListener('keydown', handleKeyboard);
        });

        return {
            currentImageIndex,
            currentImage,
            isAutoPlaying,
            showThumbnailNav,
            isLooping,
            selectImage,
            nextImage,
            previousImage,
            toggleAutoPlay,
            scrollThumbnails
        };
    }
};
