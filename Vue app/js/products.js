// NeoGears Product Database
// Comprehensive list of technology products

const PRODUCT_DATABASE = {
    // MOBITELI
    'iphone15pro': {
        id: 'iphone15pro',
        title: 'iPhone 15 Pro 128GB',
        category: 'MOBITELI',
        brand: 'Apple',
        currentPrice: '1.199,99 €',
        originalPrice: '1.399,99 €',
        image: 'https://aloalo.hr/upload/catalog/product/22683/1697647111_0903862.jpg',
        description: 'Najnoviji iPhone 15 Pro s A17 Pro čipom, titanijskim kućištem i naprednim kamerama. Dostupan u različitim bojama s 128GB prostora za pohranu.',
        specs: ['A17 Pro čip', 'Titanijsko kućište', '48MP kamera', '128GB memorija'],
        inStock: true,
        featured: true,
        badge: 'sale',
        badgeText: '-15%',
        stock: 12,
        colors: [
            { code: '#1f2937', name: 'Natural Titanium' },
            { code: '#374151', name: 'Blue Titanium' },
            { code: '#f3f4f6', name: 'White Titanium' },
            { code: '#111827', name: 'Black Titanium' }
        ],
        gallery: [
            { src: 'https://aloalo.hr/upload/catalog/product/22683/1697647111_0903862.jpg', alt: 'iPhone 15 Pro front' },
            { src: 'https://wowshop.hr/wp-content/uploads/2024/03/apple-iphone-15-pro-black-titanium-01-1000x1000.jpg', alt: 'iPhone 15 Pro back' }
        ]
    },
    'iphone15': {
        id: 'iphone15',
        title: 'iPhone 15 128GB',
        category: 'MOBITELI',
        brand: 'Apple',
        currentPrice: '999,99 €',
        oldPrice: '',
        image: 'https://wowshop.hr/wp-content/uploads/2024/03/apple-iphone-15-pro-black-titanium-01-1000x1000.jpg',
        description: 'iPhone 15 s A16 Bionic čipom i Dynamic Island. Odličan izbor za svakodnevnu upotrebu.',
        specs: ['A16 Bionic čip', 'Dynamic Island', '48MP kamera', '128GB memorija'],
        inStock: true,
        featured: false
    },
    'galaxys24': {
        id: 'galaxys24',
        title: 'Samsung Galaxy S24 256GB',
        category: 'MOBITELI',
        brand: 'Samsung',
        currentPrice: '899,99 €',
        originalPrice: '',
        image: 'https://www.gsm-centar.hr/image/cache/catalog/LD0006099689_0006099728-1024x768.jpg',
        description: 'Samsung Galaxy S24 s najnovijim Snapdragon procesorom, odličnim kamerama i 256GB prostora.',
        specs: ['Snapdragon 8 Gen 3', '50MP kamera', '256GB memorija', 'AI funkcije'],
        inStock: true,
        featured: true,
        badge: 'new',
        badgeText: 'NOVO',
        stock: 8,
        colors: [
            { code: '#1f2937', name: 'Phantom Black' },
            { code: '#f3f4f6', name: 'Marble Gray' },
            { code: '#fbbf24', name: 'Amber Yellow' },
            { code: '#7c3aed', name: 'Cobalt Violet' }
        ]
    },
    'galaxys24ultra': {
        id: 'galaxys24ultra',
        title: 'Samsung Galaxy S24 Ultra 512GB',
        category: 'MOBITELI',
        brand: 'Samsung',
        currentPrice: '1.399,99 €',
        oldPrice: '1.599,99 €',
        image: 'https://aloalo.hr/upload/catalog/product/23338/1706277899_0903913.jpg',
        description: 'Vrhunski Galaxy S24 Ultra s S Pen olovkom i 200MP kamerom.',
        specs: ['Snapdragon 8 Gen 3', '200MP kamera', 'S Pen', '512GB memorija'],
        inStock: true,
        featured: false
    },
    'pixel8pro': {
        id: 'pixel8pro',
        title: 'Google Pixel 8 Pro 256GB',
        category: 'MOBITELI',
        brand: 'Google',
        currentPrice: '799,99 €',
        oldPrice: '899,99 €',
        image: 'https://e-point.hr/wp-content/uploads/2024/01/HF15_BF4D7C5A-3EAD-43DF-A2C7-A14297C9E3C7_large.jpg',
        description: 'Google Pixel 8 Pro s Tensor G3 čipom i najnaprednijim AI funkcijama.',
        specs: ['Tensor G3 čip', 'AI fotografija', '50MP kamera', '256GB memorija'],
        inStock: true,
        featured: false
    },
    'oneplus12': {
        id: 'oneplus12',
        title: 'OnePlus 12 256GB',
        category: 'MOBITELI',
        brand: 'OnePlus',
        currentPrice: '849,99 €',
        oldPrice: '',
        image: 'https://cdn.kalvo.com/uploads/img/gallery/57375-oneplus-12-2.jpg',
        description: 'OnePlus 12 s Snapdragon 8 Gen 3 čipom i brzim punjenjem.',
        specs: ['Snapdragon 8 Gen 3', '50MP kamera', '100W punjenje', '256GB memorija'],
        inStock: true,
        featured: false
    },
    'xiaomi14': {
        id: 'xiaomi14',
        title: 'Xiaomi 14 Pro 512GB',
        category: 'MOBITELI',
        brand: 'Xiaomi',
        currentPrice: '749,99 €',
        oldPrice: '849,99 €',
        image: 'https://www.univerzalno.com/uploads/images/xiaomi14-5_1738656075.webp',
        description: 'Xiaomi 14 Pro s Leica kamerama i premium dizajnom.',
        specs: ['Snapdragon 8 Gen 3', 'Leica kamere', '120W punjenje', '512GB memorija'],
        inStock: true,
        featured: false
    },
    'huaweip60': {
        id: 'huaweip60',
        title: 'Huawei P60 Pro 256GB',
        category: 'MOBITELI',
        brand: 'Huawei',
        currentPrice: '699,99 €',
        oldPrice: '',
        image: 'https://img.cdn-cnj.si/img/500/500/j6/j6BPEUoz8W.webp',
        description: 'Huawei P60 Pro s naprednim kamerama i elegantnim dizajnom.',
        specs: ['Kirin 9000S', '48MP kamera', 'Leica optika', '256GB memorija'],
        inStock: true,
        featured: false
    },
    'sonyxperia1v': {
        id: 'sonyxperia1v',
        title: 'Sony Xperia 1 V 256GB',
        category: 'MOBITELI',
        brand: 'Sony',
        currentPrice: '1.199,99 €',
        oldPrice: '',
        image: 'https://media.icdn.hu/product/GalleryMod/2023-08/925931/resp/3030509_sony-xperia-1-v-65-5g-12-256gb-dualsim-fekete.webp',
        description: 'Sony Xperia 1 V s profesionalnim kamerama i 4K displayom.',
        specs: ['Snapdragon 8 Gen 2', '4K OLED display', 'Alpha kamere', '256GB memorija'],
        inStock: true,
        featured: false
    },
    'iphone14pro': {
        id: 'iphone14pro',
        title: 'iPhone 14 Pro 256GB',
        category: 'MOBITELI',
        brand: 'Apple',
        currentPrice: '1.099,99 €',
        oldPrice: '1.299,99 €',
        image: 'https://tehno-mag.hr/upload/catalog/product/17164/iphone-14-pro-128gb-gold_6319e6c1a6a03.jpg',
        description: 'iPhone 14 Pro s A16 Bionic čipom i Dynamic Island.',
        specs: ['A16 Bionic čip', 'Dynamic Island', '48MP Pro kamera', '256GB memorija'],
        inStock: true,
        featured: false
    },

    // LAPTOPI
    'macbookair': {
        id: 'macbookair',
        title: 'MacBook Air M3 13" 256GB',
        category: 'LAPTOPI',
        brand: 'Apple',
        currentPrice: '1.349,99 €',
        originalPrice: '1.499,99 €',
        image: 'https://media.wired.com/photos/65ea34d70264b0ad869cbc18/master/w_2560%2Cc_limit/MacBook-Air-M3-Review-Featured-Gear.jpg',
        description: 'MacBook Air s M3 čipom pruža nevjerojatnu performansu i bateriju koja traje cijeli dan.',
        specs: ['M3 čip', '13.6" Liquid Retina', '256GB SSD', '18h baterija'],
        inStock: true,
        featured: true,
        badge: 'sale',
        badgeText: '-10%',
        stock: 5,
        colors: [
            { code: '#f3f4f6', name: 'Silver' },
            { code: '#374151', name: 'Space Gray' },
            { code: '#fbbf24', name: 'Starlight' },
            { code: '#1e40af', name: 'Midnight' }
        ]
    },
    'macbookpro': {
        id: 'macbookpro',
        title: 'MacBook Pro M3 Pro 14" 512GB',
        category: 'LAPTOPI',
        brand: 'Apple',
        currentPrice: '2.199,99 €',
        oldPrice: '',
        image: 'https://cdn.mos.cms.futurecdn.net/CBQdQAHgggtdo66eddi5yU.jpg',
        description: 'Profesionalni MacBook Pro s M3 Pro čipom za zahtjevne zadatke.',
        specs: ['M3 Pro čip', '14.2" Liquid Retina XDR', '512GB SSD', 'ProRes podrška'],
        inStock: true,
        featured: false
    },
    'dellxps13': {
        id: 'dellxps13',
        title: 'Dell XPS 13 Intel i7 512GB',
        category: 'LAPTOPI',
        brand: 'Dell',
        currentPrice: '1.299,99 €',
        oldPrice: '1.499,99 €',
        image: 'https://pictures-nigeria.jijistatic.net/153666408_NjIwLTc1My1lZGNlYjg4MmIy.webp',
        description: 'Elegantan Dell XPS 13 s Intel Core i7 procesorom i premium dizajnom.',
        specs: ['Intel Core i7', '13.4" InfinityEdge', '512GB SSD', '16GB RAM'],
        inStock: true,
        featured: false
    },
    'lenovothinkpad': {
        id: 'lenovothinkpad',
        title: 'Lenovo ThinkPad X1 Carbon Gen 11',
        category: 'LAPTOPI',
        brand: 'Lenovo',
        currentPrice: '1.599,99 €',
        oldPrice: '',
        image: 'https://cdn.mos.cms.futurecdn.net/gwCVccweaX2Xt6X3CxyGuP.jpg',
        description: 'Poslovni laptop s vrhunskim performansama i dugotrajnom baterijom.',
        specs: ['Intel Core i7', '14" WUXGA', '1TB SSD', 'TrackPoint'],
        inStock: true,
        featured: false
    },
    'hpspectre': {
        id: 'hpspectre',
        title: 'HP Spectre x360 14" Intel i7',
        category: 'LAPTOPI',
        brand: 'HP',
        currentPrice: '1.399,99 €',
        oldPrice: '1.599,99 €',
        image: 'https://www.notebookcheck.net/fileadmin/_processed_/8/2/csm_IMG_2120_22dba18202.jpg',
        description: 'Konvertibilni laptop s OLED displayom i premium dizajnom.',
        specs: ['Intel Core i7', '14" OLED touchscreen', '512GB SSD', '360° okretanje'],
        inStock: true,
        featured: false
    },
    'asuszenbook': {
        id: 'asuszenbook',
        title: 'ASUS ZenBook 14 OLED',
        category: 'LAPTOPI',
        brand: 'ASUS',
        currentPrice: '1.199,99 €',
        oldPrice: '',
        image: 'https://pcchip.hr/wp-content/uploads/2024/05/11.webp',
        description: 'Elegantan ultrabook s OLED displayom i AMD Ryzen procesorom.',
        specs: ['AMD Ryzen 7', '14" OLED 2.8K', '512GB SSD', 'NumberPad 2.0'],
        inStock: true,
        featured: false
    },

    // TABLETI
    'ipadpro': {
        id: 'ipadpro',
        title: 'iPad Pro 11" M4 256GB',
        category: 'TABLETI',
        brand: 'Apple',
        currentPrice: '1.099,99 €',
        oldPrice: '',
        image: 'https://media.pazar3.mk/Image/43bc20ca-c48b-4c81-b5c4-0d2d2ecefeb5/20250531/false/false/1280/960/ipad-pro-m4-256gb-11.jpeg?noLogo=true',
        description: 'iPad Pro s M4 čipom i Liquid Retina displayom. Idealan za profesionalce.',
        specs: ['M4 čip', '11" Liquid Retina', 'Apple Pencil podrška', '256GB memorija'],
        inStock: true,
        featured: true,
        badge: 'bestseller',
        badgeText: 'BESTSELLER'
    },
    'ipadair': {
        id: 'ipadair',
        title: 'iPad Air M2 10.9" 128GB',
        category: 'TABLETI',
        brand: 'Apple',
        currentPrice: '699,99 €',
        oldPrice: '799,99 €',
        image: 'https://www.zdnet.com/a/img/2024/05/23/0ba06652-4cdf-4525-b7ce-efcb4b0de055/4.jpg',
        description: 'iPad Air s M2 čipom - savršen balans performansi i cijene.',
        specs: ['M2 čip', '10.9" Liquid Retina', 'Touch ID', '128GB memorija'],
        inStock: true,
        featured: false
    },
    'galaxytabs9': {
        id: 'galaxytabs9',
        title: 'Samsung Galaxy Tab S9 256GB',
        category: 'TABLETI',
        brand: 'Samsung',
        currentPrice: '899,99 €',
        oldPrice: '',
        image: 'https://images.samsung.com/is/image/samsung/p6pim/hr/sm-x926bzareue/gallery/hr-galaxy-tab-s10-ultra-sm-x920-524353-sm-x926bzareue-thumb-543700308?$UX_EXT1_PNG$',
        description: 'Premium Android tablet s S Pen olovkom i AMOLED displayom.',
        specs: ['Snapdragon 8 Gen 2', '11" AMOLED', 'S Pen uključen', '256GB memorija'],
        inStock: true,
        featured: false
    },

    // GAMING
    'ps5': {
        id: 'ps5',
        title: 'PlayStation 5 Console',
        category: 'GAMING',
        brand: 'Sony',
        currentPrice: '549,99 €',
        oldPrice: '',
        image: 'https://platform.theverge.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/21990370/vpavic_4261_20201023_0058.jpg?quality=90&strip=all&crop=0,0,100,100',
        description: 'Najnovija PlayStation 5 konzola s ultra-brzim SSD-om.',
        specs: ['Custom AMD Zen 2', '825GB SSD', '4K gaming', 'Ray tracing'],
        inStock: true,
        featured: false
    },
    'xboxseriesx': {
        id: 'xboxseriesx',
        title: 'Xbox Series X Console',
        category: 'GAMING',
        brand: 'Microsoft',
        currentPrice: '499,99 €',
        oldPrice: '549,99 €',
        image: 'https://platform.theverge.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/21916918/twarren_xboxseriesxhandson.jpg?quality=90&strip=all&crop=0,0,100,100',
        description: 'Moćna Xbox Series X konzola za 4K gaming.',
        specs: ['Custom AMD Zen 2', '1TB SSD', '4K 120fps', 'Quick Resume'],
        inStock: true,
        featured: false
    },
    'steamdeck': {
        id: 'steamdeck',
        title: 'Steam Deck 512GB',
        category: 'GAMING',
        brand: 'Valve',
        currentPrice: '679,99 €',
        oldPrice: '',
        image: 'https://www.njuskalo.hr/image-w920x690/igrace-konzole/steam-deck-512gb-slika-232462052.jpg',
        description: 'Prijenosna gaming konzola s pristupom Steam biblioteci.',
        specs: ['AMD APU', '7" touchscreen', '512GB SSD', 'SteamOS'],
        inStock: true,
        featured: false
    },
    'nintendoswitch': {
        id: 'nintendoswitch',
        title: 'Nintendo Switch OLED 64GB',
        category: 'GAMING',
        brand: 'Nintendo',
        currentPrice: '349,99 €',
        oldPrice: '',
        image: 'https://youget.pt/67824-large_default/console-nintendo-switch-oled-version-64gb-bluered.jpg',
        description: 'Hibridna gaming konzola s OLED displayom.',
        specs: ['NVIDIA Tegra X1', '7" OLED touchscreen', '64GB memorija', 'Joy-Con kontroleri'],
        inStock: true,
        featured: false
    },

    // DODACI
    'airpodspro': {
        id: 'airpodspro',
        title: 'Apple AirPods Pro (3rd gen)',
        category: 'DODACI',
        brand: 'Apple',
        currentPrice: '279,99 €',
        oldPrice: '329,99 €',
        image: 'https://down-br.img.susercontent.com/file/br-11134207-7r98o-lttp9f8r2f5522',
        description: 'Bežične slušalice s aktivnim poništavanjem buke.',
        specs: ['Active Noise Cancellation', 'Spatial Audio', 'H2 čip', 'MagSafe punjenje'],
        inStock: true,
        featured: false
    },
    'applewatch': {
        id: 'applewatch',
        title: 'Apple Watch Series 9 45mm',
        category: 'DODACI',
        brand: 'Apple',
        currentPrice: '449,99 €',
        oldPrice: '',
        image: 'https://www.otterbox.com/dw/image/v2/BGMS_PRD/on/demandware.static/-/Sites-masterCatalog/default/dw1f2d2bf5/productimages/dis/cases-screen-protection/watch-case-series-7-45mm/watch-case-series-7-45mm-fine-timing-1.png?sw=800&sh=800',
        description: 'Najnapredniji Apple Watch s S9 čipom.',
        specs: ['S9 SiP čip', '45mm Always-On Retina', 'GPS + Cellular', 'Zdravstveni senzori'],
        inStock: true,
        featured: false
    },
    'samsungbuds': {
        id: 'samsungbuds',
        title: 'Samsung Galaxy Buds2 Pro',
        category: 'DODACI',
        brand: 'Samsung',
        currentPrice: '199,99 €',
        oldPrice: '229,99 €',
        image: 'https://images.samsung.com/ph/galaxy-buds2-pro/feature/galaxy-buds2-pro-easy-pairing-front-mo.jpg',
        description: 'Premium bežične slušalice s ANC tehnologijom.',
        specs: ['Active Noise Cancellation', '360 Audio', 'IPX7 otpornost', 'Bežično punjenje'],
        inStock: true,
        featured: false
    }
};

