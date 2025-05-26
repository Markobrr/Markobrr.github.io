// Products Page JavaScript - Enhanced with your preferred card design
console.log('Products page script loaded');

let currentProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 12;

// Convert PRODUCT_DATABASE to array format with badge information
const allProducts = Object.values(PRODUCT_DATABASE).map(product => {
    // Use badge information from database if available, otherwise generate
    let badge = product.badge || null;
    let badgeText = product.badgeText || '';

    // If no badge in database, determine based on product properties
    if (!badge) {
        if (product.oldPrice && product.oldPrice !== '') {
            badge = 'sale';
            const current = parseFloat(product.currentPrice.replace(/[^\d,]/g, '').replace(',', '.'));
            const old = parseFloat(product.oldPrice.replace(/[^\d,]/g, '').replace(',', '.'));
            const discount = Math.round(((old - current) / old) * 100);
            badgeText = `-${discount}%`;
        } else if (product.featured) {
            badge = 'bestseller';
            badgeText = 'BESTSELLER';
        }
    }

    return {
        ...product,
        badge,
        badgeText,
        // Convert price strings to numbers for sorting
        priceNumber: parseFloat(product.currentPrice.replace(/[^\d,]/g, '').replace(',', '.'))
    };
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing products page...');
    console.log('Total products available:', allProducts.length);
    initializePage();
    loadProducts();
    setupEventListeners();
    updateCartCount();
    setupDarkMode();
});

function initializePage() {
    // Check URL parameters for category filter
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const search = urlParams.get('search');

    if (category) {
        // Activate the category filter button
        const categoryButton = document.querySelector(`[data-category="${category}"]`);
        if (categoryButton) {
            categoryButton.classList.add('active');
        }

        // Update page title and description
        const categoryNames = {
            'mobiteli': 'Mobiteli',
            'laptopi': 'Laptopi',
            'tableti': 'Tableti',
            'gaming': 'Gaming',
            'dodaci': 'Dodaci'
        };

        const categoryName = categoryNames[category] || category;
        document.getElementById('pageTitle').textContent = categoryName;
        document.getElementById('pageDescription').textContent = `Otkrijte našu kolekciju ${categoryName.toLowerCase()}`;
    }

    if (search) {
        const searchInput = document.querySelector('.search-form input[type="search"]');
        if (searchInput) {
            searchInput.value = search;
        }
        document.getElementById('pageTitle').textContent = `Rezultati pretrage: "${search}"`;
        document.getElementById('pageDescription').textContent = `Pronađeni proizvodi za "${search}"`;
    }
}

function loadProducts() {
    currentProducts = [...allProducts];
    applyFilters();
}

