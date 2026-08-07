/**
 * Admin Package View Page
 * Displays detailed package information
 */

// ============================================================================
// GLOBAL STATE
// ============================================================================

let currentPackage = null;
let currentTab = 'highlights';

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    loadPackageFromURL();
    initializeEventListeners();
});

function initializeEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }
}

// ============================================================================
// LOAD PACKAGE DATA
// ============================================================================

function loadPackageFromURL() {
    // Get package ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const packageId = urlParams.get('id');
    
    if (packageId) {
        currentPackage = getPackageById(parseInt(packageId));
        if (currentPackage) {
            displayPackageDetails(currentPackage);
        } else {
            showError('Package not found');
        }
    } else {
        // If no ID, show first package as demo
        const packages = getAllPackages();
        if (packages.length > 0) {
            currentPackage = packages[0];
            displayPackageDetails(currentPackage);
        } else {
            showError('No packages available');
        }
    }
}

function displayPackageDetails(pkg) {
    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        const categoryText = getCategoryText(pkg.category);
        pageTitle.textContent = `${categoryText} ${pkg.type.split(' ')[0]} | View Package`;
    }
    
    // Update date
    const viewDate = document.getElementById('viewDate');
    if (viewDate) {
        viewDate.textContent = formatDate(pkg.updatedDate || pkg.createdDate);
    }
    
    // Update hero image
    const heroImage = document.getElementById('packageHeroImage');
    if (heroImage) {
        heroImage.src = pkg.image;
        heroImage.alt = pkg.name;
        heroImage.onerror = function() {
            this.src = '../assets/images/hero.png';
        };
    }
    
    // Update title section
    document.getElementById('categoryBadge').textContent = pkg.category.replace('nights', 'N');
    document.getElementById('typeBadge').textContent = pkg.type.split(' ')[0];
    document.getElementById('packageMainTitle').textContent = pkg.name;
    document.getElementById('packageDescription').textContent = pkg.description;
    
    // Update price card
    const formattedPrice = formatCurrency(pkg.price);
    document.getElementById('priceAmount').textContent = formattedPrice;
    document.getElementById('durationText').textContent = pkg.duration;
    
    // Update website link
    const websiteBtn = document.getElementById('viewWebsiteBtn');
    if (websiteBtn && pkg.pageUrl) {
        websiteBtn.href = pkg.pageUrl;
    }
    
    // Load tab content
    loadHighlightsTab(pkg);
    loadItineraryTab(pkg);
    loadBudgetTab(pkg);
    loadHotelsTab(pkg);
}

// ============================================================================
// TAB CONTENT LOADERS
// ============================================================================

function loadHighlightsTab(pkg) {
    // Load activities
    const activitiesList = document.getElementById('activitiesList');
    if (activitiesList && pkg.inclusions && pkg.inclusions.length > 0) {
        activitiesList.innerHTML = pkg.inclusions.slice(0, 6).map(activity => `
            <div class="activity-item">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 18l-7-7 7-7 7 7-7 7z" stroke="#0e5a36" stroke-width="1.5" fill="none"/>
                </svg>
                <span>${activity}</span>
            </div>
        `).join('');
    }
    
    // Load package type details
    document.getElementById('pkgCategory').textContent = pkg.type;
    document.getElementById('pkgStaying').textContent = '3 Hotels'; // Default
    document.getElementById('pkgPerson').textContent = '2-4 Adults';
    document.getElementById('pkgOther').textContent = pkg.exclusions?.[0] || 'Not Included';
    document.getElementById('pkgMeals').textContent = 'As per itinerary';
    document.getElementById('pkgHotels').textContent = `Standard ${pkg.type} accommodation`;
}

