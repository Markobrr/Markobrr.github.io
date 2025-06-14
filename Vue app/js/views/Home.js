// Home View Component
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
                                <div class="stat-number">{{ totalProducts }}+</div>
                                <div class="stat-label">Proizvoda</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">{{ categories.length }}</div>
                                <div class="stat-label">Kategorija</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">{{ brands.length }}+</div>
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
                            :key="category"
                            class="category-card"
                            @click="navigateToCategory(category)"
                        >
                            <div class="category-icon">
                                <i :class="getCategoryIcon(category)"></i>
                            </div>
                            <h3 class="category-name">{{ getCategoryName(category) }}</h3>
                            <p class="category-count">{{ getCategoryProductCount(category) }} proizvoda</p>
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
                        <product-card 
                            v-for="product in featuredProducts" 
                            :key="product.id"
                            :product="product"
                            class="animate-in"
                        />
                    </div>
                    <div class="loading-grid" v-else>
                        <div v-for="n in 4" :key="n" class="product-skeleton"></div>
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

            <!-- Newsletter Section -->
            <section class="newsletter-section">
                <div class="container">
                    <div class="newsletter-content">
                        <div class="newsletter-text">
                            <h2 class="newsletter-title">Ostanite u tijeku</h2>
                            <p class="newsletter-subtitle">
                                Prijavite se za naš newsletter i budite prvi koji će saznati 
                                o novim proizvodima i posebnim ponudama.
                            </p>
                        </div>
                        <div class="newsletter-form">
                            <div class="input-group">
                                <input 
                                    type="email" 
                                    v-model="newsletterEmail"
                                    placeholder="Vaša email adresa"
                                    class="newsletter-input"
                                    @keyup.enter="subscribeNewsletter"
                                >
                                <button 
                                    class="btn btn-primary newsletter-btn"
                                    @click="subscribeNewsletter"
                                    :disabled="!newsletterEmail || isSubscribing"
                                >
                                    <i class="fas fa-paper-plane" v-if="!isSubscribing"></i>
                                    <i class="fas fa-spinner fa-spin" v-else></i>
                                    {{ isSubscribing ? 'Šalje se...' : 'Pretplati se' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    `,

    setup() {
        const { ref, computed, onMounted } = Vue;
        const { useRouter } = VueRouter;
        
        const router = useRouter();
        const { 
            featuredProducts, 
            categories, 
            brands, 
            totalProducts, 
            isLoading,
            initializeProducts,
            getProductsByCategory
        } = useProducts();
        const { success, error } = useNotifications();

        // Reactive state
        const newsletterEmail = ref('');
        const isSubscribing = ref(false);

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

        const getCategoryIcon = (category) => {
            const icons = {
                'MOBITELI': 'fas fa-mobile-alt',
                'LAPTOPI': 'fas fa-laptop',
                'TABLETI': 'fas fa-tablet-alt',
                'GAMING': 'fas fa-gamepad',
                'DODACI': 'fas fa-headphones'
            };
            return icons[category] || 'fas fa-tag';
        };

        const getCategoryName = (category) => {
            const names = {
                'MOBITELI': 'Mobiteli',
                'LAPTOPI': 'Laptopi',
                'TABLETI': 'Tableti',
                'GAMING': 'Gaming',
                'DODACI': 'Dodaci'
            };
            return names[category] || category;
        };

        const getCategoryProductCount = (category) => {
            return getProductsByCategory(category).length;
        };

        const subscribeNewsletter = async () => {
            if (!newsletterEmail.value) {
                error('Greška', 'Molimo unesite email adresu');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newsletterEmail.value)) {
                error('Greška', 'Molimo unesite valjanu email adresu');
                return;
            }

            isSubscribing.value = true;

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                success('Uspješno!', 'Uspješno ste se pretplatili na naš newsletter');
                newsletterEmail.value = '';
            } catch (err) {
                error('Greška', 'Došlo je do greške. Molimo pokušajte ponovo.');
            } finally {
                isSubscribing.value = false;
            }
        };

        // Initialize products on mount
        onMounted(async () => {
            await initializeProducts();
        });

        return {
            // State
            newsletterEmail,
            isSubscribing,

            // Computed
            featuredProducts,
            categories,
            brands,
            totalProducts,
            isLoading,

            // Methods
            navigateToCategory,
            scrollToFeatured,
            getCategoryIcon,
            getCategoryName,
            getCategoryProductCount,
            subscribeNewsletter
        };
    }
};
