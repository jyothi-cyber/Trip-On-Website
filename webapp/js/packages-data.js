/**
 * Packages Database - Trip On Admin Dashboard
 * All package data and configurations
 */

// ============================================================================
// DEFAULT PACKAGES DATA
// ============================================================================

const defaultPackagesData = [
    {
        id: 1,
        packageId: 'PKG-001',
        name: 'The White Beach Land',
        location: 'Gili Trawangan, Indonesia',
        duration: '6 Days 5 Nights',
        price: 75000,
        currency: 'INR',
        rating: 4.8,
        reviewCount: 136,
        category: '5nights',
        type: 'Beach & Relaxation',
        status: 'active',
        featured: true,
        description: 'Pristine white beaches, crystal clear waters, and ultimate relaxation.',
        image: '../assets/images/beach.png',
        pageUrl: '../packages/the-white-beach-land.html',
        inclusions: [
            'Accommodation in beach resort',
            'Daily breakfast',
            'Airport transfers',
            'Island hopping tour',
            'Snorkeling equipment',
            'Beach activities'
        ],
        exclusions: [
            'International flights',
            'Travel insurance',
            'Personal expenses',
            'Lunch and dinner'
        ],
        itinerary: [
            { day: 1, title: 'Arrival & Check-in', activities: 'Airport pickup, hotel check-in, welcome dinner' },
            { day: 2, title: 'Beach Day', activities: 'Snorkeling, beach relaxation, sunset viewing' },
            { day: 3, title: 'Island Hopping', activities: 'Visit nearby islands, water sports' },
            { day: 4, title: 'Cultural Tour', activities: 'Local village tour, traditional dance show' },
            { day: 5, title: 'Adventure Day', activities: 'Diving, kayaking, beach volleyball' },
            { day: 6, title: 'Departure', activities: 'Check-out, airport drop-off' }
        ],
        createdDate: '2026-01-15T10:00:00',
        updatedDate: '2026-08-01T14:30:00',
        createdBy: 'Admin',
        bookingsCount: 45,
        availability: 'Available'
    },
    {
        id: 2,
        packageId: 'PKG-002',
        name: 'The Cultural Homeland',
        location: 'Ubud, Indonesia',
        duration: '4 Days 3 Nights',
        price: 45000,
        currency: 'INR',
        rating: 4.8,
        reviewCount: 98,
        category: '4nights',
        type: 'Cultural & Heritage',
        status: 'active',
        featured: true,
        description: 'Immerse yourself in Balinese culture, temples, and traditions.',
        image: '../assets/images/ubud.png',
        pageUrl: '../packages/the-cultural-homeland.html',
        inclusions: [
            'Boutique hotel accommodation',
            'Daily breakfast',
            'Temple tours',
            'Traditional dance show',
            'Cooking class',
            'Ubud market visit'
        ],
        exclusions: [
            'International flights',
            'Personal expenses',
            'Lunch and dinner',
            'Optional activities'
        ],
        itinerary: [
            { day: 1, title: 'Welcome to Ubud', activities: 'Hotel check-in, Ubud Palace tour, welcome dinner' },
            { day: 2, title: 'Temple Trail', activities: 'Tirta Empul, Gunung Kawi, rice terrace walk' },
            { day: 3, title: 'Cultural Immersion', activities: 'Cooking class, art galleries, traditional dance' },
            { day: 4, title: 'Departure', activities: 'Monkey Forest visit, check-out, transfer' }
        ],
        createdDate: '2026-01-10T09:00:00',
        updatedDate: '2026-07-28T11:20:00',
        createdBy: 'Admin',
        bookingsCount: 38,
        availability: 'Available'
    },
    {
        id: 3,
        packageId: 'PKG-003',
        name: 'Isolated Mountains',
        location: 'Nusa Penida, Indonesia',
        duration: '5 Days 4 Nights',
        price: 50000,
        currency: 'INR',
        rating: 4.7,
        reviewCount: 112,
        category: '5nights',
        type: 'Adventure & Nature',
        status: 'active',
        featured: false,
        description: 'Explore dramatic cliffs, hidden beaches, and untouched nature.',
        image: '../assets/images/indonesia.png',
        pageUrl: '../packages/isolated-mountains.html',
        inclusions: [
            'Eco-resort accommodation',
            'Daily meals',
            'Boat transfers',
            'Cliff trekking',
            'Snorkeling gear',
            'Professional guide'
        ],
        exclusions: [
            'International flights',
            'Travel insurance',
            'Alcoholic beverages',
            'Tips and gratuities'
        ],
        itinerary: [
            { day: 1, title: 'Journey Begins', activities: 'Boat to Nusa Penida, check-in, beach sunset' },
            { day: 2, title: 'West Coast Exploration', activities: 'Angels Billabong, Broken Beach, Kelingking' },
            { day: 3, title: 'East Coast Adventure', activities: 'Atuh Beach, Diamond Beach, cliff jumping' },
            { day: 4, title: 'Underwater World', activities: 'Manta Point diving, Crystal Bay snorkeling' },
            { day: 5, title: 'Return Journey', activities: 'Morning trek, boat back, departure' }
        ],
        createdDate: '2026-01-20T11:00:00',
        updatedDate: '2026-08-03T16:45:00',
        createdBy: 'Admin',
        bookingsCount: 29,
        availability: 'Available'
    },
    {
        id: 4,
        packageId: 'PKG-004',
        name: 'Romantic Escape Premium',
        location: 'Seminyak, Indonesia',
        duration: '7 Days 6 Nights',
        price: 125000,
        currency: 'INR',
        rating: 4.9,
        reviewCount: 87,
        category: '7nights',
        type: 'Honeymoon Special',
        status: 'active',
        featured: true,
        description: 'Luxury honeymoon package with private villas, spa treatments, and romantic dinners.',
        image: '../assets/images/romantic.png',
        pageUrl: '../packages/custom.html',
        inclusions: [
            'Private pool villa',
            'All meals included',
            'Couples spa treatments',
            'Sunset cruise',
            'Private beach dinner',
            'Airport luxury transfers'
        ],
        exclusions: [
            'International flights',
            'Personal shopping',
            'Premium alcoholic beverages'
        ],
        itinerary: [
            { day: 1, title: 'Welcome & Romance', activities: 'Villa check-in, welcome champagne, couple massage' },
            { day: 2, title: 'Beach Bliss', activities: 'Private beach cabana, water sports, sunset dinner' },
            { day: 3, title: 'Cultural Discovery', activities: 'Temple visits, traditional crafts, dance show' },
            { day: 4, title: 'Adventure Together', activities: 'ATV ride, waterfall trek, cooking class' },
            { day: 5, title: 'Sunset Cruise', activities: 'Private yacht charter, snorkeling, seafood dinner' },
            { day: 6, title: 'Spa & Relaxation', activities: 'Full day spa package, pool time, fine dining' },
            { day: 7, title: 'Farewell', activities: 'Breakfast in villa, departure transfer' }
        ],
        createdDate: '2026-02-01T10:00:00',
        updatedDate: '2026-08-05T09:15:00',
        createdBy: 'Admin',
        bookingsCount: 52,
        availability: 'Available'
    },
    {
        id: 5,
        packageId: 'PKG-005',
        name: 'Adventure Seeker Ultimate',
        location: 'Multiple Locations, Indonesia',
        duration: '6 Days 5 Nights',
        price: 95000,
        currency: 'INR',
        rating: 4.8,
        reviewCount: 156,
        category: '6nights',
        type: 'Adventure & Nature',
        status: 'active',
        featured: true,
        description: 'Thrilling adventures including diving, hiking, rafting, and paragliding.',
        image: '../assets/images/adventure2.png',
        pageUrl: '../packages/custom.html',
        inclusions: [
            'Adventure resort accommodation',
            'All meals and snacks',
            'Professional guides',
            'All adventure equipment',
            'Safety gear and insurance',
            'Airport transfers'
        ],
        exclusions: [
            'International flights',
            'Medical insurance',
            'Personal adventure gear'
        ],
        itinerary: [
            { day: 1, title: 'Arrival & Briefing', activities: 'Check-in, safety briefing, equipment fitting' },
            { day: 2, title: 'Mountain Trek', activities: 'Sunrise trek to Mount Batur, hot springs' },
            { day: 3, title: 'Water Adventures', activities: 'White water rafting, waterfall rappelling' },
            { day: 4, title: 'Underwater World', activities: 'Scuba diving at Tulamben shipwreck' },
            { day: 5, title: 'Sky High', activities: 'Paragliding, cliff jumping, beach bonfire' },
            { day: 6, title: 'Departure', activities: 'Morning yoga, check-out, transfer' }
        ],
        createdDate: '2026-02-10T11:30:00',
        updatedDate: '2026-08-04T13:45:00',
        createdBy: 'Admin',
        bookingsCount: 67,
        availability: 'Available'
    }
];

