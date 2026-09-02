/**
 * Admin Package Form
 * Handles add/edit package functionality
 */

// ============================================================================
// GLOBAL STATE
// ============================================================================

let isEditMode = false;
let currentPackageId = null;
let dayCounter = 0;

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    checkEditMode();
});

function initializeForm() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }
    
    // Initialize mobile menu handlers
    initializeMobileMenu();
    
    // Initialize image URL input handler
    handleImageUrlInput();
    
    // For new packages, don't add default days yet - they'll be added when mode is confirmed
}

function initializeMobileMenu() {
    // Mobile menu button (in mobile header)
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            if (sidebar) {
                sidebar.classList.toggle('active');
            }
            if (overlay) {
                overlay.classList.toggle('active');
            }
        });
    }
    
    // Close sidebar when clicking overlay
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.remove('active');
            }
            this.classList.remove('active');
        });
    }
    
    // Mobile profile button
    const mobileProfileBtn = document.getElementById('mobileProfileBtn');
    if (mobileProfileBtn) {
        mobileProfileBtn.addEventListener('click', function() {
            if (confirm('Do you want to logout?')) {
                sessionStorage.removeItem('adminLoggedIn');
                sessionStorage.removeItem('adminEmail');
                window.location.href = 'admin-login.html';
            }
        });
    }
    
    // Close sidebar when clicking a nav link (mobile)
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById('sidebar');
                const overlay = document.getElementById('sidebarOverlay');
                if (sidebar) {
                    sidebar.classList.remove('active');
                }
                if (overlay) {
                    overlay.classList.remove('active');
                }
            }
        });
    });
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }
}

// ============================================================================
// CHECK EDIT MODE
// ============================================================================

function checkEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const packageId = urlParams.get('id');
    const editId = urlParams.get('edit');
    
    if (packageId || editId) {
        isEditMode = true;
        currentPackageId = parseInt(packageId || editId);
        loadPackageForEdit(currentPackageId);
        
        // Update UI elements that exist
        const submitBtn = document.getElementById('submitBtnText');
        if (submitBtn) {
            submitBtn.textContent = 'Update Package';
        }
        
        const formTitle = document.getElementById('formCategoryTitle');
        if (formTitle) {
            formTitle.textContent = 'Edit Package';
        }
        
        const pageTitle = document.getElementById('formPageTitle');
        if (pageTitle) {
            pageTitle.textContent = 'Edit Package';
        }
    } else {
        isEditMode = false;
        
        const submitBtn = document.getElementById('submitBtnText');
        if (submitBtn) {
            submitBtn.textContent = 'Create Package';
        }
        
        // Initialize with default days for new package
        initializeDefaultDays();
    }
}

function initializeDefaultDays() {
    // Clear container first
    document.getElementById('daysContainer').innerHTML = '';
    dayCounter = 0;
    
    // Day 1 open by default, Days 2-4 collapsed
    addDayItemWithStructure(1, true);
    
    addDayItemWithStructure(2, false);

    addDayItemWithStructure(3, false);

    addDayItemWithStructure(4, false);
}