function renderProducts(products) {
    console.log('Rendering products:', products.length);
    const grid = document.getElementById('productsGrid');

    if (products.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: var(--spacing-2xl);">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--gray-400); margin-bottom: var(--spacing-md);"></i>
                <h3>Nema proizvoda</h3>
                <p>Pokušajte s drugačijim filterima ili pretragom.</p>
            </div>
        `;
        return;
    }

    // Pagination
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);

    grid.innerHTML = paginatedProducts.map(product => `
        <div class="product-card-enhanced" onclick="openProductModal('${product.id}')">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}">
                ${product.badge ? `<div class="product-badge badge-${product.badge}">${product.badgeText}</div>` : ''}
            </div>
            <div class="product-info">
                <div class="product-category-small">${product.category}</div>
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price-container">
                    <span class="current-price">${product.currentPrice}</span>
                    ${product.oldPrice && product.oldPrice !== '' ? `<span class="old-price">${product.oldPrice}</span>` : ''}
                </div>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart('${product.id}')">
                    Dodaj u košaricu
                </button>
            </div>
        </div>
    `).join('');

    updateProductsCount(products.length, startIndex + 1, Math.min(endIndex, products.length));
    renderPagination(products.length);
}

function updateProductsCount(total, start, end) {
    document.getElementById('productsCount').textContent =
        `Prikazano ${start}-${end} od ${total} proizvoda`;
}

function renderPagination(totalProducts) {
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const pagination = document.getElementById('pagination');

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let paginationHTML = '';

    // Previous button
    paginationHTML += `
        <button class="pagination-btn" onclick="changePage(${currentPage - 1})"
                ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            paginationHTML += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}"
                        onclick="changePage(${i})">${i}</button>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            paginationHTML += '<span class="pagination-dots">...</span>';
        }
    }

    // Next button
    paginationHTML += `
        <button class="pagination-btn" onclick="changePage(${currentPage + 1})"
                ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;

    pagination.innerHTML = paginationHTML;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    renderProducts(filteredProducts);

    // Scroll to top of products
    document.querySelector('.products-content').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function applyFilters() {
    showLoading();

    setTimeout(() => {
        let products = [...currentProducts];

        // Category filters
        const categoryFilters = Array.from(document.querySelectorAll('.filter-btn[data-category].active'))
            .map(btn => btn.dataset.category);

        if (categoryFilters.length > 0) {
            products = products.filter(product =>
                categoryFilters.includes(product.category.toLowerCase())
            );
        }

        // Brand filters
        const brandFilters = Array.from(document.querySelectorAll('.filter-btn[data-brand].active'))
            .map(btn => btn.dataset.brand);

        if (brandFilters.length > 0) {
            products = products.filter(product =>
                brandFilters.includes(product.brand)
            );
        }

        // Price range filter
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;

        if (minPrice || maxPrice) {
            products = products.filter(product => {
                const price = product.priceNumber;
                const min = minPrice ? parseFloat(minPrice) : 0;
                const max = maxPrice ? parseFloat(maxPrice) : Infinity;
                return price >= min && price <= max;
            });
        }

        // Search filter
        const searchInput = document.querySelector('.search-form input[type="search"]');
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        if (searchTerm) {
            products = products.filter(product =>
                product.title.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.brand.toLowerCase().includes(searchTerm)
            );
        }

        // Apply sorting
        const sortBy = document.getElementById('sortSelect').value;
        products = sortProducts(products, sortBy);

        filteredProducts = products;
        currentPage = 1;
        renderProducts(filteredProducts);
        hideLoading();
    }, 300);
}

function sortProducts(products, sortBy) {
    const sorted = [...products];

    switch(sortBy) {
        case 'price-low':
            return sorted.sort((a, b) => a.priceNumber - b.priceNumber);
        case 'price-high':
            return sorted.sort((a, b) => b.priceNumber - a.priceNumber);
        case 'name-asc':
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'name-desc':
            return sorted.sort((a, b) => b.title.localeCompare(a.title));
        case 'newest':
            return sorted.reverse();
        default:
            return sorted;
    }
}

function clearFilters() {
    // Clear category filter buttons
    document.querySelectorAll('.filter-btn[data-category]').forEach(btn => btn.classList.remove('active'));

    // Clear brand filter buttons
    document.querySelectorAll('.filter-btn[data-brand]').forEach(btn => btn.classList.remove('active'));

    // Clear price inputs
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';

    // Clear search
    const searchInput = document.querySelector('.search-form input[type="search"]');
    if (searchInput) {
        searchInput.value = '';
    }

    // Reset sort
    document.getElementById('sortSelect').value = 'default';

    // Reset page title
    document.getElementById('pageTitle').textContent = 'Svi proizvodi';
    document.getElementById('pageDescription').textContent = 'Otkrijte našu kompletnu kolekciju najnovije tehnologije';

    // Reload products
    applyFilters();
}

function setupEventListeners() {
    // Price inputs
    document.getElementById('minPrice').addEventListener('input', debounce(applyFilters, 500));
    document.getElementById('maxPrice').addEventListener('input', debounce(applyFilters, 500));

    // Search form
    document.querySelector('.search-form').addEventListener('submit', function(e) {
        e.preventDefault();
        applyFilters();
    });

    // Search input
    const searchInput = document.querySelector('.search-form input[type="search"]');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 500));
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Loading functions
function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

// Cart functionality
let cart = JSON.parse(sessionStorage.getItem('techshop_cart')) || [];

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

function addToCart(productId) {
    showLoading();

    setTimeout(() => {
        const product = allProducts.find(p => p.id === productId);
        if (product) {
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    title: product.title,
                    price: product.currentPrice,
                    image: product.image,
                    quantity: 1
                });
            }
            sessionStorage.setItem('techshop_cart', JSON.stringify(cart));
            updateCartCount();

            // Show success message
            alert('Proizvod je dodan u košaricu!');
        }
        hideLoading();
    }, 500);
}

// Product modal functionality
function openProductModal(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        document.getElementById('modalProductImage').src = product.image;
        document.getElementById('modalProductCategory').textContent = product.category;
        document.getElementById('modalProductTitle').textContent = product.title;
        document.getElementById('modalCurrentPrice').textContent = product.currentPrice;
        document.getElementById('modalOldPrice').textContent = product.oldPrice || '';
        document.getElementById('modalOldPrice').style.display = product.oldPrice && product.oldPrice !== '' ? 'inline' : 'none';
        document.getElementById('modalProductDescription').textContent = product.description;

        // Render specs
        const specsList = document.getElementById('modalProductSpecs');
        specsList.innerHTML = product.specs.map(spec => `<li>${spec}</li>`).join('');

        const addToCartBtn = document.getElementById('modalAddToCartBtn');
        addToCartBtn.onclick = () => {
            addToCart(productId);
            closeProductModal();
        };

        document.getElementById('productModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Dark mode functionality
function setupDarkMode() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');

    // Load saved preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        const icon = darkModeToggle.querySelector('i');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');

        // Save preference
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));

        // Change icon
        const icon = this.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.id === 'productModal') {
        closeProductModal();
    }
});

// Toggle brands function
function toggleBrands() {
    const container = document.getElementById('brandsContainer');
    const chevron = document.getElementById('brandsChevron');
    const header = document.querySelector('.collapsible-header');

    if (container.style.display === 'none') {
        container.style.display = 'block';
        header.classList.add('active');
    } else {
        container.style.display = 'none';
        header.classList.remove('active');
    }
}

// Filter button functions
function toggleCategoryFilter(button) {
    button.classList.toggle('active');
    applyFilters();
}

function toggleBrandFilter(button) {
    button.classList.toggle('active');
    applyFilters();
}