// ============================================================================
// PACKAGES CONFIGURATION
// ============================================================================

const packagesConfig = {
    categories: [
        { value: '4nights', label: '4 Nights 5 Days' },
        { value: '5nights', label: '5 Nights 6 Days' },
        { value: '6nights', label: '6 Nights 7 Days' },
        { value: '7nights', label: '7 Nights 8 Days' },
        { value: 'custom', label: 'Custom Package' }
    ],
    
    types: [
        'Beach & Relaxation',
        'Cultural & Heritage',
        'Adventure & Nature',
        'Honeymoon Special',
        'Family Fun',
        'Luxury Getaway',
        'Budget Friendly'
    ],
    
    status: [
        { value: 'active', label: 'Active', color: '#4CAF50' },
        { value: 'inactive', label: 'Inactive', color: '#9E9E9E' },
        { value: 'draft', label: 'Draft', color: '#FF9800' },
        { value: 'archived', label: 'Archived', color: '#607D8B' }
    ],
    
    availability: [
        'Available',
        'Limited',
        'Sold Out',
        'Coming Soon'
    ],
    
    priceRanges: [
        { min: 0, max: 30000, label: 'Budget (< ₹30K)' },
        { min: 30000, max: 60000, label: 'Standard (₹30K - ₹60K)' },
        { min: 60000, max: 100000, label: 'Premium (₹60K - ₹1L)' },
        { min: 100000, max: Infinity, label: 'Luxury (> ₹1L)' }
    ]
};