function addDayItemWithStructure(dayNum, isOpen) {
    dayCounter++;
    const container = document.getElementById('daysContainer');
    
    const dayItem = document.createElement('div');
    dayItem.className = 'day-item';
    dayItem.id = `day-${dayCounter}`;
    if (isOpen) {
        dayItem.classList.add('open');
    }
    
    let dayTitle = '';
    let dayActivities = '';
    let dayDetails = '';
    
    if (dayNum === 1) {
        dayTitle = 'Day 1';
        dayActivities = '';
        dayDetails = `
<div class="day-expanded-section">
    <div class="day-subsection">
        <h4>Day / Activity Title</h4>
        <input type="text" class="form-input" placeholder="e.g., Arrival & Check-in" value="Day 1 - Arrival & Check-in">
    </div>

    <div class="day-subsection">
        <h4>Activity / Service Details</h4>
        <div class="form-grid">
            <div class="economy-item">
                <label>Activity Name</label>
                <input type="text" class="form-input-sm" value="On-Ground Assistance by Tour Manager - 1hr" placeholder="Activity name">
            </div>
            <div class="economy-item">
                <label>Location</label>
                <input type="text" class="form-input-sm" placeholder="Location">
            </div>
        </div>
        <div class="form-grid">
            <div class="economy-item">
                <label>Timing</label>
                <input type="text" class="form-input-sm" placeholder="e.g., 10:00 AM - 2:00 PM">
            </div>
            <div class="economy-item">
                <label>Description</label>
                <input type="text" class="form-input-sm" placeholder="Short activity description">
            </div>
        </div>
        <div class="economy-description">
            <label>Additional Details</label>
            <textarea class="form-textarea-sm" rows="2" placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore."></textarea>
        </div>
    </div>

    <div class="day-subsection">
        <h4>Day 1 Description</h4>
        <textarea class="form-textarea-sm" rows="3" placeholder="Describe what happens during the day, activities included, instructions and timing information...">On arrival, meet your tour manager who assists with the check-in process. Afternoon at leisure, followed by a welcome dinner.</textarea>
    </div>
</div>`;
    } else {
        dayTitle = 'Day ' + dayNum;
        dayActivities = '';
        dayDetails = `
<div class="day-expanded-section">
    <div class="day-subsection">
        <h4>Day / Activity Title</h4>
        <input type="text" class="form-input" placeholder="e.g., Sightseeing & Exploration">
    </div>
    <div class="day-subsection">
        <h4>Day ${dayNum} Description</h4>
        <textarea class="form-textarea-sm" rows="3" placeholder="Describe the activities and itinerary details for this day..."></textarea>
    </div>
</div>`;
    }
    
    dayItem.innerHTML = `
        <div class="day-item-header" onclick="toggleDayAccordion(${dayCounter})">
            <span class="day-arrow">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
            <span class="day-number">${dayTitle}</span>
            <button type="button" class="btn-remove-day" onclick="event.stopPropagation();removeDayItem(${dayCounter})">Remove</button>
        </div>
        <div class="day-fields">
            <div class="form-group">
                <label>Day Title</label>
                <input type="text" class="form-input day-title" placeholder="e.g., Arrival & Check-in" value="${dayTitle}">
            </div>
            <div class="form-group">
                <label>Activities</label>
                <textarea class="form-textarea day-activities" rows="3" placeholder="Describe the day's activities...">${dayActivities}</textarea>
            </div>
            <div class="day-details-section">
                ${dayDetails}
            </div>
        </div>
    `;
    
    container.appendChild(dayItem);
}

function loadPackageForEdit(packageId) {
    const pkg = getPackageById(packageId);
    
    if (!pkg) {
        alert('Package not found!');
        goBack();
        return;
    }
    
    // Load basic info
    document.getElementById('packageName').value = pkg.name;
    document.getElementById('packageLocation').value = pkg.location;
    document.getElementById('packageDuration').value = pkg.category;
    document.getElementById('packageType').value = pkg.type;
    document.getElementById('packagePrice').value = pkg.price;
    document.getElementById('packageStatus').value = pkg.status;
    document.getElementById('packageDescription').value = pkg.description;
    
    // Handle featured checkbox
    const featuredCheckbox = document.getElementById('packageFeatured');
    if (featuredCheckbox) {
        featuredCheckbox.checked = pkg.featured || false;
    }
    
    // Load and display existing image in the upload area
    if (pkg.image) {
        const imageUrlInput = document.getElementById('packageImageUrl');
        if (imageUrlInput) {
            imageUrlInput.value = pkg.image;
            displayImagePreview(pkg.image);
        }
    }
    
    // Load package type info with defaults if not present
    document.getElementById('typeCategory').value = pkg.typeCategory || pkg.type || '';
    document.getElementById('typeStaying').value = pkg.typeStaying || '3 Hotels';
    document.getElementById('typePerson').value = pkg.typePerson || '2-4 Adults';
    document.getElementById('typeMeals').value = pkg.typeMeals || 'Breakfast included';
    document.getElementById('typeHotels').value = pkg.typeHotels || 'Standard accommodation';
    document.getElementById('typeOther').value = pkg.typeOther || 'Not included';
    
    // Load itinerary
    if (pkg.itinerary && pkg.itinerary.length > 0) {
        // Clear default day
        document.getElementById('daysContainer').innerHTML = '';
        dayCounter = 0;
        
        pkg.itinerary.forEach(day => {
            addDayItem(day.title, day.activities);
        });
    }
    
    // Load policies
    document.getElementById('cancellationPolicy').value = pkg.cancellationPolicy || 'Standard cancellation policy applies. Please contact for details.';
    document.getElementById('instructions').value = pkg.instructions || 'Please carry valid ID proof. Check-in time is 2 PM, check-out is 11 AM.';
    
    updateCategoryTitle();
}

