// Simple Home View Component without external dependencies
const Home = {
    template: `
        <div class="home-page">
            <!-- Hero Section -->
            <section class="hero-section">
                <div class="hero-background">
                    <div class="hero-overlay"></div>
                </div>
                <div class="container">
                    <div class="hero-content">
                        <h1 class="hero-title">
                            Dobrodošli u <span class="brand-highlight">NeoGears</span>
                        </h1>
                        <p class="hero-subtitle">
                            Otkrijte najnoviju tehnologiju po najboljim cijenama. 
                            Mobiteli, laptopi, tableti i gaming oprema - sve na jednom mjestu.
                        </p>
                        <div class="hero-actions">
                            <router-link to="/products" class="btn btn-primary btn-lg">
                                <i class="fas fa-shopping-bag"></i>
                                Pregledaj proizvode
                            </router-link>
                            <button class="btn btn-outline btn-lg" @click="scrollToFeatured">
                                <i class="fas fa-star"></i>
                                Istaknuti proizvodi
                            </button>
                        </div>
                        <div class="hero-stats">
                            <div class="stat-item">
                                <div class="stat-number">50+</div>
                                <div class="stat-label">Proizvoda</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">5</div>
                                <div class="stat-label">Kategorija</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">10+</div>
                                <div class="stat-label">Brendova</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Categories Section -->
            <section class="categories-section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">Kategorije proizvoda</h2>
                        <p class="section-subtitle">Pronađite ono što tražite u našim kategorijama</p>
                    </div>
                    <div class="categories-grid">
                        <div 
                            v-for="category in categories" 
                            :key="category.name"
                            class="category-card"
                            @click="navigateToCategory(category.name)"
                        >
                            <div class="category-icon">
                                <i :class="category.icon"></i>
                            </div>
                            <h3 class="category-name">{{ category.displayName }}</h3>
                            <p class="category-count">{{ category.count }} proizvoda</p>
                            <div class="category-overlay">
                                <span class="view-category">Pogledaj kategoriju</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Featured Products Section -->
            <section class="featured-section" id="featured-products">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">Istaknuti proizvodi</h2>
                        <p class="section-subtitle">Najbolji izbor naših stručnjaka</p>
                    </div>
                    <div class="products-grid" v-if="!isLoading">
                        <div
                            v-for="product in featuredProducts"
                            :key="product.id"
                            class="product-card animate-in"
                            @click="addToCart(product)"
                        >
                            <div class="product-image-container">
                                <img :src="product.image" :alt="product.title" loading="lazy" class="product-image">
                            </div>
                            <div class="product-info">
                                <h3 class="product-title">{{ product.title }}</h3>
                                <p class="product-brand">{{ product.brand }}</p>
                                <div class="product-price">
                                    <span class="current-price">{{ product.currentPrice }}</span>
                                    <span v-if="product.originalPrice" class="original-price">{{ product.originalPrice }}</span>
                                </div>
                                <button class="btn btn-primary add-to-cart-btn" @click.stop="addToCart(product)">
                                    <i class="fas fa-shopping-cart"></i>
                                    Dodaj u košaricu
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="loading-grid" v-else>
                        <loading-skeleton type="product" :count="8"></loading-skeleton>
                    </div>
                    <div class="section-actions">
                        <router-link to="/products" class="btn btn-primary">
                            <i class="fas fa-arrow-right"></i>
                            Pogledaj sve proizvode
                        </router-link>
                    </div>
                </div>
            </section>

            <!-- Features Section -->
            <section class="features-section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">Zašto odabrati NeoGears?</h2>
                        <p class="section-subtitle">Vaš pouzdani partner za tehnologiju</p>
                    </div>
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-shipping-fast"></i>
                            </div>
                            <h3 class="feature-title">Brza dostava</h3>
                            <p class="feature-description">
                                Besplatna dostava za narudžbe preko 500€. 
                                Standardna dostava 1-3 radna dana.
                            </p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-shield-alt"></i>
                            </div>
                            <h3 class="feature-title">Jamstvo kvalitete</h3>
                            <p class="feature-description">
                                Svi proizvodi dolaze s punim jamstvom proizvođača 
                                i našom dodatnom podrškom.
                            </p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-headset"></i>
                            </div>
                            <h3 class="feature-title">24/7 podrška</h3>
                            <p class="feature-description">
                                Naš tim stručnjaka dostupan je 24 sata dnevno 
                                za sva vaša pitanja.
                            </p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-undo"></i>
                            </div>
                            <h3 class="feature-title">Povrat novca</h3>
                            <p class="feature-description">
                                30 dana za povrat proizvoda bez pitanja. 
                                Vaše zadovoljstvo je naš prioritet.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Recently Viewed Section - Temporarily disabled -->
            <!--
            <recently-viewed
                :max-items="6"
                layout="horizontal"
                :show-title="true"
            />
            -->
        </div>

        <!-- Product Comparison - Temporarily disabled -->
        <!-- <product-comparison /> -->
    `,

    setup() {
        const { ref, computed, onMounted } = Vue;
        const { useRouter } = VueRouter;
        
        const router = useRouter();
        
        // Reactive state
        const isLoading = ref(false);
        
        // Static data
        const categories = ref([
            { name: 'MOBITELI', displayName: 'Mobiteli', icon: 'fas fa-mobile-alt', count: 15 },
            { name: 'LAPTOPI', displayName: 'Laptopi', icon: 'fas fa-laptop', count: 12 },
            { name: 'TABLETI', displayName: 'Tableti', icon: 'fas fa-tablet-alt', count: 8 },
            { name: 'GAMING', displayName: 'Gaming', icon: 'fas fa-gamepad', count: 10 },
            { name: 'DODACI', displayName: 'Dodaci', icon: 'fas fa-headphones', count: 5 }
        ]);

        // Get featured products from global products data
        const featuredProducts = computed(() => {
            if (typeof getAllProducts === 'function') {
                return getAllProducts().slice(0, 8);
            }
            return [];
        });

        // Methods
        const navigateToCategory = (category) => {
            router.push({ path: '/products', query: { category } });
        };

        const scrollToFeatured = () => {
            const element = document.getElementById('featured-products');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        };

        const addToCart = (product) => {
            if (window.cartStore) {
                window.cartStore.addItem(product);

                // Show toast notification
                if (window.toast) {
                    window.toast.success(
                        `${product.title} je dodano u košaricu!`,
                        'Proizvod dodano'
                    );
                }
            }
        };

        // Lifecycle
        onMounted(() => {
            // Simulate loading
            isLoading.value = true;

            setTimeout(() => {
                isLoading.value = false;
            }, 1000);
        });

        return {
            isLoading,
            categories,
            featuredProducts,
            navigateToCategory,
            scrollToFeatured,
            addToCart
        };
    }
};
