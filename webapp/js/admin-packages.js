/**
 * Admin Packages Management System
 * Handles all package CRUD operations and UI interactions
 */

// ============================================================================
// GLOBAL STATE
// ============================================================================

let currentTab = 'all';
let currentDurationFilter = 'all';
let editingPackageId = null;

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    loadPackages();
});

function initializePage() {
    // Set default view
    switchTab('all');
    
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
// TAB SWITCHING
// ============================================================================

function switchTab(tab) {
    currentTab = tab;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide views
    const allView = document.getElementById('allPackagesView');
    const popularView = document.getElementById('popularPackagesView');
    
    if (tab === 'all') {
        allView.style.display = 'block';
        popularView.style.display = 'none';
    } else {
        allView.style.display = 'none';
        popularView.style.display = 'block';
        loadPopularPackages();
    }
}

// ============================================================================
// DURATION FILTERING
// ============================================================================

function filterByDuration(duration) {
    currentDurationFilter = duration;
    
    // Update active button
    document.querySelectorAll('.duration-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.duration === duration) {
            btn.classList.add('active');
        }
    });
    
    // You can implement actual filtering logic here if needed
    console.log('Filtering by duration:', duration);
}

// ============================================================================
// LOAD PACKAGES
// ============================================================================

function loadPackages() {
    // Initialize packages data if needed
    const packages = getAllPackages();
    console.log('Loaded packages:', packages);
}

function loadPopularPackages() {
    const popularPackages = getPopularPackages();
    const grid = document.getElementById('popularPackagesGrid');
    
    if (!grid) return;
    
    if (popularPackages.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <h3>No Popular Packages Yet</h3>
                <p>Packages with budget over ₹1 Lakh or marked as featured will appear here.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = popularPackages.map(pkg => createPackageCard(pkg)).join('');
}

function createPackageCard(pkg) {
    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(pkg.price);
    
    return `
        <div class="popular-package-card">
            <img src="${pkg.image}" alt="${pkg.name}" class="package-image" 
                 onerror="this.src='../assets/images/hero.png'" 
                 onclick="viewPackageDetails(${pkg.id})" 
                 style="cursor: pointer;">
            <div class="package-content">
                <div class="package-header">
                    <div>
                        <h3 class="package-title">${pkg.name}</h3>
                        <div class="package-location">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="meta-icon">
                                <path d="M7 1C4.8 1 3 2.8 3 5c0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4zm0 5.5c-.8 0-1.5-.7-1.5-1.5S6.2 3.5 7 3.5 8.5 4.2 8.5 5 7.8 6.5 7 6.5z" fill="currentColor"/>
                            </svg>
                            ${pkg.location}
                        </div>
                    </div>
                    <div class="package-price">${formattedPrice}</div>
                </div>
                <div class="package-meta">
                    <div class="meta-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="meta-icon">
                            <rect x="2" y="3" width="12" height="11" rx="1" stroke="currentColor" stroke-width="1.5"/>
                            <line x1="2" y1="7" x2="14" y2="7" stroke="currentColor" stroke-width="1.5"/>
                            <line x1="5" y1="1" x2="5" y2="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            <line x1="11" y1="1" x2="11" y2="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                        ${pkg.duration}
                    </div>
                    <div class="meta-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="meta-icon">
                            <path d="M8 1l2 4 4.5.5-3.25 3 .75 4.5L8 11l-4 2 .75-4.5-3.25-3L6 5l2-4z" fill="currentColor"/>
                        </svg>
                        ${pkg.rating} (${pkg.reviewCount})
                    </div>
                    <div class="meta-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="meta-icon">
                            <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
                            <path d="M8 4v4l2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                        ${pkg.bookingsCount} bookings
                    </div>
                </div>
                <div class="package-actions" onclick="event.stopPropagation()">
                    <button class="btn-view" onclick="viewPackageDetails(${pkg.id})">View Details</button>
                    <button class="btn-edit" onclick="openEditPackageModal(${pkg.id})">Edit</button>
                </div>
            </div>
        </div>
    `;
}

// ============================================================================
// NAVIGATION
// ============================================================================

function navigateToPackageType(type) {
    console.log('Navigating to package type:', type);
    alert(`Package type "${type}" page will be implemented. This will show specific packages for ${type} category.`);
}

// ============================================================================
// ADD PACKAGE - Redirect to Form
// ============================================================================

function openAddPackageModal() {
    window.location.href = 'admin-package-form.html';
}

// ============================================================================
// EDIT PACKAGE - Redirect to Form
// ============================================================================

function openEditPackageModal(packageId) {
    window.location.href = `admin-package-form.html?edit=${packageId}`;
}

// These functions are kept for backward compatibility but redirect to form page
function closePackageModal() {
    // Not used anymore - redirects to form page
}

function savePackage() {
    // Not used anymore - handled in form page
}

// ============================================================================
// VIEW PACKAGE DETAILS
// ============================================================================

function viewPackageDetails(packageId) {
    // Redirect to detailed view page
    window.location.href = `admin-package-view.html?id=${packageId}`;
}

// ============================================================================
// MODAL CLOSE ON OUTSIDE CLICK
// ============================================================================

window.onclick = function(event) {
    const packageModal = document.getElementById('packageModal');
    
    if (event.target === packageModal) {
        closePackageModal();
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// ============================================================================
// EXPORT FUNCTIONS FOR GLOBAL ACCESS
// ============================================================================

window.switchTab = switchTab;
window.filterByDuration = filterByDuration;
window.navigateToPackageType = navigateToPackageType;
window.openAddPackageModal = openAddPackageModal;
window.closePackageModal = closePackageModal;
window.openEditPackageModal = openEditPackageModal;
window.savePackage = savePackage;
window.viewPackageDetails = viewPackageDetails;