// ============================================================================
// IMAGE HANDLING
// ============================================================================

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            displayImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

function displayImagePreview(src) {
    const preview = document.getElementById('previewImg');
    const placeholder = document.getElementById('uploadPlaceholder');
    const overlay = document.getElementById('imageOverlay');
    
    if (preview && placeholder) {
        preview.src = src;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
        
        // Show overlay on hover
        if (overlay) {
            preview.addEventListener('mouseenter', function() {
                overlay.style.opacity = '1';
                overlay.style.display = 'flex';
            });
            
            preview.addEventListener('mouseleave', function() {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    if (overlay.style.opacity === '0') {
                        overlay.style.display = 'none';
                    }
                }, 300);
            });
        }
        
        // Make image clickable to redirect to view page
        preview.style.cursor = 'pointer';
        preview.onclick = function() {
            if (currentPackageId && isEditMode) {
                // If editing existing package, redirect to view page
                window.open(`admin-package-view.html?id=${currentPackageId}`, '_blank');
            } else {
                // If new package, show message
                alert('Save the package first to view the details page');
            }
        };
        
        preview.onerror = function() {
            this.style.display = 'none';
            placeholder.style.display = 'flex';
            if (overlay) {
                overlay.style.display = 'none';
            }
            alert('Failed to load image. Please check the URL.');
        };
    }
}

// Handle image URL input
function handleImageUrlInput() {
    const imageUrlInput = document.getElementById('packageImageUrl');
    if (imageUrlInput) {
        imageUrlInput.addEventListener('input', function() {
            const url = this.value.trim();
            if (url) {
                displayImagePreview(url);
            }
        });
    }
}

// ============================================================================
// CATEGORY DISPLAY UPDATE
// ============================================================================

function updateCategoryTitle() {
    const duration = document.getElementById('packageDuration').value;
    const type = document.getElementById('packageType').value;
    
    let durationText = '';
    switch(duration) {
        case '4nights': durationText = '3N4D'; break;
        case '5nights': durationText = '4N5D'; break;
        case '6nights': durationText = '5N6D'; break;
        case '7nights': durationText = '6N7D'; break;
        case 'custom': durationText = 'Custom'; break;
        default: durationText = '';
    }
    
    const displayText = durationText && type ? `${durationText} ${type}` : (isEditMode ? 'Edit Package' : 'New Package');
    
    const categoryDisplay = document.getElementById('formCategoryTitle');
    if (categoryDisplay) {
        categoryDisplay.textContent = displayText;
    }
}

// ============================================================================
// DAY ITEMS MANAGEMENT
// ============================================================================

function addDayItem(title = '', activities = '') {
    dayCounter++;
    const container = document.getElementById('daysContainer');
    
    const dayItem = document.createElement('div');
    dayItem.className = 'day-item';
    dayItem.id = `day-${dayCounter}`;
    
    dayItem.innerHTML = `
        <div class="day-item-header" onclick="toggleDayAccordion(${dayCounter})">
            <span class="day-arrow">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
            <span class="day-number">Day ${dayCounter}</span>
            <button type="button" class="btn-remove-day" onclick="event.stopPropagation();removeDayItem(${dayCounter})">Remove</button>
        </div>
        <div class="day-fields">
            <div class="form-group">
                <label>Day Title</label>
                <input type="text" class="form-input day-title" placeholder="e.g., Arrival & Check-in" value="${title}">
            </div>
            <div class="form-group">
                <label>Activities</label>
                <textarea class="form-textarea day-activities" rows="3" placeholder="Describe the day's activities...">${activities}</textarea>
            </div>
        </div>
    `;
    
    container.appendChild(dayItem);
}

function removeDayItem(dayId) {
    const dayItem = document.getElementById(`day-${dayId}`);
    if (dayItem) {
        dayItem.remove();
        renumberDays();
    }
}

function renumberDays() {
    const dayItems = document.querySelectorAll('.day-item');
    dayItems.forEach((item, index) => {
        const dayNumber = item.querySelector('.day-number');
        if (dayNumber) {
            dayNumber.textContent = `Day ${index + 1}`;
        }
    });
}