function loadItineraryTab(pkg) {
    const itineraryList = document.getElementById('itineraryList');
    if (!itineraryList) return;
    
    if (pkg.itinerary && pkg.itinerary.length > 0) {
        itineraryList.innerHTML = pkg.itinerary.map((day, index) => `
            <div class="itinerary-day" id="day-${index}">
                <div class="day-header" onclick="toggleDay(${index})">
                    <div class="day-title">Day ${day.day}</div>
                    <svg class="day-toggle" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M6 8l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="day-content">
                    <div class="day-details">
                        <h4>${day.title}</h4>
                        <p>${day.activities}</p>
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        itineraryList.innerHTML = `
            <div class="itinerary-day">
                <div class="day-header">
                    <div class="day-title">Day 1</div>
                </div>
                <div class="day-content" style="max-height: 200px;">
                    <div class="day-details">
                        <h4>Arrival & Check-in</h4>
                        <p>Arrive at destination, hotel check-in, welcome briefing, and leisure time.</p>
                    </div>
                </div>
            </div>
            <div class="itinerary-day">
                <div class="day-header">
                    <div class="day-title">Day 2-3</div>
                </div>
                <div class="day-content">
                    <div class="day-details">
                        <h4>Sightseeing & Activities</h4>
                        <p>Explore major attractions, local experiences, and adventure activities as per package.</p>
                    </div>
                </div>
            </div>
            <div class="itinerary-day">
                <div class="day-header">
                    <div class="day-title">Final Day</div>
                </div>
                <div class="day-content">
                    <div class="day-details">
                        <h4>Departure</h4>
                        <p>Check-out from hotel, transfer to airport/railway station, journey back home.</p>
                    </div>
                </div>
            </div>
        `;
    }
}

function loadBudgetTab(pkg) {
    // Load inclusions
    const inclusionsList = document.getElementById('inclusionsList');
    if (inclusionsList && pkg.inclusions && pkg.inclusions.length > 0) {
        inclusionsList.innerHTML = pkg.inclusions.map(item => `<li>${item}</li>`).join('');
    }
    
    // Load exclusions
    const exclusionsList = document.getElementById('exclusionsList');
    if (exclusionsList && pkg.exclusions && pkg.exclusions.length > 0) {
        exclusionsList.innerHTML = pkg.exclusions.map(item => `<li>${item}</li>`).join('');
    }
    
    // Load statistics
    document.getElementById('statBookings').textContent = pkg.bookingsCount || 0;
    document.getElementById('statRating').textContent = `${pkg.rating || 0} ⭐`;
    document.getElementById('statReviews').textContent = pkg.reviewCount || 0;
    document.getElementById('statAvailability').textContent = pkg.availability || 'Available';
}

function loadHotelsTab(pkg) {
    const hotelsList = document.getElementById('hotelsList');
    if (!hotelsList) return;
    
    // Default hotel information
    hotelsList.innerHTML = `
        <div class="hotel-item">
            <div class="hotel-icon">🏨</div>
            <div class="hotel-details">
                <h4>Accommodation Type</h4>
                <p>${pkg.type} category hotels with modern amenities including AC, WiFi, and breakfast facilities.</p>
            </div>
        </div>
        <div class="hotel-item">
            <div class="hotel-icon">🍽️</div>
            <div class="hotel-details">
                <h4>Meal Plan</h4>
                <p>Daily breakfast included at the hotel. Other meals as specified in the package itinerary.</p>
            </div>
        </div>
        <div class="hotel-item">
            <div class="hotel-icon">🛏️</div>
            <div class="hotel-details">
                <h4>Room Category</h4>
                <p>Standard double/twin sharing rooms. Extra bed available on request for additional charges.</p>
            </div>
        </div>
    `;
}

// ============================================================================
// TAB SWITCHING
// ============================================================================

function switchDetailTab(tabName) {
    currentTab = tabName;
    
    // Update tab buttons
    document.querySelectorAll('.package-tab').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const activeTab = document.getElementById(`${tabName}Tab`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
}

// ============================================================================
// ACCORDION TOGGLES
// ============================================================================

function toggleDay(dayIndex) {
    const dayElement = document.getElementById(`day-${dayIndex}`);
    if (dayElement) {
        dayElement.classList.toggle('open');
    }
}

function togglePolicy(policyType) {
    const policyItem = document.querySelector(`#${policyType}Policy`).parentElement;
    if (policyItem) {
        policyItem.classList.toggle('open');
    }
}

// ============================================================================
// NAVIGATION
// ============================================================================

function goBack() {
    window.location.href = 'admin-packages.html';
}

function editCurrentPackage() {
    if (currentPackage) {
        window.location.href = `admin-package-form.html?edit=${currentPackage.id}`;
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getCategoryText(category) {
    const categoryMap = {
        '4nights': '3N4D',
        '5nights': '4N5D',
        '6nights': '5N6D',
        '7nights': '6N7D',
        'custom': 'Custom'
    };
    return categoryMap[category] || category;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function showError(message) {
    const container = document.querySelector('.package-view-container');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <h2 style="color: #dc2626; margin-bottom: 16px;">Error</h2>
                <p style="color: #6b7280; margin-bottom: 24px;">${message}</p>
                <button onclick="goBack()" class="btn-edit-package">Go Back to Packages</button>
            </div>
        `;
    }
}

// ============================================================================
// EXPORT FUNCTIONS FOR GLOBAL ACCESS
// ============================================================================

window.switchDetailTab = switchDetailTab;
window.toggleDay = toggleDay;
window.togglePolicy = togglePolicy;
window.goBack = goBack;
window.editCurrentPackage = editCurrentPackage;
