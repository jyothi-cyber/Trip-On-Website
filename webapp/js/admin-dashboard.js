/**
 * Admin Dashboard - Leads Database
 * Full functionality with assign/status dropdowns, checkboxes, search, pagination
 */

// ============================================================================
// GLOBAL STATE
// ============================================================================

let currentPage = 1;
let itemsPerPage = 10;
let filteredLeads = [];
let allLeads = [];
let currentSort = { field: null, direction: 'asc' };
let searchQuery = '';
let activeDropdownLeadId = null;
let activeSheetFilter = '';
let activeDateFilter = '';

const LEAD_STORAGE_KEY = 'tripon_leads_demo_data_v3';

// Visible error reporter – surfaces any runtime error on the page so it is
// easy to see and report instead of silently breaking the dashboard.
function reportError(err) {
    try {
        let banner = document.getElementById('initErrorBanner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'initErrorBanner';
            banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:2147483647;background:#fff1f1;color:#b91c1c;border-bottom:1px solid #fecaca;padding:8px 16px;font:13px/1.4 Arial,sans-serif;cursor:pointer;';
            banner.title = 'Click to dismiss';
            banner.addEventListener('click', function () { banner.remove(); });
            document.body.appendChild(banner);
        }
        banner.textContent = 'Page error: ' + (err && err.message ? err.message : String(err));
    } catch (e) { /* ignore */ }
}

window.addEventListener('error', function (e) {
    reportError(e.error || e.message);
});
window.addEventListener('unhandledrejection', function (e) {
    reportError(e.reason);
});

function saveLeadsToStorage() {
    try { localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(allLeads)); } catch (e) { /* ignore */ }
}

function loadLeadsFromStorage() {
    try {
        const stored = localStorage.getItem(LEAD_STORAGE_KEY);
        if (!stored) return null;
        const data = JSON.parse(stored);
        if (!Array.isArray(data) || data.length === 0) return null;
        for (let i = 0; i < data.length; i++) {
            const l = data[i];
            if (!l || typeof l.id !== 'string' || typeof l.name !== 'string' || typeof l.phone !== 'string') {
                return null;
            }
        }
        return data;
    } catch (e) { /* ignore */ }
    return null;
}

function applyDemoDestinations() {
    allLeads.forEach((lead, i) => {
        if (!lead.destination) {
            if (i < 20) lead.destination = 'Bali';
            else if (i < 40) lead.destination = 'Indonesia';
            else lead.destination = 'Andaman';
        }
    });
}

// ============================================================================
// LEADS DATA
// ============================================================================

