/**
 * Packages Dashboard - JavaScript
 * Trip On Admin Dashboard - Packages Management
 */

// ============================================================================
// GLOBAL STATE
// ============================================================================

let packagesData = initializePackagesData();
let currentPackageId = null;
let currentPage = 1;
let itemsPerPage = 10;
let filteredPackages = [];

// ============================================================================
// INITIALIZATION
// ============================================================================

window.addEventListener('DOMContentLoaded', function () {
    // Check authentication
    if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'admin-login.html';
        return;
    }

    initializePackagesDashboard();
});

/**
 * Initialize packages dashboard
 */
function initializePackagesDashboard() {
    updateUserDisplay();
    refreshPackagesTable();
    initializePackageFilters();
    attachPackageEventListeners();

    console.log('Packages dashboard initialized');
}

/**
 * Update user display
 */
function updateUserDisplay() {
    const userName = sessionStorage.getItem('adminName') || 'Admin User';
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement) {
        userNameElement.textContent = userName;
    }
}

/**
 * Attach event listeners
 */
function attachPackageEventListeners() {
    // Add new package button
    const addNewBtn = document.getElementById('addNewPackageBtn');
    if (addNewBtn) {
        addNewBtn.addEventListener('click', function () {
            document.getElementById('addPackageForm').reset();
            openModal('addPackageModal');
        });
    }

    // Menu toggle
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }

    // Close modals on outside click
    window.addEventListener('click', handleOutsideClick);
}

// ============================================================================
// MODAL FUNCTIONS
// ============================================================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function handleOutsideClick(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============================================================================
// TABLE RENDERING
// ============================================================================

function refreshPackagesTable() {
    const tbody = document.getElementById('packagesTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    packagesData.forEach(pkg => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>
                <div class="package-id">${pkg.packageId}</div>
                <div class="package-name">${pkg.name}</div>
            </td>
            <td>${pkg.location}</td>
            <td>${pkg.duration}</td>
            <td>${pkg.type}</td>
            <td>₹${pkg.price.toLocaleString('en-IN')}</td>
            <td>
                <div class="rating-display">
                    <i class="fa-solid fa-star"></i> ${pkg.rating} (${pkg.reviewCount})
                </div>
            </td>
            <td>
                <span class="status-badge status-${pkg.status}">${formatStatus(pkg.status)}</span>
            </td>
            <td>${pkg.bookingsCount}</td>
            <td>
                <div class="three-dots-menu">
                    <button class="three-dots-btn" onclick="togglePackageMenu(${pkg.id}, event)">⋮</button>
                    <div class="three-dots-dropdown" id="packageMenu-${pkg.id}">
                        <div class="dots-option" onclick="viewPackage(${pkg.id})">
                            <i class="fa-solid fa-eye"></i> View Details
                        </div>
                        <div class="dots-option" onclick="editPackage(${pkg.id})">
                            <i class="fa-solid fa-pen"></i> Edit
                        </div>
                        <div class="dots-option" onclick="duplicatePackage(${pkg.id})">
                            <i class="fa-solid fa-copy"></i> Duplicate
                        </div>
                        <div class="dots-option dots-option-delete" onclick="deletePackageFromMenu(${pkg.id})">
                            <i class="fa-solid fa-trash"></i> Delete
                        </div>
                    </div>
                </div>
            </td>
        `;
    });
}

function formatStatus(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

// ============================================================================
// PACKAGE OPERATIONS
// ============================================================================

function viewPackage(packageId) {
    const pkg = packagesData.find(p => p.id === packageId);
    if (!pkg) return;

    currentPackageId = packageId;

    // Populate view modal
    document.getElementById('viewPackageId').textContent = pkg.packageId;
    document.getElementById('viewPackageName').textContent = pkg.name;
    document.getElementById('viewLocation').textContent = pkg.location;
    document.getElementById('viewDuration').textContent = pkg.duration;
    document.getElementById('viewPrice').textContent = `₹${pkg.price.toLocaleString('en-IN')}`;
    document.getElementById('viewType').textContent = pkg.type;
    document.getElementById('viewRating').textContent = `${pkg.rating} (${pkg.reviewCount} reviews)`;
    document.getElementById('viewStatus').textContent = formatStatus(pkg.status);
    document.getElementById('viewBookings').textContent = pkg.bookingsCount;
    document.getElementById('viewDescription').textContent = pkg.description;

    openModal('viewPackageModal');
}

function editPackage(packageId) {
    const pkg = packagesData.find(p => p.id === packageId);
    if (!pkg) return;

    currentPackageId = packageId;

    // Populate edit form
    document.getElementById('editPackageId').value = pkg.packageId;
    document.getElementById('editPackageName').value = pkg.name;
    document.getElementById('editLocation').value = pkg.location;
    document.getElementById('editDuration').value = pkg.duration;
    document.getElementById('editPrice').value = pkg.price;
    document.getElementById('editType').value = pkg.type;
    document.getElementById('editCategory').value = pkg.category;
    document.getElementById('editStatus').value = pkg.status;
    document.getElementById('editDescription').value = pkg.description;

    openModal('editPackageModal');
}

function saveEditPackage() {
    if (!currentPackageId) {
        alert('Error: No package selected');
        return;
    }

    const updates = {
        packageId: document.getElementById('editPackageId').value,
        name: document.getElementById('editPackageName').value,
        location: document.getElementById('editLocation').value,
        duration: document.getElementById('editDuration').value,
        price: parseFloat(document.getElementById('editPrice').value),
        type: document.getElementById('editType').value,
        category: document.getElementById('editCategory').value,
        status: document.getElementById('editStatus').value,
        description: document.getElementById('editDescription').value
    };

    const updated = updatePackage(packagesData, currentPackageId, updates);

    if (updated) {
        alert('✅ Package updated successfully!');
        closeModal('editPackageModal');
        packagesData = initializePackagesData();
        refreshPackagesTable();
    } else {
        alert('❌ Error updating package');
    }
}

function duplicatePackage(packageId) {
    const pkg = packagesData.find(p => p.id === packageId);
    if (!pkg) return;

    if (confirm(`Duplicate package "${pkg.name}"?`)) {
        const newPackage = {
            ...pkg,
            name: `${pkg.name} (Copy)`,
            status: 'draft'
        };
        delete newPackage.id;
        delete newPackage.packageId;

        addNewPackage(packagesData, newPackage);
        packagesData = initializePackagesData();
        refreshPackagesTable();
        alert('✅ Package duplicated successfully!');
    }
}

function deletePackageFromMenu(packageId) {
    const pkg = packagesData.find(p => p.id === packageId);
    if (!pkg) return;

    if (confirm(`Are you sure you want to delete "${pkg.name}"?`)) {
        const success = deletePackage(packagesData, packageId);
        if (success) {
            packagesData = initializePackagesData();
            refreshPackagesTable();
            alert('✅ Package deleted successfully!');
        }
    }
}
