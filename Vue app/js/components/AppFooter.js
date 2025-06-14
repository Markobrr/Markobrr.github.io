// AppFooter Component
const AppFooter = {
    template: `
        <footer class="app-footer">
            <div class="container">
                <div class="footer-content">
                    <!-- Company Info -->
                    <div class="footer-section">
                        <div class="footer-logo">
                            <i class="fas fa-bolt"></i>
                            <span>NeoGears</span>
                        </div>
                        <p class="footer-description">
                            Vaš pouzdani partner za najnoviju tehnologiju. 
                            Nudimo širok izbor kvalitetnih proizvoda po pristupačnim cijenama.
                        </p>
                        <div class="social-links">
                            <a href="#" class="social-link" title="Facebook">
                                <i class="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" class="social-link" title="Instagram">
                                <i class="fab fa-instagram"></i>
                            </a>
                            <a href="#" class="social-link" title="Twitter">
                                <i class="fab fa-twitter"></i>
                            </a>
                            <a href="#" class="social-link" title="YouTube">
                                <i class="fab fa-youtube"></i>
                            </a>
                        </div>
                    </div>

                    <!-- Quick Links -->
                    <div class="footer-section">
                        <h3 class="footer-title">Brze veze</h3>
                        <ul class="footer-links">
                            <li><router-link to="/">Početna</router-link></li>
                            <li><router-link to="/products">Proizvodi</router-link></li>
                            <li><router-link to="/products?category=MOBITELI">Mobiteli</router-link></li>
                            <li><router-link to="/products?category=LAPTOPI">Laptopi</router-link></li>
                            <li><router-link to="/products?category=GAMING">Gaming</router-link></li>
                        </ul>
                    </div>

                    <!-- Customer Service -->
                    <div class="footer-section">
                        <h3 class="footer-title">Korisnička podrška</h3>
                        <ul class="footer-links">
                            <li><a href="#" @click.prevent="showContactModal">Kontakt</a></li>
                            <li><a href="#" @click.prevent="showSupportModal">Podrška</a></li>
                            <li><a href="#" @click.prevent="showShippingInfo">Dostava</a></li>
                            <li><a href="#" @click.prevent="showReturnPolicy">Povrat</a></li>
                            <li><a href="#" @click.prevent="showWarranty">Jamstvo</a></li>
                        </ul>
                    </div>

                    <!-- Contact Info -->
                    <div class="footer-section">
                        <h3 class="footer-title">Kontakt informacije</h3>
                        <div class="contact-info">
                            <div class="contact-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>Ilica 1, 10000 Zagreb, Hrvatska</span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                <span>+385 1 234 5678</span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-envelope"></i>
                                <span>info@neogears.hr</span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-clock"></i>
                                <span>Pon-Pet: 8:00-20:00<br>Sub: 9:00-15:00</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer Bottom -->
                <div class="footer-bottom">
                    <div class="footer-bottom-content">
                        <div class="copyright">
                            <p>&copy; {{ currentYear }} NeoGears. Sva prava zadržana.</p>
                        </div>
                        <div class="footer-bottom-links">
                            <a href="#" @click.prevent="showPrivacyPolicy">Privatnost</a>
                            <a href="#" @click.prevent="showTerms">Uvjeti korištenja</a>
                            <a href="#" @click.prevent="showCookiePolicy">Kolačići</a>
                        </div>
                        <div class="payment-methods">
                            <span class="payment-label">Prihvaćamo:</span>
                            <div class="payment-icons">
                                <i class="fab fa-cc-visa" title="Visa"></i>
                                <i class="fab fa-cc-mastercard" title="Mastercard"></i>
                                <i class="fab fa-cc-paypal" title="PayPal"></i>
                                <i class="fab fa-cc-apple-pay" title="Apple Pay"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Back to top button -->
            <button 
                class="back-to-top"
                :class="{ 'visible': showBackToTop }"
                @click="scrollToTop"
                title="Povratak na vrh"
            >
                <i class="fas fa-chevron-up"></i>
            </button>
        </footer>
    `,

    setup() {
        const { ref, computed, onMounted, onUnmounted } = Vue;
        const { success, info } = useNotifications();
        const uiStore = useUIStore();

        // Reactive state
        const showBackToTop = ref(false);

        // Computed properties
        const currentYear = computed(() => new Date().getFullYear());

        // Methods
        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };

        const handleScroll = () => {
            showBackToTop.value = window.scrollY > 300;
        };

        const showContactModal = () => {
            info('Kontakt', 'Kontakt forma će biti dostupna uskoro. Za sada nas možete kontaktirati na info@neogears.hr');
        };

        const showSupportModal = () => {
            info('Podrška', 'Naš tim podrške dostupan je 24/7 na telefonu +385 1 234 5678');
        };

        const showShippingInfo = () => {
            info('Dostava', 'Besplatna dostava za narudžbe preko 500€. Standardna dostava 1-3 radna dana.');
        };

        const showReturnPolicy = () => {
            info('Povrat', '30 dana za povrat proizvoda bez pitanja. Vaše zadovoljstvo je naš prioritet.');
        };

        const showWarranty = () => {
            info('Jamstvo', 'Svi proizvodi dolaze s punim jamstvom proizvođača i našom dodatnom podrškom.');
        };

        const showPrivacyPolicy = () => {
            info('Privatnost', 'Politika privatnosti će biti dostupna uskoro.');
        };

        const showTerms = () => {
            info('Uvjeti', 'Uvjeti korištenja će biti dostupni uskoro.');
        };

        const showCookiePolicy = () => {
            info('Kolačići', 'Koristimo kolačiće za poboljšanje korisničkog iskustva.');
        };

        // Lifecycle
        onMounted(() => {
            window.addEventListener('scroll', handleScroll);
        });

        onUnmounted(() => {
            window.removeEventListener('scroll', handleScroll);
        });

        return {
            // State
            showBackToTop,

            // Computed
            currentYear,

            // Methods
            scrollToTop,
            showContactModal,
            showSupportModal,
            showShippingInfo,
            showReturnPolicy,
            showWarranty,
            showPrivacyPolicy,
            showTerms,
            showCookiePolicy
        };
    }
};
