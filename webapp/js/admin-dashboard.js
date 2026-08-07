// Admin Dashboard JavaScript - New Design

// Initialize leads data from leads-data.js
let leadsData = initializeLeadsData();
let currentLeadId = null;

// Check authentication
window.addEventListener('DOMContentLoaded', function() {
    if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'admin-login.html';
    }
    
    // Initialize table
    refreshTable();
    
    // Initialize filter listeners
    initializeFilters();
});

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// View lead details
function viewLead(leadId) {
    const lead = leadsData.find(l => l.id === leadId);
    if (!lead) return;

    // Store current lead ID
    currentLeadId = leadId;

    // Populate header
    document.getElementById('viewLeadIdTop').textContent = lead.stNumber;
    
    // Populate left section
    document.getElementById('viewName').textContent = lead.name;
    document.getElementById('viewContact').textContent = lead.contact;
    document.getElementById('viewEmail').textContent = lead.email;
    
    // Format created date
    const createdDate = lead.leadDateISO ? new Date(lead.leadDateISO) : new Date();
    const dateStr = createdDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = createdDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    document.getElementById('viewCreatedAt').textContent = `${dateStr} · ${timeStr}`;
    
    document.getElementById('viewFormSource').textContent = lead.formSource || 'Homepage';
    document.getElementById('viewGuests').textContent = lead.guests;
    document.getElementById('viewPlannedVisit').textContent = lead.plannedVisit || 'This Weekend';
    document.getElementById('viewTicketsCount').textContent = lead.ticketsCount || '6';
    document.getElementById('viewInterest').textContent = lead.interest || 'Decide on-site';
    
    // Populate right section
    document.getElementById('viewAssignedTo').value = lead.assignedTo;
    document.getElementById('viewStatus').value = lead.status;
    document.getElementById('viewNotesInput').value = lead.notes || '';

    openModal('viewLeadModal');
}

// Edit lead
function editLead(leadId) {
    currentLeadId = leadId;
    const lead = leadsData.find(l => l.id === leadId);
    if (!lead) return;

    // Populate form fields
    document.getElementById('editLeadId').value = lead.stNumber; // Changed to value for input
    document.getElementById('editStatus').value = lead.status;
    document.getElementById('editAssignTo').value = lead.assignedTo;
    
    // Convert lead date to datetime-local format if it exists
    if (lead.leadDateISO) {
        document.getElementById('editLeadDate').value = lead.leadDateISO;
    } else {
        // Set default to current date/time if no ISO date exists
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        document.getElementById('editLeadDate').value = localDateTime;
    }
    
    document.getElementById('editName').value = lead.name;
    document.getElementById('editGuests').value = lead.guests;
    document.getElementById('editPackage').value = lead.packageType;
    document.getElementById('editBudget').value = lead.budget;
    document.getElementById('editContact').value = lead.contact;
    document.getElementById('editEmail').value = lead.email;
    document.getElementById('editAddress').value = lead.address;
    document.getElementById('editNotes').value = lead.notes;

    openModal('editLeadModal');
}