// ============================================================================
// COLLAPSIBLE SECTIONS
// ============================================================================

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const parent = section.closest('.collapsible-section');
    if (parent) {
        parent.classList.toggle('collapsed');
    }
}

// Toggle the day itinerary accordion open/closed
function toggleDayAccordion(dayId) {
    const dayItem = document.getElementById(`day-${dayId}`);
    if (dayItem) {
        dayItem.classList.toggle('open');
    }
}

// Toggle a plain collapsible section by id
function toggleCollapsible(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.toggle('collapsed');
    }
}

// Add a "Why This Package" reason input row
function addWhyItem() {
    const container = document.getElementById('whyListContainer');
    if (!container) { return; }
    const item = document.createElement('div');
    item.className = 'why-item';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-input';
    input.placeholder = 'e.g., Special experiences, unique benefits, included services';
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn-add-reason btn-remove';
    removeBtn.textContent = '×';
    removeBtn.onclick = function() { item.remove(); };
    item.appendChild(input);
    item.appendChild(removeBtn);
    container.appendChild(item);
}

// ============================================================================
// FORM SUBMISSION
// ============================================================================

function submitPackage() {
    if (!validateForm()) {
        return;
    }
    
    const packageData = collectFormData();
    
    if (isEditMode) {
        // Update existing package
        updatePackage(currentPackageId, packageData);
        alert('Package updated successfully!');
    } else {
        // Create new package
        const newPackage = addPackage(packageData);
        alert('Package created successfully!');
        currentPackageId = newPackage.id;
    }
    
    // Redirect to view page
    window.location.href = `admin-package-view.html?id=${currentPackageId}`;
}

function validateForm() {
    const form = document.getElementById('packageForm');
    const requiredFields = form.querySelectorAll('[required]');
    
    for (let field of requiredFields) {
        if (!field.value.trim()) {
            alert('Please fill in all required fields marked with *');
            field.focus();
            return false;
        }
    }
    
    // Validate image - check if there's a preview image displayed or URL
    const imageUrl = document.getElementById('packageImageUrl').value.trim();
    const previewImage = document.getElementById('previewImg');
    const hasPreviewImage = previewImage && previewImage.style.display !== 'none' && previewImage.src;
    
    if (!imageUrl && !hasPreviewImage) {
        alert('Please upload an image or provide an image URL');
        return false;
    }
    
    return true;
}

function collectFormData() {
    // Basic info
    const name = document.getElementById('packageName').value.trim();
    const location = document.getElementById('packageLocation').value.trim();
    const destination = document.getElementById('pkgDestination') ? document.getElementById('pkgDestination').value : '';
    const duration = document.getElementById('packageDuration').value;
    const type = document.getElementById('packageType').value;
    const price = parseInt(document.getElementById('packagePrice').value);
    const status = document.getElementById('packageStatus').value;
    const description = document.getElementById('packageDescription').value.trim();
    const featured = document.getElementById('packageFeatured').checked;
    
    // Image - preserve existing or use new
    const imageUrlInput = document.getElementById('packageImageUrl').value.trim();
    const previewImage = document.getElementById('previewImg');
    let imageUrl = imageUrlInput;
    
    // If no URL but preview is shown, get the preview src
    if (!imageUrl && previewImage && previewImage.style.display !== 'none' && previewImage.src) {
        imageUrl = previewImage.src;
    }
    
    // Package type info
    const typeCategory = document.getElementById('typeCategory').value.trim();
    const typeStaying = document.getElementById('typeStaying').value.trim();
    const typePerson = document.getElementById('typePerson').value.trim();
    const typeMeals = document.getElementById('typeMeals').value.trim();
    const typeHotels = document.getElementById('typeHotels').value.trim();
    const typeOther = document.getElementById('typeOther').value.trim();
    
    // Collect days
    const dayItems = document.querySelectorAll('.day-item');
    const itinerary = [];
    dayItems.forEach((item, index) => {
        const title = item.querySelector('.day-title').value.trim();
        const activities = item.querySelector('.day-activities').value.trim();
        if (title || activities) {
            itinerary.push({
                day: index + 1,
                title: title || `Day ${index + 1}`,
                activities: activities
            });
        }
    });
    
    // Policies
    const cancellationPolicy = document.getElementById('cancellationPolicy').value.trim();
    const instructions = document.getElementById('instructions').value.trim();
    
    // Duration text
    const durationMap = {
        '4nights': '4 Days 3 Nights',
        '5nights': '5 Days 4 Nights',
        '6nights': '6 Days 5 Nights',
        '7nights': '7 Days 6 Nights',
        'custom': 'Custom Duration'
    };
    
    // Default exclusions if not specified
    const exclusions = ['International flights', 'Travel insurance', 'Personal expenses', 'Meals not mentioned in itinerary'];
    
    return {
        name,
        location,
        destination,
        duration: durationMap[duration] || duration,
        category: duration,
        type,
        price,
        currency: 'INR',
        status,
        description,
        featured,
        image: imageUrl,
        pageUrl: generatePageUrl(name),
        inclusions: ['Accommodation', 'Transportation', 'Sightseeing', 'Tour guide'],
        exclusions,
        itinerary,
        typeCategory,
        typeStaying,
        typePerson,
        typeMeals,
        typeHotels,
        typeOther,
        cancellationPolicy,
        instructions
    };
}

