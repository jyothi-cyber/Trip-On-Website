// Leads Database - All data stored here for easy editing
// This file contains all lead records and configuration

// Default leads data (used for initial load or reset)
const defaultLeadsData = [
    {
        id: 1,
        stNumber: 'L-BBLIO-108',
        name: 'Apurva Kale',
        contact: '+91 9712345601',
        email: 'apurva@email.com',
        leadDate: 'Sunday, Oct 24th, 2020<br>08:29 AM',
        leadDateISO: '2020-10-24T08:29',
        guests: '4-5 People',
        packageType: '5Nights 6Days',
        budget: '20K - 30K INR',
        status: 'follow-up',
        assignedTo: 'Un-Allocated',
        location: 'Ubud, Seminyak',
        address: '123, MG Road, Bangalore - 560001',
        notes: 'Looking for a romantic getaway with cultural experiences.',
        formSource: 'Homepage',
        plannedVisit: 'This Weekend',
        ticketsCount: '6',
        interest: 'Decide on-site'
    },
    {
        id: 2,
        stNumber: 'L-02043',
        name: 'Divyansh Rathore',
        contact: '+91 8602892488',
        email: 'demonisrevoked1512@gmail.com',
        leadDate: 'Monday, Aug 05th, 2026<br>05:58 AM',
        leadDateISO: '2026-08-05T05:58',
        guests: '4-5 People',
        packageType: '5Nights 6Days',
        budget: '20K - 30K INR',
        status: 'new',
        assignedTo: 'Shipra',
        location: 'Kuta, Nusa Dua',
        address: '456, Park Street, Mumbai - 400001',
        notes: 'Family vacation with kids.',
        formSource: 'Contact Page',
        plannedVisit: 'Next Month',
        ticketsCount: '6',
        interest: 'Interested'
    },
    {
        id: 3,
        stNumber: 'L-A7L10-99',
        name: 'Vijay Kumar',
        contact: '+91 9988776655',
        email: 'vijay@email.com',
        leadDate: 'Sunday, Oct 23rd, 2020<br>08:29 AM',
        leadDateISO: '2020-10-23T08:29',
        guests: '2-3 People',
        packageType: '5Nights 7Days',
        budget: '60K - 80K INR',
        status: 'interested',
        assignedTo: 'Un-Allocated',
        location: 'Lombok',
        address: '789, Brigade Road, Bangalore - 560025',
        notes: 'Adventure seeker. Interested in hiking.',
        formSource: 'Homepage',
        plannedVisit: 'This Weekend',
        ticketsCount: '3',
        interest: 'Very Interested'
    },
    {
        id: 4,
        stNumber: 'L-00234',
        name: 'Priya Sharma',
        contact: '+91 9876543210',
        email: 'priya.sharma@email.com',
        leadDate: 'Tuesday, Oct 25th, 2020<br>10:15 AM',
        leadDateISO: '2020-10-25T10:15',
        guests: '2 People',
        packageType: '4Nights 5Days',
        budget: '40K - 50K INR',
        status: 'interested',
        assignedTo: 'Team Member2',
        location: 'Canggu, Seminyak',
        address: '321, MG Road, Ahmedabad - 380001',
        notes: 'Solo traveler. Looking for yoga retreats.',
        formSource: 'Landing Page',
        plannedVisit: 'In 2 Weeks',
        ticketsCount: '2',
        interest: 'Decide on-site'
    },
    {
        id: 5,
        stNumber: 'L-00567',
        name: 'Rahul Mehta',
        contact: '+91 9123456789',
        email: 'rahul.mehta@email.com',
        leadDate: 'Wednesday, Oct 26th, 2020<br>02:30 PM',
        leadDateISO: '2020-10-26T14:30',
        guests: '6-8 People',
        packageType: '7Nights 8Days',
        budget: '100K - 150K INR',
        status: 'special',
        assignedTo: 'Team Member3',
        location: 'Ubud',
        address: '654, Connaught Place, Delhi - 110001',
        notes: 'Honeymoon package. Looking for romantic settings.',
        formSource: 'Homepage',
        plannedVisit: 'This Month',
        ticketsCount: '8',
        interest: 'Very Interested'
    },
    {
        id: 6,
        stNumber: 'L-00891',
        name: 'Sneha Patel',
        contact: '+91 9567891234',
        email: 'sneha.patel@email.com',
        leadDate: 'Thursday, Oct 27th, 2020<br>11:45 AM',
        leadDateISO: '2020-10-27T11:45',
        guests: '4 People',
        packageType: '5Nights 6Days',
        budget: '30K - 40K INR',
        status: 'no-interest',
        assignedTo: 'Team Member4',
        location: 'Seminyak',
        address: '987, Anna Salai, Chennai - 600002',
        notes: 'Not interested anymore. Budget constraints.',
        formSource: 'Facebook Ad',
        plannedVisit: 'Undecided',
        ticketsCount: '4',
        interest: 'Not Interested'
    },
    {
        id: 7,
        stNumber: 'L-01234',
        name: 'Amit Singh',
        contact: '+91 9445566778',
        email: 'amit.singh@email.com',
        leadDate: 'Friday, Oct 28th, 2020<br>09:20 AM',
        leadDateISO: '2020-10-28T09:20',
        guests: '5 People',
        packageType: '6Nights 7Days',
        budget: '50K - 70K INR',
        status: 'follow-up',
        assignedTo: 'Team Member2',
        location: 'Nusa Penida',
        address: '555, Residency Road, Hyderabad - 500001',
        notes: 'Needs follow-up next week. Interested in island hopping.',
        formSource: 'Homepage',
        plannedVisit: 'Next Week',
        ticketsCount: '5',
        interest: 'Decide on-site'
    },
    {
        id: 8,
        stNumber: 'L-01567',
        name: 'Neha Gupta',
        contact: '+91 9334455667',
        email: 'neha.gupta@email.com',
        leadDate: 'Saturday, Oct 29th, 2020<br>03:15 PM',
        leadDateISO: '2020-10-29T15:15',
        guests: '3 People',
        packageType: '4Nights 5Days',
        budget: '25K - 35K INR',
        status: 'converted',
        assignedTo: 'Jyothi Duddukunta',
        location: 'Ubud, Canggu',
        address: '234, Park Avenue, Pune - 411001',
        notes: 'Confirmed booking. Payment received.',
        formSource: 'Instagram',
        plannedVisit: 'This Weekend',
        ticketsCount: '3',
        interest: 'Confirmed'
    }
];

