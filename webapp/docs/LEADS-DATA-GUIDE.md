# Leads Data Management Guide

## 📍 Location
All leads data is stored in: **`webapp/js/leads-data.js`**

## 🎯 Overview
The `leads-data.js` file contains:
- All lead records (stored in `defaultLeadsData` array)
- Configuration options (team members, statuses, etc.)
- Helper functions for data management
- localStorage persistence for edits made through the dashboard

## 📝 How to Edit Leads Data

### Editing Existing Leads

Open `webapp/js/leads-data.js` and find the `defaultLeadsData` array. Each lead is an object with these fields:

```javascript
{
    id: 1,                                    // Unique ID (number)
    stNumber: 'L-BBLIO-108',                 // Lead number (string)
    name: 'Apurva Kale',                     // Full name
    contact: '+91 9712345601',               // Phone number
    email: 'apurva@email.com',               // Email address
    leadDate: 'Sunday, Oct 24th, 2020<br>08:29 AM',  // Display format
    leadDateISO: '2020-10-24T08:29',        // ISO date for sorting
    guests: '4-5 People',                    // Number of guests
    packageType: '5Nights 6Days',            // Package type
    budget: '20K - 30K INR',                 // Budget range
    status: 'follow-up',                     // Status (see options below)
    assignedTo: 'Un-Allocated',              // Team member
    location: 'Ubud, Seminyak',              // Travel location
    address: '123, MG Road, Bangalore',      // Customer address
    notes: 'Looking for romantic getaway',   // Notes/comments
    formSource: 'Homepage',                  // Lead source
    plannedVisit: 'This Weekend',            // When they plan to visit
    ticketsCount: '6',                       // Number of tickets
    interest: 'Decide on-site'               // Interest level
}
```

### Adding New Leads

1. Copy an existing lead object
2. Change the `id` to a unique number
3. Update all other fields
4. Add comma after previous lead
5. Save the file

**Example:**
```javascript
const defaultLeadsData = [
    {
        id: 1,
        // ... existing lead
    },
    {
        id: 9,  // NEW LEAD - unique ID
        stNumber: 'L-00999',
        name: 'New Customer Name',
        contact: '+91 9876543210',
        // ... rest of the fields
    }
];
```

### Deleting Leads

Simply remove the entire lead object (including commas) from the array.

## ⚙️ Configuration Options

### Team Members
Edit in `leadsConfig.teamMembers` array:
```javascript
teamMembers: [
    'Shipra',
    'Jyothi Duddukunta',
    'Team Member1',
    'Team Member2',
    'Team Member3',
    'Team Member4',
    'Un-Allocated'
]
```

### Status Options
Edit in `leadsConfig.statusOptions` array:
```javascript
statusOptions: [
    { value: 'new', label: 'New' },
    { value: 'interested', label: 'Interested' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'converted', label: 'Converted' },
    { value: 'special', label: 'Special' },
    { value: 'no-interest', label: 'No Interest' }
]
```

**Available Status Values:**
- `new` - New lead
- `interested` - Showing interest
- `follow-up` - Needs follow-up
- `converted` - Successfully converted
- `special` - VIP or special attention
- `no-interest` - Not interested

## 💾 Data Persistence

### How It Works

1. **Default Data**: When you first load the dashboard, it uses `defaultLeadsData` from the JS file
2. **localStorage**: Any edits made through the dashboard are saved to browser's localStorage
3. **Priority**: localStorage data takes precedence over default data
4. **Reset**: To reset to default data, clear browser's localStorage for this site

### Editing Through Dashboard vs JS File

**Dashboard Edits** (saved to localStorage):
- ✅ Persist across page refreshes
- ✅ Stored in user's browser
- ❌ Only visible to that browser
- ❌ Lost if localStorage is cleared

**JS File Edits** (in `leads-data.js`):
- ✅ Shared across all users
- ✅ Permanent until file is changed
- ✅ Used as default/starting data
- ⚠️ Requires page refresh to see changes

### Reset to Default Data

To reset all leads to the default data in the JS file:

