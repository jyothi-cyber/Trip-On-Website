# Testing Instructions for Admin Dashboard Bug Fixes

## Prerequisites
1. Open `admin-dashboard.html` in a web browser
2. You may need to login first using `admin-login.html`
3. Open Browser Developer Tools (Press F12) to view console

---

## Test 1: Sorting Functionality

### Steps:
1. Look at the leads table with columns: Full Name, Lead Date, Guests, Package Type, Budget, Status, Assign To
2. Click on **"Full Name"** header
3. Observe the table rows reorder alphabetically (A→Z)
4. Click **"Full Name"** again
5. Observe the table rows reverse (Z→A)
6. Notice the arrow indicator (▲ or ▼) next to the column name

### Expected Results:
✅ Table sorts ascending on first click (▲ arrow visible)
✅ Table sorts descending on second click (▼ arrow visible)
✅ No console errors appear
✅ Sort persists (saved to localStorage)

### Test Other Columns:
- **Lead Date**: Sorts by date (oldest/newest)
- **Guests**: Sorts by guest text
- **Package Type**: Sorts alphabetically
- **Budget**: Sorts by budget amount (numeric)
- **Status**: Sorts by status
- **Assign To**: Sorts by assigned person

---

## Test 2: Filter by Status

### Steps:
1. Locate the dropdown that says **"All (4508)"**
2. Click it and select **"New Leads"**
3. Observe the table

### Expected Results:
✅ Only leads with "New" status badge are visible
✅ Other status leads are hidden
✅ Mobile cards also filter (if in mobile view)

### Test Other Filters:
- Select **"Contacted"** - shows only follow-up status leads
- Select **"Converted"** - shows only converted leads
- Select **"All"** again - shows all leads

---

## Test 3: Filter by Assignment

### Steps:
1. Locate the **"Select Assign"** dropdown
2. Select **"Team Member1"**
3. Observe the table

### Expected Results:
✅ Only leads assigned to "Team Member1" are visible
✅ Other assignments are hidden

### Test Other Options:
- **"Team Member2"**, **"Team Member3"**, **"Team Member4"**
- **"Un-Allocated"** - shows unassigned leads

---

## Test 4: Combined Filters

### Steps:
1. Set Status filter to **"New Leads"**
2. Set Assignment filter to **"Team Member1"**
3. Observe the table

### Expected Results:
✅ Only NEW leads assigned to Team Member1 are visible
✅ Filters work together (AND logic)

---

## Test 5: Search Functionality

### Steps:
1. Clear all filters (set to default "All" and no assignment)
2. Locate the **Search box** (has magnifying glass icon)
3. Type **"Divyansh"** (or any lead name from your data)
4. Observe the table filter in real-time

### Expected Results:
✅ Table filters as you type
✅ Only matching rows are visible
✅ Search works on name, email, contact, ID, etc.

### Test Search:
- Search by **name**: "Apurva"
- Search by **ID**: "L-02043"
- Search by **email**: "gmail"
- Clear search - all rows return

---

## Test 6: No Console Errors

### Steps:
1. Open Developer Tools (F12)
2. Go to **Console** tab
3. Refresh the page
4. Observe console messages

### Expected Results:
✅ NO red error messages
✅ NO "ReferenceError: currentSortColumn"
✅ NO "TypeError: Cannot read properties of null"
✅ May see debug logs like "sortTable called for column: date" (harmless)

---

## Test 7: Event Listeners Working

### Steps:
1. Click **"New lead"** button (blue button, top right)
2. Verify modal opens
3. Close modal
4. Click any **three-dots menu** (⋮) in a table row
5. Verify dropdown appears
6. Click **"View Details"** 
7. Verify view modal opens

### Expected Results:
✅ All buttons respond to clicks
✅ Modals open and close properly
✅ Dropdowns work correctly
✅ No console errors

---

## Test 8: Mobile Responsive View

### Steps:
1. Resize browser window to mobile size (< 768px width)
   - OR press F12 → Click device toolbar icon → Select "iPhone 12 Pro"
2. Observe the layout changes to card view
3. Try search functionality
4. Try clicking on a card

### Expected Results:
✅ Layout switches to mobile card view
✅ Search filters mobile cards
✅ Cards are clickable
✅ Mobile view is responsive

---

## Test 9: Data Persistence

### Steps:
1. Click a column header to sort (e.g., sort by Name A→Z)
2. Refresh the page (F5)
3. Observe if sort order is maintained

### Expected Results:
✅ Table loads with previous sort applied
✅ Data saved in localStorage
✅ Sort direction indicator shows correctly

---

## Test 10: Export Functionality

### Steps:
1. Click **"Export"** button
2. Check if CSV file downloads

### Expected Results:
✅ File `leads_export.csv` downloads
✅ File contains all lead data
✅ Columns properly formatted

---

## Common Issues & Solutions

### Issue: Page redirects to login
**Solution:** Login first using `admin-login.html` with credentials

### Issue: Table is empty
**Solution:** Check console for errors. localStorage might be empty. Add a lead manually.

### Issue: Sorting doesn't work
**Solution:** 
1. Check console for errors
2. Verify `leads-data.js` is loaded before `admin-dashboard.js`
3. Clear browser cache and reload

### Issue: Filters don't work
**Solution:**
1. Check if filter dropdowns have values selected
2. Verify dropdown IDs match: `filterAll`, `filterAssign`
3. Check console for error messages

---

## Debug Mode

To see detailed logs:

1. Open `admin-dashboard.js`
2. Look for `console.log()` statements in `sortTable()` function
3. These show:
   - "sortTable called for column: [name]"
   - "Sort direction: [asc/desc]"
   - "Table sorted and refreshed"

These logs help verify sorting is executing correctly.

---

## Success Criteria

All bugs are fixed if:

✅ Sorting works on all columns (click headers)
✅ Filters work individually and combined
✅ Search filters in real-time
✅ No console errors on page load
✅ All buttons and modals work
✅ Mobile view works correctly
✅ Data persists after refresh
✅ Export downloads CSV file

---

## Report Issues

If you find any bugs:

1. Note the exact steps to reproduce
2. Check browser console for errors (F12)
3. Take a screenshot if helpful
4. Note which browser you're using
5. Share the error message

---

**Last Updated:** August 7, 2026
**Status:** Ready for Testing