// Configuration for dropdown options
const leadsConfig = {
    // Team members for assignment
    teamMembers: [
        'Shipra',
        'Jyothi Duddukunta',
        'Team Member1',
        'Team Member2',
        'Team Member3',
        'Team Member4',
        'Un-Allocated'
    ],
    
    // Status options
    statusOptions: [
        { value: 'new', label: 'New' },
        { value: 'interested', label: 'Interested' },
        { value: 'follow-up', label: 'Follow-up' },
        { value: 'converted', label: 'Converted' },
        { value: 'special', label: 'Special' },
        { value: 'no-interest', label: 'No Interest' }
    ],
    
    // Package types
    packageTypes: [
        'Regular Type',
        'Custom Type',
        'Premium Type',
        'Budget Type'
    ],
    
    // Duration options
    durations: [
        '3 Nights',
        '4 Nights',
        '5 Nights',
        '6 Nights',
        '7 Nights',
        '8+ Nights'
    ],
    
    // Form sources
    formSources: [
        'Homepage',
        'Contact Page',
        'Landing Page',
        'Facebook Ad',
        'Instagram',
        'Google Ads',
        'Direct'
    ],
    
    // Filter options
    filters: {
        all: {
            label: 'All',
            count: 4508
        },
        sheets: [
            { value: 'sheet1', label: 'Sheet 1' },
            { value: 'sheet2', label: 'Sheet 2' }
        ]
    },
    
    // Pagination settings
    pagination: {
        itemsPerPage: 10,
        totalPages: 451
    },
    
    // Table sorting configuration
    sorting: {
        defaultColumn: 'date',
        defaultDirection: 'desc',
        columns: [
            { key: 'name', label: 'Full Name', type: 'string' },
            { key: 'date', label: 'Lead Date', type: 'date' },
            { key: 'guests', label: 'Guests', type: 'string' },
            { key: 'package', label: 'Package Type', type: 'string' },
            { key: 'budget', label: 'Budget', type: 'number' },
            { key: 'status', label: 'Status', type: 'string' },
            { key: 'assign', label: 'Assign To', type: 'string' }
        ]
    }
};

// LocalStorage key for data persistence
const STORAGE_KEY = 'tripon_leads_database';

// Initialize leads data from localStorage or use defaults
function initializeLeadsData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing stored data:', e);
            return [...defaultLeadsData];
        }
    }
    return [...defaultLeadsData];
}