**Method 1: Browser Console**
```javascript
localStorage.removeItem('tripon_leads_database');
location.reload();
```

**Method 2: Browser DevTools**
1. Open DevTools (F12)
2. Go to Application tab
3. Click "Local Storage"
4. Find key `tripon_leads_database`
5. Delete it
6. Refresh page

## 🔍 Sorting Configuration

Edit sorting options in `leadsConfig.sorting`:

```javascript
sorting: {
    defaultColumn: 'date',      // Default sort column
    defaultDirection: 'desc',   // Default direction (asc/desc)
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
```

## 📤 Import/Export Data

### Export Current Data

Use browser console:
```javascript
exportLeadsData(leadsData);
```
This downloads a JSON file with all current leads.

### Import Data from JSON

```javascript
const jsonString = '...'; // Your JSON data
const imported = importLeadsData(jsonString);
if (imported) {
    leadsData = imported;
    refreshTable();
}
```

## 🛠️ Helper Functions Available

All these functions are in `leads-data.js` and can be used:

- `initializeLeadsData()` - Load data from localStorage or defaults
- `saveLeadsData(data)` - Save data to localStorage
- `resetLeadsData()` - Reset to default data
- `addNewLead(data, leadInfo)` - Add a new lead
- `updateLead(data, leadId, updates)` - Update existing lead
- `deleteLead(data, leadId)` - Delete a lead
- `searchLeads(data, searchTerm)` - Search leads
- `filterByStatus(data, status)` - Filter by status
- `filterByAssignment(data, assignment)` - Filter by team member
- `sortLeads(data, column, direction)` - Sort leads
- `exportLeadsData(data)` - Export to JSON file
- `importLeadsData(jsonString)` - Import from JSON

## 📋 Common Tasks

### Add a New Team Member

1. Open `webapp/js/leads-data.js`
2. Find `leadsConfig.teamMembers`
3. Add new name to the array:
```javascript
teamMembers: [
    'Shipra',
    'Jyothi Duddukunta',
    'New Team Member Name',  // ADD HERE
    'Team Member1',
    // ...
]
```
4. Save file
5. Refresh dashboard

### Change Lead Status Options

1. Open `webapp/js/leads-data.js`
2. Find `leadsConfig.statusOptions`
3. Add/remove/modify options:
```javascript
statusOptions: [
    { value: 'new', label: 'New' },
    { value: 'custom-status', label: 'Custom Status' },  // ADD HERE
    // ...
]
```
4. Save file
5. Refresh dashboard

### Bulk Update Leads

Use browser console:
```javascript
// Example: Assign all unallocated leads to Shipra
leadsData.forEach(lead => {
    if (lead.assignedTo === 'Un-Allocated') {
        updateLead(leadsData, lead.id, { assignedTo: 'Shipra' });
    }
});
refreshTable();
```

## ⚠️ Important Notes

1. **Always backup** the `leads-data.js` file before making major changes
2. **Test changes** by refreshing the dashboard after editing
3. **Validate data** - ensure all required fields are present
4. **Check commas** - JavaScript arrays need commas between objects
5. **Quote strings** - All text values must be in quotes ('text' or "text")
6. **Numbers** - IDs and numeric values don't need quotes
7. **Dates** - Use ISO format (YYYY-MM-DDTHH:mm) for `leadDateISO`

## 🐛 Troubleshooting

**Problem**: Changes not showing
- Solution: Hard refresh (Ctrl+F5 or Cmd+Shift+R)
- Solution: Check browser console for errors
- Solution: Clear localStorage and refresh

**Problem**: Syntax error in file
- Solution: Check for missing commas, quotes, or brackets
- Solution: Use JSON validator online
- Solution: Restore from backup

**Problem**: Lost all data
- Solution: Check `defaultLeadsData` in JS file
- Solution: Clear localStorage to restore defaults
- Solution: Import from backup JSON file

## 📞 Support

For questions or issues:
1. Check this guide first
2. Review the comments in `leads-data.js`
3. Check browser console for error messages
4. Test with sample data first

---

**Last Updated**: 2026
**File Version**: 1.0
**Compatibility**: All modern browsers with localStorage support