// Save edited lead
function saveEditLead() {
    console.log('saveEditLead called'); // Debug log
    console.log('currentLeadId:', currentLeadId); // Debug log
    
    if (!currentLeadId) {
        alert('Error: No lead selected for editing');
        return;
    }

    const lead = leadsData.find(l => l.id === currentLeadId);
    if (!lead) {
        alert('Error: Lead not found');
        return;
    }

    console.log('Lead found:', lead); // Debug log

    // Get the datetime-local value and format it
    const leadDateInput = document.getElementById('editLeadDate').value;
    let leadDateISO = lead.leadDateISO;
    let leadDate = lead.leadDate;
    
    if (leadDateInput) {
        // Store ISO format for the input field
        leadDateISO = leadDateInput;
        
        // Format for display in the table
        const date = new Date(leadDateInput);
        const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
        const dateStr = date.toLocaleDateString('en-US', options);
        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        leadDate = `${dateStr}<br>${timeStr}`;
    }

    // Get all updated values
    const updates = {
        stNumber: document.getElementById('editLeadId').value,
        status: document.getElementById('editStatus').value,
        assignedTo: document.getElementById('editAssignTo').value,
        name: document.getElementById('editName').value,
        guests: document.getElementById('editGuests').value,
        packageType: document.getElementById('editPackage').value,
        budget: document.getElementById('editBudget').value,
        contact: document.getElementById('editContact').value,
        email: document.getElementById('editEmail').value,
        address: document.getElementById('editAddress').value,
        notes: document.getElementById('editNotes').value,
        leadDateISO: leadDateISO,
        leadDate: leadDate
    };
    
    console.log('Updates:', updates); // Debug log
    
    // Update using the function from leads-data.js
    const updated = updateLead(leadsData, currentLeadId, updates);
    
    if (updated) {
        alert('✅ Lead updated successfully!');
        closeModal('editLeadModal');
        refreshTable();
    } else {
        alert('❌ Error updating lead');
    }
}

// Delete lead (called from Edit modal)
function deleteLeadFromEdit() {
    if (!currentLeadId) return;

    if (confirm('Are you sure you want to delete this lead?')) {
        const success = deleteLead(leadsData, currentLeadId);
        if (success) {
            alert('Lead deleted successfully!');
            closeModal('editLeadModal');
            leadsData = initializeLeadsData(); // Reload from storage
            refreshTable();
        }
    }
}