// Save leads data to localStorage
function saveLeadsData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Error saving data:', e);
        return false;
    }
}

// Reset data to defaults
function resetLeadsData() {
    localStorage.removeItem(STORAGE_KEY);
    return [...defaultLeadsData];
}

// Export data as JSON
function exportLeadsData(data) {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Import data from JSON
function importLeadsData(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        if (Array.isArray(data)) {
            saveLeadsData(data);
            return data;
        }
        throw new Error('Invalid data format');
    } catch (e) {
        console.error('Error importing data:', e);
        return null;
    }
}

// Get next available ID
function getNextLeadId(data) {
    if (data.length === 0) return 1;
    return Math.max(...data.map(l => l.id)) + 1;
}

// Generate lead number
function generateLeadNumber(id) {
    return `LD-${String(id).padStart(4, '0')}`;
}

// Add new lead
function addNewLead(data, leadInfo) {
    const newId = getNextLeadId(data);
    const now = new Date();
    const leadDateISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', options);
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const leadDate = `${dateStr}<br>${timeStr}`;
    
    const newLead = {
        id: newId,
        stNumber: generateLeadNumber(newId),
        leadDate: leadDate,
        leadDateISO: leadDateISO,
        status: 'new',
        assignedTo: 'Un-Allocated',
        ticketsCount: '0',
        ...leadInfo
    };
    
    data.push(newLead);
    saveLeadsData(data);
    return newLead;
}

// Update existing lead
function updateLead(data, leadId, updates) {
    const index = data.findIndex(l => l.id === leadId);
    if (index !== -1) {
        data[index] = { ...data[index], ...updates };
        saveLeadsData(data);
        return data[index];
    }
    return null;
}

// Delete lead
function deleteLead(data, leadId) {
    const index = data.findIndex(l => l.id === leadId);
    if (index !== -1) {
        data.splice(index, 1);
        saveLeadsData(data);
        return true;
    }
    return false;
}

// Search leads
function searchLeads(data, searchTerm) {
    const term = searchTerm.toLowerCase();
    return data.filter(lead => 
        lead.name.toLowerCase().includes(term) ||
        lead.stNumber.toLowerCase().includes(term) ||
        lead.email.toLowerCase().includes(term) ||
        lead.contact.includes(term) ||
        lead.status.toLowerCase().includes(term) ||
        lead.assignedTo.toLowerCase().includes(term)
    );
}

// Filter leads by status
function filterByStatus(data, status) {
    if (!status || status === 'all') return data;
    return data.filter(lead => lead.status === status);
}

// Filter leads by assignment
function filterByAssignment(data, assignment) {
    if (!assignment) return data;
    return data.filter(lead => lead.assignedTo === assignment);
}

// Sort leads
function sortLeads(data, column, direction = 'asc') {
    const sorted = [...data].sort((a, b) => {
        let valueA, valueB;
        
        switch(column) {
            case 'name':
                valueA = a.name.toLowerCase();
                valueB = b.name.toLowerCase();
                break;
            case 'date':
                valueA = new Date(a.leadDateISO || 0);
                valueB = new Date(b.leadDateISO || 0);
                break;
            case 'guests':
                valueA = a.guests.toLowerCase();
                valueB = b.guests.toLowerCase();
                break;
            case 'package':
                valueA = a.packageType.toLowerCase();
                valueB = b.packageType.toLowerCase();
                break;
            case 'budget':
                valueA = parseInt(a.budget.match(/\d+/) || 0);
                valueB = parseInt(b.budget.match(/\d+/) || 0);
                break;
            case 'status':
                valueA = a.status.toLowerCase();
                valueB = b.status.toLowerCase();
                break;
            case 'assign':
                valueA = a.assignedTo.toLowerCase();
                valueB = b.assignedTo.toLowerCase();
                break;
            default:
                return 0;
        }
        
        let comparison = 0;
        if (valueA > valueB) comparison = 1;
        else if (valueA < valueB) comparison = -1;
        
        return direction === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
}

// Export configuration and functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        defaultLeadsData,
        leadsConfig,
        initializeLeadsData,
        saveLeadsData,
        resetLeadsData,
        exportLeadsData,
        importLeadsData,
        addNewLead,
        updateLead,
        deleteLead,
        searchLeads,
        filterByStatus,
        filterByAssignment,
        sortLeads,
        getNextLeadId,
        generateLeadNumber
    };
}