// ============================================================================
// STORAGE KEY
// ============================================================================

const PACKAGES_STORAGE_KEY = 'tripon_packages_database';

// ============================================================================
// INITIALIZATION FUNCTIONS
// ============================================================================

/**
 * Initialize packages data from localStorage or defaults
 */
function initializePackagesData() {
    const stored = localStorage.getItem(PACKAGES_STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing stored packages data:', e);
            return [...defaultPackagesData];
        }
    }
    return [...defaultPackagesData];
}

/**
 * Save packages data to localStorage
 */
function savePackagesData(packagesData) {
    try {
        localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(packagesData));
        return true;
    } catch (e) {
        console.error('Error saving packages data:', e);
        return false;
    }
}

/**
 * Get all packages
 */
function getAllPackages() {
    return initializePackagesData();
}

/**
 * Get featured/popular packages (packages with price > 100000 or featured flag)
 */
function getPopularPackages() {
    const allPackages = getAllPackages();
    return allPackages.filter(pkg => pkg.featured || pkg.price >= 100000);
}

/**
 * Get package by ID
 */
function getPackageById(id) {
    const packages = getAllPackages();
    return packages.find(pkg => pkg.id === id);
}

/**
 * Add new package
 */
function addPackage(packageData) {
    const packages = getAllPackages();
    const newId = Math.max(...packages.map(p => p.id), 0) + 1;
    
    const newPackage = {
        ...packageData,
        id: newId,
        packageId: `PKG-${String(newId).padStart(3, '0')}`,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        createdBy: 'Admin',
        bookingsCount: 0,
        rating: 0,
        reviewCount: 0,
        availability: 'Available'
    };
    
    packages.push(newPackage);
    savePackagesData(packages);
    return newPackage;
}

/**
 * Update existing package
 */
function updatePackage(id, packageData) {
    const packages = getAllPackages();
    const index = packages.findIndex(pkg => pkg.id === id);
    
    if (index !== -1) {
        packages[index] = {
            ...packages[index],
            ...packageData,
            updatedDate: new Date().toISOString()
        };
        savePackagesData(packages);
        return packages[index];
    }
    
    return null;
}

/**
 * Delete package
 */
function deletePackage(id) {
    const packages = getAllPackages();
    const filteredPackages = packages.filter(pkg => pkg.id !== id);
    
    if (filteredPackages.length < packages.length) {
        savePackagesData(filteredPackages);
        return true;
    }
    
    return false;
}

/**
 * Filter packages by criteria
 */
function filterPackages(criteria) {
    let packages = getAllPackages();
    
    if (criteria.category) {
        packages = packages.filter(pkg => pkg.category === criteria.category);
    }
    
    if (criteria.type) {
        packages = packages.filter(pkg => pkg.type === criteria.type);
    }
    
    if (criteria.status) {
        packages = packages.filter(pkg => pkg.status === criteria.status);
    }
    
    if (criteria.minPrice !== undefined) {
        packages = packages.filter(pkg => pkg.price >= criteria.minPrice);
    }
    
    if (criteria.maxPrice !== undefined) {
        packages = packages.filter(pkg => pkg.price <= criteria.maxPrice);
    }
    
    if (criteria.featured !== undefined) {
        packages = packages.filter(pkg => pkg.featured === criteria.featured);
    }
    
    return packages;
}

/**
 * Search packages by name or location
 */
function searchPackages(query) {
    const packages = getAllPackages();
    const lowercaseQuery = query.toLowerCase();
    
    return packages.filter(pkg => 
        pkg.name.toLowerCase().includes(lowercaseQuery) ||
        pkg.location.toLowerCase().includes(lowercaseQuery) ||
        pkg.description.toLowerCase().includes(lowercaseQuery)
    );
}

/**
 * Reset to default data
 */
function resetToDefaults() {
    savePackagesData(defaultPackagesData);
    return getAllPackages();
}