// Refresh table
function refreshTable() {
    const tbody = document.getElementById('leadsTableBody');
    const mobileContainer = document.getElementById('mobileCardsContainer');
    
    tbody.innerHTML = '';
    if (mobileContainer) {
        mobileContainer.innerHTML = '';
    }

    leadsData.forEach(lead => {
        // Desktop table row
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>
                <div class="lead-id">${lead.stNumber}</div>
                <div class="lead-name">${lead.name}</div>
            </td>
            <td>
                <div class="lead-date">${lead.leadDate}</div>
            </td>
            <td>${lead.guests}</td>
            <td>${lead.packageType}</td>
            <td>${lead.budget}</td>
            <td>
                <div class="status-dropdown">
                    <button class="status-badge status-${lead.status}" onclick="toggleStatusDropdown(${lead.id}, event)">
                        ${formatStatus(lead.status)}
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="margin-left: 5px;">
                            <path d="M3 5L6 8L9 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <div class="status-dropdown-menu" id="statusMenu-${lead.id}">
                        <div class="status-option" onclick="changeStatus(${lead.id}, 'interested')">
                            <span class="status-dot status-interested"></span>Interested
                        </div>
                        <div class="status-option" onclick="changeStatus(${lead.id}, 'follow-up')">
                            <span class="status-dot status-follow-up"></span>Follow-up
                        </div>
                        <div class="status-option" onclick="changeStatus(${lead.id}, 'converted')">
                            <span class="status-dot status-converted"></span>Converted
                        </div>
                        <div class="status-option" onclick="changeStatus(${lead.id}, 'special')">
                            <span class="status-dot status-special"></span>Special
                        </div>
                        <div class="status-option" onclick="changeStatus(${lead.id}, 'no-interest')">
                            <span class="status-dot status-no-interest"></span>No Interest
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <div class="assign-dropdown">
                    <button class="assign-badge assign-${lead.assignedTo.toLowerCase().replace(/\s+/g, '-')}" onclick="toggleAssignDropdown(${lead.id}, event)">
                        ${lead.assignedTo}
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="margin-left: 5px;">
                            <path d="M3 5L6 8L9 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <div class="assign-dropdown-menu" id="assignMenu-${lead.id}">
                        <div class="assign-option" onclick="changeAssignment(${lead.id}, 'Shipra')">Shipra</div>
                        <div class="assign-option" onclick="changeAssignment(${lead.id}, 'Jyothi Duddukunta')">Jyothi Duddukunta</div>
                        <div class="assign-option" onclick="changeAssignment(${lead.id}, 'Team Member1')">Team Member1</div>
                        <div class="assign-option" onclick="changeAssignment(${lead.id}, 'Team Member2')">Team Member2</div>
                        <div class="assign-option" onclick="changeAssignment(${lead.id}, 'Team Member3')">Team Member3</div>
                        <div class="assign-option" onclick="changeAssignment(${lead.id}, 'Team Member4')">Team Member4</div>
                        <div class="assign-option" onclick="changeAssignment(${lead.id}, 'Un-Allocated')">Un-Allocated</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="three-dots-menu">
                    <button class="three-dots-btn" onclick="toggleThreeDotsMenu(${lead.id}, event)">⋮</button>
                    <div class="three-dots-dropdown" id="dotsMenu-${lead.id}">
                        <div class="dots-option" onclick="viewLead(${lead.id})">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.5"/>
                                <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/>
                            </svg>
                            View Details
                        </div>
                        <div class="dots-option" onclick="editLead(${lead.id})">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M11.333 2A1.886 1.886 0 0 1 14 4.667l-9 9-3.667 1 1-3.667 9-9z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Edit
                        </div>
                        <div class="dots-option dots-option-delete" onclick="deleteLeadFromMenu(${lead.id})">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Delete
                        </div>
                    </div>
                </div>
            </td>
        `;
        
        // Mobile card
        if (mobileContainer) {
            const card = document.createElement('div');
            card.className = 'mobile-lead-card';
            card.innerHTML = `
                <div class="mobile-card-header">
                    <div class="mobile-card-user">
                        <div class="mobile-user-avatar">${lead.name.charAt(0).toUpperCase()}</div>
                        <div class="mobile-user-info">
                            <h3>${lead.name}</h3>
                            <span class="mobile-lead-id">${lead.stNumber}</span>
                        </div>
                    </div>
                    <span class="mobile-status-badge status-${lead.status}">${formatStatus(lead.status)}</span>
                </div>
                
                <div class="mobile-card-details">
                    <div class="mobile-detail-item">
                        <span class="mobile-detail-label">TICKETS</span>
                        <span class="mobile-detail-value">${lead.ticketsCount || '6'}</span>
                    </div>
                    <div class="mobile-detail-item">
                        <span class="mobile-detail-label">CREATED</span>
                        <span class="mobile-detail-value">${formatMobileDate(lead.leadDateISO)}</span>
                    </div>
                </div>
                
                <div class="mobile-card-actions">
                    <button class="mobile-action-btn mobile-view-btn" onclick="viewLead(${lead.id})">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.5"/>
                            <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/>
                        </svg>
                        View
                    </button>
                    <button class="mobile-action-btn mobile-call-btn" onclick="makeCallMobile(${lead.id})">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M14.5 11.3v2a1.33 1.33 0 0 1-1.45 1.33 13.2 13.2 0 0 1-5.76-2.05 13 13 0 0 1-4-4 13.2 13.2 0 0 1-2-5.8A1.33 1.33 0 0 1 2.6 1.5h2a1.33 1.33 0 0 1 1.33 1.15c.08.63.24 1.25.46 1.84a1.33 1.33 0 0 1-.3 1.4l-.85.85a10.67 10.67 0 0 0 4 4l.85-.85a1.33 1.33 0 0 1 1.4-.3c.6.22 1.21.38 1.84.46a1.33 1.33 0 0 1 1.15 1.35z" fill="currentColor"/>
                        </svg>
                    </button>
                    <button class="mobile-action-btn mobile-whatsapp-btn" onclick="sendWhatsAppMobile(${lead.id})">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13.6 2.33A7.33 7.33 0 0 0 1.07 11.4L.67 15l3.66-.96a7.33 7.33 0 0 0 3.5.89h.01a7.33 7.33 0 0 0 5.76-11.6zM7.84 13.6a6.1 6.1 0 0 1-3.11-.85l-.22-.13-2.3.6.62-2.25-.14-.23a6.1 6.1 0 1 1 5.15 2.86zm3.35-4.57c-.18-.09-1.08-.53-1.25-.59-.17-.06-.29-.09-.41.09s-.47.59-.58.71c-.1.12-.21.14-.4.05a5.03 5.03 0 0 1-1.48-.91 5.53 5.53 0 0 1-1.02-1.27c-.11-.18 0-.28.08-.37.08-.08.18-.21.27-.32.09-.1.12-.18.18-.3.06-.12.03-.23-.01-.32-.05-.09-.41-1-.57-1.36-.15-.35-.3-.3-.41-.31h-.35c-.12 0-.32.05-.49.23-.17.18-.65.64-.65 1.55s.67 1.8.76 1.92c.09.12 1.31 2 3.17 2.8.44.19.79.3 1.06.39.45.14.85.12 1.17.07.36-.05 1.08-.44 1.24-.87.15-.43.15-.8.11-.87-.05-.07-.17-.12-.36-.21z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
            `;
            mobileContainer.appendChild(card);
        }
    });
}

// Format status text
function formatStatus(status) {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
}

// Toggle status dropdown
function toggleStatusDropdown(leadId, event) {
    event.stopPropagation();
    const menu = document.getElementById(`statusMenu-${leadId}`);
    
    // Close all other dropdowns
    document.querySelectorAll('.status-dropdown-menu').forEach(m => {
        if (m.id !== `statusMenu-${leadId}`) m.classList.remove('active');
    });
    document.querySelectorAll('.assign-dropdown-menu').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.three-dots-dropdown').forEach(m => m.classList.remove('active'));
    
    menu.classList.toggle('active');
}

// Toggle assign dropdown
function toggleAssignDropdown(leadId, event) {
    event.stopPropagation();
    const menu = document.getElementById(`assignMenu-${leadId}`);
    
    // Close all other dropdowns
    document.querySelectorAll('.status-dropdown-menu').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.assign-dropdown-menu').forEach(m => {
        if (m.id !== `assignMenu-${leadId}`) m.classList.remove('active');
    });
    document.querySelectorAll('.three-dots-dropdown').forEach(m => m.classList.remove('active'));
    
    menu.classList.toggle('active');
}

// Toggle three dots menu
function toggleThreeDotsMenu(leadId, event) {
    event.stopPropagation();
    const menu = document.getElementById(`dotsMenu-${leadId}`);
    
    // Close all other dropdowns
    document.querySelectorAll('.status-dropdown-menu').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.assign-dropdown-menu').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.three-dots-dropdown').forEach(m => {
        if (m.id !== `dotsMenu-${leadId}`) m.classList.remove('active');
    });
    
    menu.classList.toggle('active');
}

// Change status
function changeStatus(leadId, newStatus) {
    const lead = leadsData.find(l => l.id === leadId);
    if (lead) {
        updateLead(leadsData, leadId, { status: newStatus });
        refreshTable();
    }
}

// Change assignment
function changeAssignment(leadId, newAssignment) {
    const lead = leadsData.find(l => l.id === leadId);
    if (lead) {
        updateLead(leadsData, leadId, { assignedTo: newAssignment });
        refreshTable();
    }
}

// Delete lead from menu
function deleteLeadFromMenu(leadId) {
    if (confirm('Are you sure you want to delete this lead?')) {
        const success = deleteLead(leadsData, leadId);
        if (success) {
            leadsData = initializeLeadsData(); // Reload from storage
            refreshTable();
        }
    }
}

// Close all dropdowns when clicking outside
document.addEventListener('click', function() {
    document.querySelectorAll('.status-dropdown-menu').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.assign-dropdown-menu').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.three-dots-dropdown').forEach(m => m.classList.remove('active'));
});

// Capitalize first letter
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Add new lead button
document.getElementById('addNewBtn').addEventListener('click', function() {
    document.getElementById('addLeadForm').reset();
    openModal('addLeadModal');
});

// Save new lead
function saveNewLead() {
    // Get form values
    const name = document.getElementById('addName').value.trim();
    const contact = document.getElementById('addContact').value.trim();
    const email = document.getElementById('addEmail').value.trim();
    const packageType = document.getElementById('addPackage').value;
    const duration = document.getElementById('addDuration').value;
    const travel = document.getElementById('addTravel').value.trim();
    const budget = document.getElementById('addBudget').value.trim();
    const location = document.getElementById('addLocation').value.trim();
    const address = document.getElementById('addAddress').value.trim();
    const status = document.getElementById('addStatus').value;
    const notes = document.getElementById('addNotes').value.trim();

    // Validate required fields
    if (!name || !contact || !email || !packageType || !duration || !travel || !budget) {
        alert('Please fill in all required fields (marked with *)');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    // Create lead info object
    const leadInfo = {
        name: name,
        contact: contact,
        email: email,
        duration: duration,
        packageType: packageType,
        travel: travel,
        budget: budget,
        guests: '4-5 People', // Default value
        status: status,
        location: location || 'Not specified',
        address: address || 'Not specified',
        notes: notes || 'No additional notes',
        formSource: 'Admin Dashboard',
        plannedVisit: travel,
        interest: 'New Lead'
    };

    // Add using function from leads-data.js
    const newLead = addNewLead(leadsData, leadInfo);

    // Show success message
    alert(`Lead created successfully!\nLead ID: ${newLead.stNumber}\nName: ${name}`);

    // Reload from storage and refresh
    leadsData = initializeLeadsData();
    
    // Close modal and refresh table
    closeModal('addLeadModal');
    refreshTable();

    // Reset form
    document.getElementById('addLeadForm').reset();
}

// Close modal on outside click
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// Profile and menu button handlers
document.getElementById('profileBtn').addEventListener('click', function() {
    if (confirm('Do you want to logout?')) {
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminEmail');
        window.location.href = 'admin-login.html';
    }
});

document.getElementById('menuBtn').addEventListener('click', function() {
    alert('Menu functionality - Coming soon!');
});

// Input validation and formatting for Add Lead form
document.addEventListener('DOMContentLoaded', function() {
    // Name validation - only letters and spaces
    const addNameInput = document.getElementById('addName');
    if (addNameInput) {
        addNameInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^A-Za-z\s]/g, '');
        });
    }

    // Contact number validation - only numbers and + symbol
    const addContactInput = document.getElementById('addContact');
    if (addContactInput) {
        addContactInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9+\s]/g, '');
        });
    }

    // Budget formatting helper
    const addBudgetInput = document.getElementById('addBudget');
    if (addBudgetInput) {
        addBudgetInput.addEventListener('blur', function() {
            let value = this.value.trim();
            // If user enters only numbers, format it as "INR - XXK"
            if (value && /^\d+$/.test(value)) {
                const amount = parseInt(value);
                if (amount >= 1000) {
                    this.value = `INR - ${Math.round(amount / 1000)}K`;
                }
            }
        });
    }

    // Travel date formatting helper
    const addTravelInput = document.getElementById('addTravel');
    if (addTravelInput) {
        addTravelInput.addEventListener('blur', function() {
            let value = this.value.trim().toUpperCase();
            // Auto-format if user enters date without proper format
            // Example: "15 feb" -> "FEB - 15"
            if (value && !value.includes('-')) {
                const parts = value.split(/[\s,]+/);
                if (parts.length >= 2) {
                    const month = parts[0].length <= 3 ? parts[0] : parts[0].substring(0, 3);
                    const day = parts[1];
                    this.value = `${month.toUpperCase()} - ${day}`;
                }
            }
        });
    }
});


// Initialize Filter Functions
function initializeFilters() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterTable(searchTerm);
        });
    }
    
    // Filter dropdowns
    const filterAll = document.getElementById('filterAll');
    const filterSheet = document.getElementById('filterSheet');
    const filterAssign = document.getElementById('filterAssign');
    const filterDate = document.getElementById('filterDate');
    
    if (filterAll) {
        filterAll.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    if (filterSheet) {
        filterSheet.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    if (filterAssign) {
        filterAssign.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    if (filterDate) {
        filterDate.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    // Import/Export buttons
    const importBtn = document.getElementById('importBtn');
    const exportBtn = document.getElementById('exportBtn');
    
    if (importBtn) {
        importBtn.addEventListener('click', function() {
            alert('Import functionality - Coming soon!');
        });
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportToCSV();
        });
    }
    
    // Pagination
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            alert('Previous page - Pagination coming soon!');
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            alert('Next page - Pagination coming soon!');
        });
    }
}

// Filter table based on search
function filterTable(searchTerm) {
    const rows = document.querySelectorAll('#leadsTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Apply filters
function applyFilters() {
    const filterAll = document.getElementById('filterAll').value;
    const filterAssign = document.getElementById('filterAssign').value;
    
    const rows = document.querySelectorAll('#leadsTableBody tr');
    
    rows.forEach(row => {
        let showRow = true;
        
        // Filter by status (if implemented in data)
        if (filterAll && filterAll !== '') {
            // Add status filtering logic here
        }
        
        // Filter by assignment
        if (filterAssign && filterAssign !== '') {
            const assignBadge = row.querySelector('.assign-badge');
            if (assignBadge) {
                const assignText = assignBadge.textContent.trim();
                if (filterAssign === 'unallocated' && assignText !== 'Un-Allocated') {
                    showRow = false;
                } else if (filterAssign === 'member1' && assignText !== 'Team Member1') {
                    showRow = false;
                } else if (filterAssign === 'member2' && assignText !== 'Team Member2') {
                    showRow = false;
                } else if (filterAssign === 'member3' && assignText !== 'Team Member3') {
                    showRow = false;
                } else if (filterAssign === 'member4' && assignText !== 'Team Member4') {
                    showRow = false;
                }
            }
        }
        
        row.style.display = showRow ? '' : 'none';
    });
}

// Export to CSV
function exportToCSV() {
    const headers = ['Lead ID', 'Name', 'Contact', 'Email', 'Lead Date', 'Guests', 'Package', 'Budget', 'Status', 'Assigned To'];
    const rows = leadsData.map(lead => [
        lead.stNumber,
        lead.name,
        lead.contact,
        lead.email,
        lead.leadDate.replace('<br>', ' '),
        lead.guests,
        lead.packageType,
        lead.budget,
        lead.status,
        lead.assignedTo
    ]);
    
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    alert('Leads exported successfully!');
}

// Book a Trip Modal Functions
function openBookTripModal() {
    document.getElementById('bookTripOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBookTripModal() {
    document.getElementById('bookTripOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

// Close on overlay click
document.getElementById('bookTripOverlay')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeBookTripModal();
    }
});

// Handle form submission
document.getElementById('bookTripForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('bookName').value;
    const destination = document.getElementById('bookDestination').value;
    const phone = document.getElementById('bookPhone').value;
    const days = document.getElementById('bookDays').value;
    const people = document.getElementById('bookPeople').value;
    const date = document.getElementById('bookDate').value;
    
    alert(`✅ Trip Booking Received!\n\nName: ${name}\nDestination: ${destination}\nPhone: ${phone}\nDays: ${days}\nPeople: ${people}\nTravel Date: ${date}\n\nOur team will contact you shortly!`);
    
    // Reset form and close modal
    this.reset();
    closeBookTripModal();
});

// Close on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeBookTripModal();
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});


// View Modal Functions
function editLeadFromView() {
    closeModal('viewLeadModal');
    if (currentLeadId) {
        editLead(currentLeadId);
    }
}

function deleteLeadFromView() {
    if (!currentLeadId) return;
    
    if (confirm('Are you sure you want to delete this lead?')) {
        const success = deleteLead(leadsData, currentLeadId);
        if (success) {
            alert('Lead deleted successfully!');
            closeModal('viewLeadModal');
            leadsData = initializeLeadsData(); // Reload from storage
            refreshTable();
        }
    }
}

function updateAssignmentFromView() {
    if (!currentLeadId) return;
    
    const assignedTo = document.getElementById('viewAssignedTo').value;
    updateLead(leadsData, currentLeadId, { assignedTo: assignedTo });
    refreshTable();
}

function updateStatusFromView() {
    if (!currentLeadId) return;
    
    const status = document.getElementById('viewStatus').value;
    updateLead(leadsData, currentLeadId, { status: status });
    refreshTable();
}

function switchViewTab(tab) {
    const notesSection = document.getElementById('viewNotesSection');
    const activitySection = document.getElementById('viewActivitySection');
    const tabs = document.querySelectorAll('.view-tab');
    
    tabs.forEach(t => t.classList.remove('active'));
    
    if (tab === 'notes') {
        notesSection.style.display = 'flex';
        activitySection.style.display = 'none';
        tabs[0].classList.add('active');
    } else {
        notesSection.style.display = 'none';
        activitySection.style.display = 'flex';
        tabs[1].classList.add('active');
    }
}

function clearNotes() {
    document.getElementById('viewNotesInput').value = '';
}

function saveNotes() {
    if (!currentLeadId) return;
    
    const notes = document.getElementById('viewNotesInput').value;
    const success = updateLead(leadsData, currentLeadId, { notes: notes });
    if (success) {
        alert('Notes saved successfully!');
    }
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        // Show temporary success feedback
        const btn = element.nextElementSibling;
        const originalColor = btn.style.color;
        btn.style.color = '#4CAF50';
        
        setTimeout(() => {
            btn.style.color = originalColor;
        }, 1000);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Call, Email, WhatsApp Functions
function makeCall() {
    const phoneNumber = document.getElementById('viewContact').textContent;
    
    // Remove any spaces, dashes, or special characters except +
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    
    // Open phone dialer
    window.location.href = `tel:${cleanPhone}`;
}

function sendEmail() {
    const email = document.getElementById('viewEmail').textContent;
    const name = document.getElementById('viewName').textContent;
    
    // Create email with subject and body
    const subject = encodeURIComponent(`Trip Inquiry from ${name}`);
    const body = encodeURIComponent(`Hi ${name},\n\nThank you for your interest in Trip On!\n\nWe'd love to help you plan your perfect trip.\n\nBest regards,\nTrip On Team`);
    
    // Open email client
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

function sendWhatsApp() {
    const phoneNumber = document.getElementById('viewContact').textContent;
    const name = document.getElementById('viewName').textContent;
    
    // Remove any spaces, dashes, or special characters except +
    let cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    
    // Remove + if present and add country code if needed
    cleanPhone = cleanPhone.replace('+', '');
    if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
        cleanPhone = '91' + cleanPhone; // Add India country code
    }
    
    // Create WhatsApp message
    const message = encodeURIComponent(`Hi ${name}! 👋\n\nThank you for your interest in Trip On!\n\nI'm reaching out to help you plan an amazing trip. When would be a good time to discuss your travel plans?\n\nBest regards,\nTrip On Team`);
    
    // Open WhatsApp (works on both mobile and desktop)
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
}


// Mobile Functions
function formatMobileDate(isoDate) {
    if (!isoDate) return 'N/A';
    
    const date = new Date(isoDate);
    const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    
    return `${timeStr} · ${dateStr}`;
}

function makeCallMobile(leadId) {
    const lead = leadsData.find(l => l.id === leadId);
    if (!lead) return;
    
    const cleanPhone = lead.contact.replace(/[^\d+]/g, '');
    window.location.href = `tel:${cleanPhone}`;
}

function sendWhatsAppMobile(leadId) {
    const lead = leadsData.find(l => l.id === leadId);
    if (!lead) return;
    
    let cleanPhone = lead.contact.replace(/[^\d+]/g, '');
    cleanPhone = cleanPhone.replace('+', '');
    if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
        cleanPhone = '91' + cleanPhone;
    }
    
    const message = encodeURIComponent(`Hi ${lead.name}! 👋\n\nThank you for your interest in Trip On!\n\nI'm reaching out to help you plan an amazing trip. When would be a good time to discuss your travel plans?\n\nBest regards,\nTrip On Team`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
}

// Mobile Quick View Modal Functions
let mobileQuickViewLeadId = null;

function openMobileQuickView(leadId) {
    const lead = leadsData.find(l => l.id === leadId);
    if (!lead) return;
    
    mobileQuickViewLeadId = leadId;
    
    document.getElementById('mobileQuickName').textContent = lead.name;
    document.getElementById('mobileQuickId').textContent = lead.stNumber;
    document.getElementById('mobileQuickStatus').textContent = formatStatus(lead.status);
    document.getElementById('mobileQuickStatus').className = `mobile-status-badge status-${lead.status}`;
    document.getElementById('mobileQuickTickets').textContent = lead.ticketsCount || '6';
    document.getElementById('mobileQuickCreated').textContent = formatMobileDate(lead.leadDateISO);
    
    document.getElementById('mobileQuickView').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileQuickView() {
    document.getElementById('mobileQuickView').classList.remove('active');
    document.body.style.overflow = '';
    mobileQuickViewLeadId = null;
}

function openFullViewFromQuick() {
    closeMobileQuickView();
    if (mobileQuickViewLeadId) {
        viewLead(mobileQuickViewLeadId);
    }
}

function makeCallFromQuick() {
    if (mobileQuickViewLeadId) {
        makeCallMobile(mobileQuickViewLeadId);
    }
}

function sendWhatsAppFromQuick() {
    if (mobileQuickViewLeadId) {
        sendWhatsAppMobile(mobileQuickViewLeadId);
    }
}

// Close mobile quick view on outside click
document.getElementById('mobileQuickView')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeMobileQuickView();
    }
});