function generatePageUrl(name) {
    return '../packages/' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.html';
}

// ============================================================================
// PREVIEW
// ============================================================================

function previewPackage() {
    if (!validateForm()) {
        return;
    }
    
    // Save as draft first
    const packageData = collectFormData();
    packageData.status = 'draft';
    
    let previewId;
    if (isEditMode) {
        updatePackage(currentPackageId, packageData);
        previewId = currentPackageId;
    } else {
        const newPackage = addPackage(packageData);
        previewId = newPackage.id;
    }
    
    // Open preview in new tab
    window.open(`admin-package-view.html?id=${previewId}`, '_blank');
}

// ============================================================================
// NAVIGATION
// ============================================================================

function goBack() {
    window.location.href = 'admin-packages.html';
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

window.handleImageUpload = handleImageUpload;
window.updateCategoryTitle = updateCategoryTitle;
window.addDay = addDayItem;
window.removeDayItem = removeDayItem;
window.toggleSection = toggleSection;
window.toggleDayAccordion = toggleDayAccordion;
window.toggleCollapsible = toggleCollapsible;
window.addWhyItem = addWhyItem;
window.submitPackage = submitPackage;
window.saveDraft = function() {
    if (!validateForm()) {
        return;
    }
    
    const packageData = collectFormData();
    packageData.status = 'draft';
    
    if (isEditMode) {
        updatePackage(currentPackageId, packageData);
        alert('Package saved as draft!');
    } else {
        const newPackage = addPackage(packageData);
        currentPackageId = newPackage.id;
        isEditMode = true;
        alert('Package saved as draft!');
        // Update URL to edit mode
        const newUrl = `${window.location.pathname}?id=${currentPackageId}`;
        window.history.replaceState(null, '', newUrl);
    }
};
window.previewPackage = previewPackage;
window.goBack = goBack;

// ============================================================================
// DESTINATION CUSTOM DROPDOWN
// ============================================================================

function togglePkgFormDropdown(fieldId) {
    var menu = document.getElementById(fieldId + 'Menu');
    var triggerEl = document.getElementById(fieldId + 'Dropdown');
    var trigger = triggerEl ? triggerEl.querySelector('.custom-form-dropdown-trigger') : null;
    var isOpen = menu && menu.classList.contains('show');
    document.querySelectorAll('.custom-form-dropdown-menu.show').forEach(function (m) { m.classList.remove('show'); });
    document.querySelectorAll('.custom-form-dropdown-trigger.open').forEach(function (t) { t.classList.remove('open'); });
    if (!isOpen && menu && trigger) {
        menu.classList.add('show');
        trigger.classList.add('open');
    }
}

function selectPkgFormDropdown(fieldId, value) {
    var valueEl = document.getElementById(fieldId + 'Value');
    var menu = document.getElementById(fieldId + 'Menu');
    var triggerEl = document.getElementById(fieldId + 'Dropdown');
    var trigger = triggerEl ? triggerEl.querySelector('.custom-form-dropdown-trigger') : null;
    var hidden = document.getElementById(fieldId);
    if (valueEl) { valueEl.textContent = value; }
    if (menu) { menu.classList.remove('show'); }
    if (trigger) { trigger.classList.remove('open'); }
    if (menu) {
        menu.querySelectorAll('.custom-form-dropdown-item').forEach(function (item) {
            item.classList.toggle('active', item.textContent === value);
        });
    }
    if (hidden) { hidden.value = value; }
}

document.addEventListener('click', function (e) {
    if (!e.target.closest('.custom-form-dropdown')) {
        document.querySelectorAll('.custom-form-dropdown-menu.show').forEach(function (m) { m.classList.remove('show'); });
        document.querySelectorAll('.custom-form-dropdown-trigger.open').forEach(function (t) { t.classList.remove('open'); });
    }
});

window.togglePkgFormDropdown = togglePkgFormDropdown;
window.selectPkgFormDropdown = selectPkgFormDropdown;

// ============================================================================
// HOTEL TYPE SELECTION
// ============================================================================

var hotelTypeOptions = [
    'Budget Hotels',
    'Economy Hotels',
    'Premium Hotels',
    'Luxury Hotels',
    '5 Star Hotels'
];

var hotelOptions = [
    { name: 'Hotel Name', id: '#hotel101' },
    { name: 'Hotel Name', id: '#hotel101' },
    { name: 'Hotel Name', id: '#hotel101' },
    { name: 'Beach Resort', id: '#hotel102' },
    { name: 'Villa Bay', id: '#hotel103' },
    { name: 'Ocean View', id: '#hotel104' }
];

function renderHotels() {
    var list = document.getElementById('hotelList');
    if (!list) { return; }
    list.innerHTML = '';
    var query = (document.getElementById('hotelSearchInput').value || '').toLowerCase();
    for (var i = 0; i < hotelOptions.length; i++) {
        var h = hotelOptions[i];
        var text = (h.name + ' ' + h.id).toLowerCase();
        if (query && text.indexOf(query) === -1) { continue; }
        (function (hotel) {
            var row = document.createElement('div');
            row.className = 'hotel-row';
            row.innerHTML = '<span class="hotel-row-name">' + escapeHtml(hotel.name) + '</span><span class="hotel-row-id">' + escapeHtml(hotel.id) + '</span>';
            row.addEventListener('click', function () {
                var hidden = document.getElementById('typeHotels');
                if (hidden) { hidden.value = hotel.name + ' ' + hotel.id; }
                document.querySelectorAll('.hotel-row').forEach(function (r) { r.classList.remove('selected'); });
                row.classList.add('selected');
                closeHotelTypePanel();
                var cb = document.getElementById('hotelTypeCheckbox');
                if (cb) { cb.textContent = '\u2611'; cb.classList.add('checked'); }
            });
            list.appendChild(row);
        })(h);
    }
}

function openHotelTypePanel() {
    var dropdown = document.getElementById('hotelTypeDropdown');
    var panel = document.getElementById('hotelSelectPanel');
    var arrow = document.getElementById('hotelTypeArrow');
    if (dropdown) { dropdown.classList.add('open'); }
    if (panel) { panel.classList.add('show'); }
    if (arrow) { arrow.style.transform = 'rotate(0deg)'; }
    var dest = document.getElementById('pkgDestination');
    var destVal = document.getElementById('hotelDestinationVal');
    if (destVal) { destVal.textContent = (dest && dest.value) ? dest.value : 'Andaman'; }
    renderHotels();
    var search = document.getElementById('hotelSearchInput');
    if (search) { search.value = ''; }
}

function closeHotelTypePanel() {
    var dropdown = document.getElementById('hotelTypeDropdown');
    var panel = document.getElementById('hotelSelectPanel');
    if (dropdown) { dropdown.classList.remove('open'); }
    if (panel) { panel.classList.remove('show'); }
}

function toggleHotelTypePanel() {
    var panel = document.getElementById('hotelSelectPanel');
    var open = panel && panel.classList.contains('show');
    if (open) { closeHotelTypePanel(); }
    else { openHotelTypePanel(); }
}

function filterHotels() {
    renderHotels();
}

document.addEventListener('click', function (e) {
    if (!e.target.closest('.hotel-type-wrap')) {
        closeHotelTypePanel();
    }
});

window.toggleHotelTypePanel = toggleHotelTypePanel;
window.filterHotels = filterHotels;
window.openHotelTypePanel = openHotelTypePanel;

function escapeHtml(text) {
    if (!text) { return ''; }
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