// Helper functions
function getProductsByCategory(category) {
    return Object.values(PRODUCT_DATABASE).filter(product =>
        product.category === category.toUpperCase()
    );
}

function getFeaturedProducts() {
    return Object.values(PRODUCT_DATABASE).filter(product => product.featured);
}

function searchProducts(searchTerm) {
    const term = searchTerm.toLowerCase();
    return Object.values(PRODUCT_DATABASE).filter(product =>
        product.title.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
    );
}

function getProductById(id) {
    return PRODUCT_DATABASE[id] || null;
}

function getAllProducts() {
    return Object.values(PRODUCT_DATABASE);
}

function getProductsByBrand(brand) {
    return Object.values(PRODUCT_DATABASE).filter(product =>
        product.brand.toLowerCase() === brand.toLowerCase()
    );
}

function getCategories() {
    const categories = [...new Set(Object.values(PRODUCT_DATABASE).map(product => product.category))];
    return categories.sort();
}

function getBrands() {
    const brands = [...new Set(Object.values(PRODUCT_DATABASE).map(product => product.brand))];
    return brands.sort();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PRODUCT_DATABASE,
        getProductsByCategory,
        getFeaturedProducts,
        searchProducts,
        getProductById,
        getAllProducts,
        getProductsByBrand,
        getCategories,
        getBrands
    };
}