// Mobile sidebar toggle
document.getElementById('menuToggle')?.addEventListener('click', function() {
    document.querySelector('.sidebar')?.classList.toggle('active');
});


// Table Sorting Functionality
let currentSortColumn = null;
let currentSortDirection = 'asc';

function sortTable(column) {
    console.log('sortTable called for column:', column); // Debug
    
    // Toggle sort direction if clicking the same column
    if (currentSortColumn === column) {
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortColumn = column;
        currentSortDirection = 'asc';
    }
    
    console.log('Sort direction:', currentSortDirection); // Debug
    
    // Sort the data using function from leads-data.js
    const sorted = sortLeads(leadsData, column, currentSortDirection);
    leadsData = sorted;
    
    // Save sorted data to localStorage
    saveLeadsData(leadsData);
    
    // Update visual indicators
    updateSortIndicators(column);
    
    // Refresh the table
    refreshTable();
    
    console.log('Table sorted and refreshed'); // Debug
}

function updateSortIndicators(column) {
    // Remove all sort classes
    document.querySelectorAll('.sortable').forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
    });
    
    // Add class to active column
    const columnMap = {
        'name': 0,
        'date': 1,
        'guests': 2,
        'package': 3,
        'budget': 4,
        'status': 5,
        'assign': 6
    };
    
    const thIndex = columnMap[column];
    const th = document.querySelectorAll('.sortable')[thIndex];
    if (th) {
        th.classList.add(currentSortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
    }
}