const defaultLeadsData = [
    { id: 'L-06785', name: 'Arsad', phone: '8651435058', tickets: 2, createdAt: '17 Aug 2026, 03:07 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '2 People', packageType: '3Nights 4Days', budget: '10K - 15K INR', location: 'Bali', address: '', notes: '', formSource: 'Homepage', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06754', name: 'Monalika', phone: '9889788728', tickets: 7, createdAt: '17 Aug 2026, 08:57 AM', status: 'Interested', assignedTo: 'Shipra (Me)', email: '', guests: '4-5 People', packageType: '5Nights 6Days', budget: '20K - 30K INR', location: 'Ubud', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'Next Month', interest: 'Interested' },
    { id: 'L-03853', name: 'Pragya Srivastava', phone: '7355934088', tickets: 2, createdAt: '17 Aug 2026, 12:27 AM', status: 'Contacted', assignedTo: 'Shipra (Me)', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '15K - 25K INR', location: 'Seminyak', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06763', name: 'Naina', phone: '9696064112', tickets: 3, createdAt: '17 Aug 2026, 12:23 AM', status: 'RNR', assignedTo: 'Shipra (Me)', email: '', guests: '3 People', packageType: '5Nights 6Days', budget: '25K - 35K INR', location: 'Canggu', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'Next Week', interest: 'Very Interested' },
    { id: 'L-06762', name: 'Suryansh Rathore', phone: '7644088211', tickets: 2, createdAt: '17 Aug 2026, 12:21 AM', status: 'Follow-up', assignedTo: 'Shipra (Me)', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '12K - 18K INR', location: 'Kuta', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06761', name: 'Rahul Kumar', phone: '9876543210', tickets: 4, createdAt: '16 Aug 2026, 11:45 PM', status: 'Interested', assignedTo: 'Tanveer', email: '', guests: '4 People', packageType: '6Nights 7Days', budget: '30K - 50K INR', location: 'Nusa Penida', address: '', notes: '', formSource: 'Ads Pop Up', plannedVisit: 'This Month', interest: 'Very Interested' },
    { id: 'L-06760', name: 'Priya Sharma', phone: '8765432109', tickets: 1, createdAt: '16 Aug 2026, 10:30 PM', status: 'Not Interested', assignedTo: 'Shipra (Me)', email: '', guests: '2 People', packageType: '3Nights 4Days', budget: '10K - 15K INR', location: 'Ubud', address: '', notes: '', formSource: 'General', plannedVisit: 'Undecided', interest: 'Decide on-site' },
    { id: 'L-06759', name: 'Amit Singh', phone: '7654321098', tickets: 6, createdAt: '16 Aug 2026, 09:15 PM', status: 'Contacted', assignedTo: 'Tanveer', email: '', guests: '5-6 People', packageType: '7Nights 8Days', budget: '60K - 80K INR', location: 'Lombok', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'Next Month', interest: 'Very Interested' },
    { id: 'L-06758', name: 'Sneha Gupta', phone: '6543210987', tickets: 3, createdAt: '16 Aug 2026, 08:00 PM', status: 'Follow-up', assignedTo: 'Shipra (Me)', email: '', guests: '3 People', packageType: '5Nights 6Days', budget: '20K - 30K INR', location: 'Seminyak', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'This Weekend', interest: 'Interested' },
    { id: 'L-06757', name: 'Vivek Mishra', phone: '5432109876', tickets: 5, createdAt: '16 Aug 2026, 07:30 PM', status: 'Interested', assignedTo: 'Tanveer', email: '', guests: '4-5 People', packageType: '6Nights 7Days', budget: '35K - 55K INR', location: 'Canggu', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'Next Week', interest: 'Very Interested' },
    { id: 'L-06756', name: 'Anjali Desai', phone: '9123456789', tickets: 2, createdAt: '16 Aug 2026, 06:45 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '18K - 25K INR', location: 'Ubud', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06755', name: 'Karan Malhotra', phone: '8234567890', tickets: 1, createdAt: '16 Aug 2026, 05:30 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '1 Person', packageType: '3Nights 4Days', budget: '8K - 12K INR', location: 'Kuta', address: '', notes: '', formSource: 'General', plannedVisit: 'Undecided', interest: 'Decide on-site' },
    { id: 'L-06753', name: 'Meera Joshi', phone: '7345678901', tickets: 4, createdAt: '16 Aug 2026, 04:15 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '3-4 People', packageType: '5Nights 6Days', budget: '25K - 40K INR', location: 'Seminyak', address: '', notes: '', formSource: 'Ads Pop Up', plannedVisit: 'Next Month', interest: 'Very Interested' },
    { id: 'L-06752', name: 'Rohan Verma', phone: '9456789012', tickets: 2, createdAt: '16 Aug 2026, 03:00 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '15K - 22K INR', location: 'Nusa Penida', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'This Weekend', interest: 'Interested' },
    { id: 'L-06751', name: 'Ishita Banerjee', phone: '6567890123', tickets: 3, createdAt: '16 Aug 2026, 01:45 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '3 People', packageType: '5Nights 6Days', budget: '22K - 32K INR', location: 'Ubud', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'Next Week', interest: 'Interested' },
    { id: 'L-06750', name: 'Aditya Nair', phone: '8678901234', tickets: 1, createdAt: '16 Aug 2026, 12:30 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '2 People', packageType: '3Nights 4Days', budget: '10K - 15K INR', location: 'Canggu', address: '', notes: '', formSource: 'General', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06749', name: 'Sakshi Agarwal', phone: '9789012345', tickets: 5, createdAt: '16 Aug 2026, 11:15 AM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '5 People', packageType: '6Nights 7Days', budget: '40K - 60K INR', location: 'Lombok', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'This Month', interest: 'Very Interested' },
    { id: 'L-06748', name: 'Nikhil Chopra', phone: '7890123456', tickets: 2, createdAt: '16 Aug 2026, 10:00 AM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '16K - 24K INR', location: 'Seminyak', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'Undecided', interest: 'Decide on-site' },
    { id: 'L-06747', name: 'Pooja Reddy', phone: '8901234567', tickets: 3, createdAt: '16 Aug 2026, 09:00 AM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '3-4 People', packageType: '5Nights 6Days', budget: '28K - 38K INR', location: 'Ubud', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'Next Month', interest: 'Interested' },
    { id: 'L-06746', name: 'Varun Saxena', phone: '9012345678', tickets: 4, createdAt: '15 Aug 2026, 11:55 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '4 People', packageType: '6Nights 7Days', budget: '35K - 50K INR', location: 'Kuta', address: '', notes: '', formSource: 'Ads Pop Up', plannedVisit: 'Next Week', interest: 'Very Interested' },
    { id: 'L-06745', name: 'Divya Iyer', phone: '6123456789', tickets: 1, createdAt: '15 Aug 2026, 10:40 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '1 Person', packageType: '3Nights 4Days', budget: '8K - 12K INR', location: 'Canggu', address: '', notes: '', formSource: 'General', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06744', name: 'Arjun Menon', phone: '7234567890', tickets: 2, createdAt: '15 Aug 2026, 09:25 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '14K - 20K INR', location: 'Nusa Penida', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'This Weekend', interest: 'Interested' },
    { id: 'L-06743', name: 'Shruti Pillai', phone: '8345678901', tickets: 3, createdAt: '15 Aug 2026, 08:10 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '3 People', packageType: '5Nights 6Days', budget: '20K - 30K INR', location: 'Seminyak', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'Next Month', interest: 'Very Interested' },
    { id: 'L-06742', name: 'Kabir Sharma', phone: '9456789012', tickets: 2, createdAt: '15 Aug 2026, 07:00 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '16K - 22K INR', location: 'Ubud', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06741', name: 'Tanya Khanna', phone: '6567890123', tickets: 1, createdAt: '15 Aug 2026, 05:45 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '2 People', packageType: '3Nights 4Days', budget: '10K - 15K INR', location: 'Kuta', address: '', notes: '', formSource: 'General', plannedVisit: 'Undecided', interest: 'Decide on-site' },
    { id: 'L-06740', name: 'Gaurav Tiwari', phone: '7678901234', tickets: 4, createdAt: '15 Aug 2026, 04:30 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '4-5 People', packageType: '6Nights 7Days', budget: '45K - 65K INR', location: 'Lombok', address: '', notes: '', formSource: 'Ads Pop Up', plannedVisit: 'This Month', interest: 'Very Interested' },
    { id: 'L-06739', name: 'Nandini Rao', phone: '8789012345', tickets: 2, createdAt: '15 Aug 2026, 03:15 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '18K - 26K INR', location: 'Canggu', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'Next Week', interest: 'Interested' },
    { id: 'L-06738', name: 'Harsh Gupta', phone: '9890123456', tickets: 3, createdAt: '15 Aug 2026, 02:00 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '3 People', packageType: '5Nights 6Days', budget: '24K - 34K INR', location: 'Seminyak', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'Next Month', interest: 'Very Interested' },
    { id: 'L-06737', name: 'Ritika Sen', phone: '7901234567', tickets: 1, createdAt: '15 Aug 2026, 12:45 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '1 Person', packageType: '3Nights 4Days', budget: '8K - 12K INR', location: 'Nusa Penida', address: '', notes: '', formSource: 'General', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06736', name: 'Manish Dubey', phone: '6012345678', tickets: 5, createdAt: '15 Aug 2026, 11:30 AM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '5-6 People', packageType: '7Nights 8Days', budget: '55K - 75K INR', location: 'Ubud', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'This Month', interest: 'Very Interested' },
    { id: 'L-06735', name: 'Aisha Khan', phone: '7123456789', tickets: 2, createdAt: '15 Aug 2026, 10:15 AM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '15K - 22K INR', location: 'Kuta', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'Next Week', interest: 'Interested' },
    { id: 'L-06734', name: 'Siddharth Jain', phone: '8234567890', tickets: 2, createdAt: '15 Aug 2026, 09:00 AM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '16K - 24K INR', location: 'Canggu', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06733', name: 'Deepa Nambiar', phone: '9345678901', tickets: 3, createdAt: '14 Aug 2026, 11:55 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '3-4 People', packageType: '5Nights 6Days', budget: '26K - 36K INR', location: 'Seminyak', address: '', notes: '', formSource: 'Ads Pop Up', plannedVisit: 'Next Month', interest: 'Very Interested' },
    { id: 'L-06732', name: 'Vikram Bhat', phone: '6456789012', tickets: 1, createdAt: '14 Aug 2026, 10:40 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '1 Person', packageType: '3Nights 4Days', budget: '7K - 11K INR', location: 'Nusa Penida', address: '', notes: '', formSource: 'General', plannedVisit: 'Undecided', interest: 'Decide on-site' },
    { id: 'L-06731', name: 'Tanvi Kulkarni', phone: '7567890123', tickets: 4, createdAt: '14 Aug 2026, 09:25 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '4 People', packageType: '6Nights 7Days', budget: '38K - 55K INR', location: 'Lombok', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'This Month', interest: 'Very Interested' },
    { id: 'L-06730', name: 'Rajat Malhotra', phone: '8678901234', tickets: 2, createdAt: '14 Aug 2026, 08:10 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '14K - 20K INR', location: 'Ubud', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'This Weekend', interest: 'Interested' },
    { id: 'L-06729', name: 'Simran Kaur', phone: '9789012345', tickets: 1, createdAt: '14 Aug 2026, 06:55 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '2 People', packageType: '3Nights 4Days', budget: '9K - 13K INR', location: 'Kuta', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06728', name: 'Akash Patel', phone: '6890123456', tickets: 3, createdAt: '14 Aug 2026, 05:40 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '3 People', packageType: '5Nights 6Days', budget: '22K - 32K INR', location: 'Canggu', address: '', notes: '', formSource: 'Ads Pop Up', plannedVisit: 'Next Week', interest: 'Very Interested' },
    { id: 'L-06727', name: 'Neha Kapoor', phone: '7901234567', tickets: 2, createdAt: '14 Aug 2026, 04:25 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '17K - 25K INR', location: 'Seminyak', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'Next Month', interest: 'Interested' },
    { id: 'L-06726', name: 'Tarun Bose', phone: '8012345678', tickets: 1, createdAt: '14 Aug 2026, 03:10 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '1 Person', packageType: '3Nights 4Days', budget: '8K - 12K INR', location: 'Nusa Penida', address: '', notes: '', formSource: 'General', plannedVisit: 'Undecided', interest: 'Decide on-site' },
    { id: 'L-06725', name: 'Kriti Sharma', phone: '9123456789', tickets: 5, createdAt: '14 Aug 2026, 01:55 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '5 People', packageType: '7Nights 8Days', budget: '50K - 70K INR', location: 'Lombok', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'This Month', interest: 'Very Interested' },
    { id: 'L-06724', name: 'Amitabh Das', phone: '6234567890', tickets: 2, createdAt: '14 Aug 2026, 12:40 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '15K - 21K INR', location: 'Ubud', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'This Weekend', interest: 'Interested' },
    { id: 'L-06723', name: 'Pallavi Sinha', phone: '7345678901', tickets: 3, createdAt: '14 Aug 2026, 11:25 AM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '3-4 People', packageType: '5Nights 6Days', budget: '28K - 40K INR', location: 'Kuta', address: '', notes: '', formSource: 'Ads Pop Up', plannedVisit: 'Next Month', interest: 'Very Interested' },
    { id: 'L-06722', name: 'Devendra Raj', phone: '8456789012', tickets: 1, createdAt: '14 Aug 2026, 10:10 AM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '1 Person', packageType: '3Nights 4Days', budget: '7K - 10K INR', location: 'Canggu', address: '', notes: '', formSource: 'General', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06721', name: 'Swati Mehra', phone: '9567890123', tickets: 4, createdAt: '14 Aug 2026, 08:55 AM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '4 People', packageType: '6Nights 7Days', budget: '32K - 48K INR', location: 'Seminyak', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'Next Week', interest: 'Very Interested' },
    { id: 'L-06720', name: 'Mohit Goel', phone: '6678901234', tickets: 2, createdAt: '13 Aug 2026, 11:50 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '16K - 23K INR', location: 'Nusa Penida', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'This Weekend', interest: 'Interested' },
    { id: 'L-06719', name: 'Ankita Chatterjee', phone: '7789012345', tickets: 2, createdAt: '13 Aug 2026, 10:35 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '18K - 26K INR', location: 'Ubud', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'Next Month', interest: 'Decide on-site' },
    { id: 'L-06718', name: 'Sanjay Kulkarni', phone: '8890123456', tickets: 3, createdAt: '13 Aug 2026, 09:20 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '3 People', packageType: '5Nights 6Days', budget: '24K - 34K INR', location: 'Kuta', address: '', notes: '', formSource: 'Ads Pop Up', plannedVisit: 'This Month', interest: 'Very Interested' },
    { id: 'L-06717', name: 'Preeti Chauhan', phone: '6901234567', tickets: 1, createdAt: '13 Aug 2026, 08:05 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '1 Person', packageType: '3Nights 4Days', budget: '8K - 11K INR', location: 'Canggu', address: '', notes: '', formSource: 'General', plannedVisit: 'Undecided', interest: 'Decide on-site' },
    { id: 'L-06716', name: 'Karan Bhatt', phone: '9012345678', tickets: 4, createdAt: '13 Aug 2026, 06:50 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '4-5 People', packageType: '6Nights 7Days', budget: '40K - 58K INR', location: 'Lombok', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'Next Week', interest: 'Very Interested' },
    { id: 'L-06715', name: 'Lata Venkatesh', phone: '7123456789', tickets: 2, createdAt: '13 Aug 2026, 05:35 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '14K - 20K INR', location: 'Seminyak', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'This Weekend', interest: 'Interested' },
    { id: 'L-06714', name: 'Ravi Prasad', phone: '8234567890', tickets: 1, createdAt: '13 Aug 2026, 04:20 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '1 Person', packageType: '3Nights 4Days', budget: '7K - 10K INR', location: 'Nusa Penida', address: '', notes: '', formSource: 'General', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06713', name: 'Shreya Ghosh', phone: '9345678901', tickets: 3, createdAt: '13 Aug 2026, 03:05 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '3 People', packageType: '5Nights 6Days', budget: '22K - 30K INR', location: 'Ubud', address: '', notes: '', formSource: 'Ads Pop Up', plannedVisit: 'Next Month', interest: 'Very Interested' },
    { id: 'L-06712', name: 'Ajay Kumar Singh', phone: '6456789012', tickets: 2, createdAt: '13 Aug 2026, 01:50 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '16K - 24K INR', location: 'Kuta', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'Next Week', interest: 'Interested' },
    { id: 'L-06711', name: 'Usha Reddy', phone: '7567890123', tickets: 1, createdAt: '13 Aug 2026, 12:35 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '2 People', packageType: '3Nights 4Days', budget: '9K - 14K INR', location: 'Canggu', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06710', name: 'Suresh Pillai', phone: '8678901234', tickets: 5, createdAt: '13 Aug 2026, 11:20 AM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '5-6 People', packageType: '7Nights 8Days', budget: '55K - 75K INR', location: 'Lombok', address: '', notes: '', formSource: 'Ads Pop Up', plannedVisit: 'This Month', interest: 'Very Interested' },
    { id: 'L-06709', name: 'Geeta Bajaj', phone: '9789012345', tickets: 2, createdAt: '13 Aug 2026, 10:05 AM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '15K - 22K INR', location: 'Seminyak', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'This Weekend', interest: 'Interested' },
    { id: 'L-06708', name: 'Pradeep Menon', phone: '6890123456', tickets: 3, createdAt: '12 Aug 2026, 11:55 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '3-4 People', packageType: '5Nights 6Days', budget: '26K - 38K INR', location: 'Ubud', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'Next Month', interest: 'Very Interested' },
    { id: 'L-06707', name: 'Manorama Das', phone: '7901234567', tickets: 1, createdAt: '12 Aug 2026, 10:40 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '1 Person', packageType: '3Nights 4Days', budget: '7K - 11K INR', location: 'Nusa Penida', address: '', notes: '', formSource: 'General', plannedVisit: 'Undecided', interest: 'Decide on-site' },
    { id: 'L-06706', name: 'Ashok Ranjan', phone: '8012345678', tickets: 4, createdAt: '12 Aug 2026, 09:25 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '4 People', packageType: '6Nights 7Days', budget: '34K - 50K INR', location: 'Kuta', address: '', notes: '', formSource: 'Ads Pop Up', plannedVisit: 'Next Week', interest: 'Very Interested' },
    { id: 'L-06705', name: 'Vandana Shukla', phone: '9123456789', tickets: 2, createdAt: '12 Aug 2026, 08:10 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '14K - 20K INR', location: 'Canggu', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06704', name: 'Jatin Sehgal', phone: '6234567890', tickets: 2, createdAt: '12 Aug 2026, 06:55 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '17K - 25K INR', location: 'Seminyak', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'Next Month', interest: 'Interested' },
    { id: 'L-06703', name: 'Madhavi Latha', phone: '7345678901', tickets: 3, createdAt: '12 Aug 2026, 05:40 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '3 People', packageType: '5Nights 6Days', budget: '23K - 33K INR', location: 'Lombok', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'This Month', interest: 'Very Interested' },
    { id: 'L-06702', name: 'Sunil Jaiswal', phone: '8456789012', tickets: 1, createdAt: '12 Aug 2026, 04:25 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '1 Person', packageType: '3Nights 4Days', budget: '8K - 12K INR', location: 'Ubud', address: '', notes: '', formSource: 'General', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06701', name: 'Kamini Saxena', phone: '9567890123', tickets: 4, createdAt: '12 Aug 2026, 03:10 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '4 People', packageType: '6Nights 7Days', budget: '36K - 52K INR', location: 'Kuta', address: '', notes: '', formSource: 'Ads Pop Up', plannedVisit: 'Next Week', interest: 'Very Interested' },
    { id: 'L-06700', name: 'Naveen Chandra', phone: '6678901234', tickets: 2, createdAt: '12 Aug 2026, 01:55 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '15K - 23K INR', location: 'Nusa Penida', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'This Weekend', interest: 'Interested' },
    { id: 'L-06699', name: 'Urmila Thakur', phone: '7789012345', tickets: 1, createdAt: '12 Aug 2026, 12:40 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '2 People', packageType: '3Nights 4Days', budget: '9K - 14K INR', location: 'Canggu', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'Undecided', interest: 'Decide on-site' },
    { id: 'L-06698', name: 'Deepak Rai', phone: '8890123456', tickets: 3, createdAt: '12 Aug 2026, 11:25 AM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '3 People', packageType: '5Nights 6Days', budget: '20K - 28K INR', location: 'Seminyak', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'Next Month', interest: 'Interested' },
    { id: 'L-06697', name: 'Firoz Khan', phone: '6901234567', tickets: 2, createdAt: '12 Aug 2026, 10:10 AM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '16K - 24K INR', location: 'Ubud', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06696', name: 'Lalitha Devi', phone: '7012345678', tickets: 5, createdAt: '11 Aug 2026, 11:55 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '5 People', packageType: '7Nights 8Days', budget: '48K - 68K INR', location: 'Lombok', address: '', notes: '', formSource: 'Ads Pop Up', plannedVisit: 'This Month', interest: 'Very Interested' },
    { id: 'L-06695', name: 'Bharat Rawat', phone: '8123456789', tickets: 1, createdAt: '11 Aug 2026, 10:40 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '1 Person', packageType: '3Nights 4Days', budget: '7K - 10K INR', location: 'Kuta', address: '', notes: '', formSource: 'General', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06694', name: 'Chitra Murthy', phone: '9234567890', tickets: 2, createdAt: '11 Aug 2026, 09:25 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '14K - 21K INR', location: 'Nusa Penida', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'Next Week', interest: 'Interested' },
    { id: 'L-06693', name: 'Rakesh Khatri', phone: '6345678901', tickets: 3, createdAt: '11 Aug 2026, 08:10 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '3-4 People', packageType: '5Nights 6Days', budget: '27K - 39K INR', location: 'Canggu', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'Next Month', interest: 'Very Interested' },
    { id: 'L-06692', name: 'Suma Hegde', phone: '7456789012', tickets: 2, createdAt: '11 Aug 2026, 06:55 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '18K - 26K INR', location: 'Seminyak', address: '', notes: '', formSource: 'Ads Pop Up', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06691', name: 'Mohan Lal', phone: '8567890123', tickets: 1, createdAt: '11 Aug 2026, 05:40 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '1 Person', packageType: '3Nights 4Days', budget: '8K - 11K INR', location: 'Ubud', address: '', notes: '', formSource: 'General', plannedVisit: 'Undecided', interest: 'Decide on-site' },
    { id: 'L-06690', name: 'Vasundhara Iyer', phone: '9678901234', tickets: 4, createdAt: '11 Aug 2026, 04:25 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '4 People', packageType: '6Nights 7Days', budget: '38K - 56K INR', location: 'Kuta', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'This Month', interest: 'Very Interested' },
    { id: 'L-06689', name: 'Prakash Jha', phone: '6789012345', tickets: 2, createdAt: '11 Aug 2026, 03:10 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '15K - 22K INR', location: 'Lombok', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'This Weekend', interest: 'Interested' },
    { id: 'L-06688', name: 'Sarita Bhatt', phone: '7890123456', tickets: 3, createdAt: '11 Aug 2026, 01:55 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '3 People', packageType: '5Nights 6Days', budget: '22K - 32K INR', location: 'Canggu', address: '', notes: '', formSource: 'Ads Pop Up', plannedVisit: 'Next Week', interest: 'Very Interested' },
    { id: 'L-06687', name: 'Vinod Kumar', phone: '8901234567', tickets: 1, createdAt: '11 Aug 2026, 12:40 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '2 People', packageType: '3Nights 4Days', budget: '9K - 13K INR', location: 'Nusa Penida', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06686', name: 'Anuradha Kulkarni', phone: '6012345678', tickets: 5, createdAt: '11 Aug 2026, 11:25 AM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '5-6 People', packageType: '7Nights 8Days', budget: '52K - 72K INR', location: 'Seminyak', address: '', notes: '', formSource: 'Ads Pop Up', plannedVisit: 'Next Month', interest: 'Very Interested' },
    { id: 'L-06685', name: 'Dinesh Yadav', phone: '9123456789', tickets: 2, createdAt: '11 Aug 2026, 10:10 AM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '14K - 20K INR', location: 'Ubud', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'Undecided', interest: 'Decide on-site' },
    { id: 'L-06684', name: 'Sunita Devi', phone: '6234567890', tickets: 1, createdAt: '10 Aug 2026, 11:55 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '1 Person', packageType: '3Nights 4Days', budget: '7K - 10K INR', location: 'Kuta', address: '', notes: '', formSource: 'General', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06683', name: 'Ramesh Chandra', phone: '7345678901', tickets: 3, createdAt: '10 Aug 2026, 10:40 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '3 People', packageType: '5Nights 6Days', budget: '21K - 31K INR', location: 'Lombok', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'This Month', interest: 'Very Interested' },
    { id: 'L-06682', name: 'Pushpa Rani', phone: '8456789012', tickets: 2, createdAt: '10 Aug 2026, 09:25 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '16K - 24K INR', location: 'Canggu', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'Next Week', interest: 'Interested' },
    { id: 'L-06681', name: 'Anil Kapoor', phone: '9567890123', tickets: 4, createdAt: '10 Aug 2026, 08:10 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '4 People', packageType: '6Nights 7Days', budget: '35K - 52K INR', location: 'Nusa Penida', address: '', notes: '', formSource: 'Ads Pop Up', plannedVisit: 'Next Month', interest: 'Very Interested' },
    { id: 'L-06680', name: 'Kirby Soares', phone: '6678901234', tickets: 1, createdAt: '10 Aug 2026, 06:55 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '2 People', packageType: '3Nights 4Days', budget: '10K - 15K INR', location: 'Seminyak', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06679', name: 'Jayashree Patil', phone: '7789012345', tickets: 2, createdAt: '10 Aug 2026, 05:40 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '17K - 25K INR', location: 'Ubud', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'This Weekend', interest: 'Interested' },
    { id: 'L-06678', name: 'Yogesh Bhat', phone: '8890123456', tickets: 3, createdAt: '10 Aug 2026, 04:25 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '3 People', packageType: '5Nights 6Days', budget: '24K - 34K INR', location: 'Kuta', address: '', notes: '', formSource: 'Ads Pop Up', plannedVisit: 'Next Week', interest: 'Very Interested' },
    { id: 'L-06677', name: 'Renuka Sharma', phone: '6901234567', tickets: 1, createdAt: '10 Aug 2026, 03:10 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '1 Person', packageType: '3Nights 4Days', budget: '7K - 11K INR', location: 'Canggu', address: '', notes: '', formSource: 'General', plannedVisit: 'Undecided', interest: 'Decide on-site' },
    { id: 'L-06676', name: 'Sagar Naik', phone: '9012345678', tickets: 4, createdAt: '10 Aug 2026, 01:55 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '4-5 People', packageType: '6Nights 7Days', budget: '42K - 60K INR', location: 'Lombok', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'This Month', interest: 'Very Interested' },
    { id: 'L-06675', name: 'Lakshmi Iyengar', phone: '7123456789', tickets: 2, createdAt: '10 Aug 2026, 12:40 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '15K - 22K INR', location: 'Nusa Penida', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06674', name: 'Raghunath Rao', phone: '6234567890', tickets: 2, createdAt: '10 Aug 2026, 11:25 AM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '18K - 27K INR', location: 'Seminyak', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'Next Month', interest: 'Interested' },
    { id: 'L-06673', name: 'Vijayalakshmi', phone: '7345678901', tickets: 3, createdAt: '10 Aug 2026, 10:10 AM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '3 People', packageType: '5Nights 6Days', budget: '23K - 33K INR', location: 'Kuta', address: '', notes: '', formSource: 'Ads Pop Up', plannedVisit: 'Next Week', interest: 'Very Interested' },
    { id: 'L-06672', name: 'Madhukar Pawar', phone: '8456789012', tickets: 1, createdAt: '09 Aug 2026, 11:55 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '1 Person', packageType: '3Nights 4Days', budget: '8K - 12K INR', location: 'Canggu', address: '', notes: '', formSource: 'General', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06671', name: 'Sarojini Menon', phone: '9567890123', tickets: 5, createdAt: '09 Aug 2026, 10:40 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '5 People', packageType: '7Nights 8Days', budget: '50K - 70K INR', location: 'Ubud', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'This Month', interest: 'Very Interested' },
    { id: 'L-06670', name: 'Gopal Krishna', phone: '6678901234', tickets: 2, createdAt: '09 Aug 2026, 09:25 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '16K - 24K INR', location: 'Lombok', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'This Weekend', interest: 'Interested' },
    { id: 'L-06669', name: 'Bela Singh', phone: '7789012345', tickets: 1, createdAt: '09 Aug 2026, 08:10 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '2 People', packageType: '3Nights 4Days', budget: '9K - 14K INR', location: 'Nusa Penida', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'Undecided', interest: 'Decide on-site' },
    { id: 'L-06668', name: 'Pandurang Shetty', phone: '8890123456', tickets: 3, createdAt: '09 Aug 2026, 06:55 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '3 People', packageType: '5Nights 6Days', budget: '22K - 30K INR', location: 'Seminyak', address: '', notes: '', formSource: 'Ads Pop Up', plannedVisit: 'Next Week', interest: 'Very Interested' },
    { id: 'L-06667', name: 'Kamala Rajan', phone: '6901234567', tickets: 2, createdAt: '09 Aug 2026, 05:40 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '14K - 21K INR', location: 'Ubud', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06666', name: 'Tilak Raj', phone: '7012345678', tickets: 4, createdAt: '09 Aug 2026, 04:25 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '4 People', packageType: '6Nights 7Days', budget: '34K - 50K INR', location: 'Kuta', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'Next Month', interest: 'Very Interested' },
    { id: 'L-06665', name: 'Durga Prasad', phone: '8123456789', tickets: 1, createdAt: '09 Aug 2026, 03:10 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '1 Person', packageType: '3Nights 4Days', budget: '7K - 10K INR', location: 'Canggu', address: '', notes: '', formSource: 'General', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06664', name: 'Meenakshi Amma', phone: '9234567890', tickets: 3, createdAt: '09 Aug 2026, 01:55 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '3 People', packageType: '5Nights 6Days', budget: '26K - 38K INR', location: 'Lombok', address: '', notes: '', formSource: 'Ads Pop Up', plannedVisit: 'This Month', interest: 'Very Interested' },
    { id: 'L-06663', name: 'Narasimha Rao', phone: '6345678901', tickets: 2, createdAt: '09 Aug 2026, 12:40 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '15K - 22K INR', location: 'Nusa Penida', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'Next Week', interest: 'Decide on-site' },
    { id: 'L-06662', name: 'Chandrika Devi', phone: '7456789012', tickets: 1, createdAt: '09 Aug 2026, 11:25 AM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '2 People', packageType: '3Nights 4Days', budget: '8K - 12K INR', location: 'Seminyak', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'This Weekend', interest: 'Interested' },
    { id: 'L-06661', name: 'Shankar Pillai', phone: '8567890123', tickets: 4, createdAt: '09 Aug 2026, 10:10 AM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '4-5 People', packageType: '6Nights 7Days', budget: '40K - 58K INR', location: 'Canggu', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'This Month', interest: 'Very Interested' },
    { id: 'L-06660', name: 'Parvathi Menon', phone: '9678901234', tickets: 2, createdAt: '08 Aug 2026, 11:55 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '17K - 25K INR', location: 'Ubud', address: '', notes: '', formSource: 'Ads Pop Up', plannedVisit: 'Next Month', interest: 'Decide on-site' },
    { id: 'L-06659', name: 'Govind Nambiar', phone: '6789012345', tickets: 1, createdAt: '08 Aug 2026, 10:40 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '1 Person', packageType: '3Nights 4Days', budget: '7K - 11K INR', location: 'Kuta', address: '', notes: '', formSource: 'General', plannedVisit: 'Undecided', interest: 'Decide on-site' },
    { id: 'L-06658', name: 'Padmavathi R.', phone: '7890123456', tickets: 3, createdAt: '08 Aug 2026, 09:25 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '3 People', packageType: '5Nights 6Days', budget: '24K - 34K INR', location: 'Lombok', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'Next Week', interest: 'Very Interested' },
    { id: 'L-06657', name: 'Raghavan P.', phone: '8901234567', tickets: 2, createdAt: '08 Aug 2026, 08:10 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '16K - 23K INR', location: 'Nusa Penida', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'This Weekend', interest: 'Interested' },
    { id: 'L-06656', name: 'Aparna Iyer', phone: '6012345678', tickets: 5, createdAt: '08 Aug 2026, 06:55 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '5 People', packageType: '7Nights 8Days', budget: '55K - 75K INR', location: 'Seminyak', address: '', notes: '', formSource: 'Ads Pop Up', plannedVisit: 'This Month', interest: 'Very Interested' },
    { id: 'L-06655', name: 'Suresh Kumar', phone: '9123456789', tickets: 1, createdAt: '08 Aug 2026, 05:40 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '1 Person', packageType: '3Nights 4Days', budget: '8K - 12K INR', location: 'Canggu', address: '', notes: '', formSource: 'General', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06654', name: 'Devika Menon', phone: '6234567890', tickets: 2, createdAt: '08 Aug 2026, 04:25 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '15K - 21K INR', location: 'Ubud', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'Next Week', interest: 'Decide on-site' },
    { id: 'L-06653', name: 'Balasubramaniam', phone: '7345678901', tickets: 3, createdAt: '08 Aug 2026, 03:10 PM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '3-4 People', packageType: '5Nights 6Days', budget: '28K - 40K INR', location: 'Kuta', address: '', notes: '', formSource: 'Pop Up', plannedVisit: 'Next Month', interest: 'Very Interested' },
    { id: 'L-06652', name: 'Sharada Raj', phone: '8456789012', tickets: 2, createdAt: '08 Aug 2026, 01:55 PM', status: 'New', assignedTo: 'Bedkar', email: '', guests: '2 People', packageType: '4Nights 5Days', budget: '18K - 26K INR', location: 'Lombok', address: '', notes: '', formSource: 'Semi Pop Up', plannedVisit: 'This Weekend', interest: 'Interested' },
    { id: 'L-06651', name: 'Ganesh Pai', phone: '9567890123', tickets: 1, createdAt: '08 Aug 2026, 12:40 PM', status: 'New', assignedTo: 'Shipra (Me)', email: '', guests: '1 Person', packageType: '3Nights 4Days', budget: '7K - 10K INR', location: 'Nusa Penida', address: '', notes: '', formSource: 'General', plannedVisit: 'This Weekend', interest: 'Decide on-site' },
    { id: 'L-06650', name: 'Sushila Bai', phone: '6678901234', tickets: 4, createdAt: '08 Aug 2026, 11:25 AM', status: 'New', assignedTo: 'Tanveer', email: '', guests: '4 People', packageType: '6Nights 7Days', budget: '36K - 52K INR', location: 'Canggu', address: '', notes: '', formSource: 'Ads Pop Up', plannedVisit: 'Next Week', interest: 'Very Interested' }
];

// ============================================================================
// INITIALIZATION
// ============================================================================

function updateLastSync() {
    const el = document.getElementById('lastSyncText');
    if (!el) return;
    const now = new Date();
    const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    el.textContent = 'Last sync ' + date + ', ' + time;
}

function logoutAdmin() {
    if (confirm('Do you want to logout?')) {
        sessionStorage.removeItem('adminLoggedIn');
        window.location.href = 'admin-login.html';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    try {
        allLeads = loadLeadsFromStorage() || [...defaultLeadsData];
        applyDemoDestinations();
        filteredLeads = [...allLeads];
        const allFilterText = document.querySelector('#allBtn .filter-text');
        if (allFilterText) allFilterText.textContent = 'All (' + allLeads.length + ')';
        updateFilterCounts();
        renderTable();
        updateResultsInfo();
        renderPagination();
        initializeMobileMenu();
    } catch (err) {
        reportError(err);
    }

    const topMenuBtn = document.getElementById('topMenuBtn');
    if (topMenuBtn) topMenuBtn.addEventListener('click', function() {
        var sb = document.getElementById('sidebar');
        if (sb) sb.classList.toggle('collapsed');
    });
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.custom-dropdown')) closeAllDropdowns();
        if (!e.target.closest('.bulk-dropdown')) closeBulkMenus();
        if (!e.target.closest('.user-profile')) {
            const pp = document.getElementById('profilePopup');
            if (pp) pp.classList.remove('show');
        }
        if (!e.target.closest('.notif-wrapper') && !e.target.closest('.mobile-notif-wrapper')) {
            closeNotifPanels();
        }
        if (!e.target.closest('.custom-form-dropdown')) {
            document.querySelectorAll('.custom-form-dropdown-menu.show').forEach(function(m) { m.classList.remove('show'); });
            document.querySelectorAll('.custom-form-dropdown-trigger.open').forEach(function(t) { t.classList.remove('open'); });
        }
        if (!e.target.closest('.view-custom-dropdown')) {
            document.querySelectorAll('.view-dropdown-menu.show').forEach(function(m) { m.classList.remove('show'); });
            document.querySelectorAll('.view-dropdown-trigger.open').forEach(function(t) { t.classList.remove('open'); });
        }
        if (!e.target.closest('.assign-cell') && !e.target.closest('.assign-dropdown-popup')) {
            closeAssignDropdown();
        }
        if (!e.target.closest('.status-cell') && !e.target.closest('.status-dropdown-popup')) {
            closeStatusDropdown();
        }
        if (!e.target.closest('.destination-cell') && !e.target.closest('.destination-dropdown-popup')) {
            closeDestinationDropdown();
        }
    });

    document.addEventListener('change', function(e) {
        if (e.target && e.target.name === 'leadCheck') {
            const selectAll = document.getElementById('selectAll');
            const all = document.querySelectorAll('input[name="leadCheck"]');
            const checked = document.querySelectorAll('input[name="leadCheck"]:checked');
            if (selectAll) selectAll.checked = all.length > 0 && all.length === checked.length;
            updateBulkBar();
        }
    });

    const addNewBtn = document.getElementById('addNewBtn');
    if (addNewBtn) addNewBtn.addEventListener('click', () => openModal('addLeadModal'));

    const importBtn = document.getElementById('importBtn');
    if (importBtn) importBtn.addEventListener('click', importLeads);

    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) exportBtn.addEventListener('click', exportLeads);

    updateLastSync();
    const leadsSync = document.getElementById('leadsSync');
    if (leadsSync) leadsSync.addEventListener('click', function() {
        updateLastSync();
        showToast('Leads synced');
    });

    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) userAvatar.addEventListener('click', function(e) {
        e.stopPropagation();
        const popup = document.getElementById('profilePopup');
        if (popup) popup.classList.toggle('show');
    });
});

// ============================================================================
// MOBILE MENU
// ============================================================================

function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mobileProfileBtn = document.getElementById('mobileProfileBtn');
    const mobileMenuDropdown = document.getElementById('mobileMenuDropdown');
    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (mobileMenuDropdown) mobileMenuDropdown.classList.toggle('show');
        if (sidebar) sidebar.classList.remove('active');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    });
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('mobileMenuDropdown');
        if (dropdown && dropdown.classList.contains('show') && !e.target.closest('.mobile-menu-btn') && !e.target.closest('.mobile-menu-dropdown')) {
            dropdown.classList.remove('show');
        }
    });
    const mobileMenuLeads = document.getElementById('mobileMenuLeads');
    const mobileMenuPackages = document.getElementById('mobileMenuPackages');
    if (mobileMenuLeads) mobileMenuLeads.addEventListener('click', function(e) { e.preventDefault(); goToMobilePage('admin-dashboard.html'); });
    if (mobileMenuPackages) mobileMenuPackages.addEventListener('click', function(e) { e.preventDefault(); goToMobilePage('admin-packages.html'); });
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', function() { if (sidebar) sidebar.classList.remove('active'); this.classList.remove('active'); });
    if (mobileProfileBtn) mobileProfileBtn.addEventListener('click', function() { if (confirm('Do you want to logout?')) { sessionStorage.removeItem('adminLoggedIn'); window.location.href = 'admin-login.html'; } });
}

function goToMobilePage(href) {
    const dropdown = document.getElementById('mobileMenuDropdown');
    if (dropdown) dropdown.classList.remove('show');
    window.location.href = href;
}

function mobileLogout() {
    if (confirm('Do you want to logout?')) {
        sessionStorage.removeItem('adminLoggedIn');
        window.location.href = 'admin-login.html';
    }
}

// ============================================================================
// FILTER FUNCTIONALITY
// ============================================================================

function toggleFilters() {
    const filtersRow = document.getElementById('filtersRow');
    const filtersToggle = document.getElementById('filterToggle');
    if (filtersRow.style.display === 'none' || !filtersRow.style.display) {
        filtersRow.style.display = 'flex';
        filtersToggle.classList.add('active');
    } else {
        filtersRow.style.display = 'none';
        filtersToggle.classList.remove('active');
        closeAllDropdowns();
    }
}

function toggleDropdown(filterId) {
    const dropdown = document.getElementById(`${filterId}Dropdown`);
    const button = document.getElementById(`${filterId}Btn`);
    const isOpen = dropdown && dropdown.classList.contains('show');
    closeAllDropdowns();
    if (dropdown && button && !isOpen) {
        dropdown.classList.add('show');
        button.classList.add('open');
        trackPopup(dropdown, button, 4, true);
    }
}

function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(d => {
        untrackPopup(d);
        d.classList.remove('show');
    });
    document.querySelectorAll('.dropdown-trigger').forEach(b => b.classList.remove('open'));
}

function selectFilter(filterType, value, element) {
    const btn = document.getElementById(`${filterType}Btn`);
    if (btn) { const textSpan = btn.querySelector('.filter-text'); if (textSpan) textSpan.textContent = value; }
    const dropdown = element.parentElement;
    dropdown.querySelectorAll('.dropdown-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
    if (filterType === 'sheet') {
        activeSheetFilter = value;
    } else if (filterType === 'date') {
        activeDateFilter = value;
    }
    applyFilters();
    closeAllDropdowns();
}

function applyFilters() {
    filteredLeads = [...allLeads];
    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filteredLeads = filteredLeads.filter(l => l.name.toLowerCase().includes(q) || (l.phone || '').includes(searchQuery) || (l.id || '').toLowerCase().includes(q) || (l.email || '').toLowerCase().includes(q));
    }
    const assignEl = document.querySelector('#assignBtn .filter-text');
    const assignFilter = assignEl ? assignEl.textContent : undefined;
    if (assignFilter && assignFilter !== 'Select Assign' && assignFilter !== 'Assign All') {
        filteredLeads = filteredLeads.filter(l => (l.assignedTo || '').startsWith(assignFilter));
    }
    const allEl = document.querySelector('#allBtn .filter-text');
    const allFilter = allEl ? allEl.textContent : undefined;
    if (allFilter && allFilter !== 'All (' + allLeads.length + ')') {
        const statusMap = { 'New': 'new', 'Contacted': 'contacted', 'RNR': 'rnr', 'Follow Up': 'follow-up', 'Interested': 'interested', 'Not Interested': 'not-interested' };
        const norm = (s) => (s || '').toLowerCase().replace(/\s+/g, '-');
        for (const [label, statusVal] of Object.entries(statusMap)) {
            if (allFilter.includes(label)) {
                filteredLeads = filteredLeads.filter(l => norm(l.status) === statusVal);
                break;
            }
        }
    }
    if (activeSheetFilter && activeSheetFilter !== 'All Sheets') {
        const sheetLower = activeSheetFilter.toLowerCase();
        if (sheetLower !== 'track') {
            filteredLeads = filteredLeads.filter(l => {
                const src = (l.source || l.formSource || '').toLowerCase();
                return src.includes(sheetLower);
            });
        }
    }
    if (activeDateFilter && activeDateFilter !== 'Select date') {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const dateRanges = {
            'Today': [today, new Date(today.getTime() + 86400000)],
            'Yesterday': [new Date(today.getTime() - 86400000), today],
            'Last 7 days': [new Date(today.getTime() - 7 * 86400000), new Date(today.getTime() + 86400000)],
            'This month': [new Date(now.getFullYear(), now.getMonth(), 1), new Date(now.getFullYear(), now.getMonth() + 1, 1)],
            'Last month': [new Date(now.getFullYear(), now.getMonth() - 1, 1), new Date(now.getFullYear(), now.getMonth(), 1)]
        };
        const range = dateRanges[activeDateFilter];
        if (range) {
            filteredLeads = filteredLeads.filter(l => {
                const d = parseLeadDate(l.createdAt);
                return d >= range[0] && d < range[1];
            });
        }
    }
    currentPage = 1;
    renderTable();
    updateResultsInfo();
    renderPagination();
}

function updateFilterCounts() {
    const counts = { all: allLeads.length, new: 0, contacted: 0, rnr: 0, 'follow-up': 0, interested: 0, 'not-interested': 0 };
    allLeads.forEach(l => {
        const norm = (l.status || '').toLowerCase().replace(/\s+/g, '-');
        if (counts[norm] !== undefined) counts[norm]++;
    });
    const labels = { all: 'All', new: 'New', contacted: 'Contacted', rnr: 'RNR', 'follow-up': 'Follow Up', interested: 'Interested', 'not-interested': 'Not Interested' };
    document.querySelectorAll('#allDropdown .dropdown-item').forEach(item => {
        const st = item.getAttribute('data-status');
        item.textContent = labels[st] + ' (' + counts[st] + ')';
    });
}

// ============================================================================
// SEARCH
// ============================================================================

function performSearch() {
    searchQuery = document.getElementById('searchInput').value;
    applyFilters();
}

function refreshSearch() {
    document.getElementById('searchInput').value = '';
    searchQuery = '';
    activeSheetFilter = '';
    activeDateFilter = '';
    const allBtn = document.querySelector('#allBtn .filter-text');
    if (allBtn) allBtn.textContent = 'All (' + allLeads.length + ')';
    updateFilterCounts();
    const assignBtn = document.querySelector('#assignBtn .filter-text');
    if (assignBtn) assignBtn.textContent = 'Select Assign';
    const sheetBtn = document.querySelector('#sheetBtn .filter-text');
    if (sheetBtn) sheetBtn.textContent = 'Select Sheet';
    const dateBtn = document.querySelector('#dateBtn .filter-text');
    if (dateBtn) dateBtn.textContent = 'Select date';
    filteredLeads = [...allLeads];
    currentPage = 1;
    renderTable();
    updateResultsInfo();
    renderPagination();
}

function syncLeads() {
    const syncEl = document.getElementById('leadsSync');
    const lastSyncText = document.getElementById('lastSyncText');
    const dot = syncEl ? syncEl.querySelector('.sync-dot') : null;
    if (syncEl) syncEl.style.pointerEvents = 'none';
    if (lastSyncText) lastSyncText.textContent = 'Syncing leads\u2026';
    if (dot) { dot.style.background = '#EF3340'; dot.style.animation = 'pulse 1s infinite'; }
    setTimeout(function() {
        if (dot) { dot.style.background = '#22C55E'; dot.style.animation = ''; }
        if (lastSyncText) {
            var now = new Date();
            var date = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
            var time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            lastSyncText.textContent = 'Last sync ' + date + ', ' + time;
        }
        refreshSearch();
        showToast('Leads are updated');
        if (syncEl) syncEl.style.pointerEvents = '';
        setTimeout(function() { if (dot) { dot.style.background = ''; dot.style.animation = ''; } }, 2000);
    }, 1500);
}

// ============================================================================
// TABLE RENDERING
// ============================================================================

function highlightText(text, query) {
    if (!query || !query.trim()) return escapeHtml(text);
    var escaped = escapeHtml(text);
    var q = escapeHtml(query.trim());
    var regex = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return escaped.replace(regex, '<mark class="search-highlight">$1</mark>');
}

function renderTable() {
    closeAssignDropdown();
    closeStatusDropdown();
    closeDestinationDropdown();
    const tableBody = document.getElementById('leadsTableBody');
    const noResults = document.getElementById('noResults');
    if (!tableBody) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredLeads.length);
    const pageLeads = filteredLeads.slice(startIndex, endIndex);
    
    if (pageLeads.length === 0) {
        tableBody.innerHTML = '';
        tableBody.parentElement.querySelector('thead').style.display = 'none';
        if (noResults) {
            noResults.style.display = 'flex';
            const title = noResults.querySelector('h3');
            const desc = noResults.querySelector('p');
            if (searchQuery.trim()) {
                if (title) title.textContent = `No items found for "${searchQuery}"`;
                if (desc) desc.textContent = 'Try adjusting your search or filter criteria.';
            } else {
                if (title) title.textContent = 'No results found';
                if (desc) desc.textContent = 'Try adjusting your filter criteria.';
            }
        }
        const mobileContainer = document.getElementById('mobileCardsContainer');
        if (mobileContainer) {
            mobileContainer.innerHTML = `
                <div style="text-align:center;padding:40px 20px;color:#999;font-size:14px;">
                    ${searchQuery.trim() ? `No items found for &quot;${searchQuery}&quot;` : 'No results found'}. Try adjusting your search or filter criteria.
                </div>`;
        }
        return;
    }
    
    tableBody.parentElement.querySelector('thead').style.display = '';
    if (noResults) noResults.style.display = 'none';
    
    tableBody.innerHTML = pageLeads.map(lead => {
        const name = lead.name || 'Unknown';
        const phone = lead.phone || '—';
        const status = lead.status || 'New';
        const assignedTo = lead.assignedTo || 'Un-Allocated';
        const destination = lead.destination || 'Andaman';
        const initials = name.split(' ').map(n => (n[0] || '')).join('').substring(0, 2) || '?';
        const createdParts = (lead.createdAt || '').split(', ');
        const createdDate = createdParts[0] || '';
        const createdTime = createdParts[1] || '';
        const hlName = highlightText(name, searchQuery);
        const hlPhone = highlightText(phone, searchQuery);
        return `
        <tr style="cursor:pointer" onclick="viewLead('${lead.id}')">
            <td class="col-checkbox" onclick="event.stopPropagation()">
                <label class="custom-checkbox">
                    <input type="checkbox" name="leadCheck" value="${lead.id}">
                    <span class="checkmark"></span>
                </label>
            </td>
            <td class="col-name">
                <div class="lead-name-cell">
                    <div class="lead-avatar">${initials}</div>
                    <div>
                        <div class="lead-name">${hlName}</div>
                        <div class="lead-id">${lead.id}</div>
                    </div>
                </div>
            </td>
            <td class="col-destination">
                <div class="destination-cell" onclick="event.stopPropagation()">
                    <button class="destination-btn" onclick="event.stopPropagation();toggleDestinationDropdownForLead('${lead.id}', this)">
                        <span>${destination}</span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </td>
            <td class="col-phone">
                <div class="phone-number">${hlPhone}</div>
            </td>
            <td class="col-created">
                <div class="created-time">${createdTime}</div>
                <div class="created-date">${createdDate}</div>
            </td>
            <td class="col-assign">
                <div class="assign-cell" onclick="event.stopPropagation()">
                    <button class="assign-btn ${assignedTo === 'Shipra (Me)' ? 'assign-me' : ''}" onclick="event.stopPropagation();toggleAssignDropdownForLead('${lead.id}', this)">
                        <span>${assignedTo}</span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </td>
            <td class="col-status">
                <div class="status-cell" onclick="event.stopPropagation()">
                    <button class="status-btn ${status.toLowerCase().replace(/\s+/g, '-')}" onclick="event.stopPropagation();toggleStatusDropdownForLead('${lead.id}', this)">
                        <span>${status}</span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </td>
            <td class="col-actions">
                <div class="action-buttons" onclick="event.stopPropagation()">
                    <button class="action-cell-btn btn-view" onclick="event.stopPropagation();viewLead('${lead.id}')" title="View Details">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3C4.5 3 1.73 5.11 1 8c.73 2.89 3.5 5 7 5s6.27-2.11 7-5c-.73-2.89-3.5-5-7-5z" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/></svg>
                        View Details
                    </button>
                    <button class="action-cell-btn btn-call" onclick="event.stopPropagation();callLead('${phone}')" title="Call">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M15.05 11.15l-3.2-3.2c-.4-.4-1-.4-1.4 0l-.8.8c-.4.4-1 .4-1.4 0L5.85 6.35c-.4-.4-.4-1 0-1.4l.8-.8c.4-.4.4-1 0-1.4L3.45.55c-.4-.4-1-.4-1.4 0L.65 1.95c-.6.6-.7 1.5-.1 2.2L2.5 6.1l7.4 7.4 1.95 1.95c.7.6 1.6.5 2.2-.1l1.4-1.4c.4-.4.4-1 0-1.4z" fill="currentColor"/></svg>
                    </button>
                    <button class="action-cell-btn btn-whatsapp" onclick="event.stopPropagation();whatsappLead('${phone}')" title="WhatsApp">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0C3.6 0 0 3.6 0 8c0 1.4.4 2.8 1 4L0 16l4.1-1c1.2.6 2.5 1 4 1 4.4 0 8-3.6 8-8S12.4 0 8 0zm4 11.2c-.2.5-.9 1-1.5 1.1-.4 0-.9.1-2.8-.6-1.6-.6-2.9-1.7-4-3.1-.5-.7-.8-1.5-.8-2.3 0-.8.3-1.5.8-2 .2-.2.4-.3.6-.3h.4c.2 0 .4.1.6.4l.8 1.9c.1.3.1.5 0 .7-.1.2-.2.4-.4.6l-.3.3c-.1.1-.1.3 0 .5.3.6.8 1.1 1.3 1.5.5.3 1 .6 1.6.7.2.1.4 0 .5-.1l.6-.7c.2-.2.5-.3.7-.2l1.8.8c.3.1.4.3.5.5.1.1.1.4 0 .7z" fill="currentColor"/></svg>
                    </button>
                </div>
            </td>
        </tr>`;
    }).join('');

    const mobileContainer = document.getElementById('mobileCardsContainer');
    if (mobileContainer) {
        mobileContainer.innerHTML = pageLeads.map(lead => {
            const name = lead.name || 'Unknown';
            const phone = lead.phone || '—';
            const status = lead.status || 'New';
            const assignedTo = lead.assignedTo || 'Un-Allocated';
            const destination = lead.destination || 'Andaman';
            const initials = name.split(' ').map(n => (n[0] || '')).join('').substring(0, 2) || '?';
            const badge = getStatusBadgeColors(status);
            return `
            <div class="mobile-lead-card" onclick="openQuickView('${lead.id}')">
                <div class="mobile-card-header">
                    <div class="mobile-card-user">
                        <label class="custom-checkbox mobile-check" onclick="event.stopPropagation()">
                            <input type="checkbox" name="leadCheck" value="${lead.id}">
                            <span class="checkmark"></span>
                        </label>
                        <div class="mobile-user-avatar">${initials}</div>
                        <div class="mobile-user-info">
                            <h3>${name}</h3>
                            <span class="mobile-lead-id">${lead.id}</span>
                        </div>
                    </div>
                    <span class="mobile-status-badge" style="background:${badge.bg};color:${badge.color}">${status}</span>
                </div>
                <div class="mobile-card-details">
                    <div class="mobile-detail-item">
                        <span class="mobile-detail-label">Destination</span>
                        <span class="mobile-detail-value">${destination}</span>
                    </div>
                    <div class="mobile-detail-item">
                        <span class="mobile-detail-label">Phone</span>
                        <span class="mobile-detail-value">${phone}</span>
                    </div>
                    <div class="mobile-detail-item">
                        <span class="mobile-detail-label">Created</span>
                        <span class="mobile-detail-value">${lead.createdAt || ''}</span>
                    </div>
                    <div class="mobile-detail-item">
                        <span class="mobile-detail-label">Assigned To</span>
                        <span class="mobile-detail-value">${assignedTo}</span>
                    </div>
                </div>
                <div class="mobile-card-actions" onclick="event.stopPropagation()">
                    <button class="mobile-action-btn mobile-view-btn" onclick="viewLead('${lead.id}')">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3C4.5 3 1.73 5.11 1 8c.73 2.89 3.5 5 7 5s6.27-2.11 7-5c-.73-2.89-3.5-5-7-5z" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/></svg>
                        View Details
                    </button>
                    <button class="mobile-action-btn mobile-call-btn" onclick="callLead('${phone}')">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M15.05 11.15l-3.2-3.2c-.4-.4-1-.4-1.4 0l-.8.8c-.4.4-1 .4-1.4 0L5.85 6.35c-.4-.4-.4-1 0-1.4l.8-.8c.4-.4.4-1 0-1.4L3.45.55c-.4-.4-1-.4-1.4 0L.65 1.95c-.6.6-.7 1.5-.1 2.2L2.5 6.1l7.4 7.4 1.95 1.95c.7.6 1.6.5 2.2-.1l1.4-1.4c.4-.4.4-1 0-1.4z" fill="currentColor"/></svg>
                        Call
                    </button>
                    <button class="mobile-action-btn mobile-whatsapp-btn" onclick="whatsappLead('${phone}')">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0C3.6 0 0 3.6 0 8c0 1.4.4 2.8 1 4L0 16l4.1-1c1.2.6 2.5 1 4 1 4.4 0 8-3.6 8-8S12.4 0 8 0zm4 11.2c-.2.5-.9 1-1.5 1.1-.4 0-.9.1-2.8-.6-1.6-.6-2.9-1.7-4-3.1-.5-.7-.8-1.5-.8-2.3 0-.8.3-1.5.8-2 .2-.2.4-.3.6-.3h.4c.2 0 .4.1.6.4l.8 1.9c.1.3.1.5 0 .7-.1.2-.2.4-.4.6l-.3.3c-.1.1-.1.3 0 .5.3.6.8 1.1 1.3 1.5.5.3 1 .6 1.6.7.2.1.4 0 .5-.1l.6-.7c.2-.2.5-.3.7-.2l1.8.8c.3.1.4.3.5.5.1.1.1.4 0 .7z" fill="currentColor"/></svg>
                        WhatsApp
                    </button>
                </div>
            </div>`;
        }).join('');
    }
}

// ============================================================================
// SMART POPUP POSITIONING
// Keeps every dropdown popup inside the viewport: opens upward when there
// isn't enough space below, clamps to the screen edges, and scrolls
// internally when content is taller than the available space.
// ============================================================================

let activePopups = [];

function positionSmartPopup(popup, anchorEl, gap, preferBelow) {
    const rect = anchorEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pw = popup.offsetWidth || popup.clientWidth || 170;
    const ph = popup.offsetHeight || popup.clientHeight || 200;
    const gapPx = typeof gap === 'number' ? gap : 6;
    const margin = 8;

    const spaceBelow = vh - rect.bottom - margin - gapPx;
    const spaceAbove = rect.top - margin - gapPx;

    let openUp = false;
    if (preferBelow === false) {
        openUp = true;
    } else if (spaceBelow >= ph + gapPx) {
        openUp = false;
    } else if (spaceAbove >= ph + gapPx) {
        openUp = true;
    } else {
        openUp = spaceAbove > spaceBelow;
    }

    let top = 'auto', bottom = 'auto';
    if (openUp) {
        bottom = (vh - rect.top + margin) + 'px';
    } else {
        top = (rect.bottom + gapPx) + 'px';
    }

    let left = rect.left;
    if (left + pw > vw - margin) left = vw - margin - pw;
    left = Math.max(margin, Math.min(left, vw - margin));

    popup.style.position = 'fixed';
    popup.style.top = top;
    popup.style.bottom = bottom;
    popup.style.left = left + 'px';
    popup.style.right = 'auto';

    const rawAvail = (openUp ? spaceAbove : spaceBelow) - gapPx;
    const availH = Math.max(0, Math.min(vh - 2 * margin, rawAvail));
    popup.style.maxHeight = availH + 'px';
    popup.style.overflowY = 'auto';
}

function trackPopup(popup, anchorEl, gap, preferBelow) {
    const item = { popup, anchor: anchorEl, gap, preferBelow };
    const idx = activePopups.findIndex(p => p.popup === popup);
    if (idx !== -1) activePopups[idx] = item;
    else activePopups.push(item);
    positionSmartPopup(popup, anchorEl, gap, preferBelow);
}

function untrackPopup(popup) {
    activePopups = activePopups.filter(p => p.popup !== popup);
}

function repositionActivePopups() {
    activePopups.forEach(function(item) {
        if (item.popup && item.popup.isConnected) {
            positionSmartPopup(item.popup, item.anchor, item.gap, item.preferBelow);
        }
    });
}

window.addEventListener('scroll', repositionActivePopups, true);
window.addEventListener('resize', repositionActivePopups);

// ============================================================================
// ASSIGN DROPDOWN (in-table)
// ============================================================================

function toggleAssignDropdownForLead(leadId, btnElement) {
    closeStatusDropdown();
    closeDestinationDropdown();

    const existing = document.querySelector('.assign-dropdown-popup');
    if (existing) { closeAssignDropdown(); return; }

    const lead = allLeads.find(l => l.id === leadId);
    if (!lead) return;
    
    const popup = document.createElement('div');
    popup.className = 'assign-dropdown-popup show';
    popup.innerHTML = `
        <div class="assign-option" onclick="event.stopPropagation();assignLead('${leadId}', 'Shipra (Me)')">
            <span class="assign-name assign-name-orange">Shipra (Me)</span>
        </div>
        <div class="assign-option" onclick="event.stopPropagation();assignLead('${leadId}', 'Tanveer')">
            <span class="assign-name">Tanveer</span>
        </div>
        <div class="assign-option" onclick="event.stopPropagation();assignLead('${leadId}', 'Bedkar')">
            <span class="assign-name">Bedkar</span>
        </div>
    `;

    document.body.appendChild(popup);
    trackPopup(popup, btnElement, 0, true);
}

function closeAssignDropdown() {
    document.querySelectorAll('.assign-dropdown-popup').forEach(d => {
        untrackPopup(d);
        d.remove();
    });
}

function assignLead(leadId, assignee) {
    const lead = allLeads.find(l => l.id === leadId);
    if (lead) {
        lead.assignedTo = assignee;
        saveLeadsToStorage();
        closeAssignDropdown();
        renderTable();
    }
}

// ============================================================================
// STATUS DROPDOWN (in-table)
// ============================================================================

function toggleStatusDropdownForLead(leadId, btnElement) {
    closeAssignDropdown();
    closeDestinationDropdown();

    const existing = document.querySelector('.status-dropdown-popup');
    if (existing) { closeStatusDropdown(); return; }

    const popup = document.createElement('div');
    popup.className = 'status-dropdown-popup show';
    popup.innerHTML = `
        <div class="status-option-item" onclick="event.stopPropagation();changeStatus('${leadId}', 'New')"><span class="status-dot" style="background:#3B82F6"></span>New</div>
        <div class="status-option-item" onclick="event.stopPropagation();changeStatus('${leadId}', 'Contacted')"><span class="status-dot" style="background:#8B5CF6"></span>Contacted</div>
        <div class="status-option-item" onclick="event.stopPropagation();changeStatus('${leadId}', 'RNR')"><span class="status-dot" style="background:#F59E0B"></span>RNR</div>
        <div class="status-option-item" onclick="event.stopPropagation();changeStatus('${leadId}', 'Follow-up')"><span class="status-dot" style="background:#F97316"></span>Follow Up</div>
        <div class="status-option-item" onclick="event.stopPropagation();changeStatus('${leadId}', 'Interested')"><span class="status-dot" style="background:#10B981"></span>Interested</div>
        <div class="status-option-item" onclick="event.stopPropagation();changeStatus('${leadId}', 'Not Interested')"><span class="status-dot" style="background:#EF4444"></span>Not Interested</div>
    `;
    
    document.body.appendChild(popup);
    trackPopup(popup, btnElement, 0, true);
}

function closeStatusDropdown() {
    document.querySelectorAll('.status-dropdown-popup').forEach(d => {
        untrackPopup(d);
        d.remove();
    });
}

function changeStatus(leadId, status) {
    const lead = allLeads.find(l => l.id === leadId);
    if (lead) {
        lead.status = status;
        saveLeadsToStorage();
        closeStatusDropdown();
        renderTable();
    }
}

// ============================================================================
// DESTINATION DROPDOWN (in-table)
// ============================================================================

function toggleDestinationDropdownForLead(leadId, btnElement) {
    closeAssignDropdown();
    closeStatusDropdown();

    const existing = document.querySelector('.destination-dropdown-popup');
    if (existing) { closeDestinationDropdown(); return; }

    const lead = allLeads.find(l => l.id === leadId);
    if (!lead) return;

    const popup = document.createElement('div');
    popup.className = 'destination-dropdown-popup';
    popup.innerHTML = `
        <div class="destination-option" onclick="event.stopPropagation();setDestination('${leadId}', 'Bali')"><span class="dest-dot" style="background:#f97316"></span>Bali</div>
        <div class="destination-option" onclick="event.stopPropagation();setDestination('${leadId}', 'Indonesia')"><span class="dest-dot" style="background:#0ea5e9"></span>Indonesia</div>
        <div class="destination-option" onclick="event.stopPropagation();setDestination('${leadId}', 'Andaman')"><span class="dest-dot" style="background:#10b981"></span>Andaman</div>
    `;

    document.body.appendChild(popup);
    trackPopup(popup, btnElement, 0, true);
}

function closeDestinationDropdown() {
    document.querySelectorAll('.destination-dropdown-popup').forEach(d => {
        untrackPopup(d);
        d.remove();
    });
}

function setDestination(leadId, destination) {
    const lead = allLeads.find(l => l.id === leadId);
    if (lead) {
        lead.destination = destination;
        saveLeadsToStorage();
        closeDestinationDropdown();
        renderTable();
    }
}

// ============================================================================
// SORTING
// ============================================================================

function sortTable(field) {
    const fieldMap = { 'name': 'name', 'date': 'createdAt', 'tickets': 'tickets', 'status': 'status', 'assign': 'assignedTo', 'destination': 'destination' };
    const dataKey = fieldMap[field] || field;
    if (currentSort.field === field) { currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc'; }
    else { currentSort.field = field; currentSort.direction = 'asc'; }
    filteredLeads.sort((a, b) => {
        let av = a[dataKey] || '', bv = b[dataKey] || '';
        if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase(); }
        if (typeof av === 'number') return currentSort.direction === 'asc' ? av - bv : bv - av;
        return currentSort.direction === 'asc' ? (av < bv ? -1 : av > bv ? 1 : 0) : (av > bv ? -1 : av < bv ? 1 : 0);
    });
    renderTable();
}

// ============================================================================
// PAGINATION
// ============================================================================

function updateResultsInfo() {
    const resultsCount = document.getElementById('resultsCount');
    const paginationInfo = document.getElementById('paginationInfo');
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, filteredLeads.length);
    const total = filteredLeads.length;
    var text = total > 0 ? `Showing ${start}–${end} of ${total}` : 'No results';
    if (searchQuery.trim() && total > 0) {
        text = `${total} result${total !== 1 ? 's' : ''} found for "${searchQuery}" — ` + text;
    }
    if (resultsCount) resultsCount.textContent = text;
    if (paginationInfo) paginationInfo.textContent = text;
}

function renderPagination() {
    const paginationNumbers = document.getElementById('paginationNumbers');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const paginationInfo = document.getElementById('paginationInfo');
    if (!paginationNumbers) return;
    const totalPages = Math.max(1, Math.ceil(filteredLeads.length / itemsPerPage));
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
    if (paginationInfo) paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    let pages = [];
    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
    else {
        if (currentPage <= 4) pages = [1,2,3,4,5,'...',totalPages];
        else if (currentPage >= totalPages-3) pages = [1,'...',totalPages-4,totalPages-3,totalPages-2,totalPages-1,totalPages];
        else pages = [1,'...',currentPage-1,currentPage,currentPage+1,'...',totalPages];
    }
    paginationNumbers.innerHTML = pages.map(p => p === '...' ? '<span class="page-ellipsis">...</span>' : `<button class="page-number ${p===currentPage?'active':''}" onclick="goToPage(${p})">${p}</button>`).join('');
}

function previousPage() { if (currentPage > 1) { currentPage--; renderTable(); updateResultsInfo(); renderPagination(); } }
function nextPage() { if (currentPage < Math.ceil(filteredLeads.length / itemsPerPage)) { currentPage++; renderTable(); updateResultsInfo(); renderPagination(); } }
function goToPage(p) { const tp = Math.ceil(filteredLeads.length / itemsPerPage); if (p >= 1 && p <= tp) { currentPage = p; renderTable(); updateResultsInfo(); renderPagination(); } }

// ============================================================================
// CHECKBOXES
// ============================================================================

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    if (!selectAll) return;
    document.querySelectorAll('input[name="leadCheck"]').forEach(cb => cb.checked = selectAll.checked);
    updateBulkBar();
}

// ============================================================================
// BULK SELECTION ACTION BAR
// ============================================================================

function updateBulkBar() {
    const bar = document.getElementById('bulkActionBar');
    if (!bar) return;
    const count = document.querySelectorAll('input[name="leadCheck"]:checked').length;
    const countEl = document.getElementById('bulkSelectedCount');
    if (count > 0) {
        if (countEl) countEl.textContent = count + ' selected';
        bar.style.display = 'flex';
    } else {
        bar.style.display = 'none';
    }
}

function clearBulkSelection() {
    document.querySelectorAll('input[name="leadCheck"]').forEach(cb => cb.checked = false);
    const selectAll = document.getElementById('selectAll');
    if (selectAll) selectAll.checked = false;
    closeBulkMenus();
    updateBulkBar();
}

function getSelectedLeads() {
    const ids = [...document.querySelectorAll('input[name="leadCheck"]:checked')].map(cb => cb.value);
    return allLeads.filter(l => ids.includes(String(l.id)));
}

function toggleBulkMenu(menuId, btnId) {
    const menu = document.getElementById(menuId);
    const btn = document.getElementById(btnId);
    const isOpen = menu && menu.classList.contains('show');
    closeBulkMenus();
    if (menu && btn && !isOpen) {
        menu.classList.add('show');
        btn.classList.add('open');
        const bar = document.getElementById('bulkActionBar');
        if (bar) {
            const spaceAbove = bar.getBoundingClientRect().top - 8;
            menu.style.maxHeight = Math.max(100, spaceAbove) + 'px';
            menu.style.overflowY = 'auto';
        }
    }
}

function closeBulkMenus() {
    document.querySelectorAll('.bulk-dropdown-menu').forEach(m => m.classList.remove('show'));
}

function bulkExport() {
    const selected = getSelectedLeads();
    if (selected.length === 0) { alert('No leads selected'); return; }
    const dataStr = JSON.stringify(selected, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function bulkChangeStatus(status) {
    const selected = getSelectedLeads();
    if (selected.length === 0) return;
    selected.forEach(l => l.status = status);
    saveLeadsToStorage();
    updateFilterCounts();
    clearBulkSelection();
    renderTable();
    updateResultsInfo();
    renderPagination();
    alert(status + ' applied to ' + selected.length + ' lead(s)');
}

function bulkAssign(assignee) {
    const selected = getSelectedLeads();
    if (selected.length === 0) return;
    selected.forEach(l => l.assignedTo = assignee);
    saveLeadsToStorage();
    clearBulkSelection();
    renderTable();
    alert(assignee + ' assigned to ' + selected.length + ' lead(s)');
}

function bulkDelete() {
    const selected = getSelectedLeads();
    if (selected.length === 0) return;
    if (!confirm('Delete ' + selected.length + ' selected lead(s)?')) return;
    const ids = new Set(selected.map(l => String(l.id)));
    allLeads = allLeads.filter(l => !ids.has(String(l.id)));
    saveLeadsToStorage();
    updateFilterCounts();
    clearBulkSelection();
    renderTable();
    updateResultsInfo();
    renderPagination();
    alert(selected.length + ' lead(s) deleted');
}

// ============================================================================
// ACTION HANDLERS
// ============================================================================

function callLead(phone) { window.open('tel:' + phone); }
function whatsappLead(phone) { window.open('https://wa.me/' + phone.replace(/\D/g, '')); }

function importLeads() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.csv';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(ev) {
            try {
                if (file.name.endsWith('.json')) {
                    const data = JSON.parse(ev.target.result);
                    if (Array.isArray(data)) {
                        allLeads = data;
                        saveLeadsToStorage();
                        filteredLeads = [...allLeads];
                        updateFilterCounts();
                        currentPage = 1;
                        renderTable();
                        updateResultsInfo();
                        renderPagination();
                        alert(`Imported ${data.length} leads successfully!`);
                    }
                } else {
                    alert('CSV import coming soon. Please use JSON format.');
                }
            } catch(err) { alert('Error reading file: ' + err.message); }
        };
        reader.readAsText(file);
    };
    input.click();
}

function exportLeads() {
    const dataStr = JSON.stringify(allLeads, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// ============================================================================
// MODAL FUNCTIONALITY
// ============================================================================

function openModal(modalId) { const m = document.getElementById(modalId); if (m) m.style.display = 'flex'; }
function closeModal(modalId) { const m = document.getElementById(modalId); if (m) m.style.display = 'none'; }

window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) e.target.style.display = 'none';
});

function viewLead(leadId) {
    var lead = allLeads.find(function(l) { return l.id === leadId; });
    if (!lead) return;
    var fields = {
        'viewLeadIdTop': lead.id, 'viewName': lead.name, 'viewContact': lead.phone,
        'viewEmail': lead.email || 'N/A', 'viewCreatedAt': lead.createdAt,
        'viewFormSource': lead.formSource || 'N/A', 'viewGuests': lead.guests || 'N/A',
        'viewPlannedVisit': lead.plannedVisit || 'N/A', 'viewDestination': lead.destination || 'N/A',
        'viewInterest': lead.interest || 'N/A', 'viewPackageType': lead.packageType || 'N/A',
        'viewBudget': lead.budget || 'N/A', 'viewLocation': lead.location || 'N/A',
        'viewAddress': lead.address || 'N/A', 'viewComingWith': lead.guests || 'N/A'
    };
    Object.entries(fields).forEach(function(entry) { var el = document.getElementById(entry[0]); if (el) el.textContent = entry[1]; });
    var assignVal = document.getElementById('viewAssignedValue');
    var statusVal = document.getElementById('viewStatusValue');
    if (assignVal) assignVal.textContent = lead.assignedTo || 'Un-Allocated';
    if (statusVal) statusVal.textContent = lead.status || 'New';
    ['viewAssignedMenu', 'viewStatusMenu'].forEach(function(menuId) {
        var menu = document.getElementById(menuId);
        if (menu) menu.querySelectorAll('.view-dropdown-item').forEach(function(item) {
            item.classList.remove('active');
        });
    });
    var notesInput = document.getElementById('viewNotesInput');
    if (notesInput) notesInput.value = lead.notes || '';
    openModal('viewLeadModal');
}

// ============================================================================
// VIEW MODAL HELPERS
// ============================================================================

let toastTimer = null;

function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const msg = document.getElementById('toastMessage');
    if (!toast) return;
    if (msg) msg.textContent = message || 'Copied!';
    toast.classList.remove('toast-green');
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() { toast.classList.remove('show'); }, 2000);
}

function showToastGreen(message) {
    var toast = document.getElementById('toastNotification');
    var msg = document.getElementById('toastMessage');
    if (!toast) return;
    if (msg) msg.textContent = message || 'Done!';
    toast.classList.add('toast-green', 'show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() { toast.classList.remove('show', 'toast-green'); }, 2200);
}

function copyToClipboard(elementId, btnId) {
    var elem = document.getElementById(elementId);
    if (!elem) return;
    var text = elem.textContent || '';
    function done() {
        if (btnId) {
            var btn = document.getElementById(btnId);
            if (btn) {
                var icon = btn.querySelector('.copy-icon');
                var check = btn.querySelector('.copy-check');
                if (icon) icon.style.display = 'none';
                if (check) check.style.display = '';
                btn.classList.add('copied');
                setTimeout(function() {
                    if (icon) icon.style.display = '';
                    if (check) check.style.display = 'none';
                    btn.classList.remove('copied');
                }, 2000);
            }
        }
        showToastGreen('Copied to clipboard');
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function() {
            fallbackCopy(text, done);
        });
    } else {
        fallbackCopy(text, done);
    }
}

function fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { showToast('Copy failed'); }
    document.body.removeChild(ta);
}

function switchViewTab(tab) {
    const notes = document.getElementById('viewNotesSection');
    const activity = document.getElementById('viewActivitySection');
    const tabs = document.querySelectorAll('.view-tab');
    for (let i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
    if (tab === 'notes') {
        if (notes) notes.style.display = 'flex';
        if (activity) activity.style.display = 'none';
        if (tabs[0]) tabs[0].classList.add('active');
    } else {
        if (notes) notes.style.display = 'none';
        if (activity) activity.style.display = 'flex';
        if (tabs[1]) tabs[1].classList.add('active');
    }
}

function clearNotes() { const n = document.getElementById('viewNotesInput'); if (n) n.value = ''; }

function saveNotes() {
    const notesInput = document.getElementById('viewNotesInput');
    const leadId = (document.getElementById('viewLeadIdTop') || {}).textContent;
    if (notesInput && notesInput.value && notesInput.value.trim()) {
        const lead = allLeads.find(l => l.id === leadId);
        if (lead) { lead.notes = notesInput.value.trim(); saveLeadsToStorage(); alert('Notes saved!'); }
    }
}

function confirmDeleteLead() {
    var overlay = document.getElementById('confirmOverlay');
    if (overlay) overlay.classList.add('show');
}

function closeConfirmPopup() {
    var overlay = document.getElementById('confirmOverlay');
    if (overlay) overlay.classList.remove('show');
}

function executeDeleteLead() {
    closeConfirmPopup();
    var leadId = (document.getElementById('viewLeadIdTop') || {}).textContent;
    if (!leadId) return;
    var idx = allLeads.findIndex(function(l) { return l.id === leadId; });
    if (idx !== -1) {
        allLeads.splice(idx, 1);
        saveLeadsToStorage();
        filteredLeads = allLeads.slice();
        closeModal('viewLeadModal');
        currentPage = 1;
        renderTable();
        updateResultsInfo();
        renderPagination();
        showToast('Lead deleted');
    }
}

function editLeadFromView() {
    const leadId = (document.getElementById('viewLeadIdTop') || {}).textContent;
    const lead = allLeads.find(l => l.id === leadId);
    if (!lead) return;
    document.getElementById('editLeadId').value = lead.id;
    document.getElementById('editStatus').value = lead.status;
    document.getElementById('editAssignTo').value = lead.assignedTo;
    document.getElementById('editName').value = lead.name;
    document.getElementById('editContact').value = lead.phone;
    document.getElementById('editEmail').value = lead.email || '';
    document.getElementById('editGuests').value = lead.guests || '';
    document.getElementById('editPackage').value = lead.packageType || '';
    document.getElementById('editBudget').value = lead.budget || '';
    document.getElementById('editAddress').value = lead.address || '';
    document.getElementById('editNotes').value = lead.notes || '';
    closeModal('viewLeadModal');
    openModal('editLeadModal');
}

function updateAssignmentFromView() {
    var leadId = (document.getElementById('viewLeadIdTop') || {}).textContent;
    var val = (document.getElementById('viewAssignedValue') || {}).textContent;
    var lead = allLeads.find(function(l) { return l.id === leadId; });
    if (lead && val) { lead.assignedTo = val; saveLeadsToStorage(); renderTable(); }
}

function updateStatusFromView() {
    var leadId = (document.getElementById('viewLeadIdTop') || {}).textContent;
    var val = (document.getElementById('viewStatusValue') || {}).textContent;
    var lead = allLeads.find(function(l) { return l.id === leadId; });
    if (lead && val) { lead.status = val; saveLeadsToStorage(); renderTable(); }
}

function makeCall() { const p = (document.getElementById('viewContact') || {}).textContent; if (p) window.open('tel:' + p.replace(/\D/g, '')); }
function sendEmail() { const e = (document.getElementById('viewEmail') || {}).textContent; if (e && e !== 'N/A') window.open('mailto:' + e); }
function sendWhatsApp() { const p = (document.getElementById('viewContact') || {}).textContent; if (p) window.open('https://wa.me/' + p.replace(/\D/g, '')); }

function getStatusBadgeColors(status) {
    const map = {
        'New': { bg: '#dbeafe', color: '#2563eb' },
        'Contacted': { bg: '#ede9fe', color: '#7c3aed' },
        'RNR': { bg: '#fef3c7', color: '#d97706' },
        'Follow-up': { bg: '#fff7ed', color: '#ea580c' },
        'Follow Up': { bg: '#fff7ed', color: '#ea580c' },
        'Interested': { bg: '#dcfce7', color: '#16a34a' },
        'Not Interested': { bg: '#fee2e2', color: '#dc2626' }
    };
    return map[status] || { bg: '#f3f4f6', color: '#374151' };
}

function openQuickView(leadId) {
    const lead = allLeads.find(l => l.id === leadId);
    if (!lead) return;
    const nameEl = document.getElementById('mobileQuickName');
    const idEl = document.getElementById('mobileQuickId');
    const statusEl = document.getElementById('mobileQuickStatus');
    const destEl = document.getElementById('mobileQuickDestination');
    const createdEl = document.getElementById('mobileQuickCreated');
    if (nameEl) nameEl.textContent = lead.name;
    if (idEl) idEl.textContent = lead.id;
    if (statusEl) {
        const badge = getStatusBadgeColors(lead.status);
        statusEl.textContent = lead.status;
        statusEl.style.background = badge.bg;
        statusEl.style.color = badge.color;
    }
    if (destEl) destEl.textContent = lead.destination || 'Andaman';
    if (createdEl) createdEl.textContent = lead.createdAt;
    var mqv = document.getElementById('mobileQuickView');
    if (mqv) mqv.classList.add('active');
}

function closeQuickView() {
    var mqv = document.getElementById('mobileQuickView');
    if (mqv) mqv.classList.remove('active');
}

function openFullViewFromQuick() {
    const qid = (document.getElementById('mobileQuickId') || {}).textContent;
    if (qid) viewLead(qid);
    var mqv = document.getElementById('mobileQuickView');
    if (mqv) mqv.classList.remove('active');
}

function makeCallFromQuick() { const qid = (document.getElementById('mobileQuickId') || {}).textContent; const l = allLeads.find(l => l.id === qid); if (l) callLead(l.phone); }
function sendWhatsAppFromQuick() { const qid = (document.getElementById('mobileQuickId') || {}).textContent; const l = allLeads.find(l => l.id === qid); if (l) whatsappLead(l.phone); }

function saveEditLead() {
    const leadId = (document.getElementById('editLeadId') || {}).value;
    const lead = allLeads.find(l => l.id === leadId);
    if (!lead) return;
    lead.name = (document.getElementById('editName') || {}).value || lead.name;
    lead.phone = (document.getElementById('editContact') || {}).value || lead.phone;
    lead.email = (document.getElementById('editEmail') || {}).value || lead.email;
    lead.guests = (document.getElementById('editGuests') || {}).value || lead.guests;
    lead.packageType = (document.getElementById('editPackage') || {}).value || lead.packageType;
    lead.budget = (document.getElementById('editBudget') || {}).value || lead.budget;
    lead.address = (document.getElementById('editAddress') || {}).value || lead.address;
    lead.notes = (document.getElementById('editNotes') || {}).value || lead.notes;
    lead.status = (document.getElementById('editStatus') || {}).value || lead.status;
    lead.assignedTo = (document.getElementById('editAssignTo') || {}).value || lead.assignedTo;
    saveLeadsToStorage();
    closeModal('editLeadModal');
    renderTable();
}

function saveNewLead() {
    var name = (document.getElementById('addName') || {}).value || '';
    var contact = (document.getElementById('addContact') || {}).value || '';
    if (!name.trim()) { alert('Please enter a valid name (letters only).'); return; }
    if (!contact.trim() || contact.length < 10) { alert('Please enter a valid 10-digit phone number.'); return; }
    var pkg = document.getElementById('addPackageValue');
    var dur = document.getElementById('addDurationValue');
    var dest = document.getElementById('addDestinationValue');
    var newId = 'L-' + String(allLeads.length + 6701).padStart(5, '0');
    allLeads.unshift({
        id: newId, name: name.trim(), phone: contact, tickets: Math.floor(Math.random() * 5) + 1,
        createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        status: 'New', assignedTo: 'Un-Allocated',
        destination: (dest ? dest.textContent : 'Bali'),
        email: (document.getElementById('addEmail') || {}).value || '',
        guests: (document.getElementById('addGuests') || {}).value || '',
        packageType: (pkg ? pkg.textContent : ''),
        duration: (dur ? dur.textContent : ''),
        budget: (document.getElementById('addBudget') || {}).value || '',
        address: (document.getElementById('addAddress') || {}).value || '',
        notes: (document.getElementById('addNotes') || {}).value || '', formSource: 'Direct', plannedVisit: 'Undecided', interest: 'Decide on-site'
    });
    filteredLeads = [...allLeads];
    saveLeadsToStorage();
    updateFilterCounts();
    closeModal('addLeadModal');
    var addForm = document.getElementById('addLeadForm');
    if (addForm) addForm.reset();
    selectFormDropdown('addPackage', 'Select Package');
    selectFormDropdown('addDuration', 'Select Duration');
    selectFormDropdown('addDestination', 'Bali');
    currentPage = 1;
    renderTable();
    updateResultsInfo();
    renderPagination();
}

function openBookTripModal() { openModal('bookTripModal'); }
function closeBookTripModal() { closeModal('bookTripModal'); }

// ============================================================================
// FORM CUSTOM DROPDOWNS
// ============================================================================

function toggleFormDropdown(fieldId) {
    var menu = document.getElementById(fieldId + 'Menu');
    var trigger = document.getElementById(fieldId + 'Dropdown').querySelector('.custom-form-dropdown-trigger');
    var isOpen = menu && menu.classList.contains('show');
    document.querySelectorAll('.custom-form-dropdown-menu.show').forEach(function(m) { m.classList.remove('show'); });
    document.querySelectorAll('.custom-form-dropdown-trigger.open').forEach(function(t) { t.classList.remove('open'); });
    if (!isOpen && menu && trigger) {
        menu.classList.add('show');
        trigger.classList.add('open');
    }
}

function selectFormDropdown(fieldId, value) {
    var valueEl = document.getElementById(fieldId + 'Value');
    var menu = document.getElementById(fieldId + 'Menu');
    var trigger = document.getElementById(fieldId + 'Dropdown').querySelector('.custom-form-dropdown-trigger');
    if (valueEl) valueEl.textContent = value;
    if (menu) menu.classList.remove('show');
    if (trigger) trigger.classList.remove('open');
    if (menu) {
        menu.querySelectorAll('.custom-form-dropdown-item').forEach(function(item) {
            item.classList.toggle('active', item.textContent === value);
        });
    }
    var hidden = document.getElementById(fieldId);
    if (hidden && hidden.tagName === 'INPUT') hidden.value = value;
}

// ============================================================================
// VIEW MODAL CUSTOM DROPDOWNS
// ============================================================================

function toggleViewDropdown(fieldId) {
    var menu = document.getElementById(fieldId + 'Menu');
    var trigger = document.getElementById(fieldId + 'Dropdown').querySelector('.view-dropdown-trigger');
    var isOpen = menu && menu.classList.contains('show');
    document.querySelectorAll('.view-dropdown-menu.show').forEach(function(m) { m.classList.remove('show'); });
    document.querySelectorAll('.view-dropdown-trigger.open').forEach(function(t) { t.classList.remove('open'); });
    if (!isOpen && menu && trigger) {
        menu.classList.add('show');
        trigger.classList.add('open');
    }
}

function selectViewDropdown(fieldId, value, element) {
    var valueEl = document.getElementById(fieldId + 'Value');
    var menu = document.getElementById(fieldId + 'Menu');
    var trigger = document.getElementById(fieldId + 'Dropdown').querySelector('.view-dropdown-trigger');
    if (valueEl) valueEl.textContent = value;
    if (menu) menu.classList.remove('show');
    if (trigger) trigger.classList.remove('open');
    if (menu) {
        menu.querySelectorAll('.view-dropdown-item').forEach(function(item) {
            item.classList.toggle('active', item.textContent === value);
        });
    }
    if (fieldId === 'viewAssigned') updateAssignmentFromView();
    if (fieldId === 'viewStatus') updateStatusFromView();
}

// ============================================================================
// NOTIFICATION PANEL
// ============================================================================

function escapeHtml(s) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(s || ''));
    return d.innerHTML;
}

function toggleNotifPanel(e) {
    if (e) e.stopPropagation();
    var panel = document.getElementById('notifPanel');
    var mobilePanel = document.getElementById('mobileNotifPanel');
    var isDesktopOpen = panel && panel.classList.contains('open');
    var isMobileOpen = mobilePanel && mobilePanel.classList.contains('open');
    closeNotifPanels();
    if (!isDesktopOpen && panel) {
        populateNotifPanel(document.getElementById('notifList'));
        panel.classList.add('open');
        showNotifOverlay();
    }
    if (!isMobileOpen && mobilePanel) {
        populateNotifPanel(document.getElementById('mobileNotifList'));
        mobilePanel.classList.add('open');
        showNotifOverlay();
    }
}

function closeNotifPanels() {
    var p = document.getElementById('notifPanel');
    var mp = document.getElementById('mobileNotifPanel');
    if (p) p.classList.remove('open');
    if (mp) mp.classList.remove('open');
    hideNotifOverlay();
}

function showNotifOverlay() {
    var ov = document.getElementById('notifOverlay');
    if (!ov) {
        ov = document.createElement('div');
        ov.id = 'notifOverlay';
        ov.className = 'notif-overlay';
        ov.addEventListener('click', closeNotifPanels);
        document.body.appendChild(ov);
    }
    ov.classList.add('open');
}

function hideNotifOverlay() {
    var ov = document.getElementById('notifOverlay');
    if (ov) ov.classList.remove('open');
}

function populateNotifPanel(listEl) {
    if (!listEl) return;
    var leads = (allLeads || []).slice();
    leads.sort(function(a, b) {
        return parseLeadDate(b.createdAt) - parseLeadDate(a.createdAt);
    });
    var recent = leads.slice(0, 4);
    var unreadCount = Math.min(recent.length, 4);
    var dot = document.getElementById('notifDot');
    var mDot = document.getElementById('mobileNotifDot');
    if (dot) dot.classList.toggle('hidden', unreadCount === 0);
    if (mDot) mDot.classList.toggle('hidden', unreadCount === 0);
    if (recent.length === 0) {
        listEl.innerHTML = '<div class="notif-empty">No notifications yet</div>';
        return;
    }
    var html = '';
    for (var i = 0; i < recent.length; i++) {
        var lead = recent[i];
        var dt = parseLeadDate(lead.createdAt);
        var mainText = '';
        var subText = '';
        var isUnread = i < 4;
        if (lead.source && lead.source.toLowerCase().indexOf('semi') !== -1) {
            mainText = 'New Semi Pop Up lead: ' + (lead.name || 'Unknown');
        } else if (lead.source && lead.source.toLowerCase().indexOf('pop') !== -1) {
            mainText = 'New Pop Up lead: ' + (lead.name || 'Unknown');
        } else {
            mainText = 'New lead: ' + (lead.name || 'Unknown');
        }
        var details = [];
        if (lead.phone) details.push(lead.phone);
        if (lead.email) details.push(lead.email);
        subText = details.join(' \u00B7 ');
        var timeStr = formatNotifTime(dt);
        html += '<div class="notif-item' + (isUnread ? ' unread' : '') + '" onclick="viewLead(\'' + (lead.id || '') + '\')">';
        html += '<div class="notif-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg></div>';
        html += '<div class="notif-content">';
        html += '<div class="notif-main-text">' + escapeHtml(mainText) + '</div>';
        if (subText) html += '<div class="notif-sub-text">' + escapeHtml(subText) + '</div>';
        html += '<div class="notif-time">' + escapeHtml(timeStr) + '</div>';
        html += '</div></div>';
    }
    listEl.innerHTML = html;
}

function parseLeadDate(str) {
    if (!str) return new Date(0);
    var cleaned = str.replace(/^(\d{1,2})\s/, '0$1 ').replace(/(\d{1,2}):(\d{2})\s*(AM|PM)/i, function(m, h, mi, ap) {
        var hh = parseInt(h, 10);
        if (ap.toUpperCase() === 'PM' && hh < 12) hh += 12;
        if (ap.toUpperCase() === 'AM' && hh === 12) hh = 0;
        return (hh < 10 ? '0' : '') + hh + ':' + mi + ':00';
    });
    var d = new Date(cleaned);
    if (isNaN(d.getTime())) return new Date(0);
    return d;
}

function formatNotifTime(dt) {
    if (!dt || isNaN(dt.getTime())) return '';
    var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    var day = dt.getDate();
    var mon = months[dt.getMonth()];
    var h = dt.getHours();
    var mi = dt.getMinutes();
    var ap = h >= 12 ? 'PM' : 'AM';
    var hh = h % 12 || 12;
    return day + ' ' + mon + ' \u00B7 ' + (hh < 10 ? '0' : '') + hh + ':' + (mi < 10 ? '0' : '') + mi + ' ' + ap;
}

function viewAllNotifications() {
    closeNotifPanels();
    window.location.href = 'admin-notifications.html';
}

// ============================================================================
// WINDOW EXPORTS
// ============================================================================

window.toggleFilters = toggleFilters;
window.toggleDropdown = toggleDropdown;
window.selectFilter = selectFilter;
window.performSearch = performSearch;
window.refreshSearch = refreshSearch;
window.sortTable = sortTable;
window.previousPage = previousPage;
window.nextPage = nextPage;
window.goToPage = goToPage;
window.toggleSelectAll = toggleSelectAll;
window.viewLead = viewLead;
window.callLead = callLead;
window.whatsappLead = whatsappLead;
window.importLeads = importLeads;
window.exportLeads = exportLeads;
window.openModal = openModal;
window.closeModal = closeModal;
window.copyToClipboard = copyToClipboard;
window.switchViewTab = switchViewTab;
window.clearNotes = clearNotes;
window.saveNotes = saveNotes;
window.editLeadFromView = editLeadFromView;
window.updateAssignmentFromView = updateAssignmentFromView;
window.updateStatusFromView = updateStatusFromView;
window.makeCall = makeCall;
window.sendEmail = sendEmail;
window.sendWhatsApp = sendWhatsApp;
window.openFullViewFromQuick = openFullViewFromQuick;
window.makeCallFromQuick = makeCallFromQuick;
window.sendWhatsAppFromQuick = sendWhatsAppFromQuick;
window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;
window.saveEditLead = saveEditLead;
window.saveNewLead = saveNewLead;
window.toggleAssignDropdownForLead = toggleAssignDropdownForLead;
window.toggleStatusDropdownForLead = toggleStatusDropdownForLead;
window.assignLead = assignLead;
window.changeStatus = changeStatus;
window.toggleDestinationDropdownForLead = toggleDestinationDropdownForLead;
window.setDestination = setDestination;
window.toggleBulkMenu = toggleBulkMenu;
window.clearBulkSelection = clearBulkSelection;
window.bulkExport = bulkExport;
window.bulkChangeStatus = bulkChangeStatus;
window.bulkAssign = bulkAssign;
window.bulkDelete = bulkDelete;
window.openBookTripModal = openBookTripModal;
window.closeBookTripModal = closeBookTripModal;
window.mobileLogout = mobileLogout;
window.goToMobilePage = goToMobilePage;
window.logoutAdmin = logoutAdmin;
window.toggleNotifPanel = toggleNotifPanel;
window.closeNotifPanels = closeNotifPanels;
window.viewAllNotifications = viewAllNotifications;
window.syncLeads = syncLeads;
window.toggleFormDropdown = toggleFormDropdown;
window.selectFormDropdown = selectFormDropdown;
window.confirmDeleteLead = confirmDeleteLead;
window.closeConfirmPopup = closeConfirmPopup;
window.executeDeleteLead = executeDeleteLead;
window.toggleViewDropdown = toggleViewDropdown;
window.selectViewDropdown = selectViewDropdown;
