/* ============================================================================
   SERVICES - ACTIVITIES ADMIN PAGE
   Tabs, status dropdowns, view details, add new item, data persistence
   ============================================================================ */

var SERVICES_STORAGE_KEY = 'tripon_services_data_v1';

var servicesTab = 'activities';

/* ─── Default data ─── */
var defaultServicesData = {
    activities: [
        { id: 1, image: 'HavelockBeach.png', imageCount: 3, name: 'Havelock Beach', location: 'Havelock', categories: ['Basic', 'Couple'], status: 'Static' },
        { id: 2, image: 'ElephantaCaves.png', imageCount: 2, name: 'Elephanta Caves', location: 'Mumbai', categories: ['Basic'], status: 'Popular' },
        { id: 3, image: 'JetSki.png', imageCount: 5, name: 'Jet Ski Ride', location: 'Bali', categories: ['Couple', 'Adventure'], status: 'Inactive' },
        { id: 4, image: 'Parasailing.png', imageCount: 4, name: 'Parasailing', location: 'Andaman', categories: ['Adventure'], status: 'Featured' }
    ],
    hotels: [
        { id: 1, image: 'hotel-pictures114.png', imageCount: 3, name: 'Over Beach Hotel - Sunday Selections', location: 'Govind Nagar', categories: ['Premium', 'Couple'], status: 'Static', rating: '3 Star', checkIn: '25 Mar, Sat 2 PM', checkOut: '26 Mar, Sat 2 PM', food: 'Breakfast, Dinner', roomSize: '5 People', bedType: 'Kings', inclusions: ['Complimentary Dinner is available.', 'Beach View Reserved Table.'], details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ac metus volutpat, venenatis erat eu, vehicula velit. Duis lobortis tempus felis, et finibus justo mattis ac. Praesent pellentesque fermentum mattis.' },
        { id: 2, image: 'hotel-pictures124.png', imageCount: 3, name: 'Hotel Name', location: 'Havelock', categories: ['Luxury'], status: 'Popular', rating: '3 Star', checkIn: '25 Mar, Sat 2 PM', checkOut: '26 Mar, Sat 2 PM', food: 'Breakfast, Dinner', roomSize: '5 People', bedType: 'Kings', inclusions: ['Complimentary Dinner is available.', 'Beach View Reserved Table.'], details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ac metus volutpat, venenatis erat eu, vehicula velit. Duis lobortis tempus felis, et finibus justo mattis ac. Praesent pellentesque fermentum mattis.' }
    ],
    sightseeings: [
        { id: 1, image: 'SunsetPoint.png', imageCount: 2, name: 'Sunset Point', location: 'Havelock', categories: ['Couple'], status: 'Static' },
        { id: 2, image: 'Waterfall.png', imageCount: 3, name: 'Waterfall Trek', location: 'Andaman', categories: ['Adventure'], status: 'Featured' }
    ]
};

/* ─── Load / save data ─── */
function loadServicesData() {
    var stored = null;
    try { stored = localStorage.getItem(SERVICES_STORAGE_KEY); } catch (e) { stored = null; }
    if (stored) {
        try {
            var parsed = JSON.parse(stored);
            if (parsed && parsed.activities) { return parsed; }
        } catch (e) { /* fall through */ }
    }
    return JSON.parse(JSON.stringify(defaultServicesData));
}

function saveServicesData(data) {
    try { localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
}

var servicesData = loadServicesData();

/* ─── Tab switching ─── */
function switchServiceTab(tab) {
    servicesTab = tab;
    var tabs = ['activities', 'hotels', 'sightseeings'];
    for (var i = 0; i < tabs.length; i++) {
        var el = document.getElementById('svcTab' + tabs[i].charAt(0).toUpperCase() + tabs[i].slice(1));
        if (el) {
            if (tabs[i] === tab) { el.classList.add('svc-tab-active'); }
            else { el.classList.remove('svc-tab-active'); }
        }
    }

    var config = tabConfigFor(tab);
    var infoTitle = document.querySelector('.svc-info-title');
    var infoDesc = document.querySelector('.svc-info-desc');
    var tableTitle = document.querySelector('.svc-table-title');
    var addBtn = document.querySelector('.svc-table-add-btn');

    if (infoTitle) { infoTitle.textContent = config.infoTitle; }
    if (infoDesc) { infoDesc.textContent = config.infoText; }
    if (tableTitle) { tableTitle.textContent = config.tableTitle; }
    if (addBtn) { addBtn.textContent = config.addBtn; }

    renderTable();
}

/* ─── Per-tab config ─── */
function tabConfigFor(tab) {
    return {
        activities: {
            prefix: 'ACT',
            infoTitle: 'Activities Description',
            infoText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            tableTitle: 'List of Activities',
            addBtn: 'New Activity',
            columns: [
                { label: 'Activity ID', key: 'id' },
                { label: 'Image', key: 'image' },
                { label: 'Name', key: 'name' },
                { label: 'Location', key: 'location' },
                { label: 'Category', key: 'categories' },
                { label: 'Status', key: 'status' },
                { label: 'Action', key: 'action' }
            ]
        },
        hotels: {
            prefix: 'HTL',
            infoTitle: 'Hotels Description',
            infoText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            tableTitle: 'List of Hotels',
            addBtn: 'New Hotel',
            columns: [
                { label: 'Hotel ID', key: 'id' },
                { label: 'Image', key: 'image' },
                { label: 'Name', key: 'name' },
                { label: 'Location', key: 'location' },
                { label: 'Rating', key: 'rating' },
                { label: 'Action', key: 'action' }
            ]
        },
        sightseeings: {
            prefix: 'STG',
            infoTitle: 'Sight Seeings Description',
            infoText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            tableTitle: 'List of Sight Seeings',
            addBtn: 'New Sightseeing',
            columns: [
                { label: 'Sight ID', key: 'id' },
                { label: 'Image', key: 'image' },
                { label: 'Name', key: 'name' },
                { label: 'Location', key: 'location' },
                { label: 'Action', key: 'action' }
            ]
        }
    }[tab] || { prefix: 'ACT', infoTitle: 'Services', infoText: '', tableTitle: 'List', addBtn: 'New', columns: [] };
}

function renderColumnHeaders() {
    var thead = document.getElementById('svcTableHeadRow');
    if (!thead) { return; }
    var cfg = tabConfigFor(servicesTab);
    thead.innerHTML = '';
    for (var i = 0; i < cfg.columns.length; i++) {
        var label = cfg.columns[i].label;
        var th = document.createElement('th');
        if (label === 'Activity ID' || label === 'Hotel ID' || label === 'Sight ID') { th.className = 'svc-th-id'; }
        th.textContent = label;
        thead.appendChild(th);
    }
}

/* ─── Render table ─── */
function renderTable() {
    var tbody = document.getElementById('svcTableBody');
    if (!tbody) { return; }

    var rows = servicesData[servicesTab] || [];
    var cfg = tabConfigFor(servicesTab);
    var idPrefix = cfg.prefix;

    renderColumnHeaders();

    tbody.innerHTML = '';

    if (rows.length === 0) {
        var emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="' + cfg.columns.length + '" style="text-align:center;color:#777777;padding:24px 10px;">No records found</td>';
        tbody.appendChild(emptyRow);
        return;
    }

    for (var i = 0; i < rows.length; i++) {
        var item = rows[i];
        var tr = document.createElement('tr');
        tr.innerHTML = buildRowHtml(cfg, item, idPrefix);
        tbody.appendChild(tr);
    }
}

function buildRowHtml(cfg, item, idPrefix) {
    var html = '';
    for (var k = 0; k < cfg.columns.length; k++) {
        var col = cfg.columns[k];
        var key = col.key;
        var cell = '';
        if (key === 'id') {
            cell = '<td class="svc-td-id" onclick="openViewModal(\'' + servicesTab + '\',' + item.id + ')">#' + idPrefix + '-' + padZero(item.id) + '</td>';
        } else if (key === 'image') {
            cell = '<td class="svc-td-image"><span class="svc-image-chip">' +
                '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.4"/><circle cx="6" cy="6" r="1.2" fill="currentColor"/><path d="M3 12l3.5-3.5 2.5 2 4-4L14 12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>' +
                escapeHtml(item.image) + '</span><span class="svc-image-count">+' + (item.imageCount || 1) + '</span></td>';
        } else if (key === 'name') {
            cell = '<td class="svc-td-name" onclick="openViewModal(\'' + servicesTab + '\',' + item.id + ')">' + escapeHtml(item.name) + '</td>';
        } else if (key === 'location') {
            cell = '<td class="svc-td-location">' + escapeHtml(item.location) + '</td>';
        } else if (key === 'categories') {
            var catHtml = '';
            var cats = item.categories || [];
            for (var c = 0; c < cats.length; c++) {
                catHtml += '<span class="svc-cat-tag">' + escapeHtml(cats[c]) + '</span>';
            }
            cell = '<td><div class="svc-cat-tags">' + catHtml + '</div></td>';
        } else if (key === 'status') {
            cell = '<td><div class="svc-status-wrap">' +
                '<div class="svc-status-pill" onclick="toggleStatusMenu(' + item.id + ')"><span>' + escapeHtml(item.status) + '</span>' +
                '<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5L5 6.5 8 3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
                '<div class="svc-status-menu" id="svcStatusMenu_' + item.id + '">' +
                    '<button class="svc-status-option" onclick="setStatus(' + item.id + ',\'Static\')">Static</button>' +
                    '<button class="svc-status-option" onclick="setStatus(' + item.id + ',\'Popular\')">Popular</button>' +
                    '<button class="svc-status-option" onclick="setStatus(' + item.id + ',\'Inactive\')">Inactive</button>' +
                    '<button class="svc-status-option" onclick="setStatus(' + item.id + ',\'Featured\')">Featured</button>' +
                '</div>' +
            '</div></td>';
        } else if (key === 'rating') {
            cell = '<td><span class="svc-rating-badge">' + escapeHtml(item.rating || '3 Star') + '</span></td>';
        } else if (key === 'action') {
            cell = '<td class="svc-td-action"><button class="svc-view-btn" onclick="openViewModal(\'' + servicesTab + '\',' + item.id + ')">View Details</button></td>';
        }
        html += cell;
    }
    return html;
}

/* ─── Status menu ─── */
function toggleStatusMenu(id) {
    var menu = document.getElementById('svcStatusMenu_' + id);
    if (!menu) { return; }
    var open = menu.classList.contains('svc-open');
    closeAllStatusMenus();
    if (!open) {
        menu.classList.add('svc-open');
        var wrap = menu.parentElement;
        var pill = wrap ? wrap.querySelector('.svc-status-pill') : null;
        if (pill) { pill.classList.add('svc-open'); }
    }
}

function closeAllStatusMenus() {
    var wraps = document.querySelectorAll('.svc-status-wrap');
    for (var i = 0; i < wraps.length; i++) {
        var pill = wraps[i].querySelector('.svc-status-pill');
        var menu = wraps[i].querySelector('.svc-status-menu');
        if (pill) { pill.classList.remove('svc-open'); }
        if (menu) { menu.classList.remove('svc-open'); }
    }
}

function setStatus(id, status) {
    for (var i = 0; i < servicesData[servicesTab].length; i++) {
        if (servicesData[servicesTab][i].id === id) {
            servicesData[servicesTab][i].status = status;
            break;
        }
    }
    saveServicesData(servicesData);
    closeAllStatusMenus();
    renderTable();
    showToast('Status updated to ' + status);
}

/* ─── View modal ─── */
var viewTab = 'activities';
var viewItemId = null;

function openViewModal(tab, id) {
    var list = servicesData[tab] || [];
    var item = null;
    for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) { item = list[i]; break; }
    }
    if (!item) { return; }

    viewTab = tab;
    viewItemId = id;

    var cfg = tabConfigFor(tab);
    var idPrefix = cfg.prefix;

    var idLabel = document.querySelector('.svc-view-row .svc-view-label');
    if (idLabel) { idLabel.textContent = serviceLabelFor(tab) + ' :'; }

    document.getElementById('svcViewId').textContent = '#' + idPrefix + '-' + padZero(item.id);
    document.getElementById('svcViewTitle').textContent = item.name;
    document.getElementById('svcViewLocation').textContent = item.location;
    document.getElementById('svcViewDetails').textContent = item.details || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ac metus volutpat, venenatis erat eu, vehicula velit. Duis lobortis tempus felis, et finibus justo mattis ac. Praesent pellentesque fermentum mattis.';
    document.getElementById('svcViewCheckIn').textContent = item.checkIn || '25 Mar, Sat 2 PM';
    document.getElementById('svcViewCheckOut').textContent = item.checkOut || '26 Mar, Sat 2 PM';
    document.getElementById('svcViewFood').textContent = item.food || 'Breakfast, Dinner';
    document.getElementById('svcViewRoomSize').textContent = item.roomSize || '5 People';
    document.getElementById('svcViewBedType').textContent = item.bedType || 'Kings';
    var inc = document.getElementById('svcViewInclusions');
    if (inc) {
        var inclArr = item.inclusions || ['Complimentary Dinner is available.', 'Beach View Reserved Table.'];
        inc.innerHTML = '';
        for (var j = 0; j < inclArr.length; j++) {
            if (j > 0) { inc.appendChild(document.createElement('br')); }
            inc.appendChild(document.createTextNode(inclArr[j]));
        }
    }

    renderViewImages(item);

    openViewOverlay('svcViewModal');
}

function renderViewImages(item) {
    var wrap = document.getElementById('svcViewImages');
    if (!wrap) { return; }
    wrap.innerHTML = '';
    var n = item.imageCount || 1;
    for (var i = 0; i < n; i++) {
        var chip = document.createElement('span');
        chip.className = 'svc-view-img';
        chip.textContent = item.image || 'image.png';
        wrap.appendChild(chip);
    }
}

function serviceLabelFor(tab) {
    if (tab === 'hotels') { return 'Hotel'; }
    if (tab === 'sightseeings') { return 'Sightseeing'; }
    return 'Activity';
}

/* ─── View type dropdown ─── */
function toggleViewTypeMenu() {
    var menu = document.getElementById('svcViewTypeMenu');
    var wrap = null;
    if (menu) { wrap = menu.parentElement; }
    var already = menu ? menu.classList.contains('svc-open') : false;
    closeViewTypeMenu();
    if (!already) {
        menu.classList.add('svc-open');
        var trigger = wrap ? wrap.querySelector('.svc-view-type') : null;
        if (trigger) { trigger.classList.add('svc-open'); }
    }
}

function closeViewTypeMenu() {
    var menu = document.getElementById('svcViewTypeMenu');
    if (menu) {
        menu.classList.remove('svc-open');
        var wrap = menu.parentElement;
        var trigger = wrap ? wrap.querySelector('.svc-view-type') : null;
        if (trigger) { trigger.classList.remove('svc-open'); }
    }
}

function setViewType(status) {
    var list = servicesData[viewTab];
    for (var i = 0; i < list.length; i++) {
        if (list[i].id === viewItemId) {
            list[i].status = status;
            break;
        }
    }
    saveServicesData(servicesData);
    var valEl = document.getElementById('svcViewTypeVal');
    if (valEl) { valEl.textContent = status; }
    closeViewTypeMenu();
    showToast('Type updated to ' + status);
}

/* ─── Edit modal ─── */
function openEditModal() {
    var list = servicesData[viewTab];
    if (!list) { return; }
    var item = null;
    for (var i = 0; i < list.length; i++) {
        if (list[i].id === viewItemId) { item = list[i]; break; }
    }
    if (!item) { return; }

    var cfg = tabConfigFor(viewTab);
    var idPrefix = cfg.prefix;

    var idLabel = document.querySelector('.svc-edit-form .svc-edit-label');
    if (idLabel) { idLabel.textContent = serviceLabelFor(viewTab) + ' :'; }

    document.getElementById('svcEditId').textContent = '#' + idPrefix + '-' + padZero(item.id);
    document.getElementById('svcEditTitle').value = item.name;
    document.getElementById('svcEditLocation').value = item.location;
    document.getElementById('svcEditDetails').value = item.details || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ac metus volutpat, venenatis erat eu, vehicula velit. Duis lobortis tempus felis, et finibus justo mattis ac. Praesent pellentesque fermentum mattis.';
    document.getElementById('svcEditCheckIn').value = item.checkIn || '25 Mar, Sat 2 PM';
    document.getElementById('svcEditCheckOut').value = item.checkOut || '26 Mar, Sat 2 PM';
    document.getElementById('svcEditFoodVal').textContent = item.food || 'Breakfast, Dinner';
    document.getElementById('svcEditRoomVal').textContent = item.roomSize || '5 People';
    document.getElementById('svcEditBedVal').textContent = item.bedType || 'Kings';
    document.getElementById('svcEditInclusions').value = (item.inclusions && item.inclusions.length) ? item.inclusions.join('\n') : 'Complimentary Dinner is available.\nBeach View Reserved Table.';

    renderEditCatTags(item.categories || ['Basic']);
    renderEditCatMenu();

    closeViewOverlay('svcViewModal');
    openEditOverlay('svcEditModal');
}

function closeEditModal() {
    closeEditTypeMenu();
    closeEditCatMenu();
    closeEditOverlay('svcEditModal');
}

/* ─── Edit type dropdown ─── */
function toggleEditTypeMenu() {
    var menu = document.getElementById('svcEditTypeMenu');
    var already = menu ? menu.classList.contains('svc-open') : false;
    closeEditTypeMenu();
    if (!already) {
        menu.classList.add('svc-open');
        var trigger = document.getElementById('svcEditType');
        if (trigger) { trigger.classList.add('svc-open'); }
    }
}

function closeEditTypeMenu() {
    var menu = document.getElementById('svcEditTypeMenu');
    if (menu) { menu.classList.remove('svc-open'); }
    var trigger = document.getElementById('svcEditType');
    if (trigger) { trigger.classList.remove('svc-open'); }
}

function setEditType(status) {
    var valEl = document.getElementById('svcEditTypeVal');
    if (valEl) { valEl.textContent = status; }
    closeEditTypeMenu();
}

/* ─── Edit categories ─── */
var availableCategories = ['Basic', 'Couple', 'Adventure', 'Premium', 'Luxury'];
var editCategories = [];

function renderEditCatTags(cats) {
    editCategories = cats.slice();
    var wrap = document.getElementById('svcEditCatTags');
    if (!wrap) { return; }
    wrap.innerHTML = '';
    for (var i = 0; i < editCategories.length; i++) {
        (function (cat) {
            var tag = document.createElement('span');
            tag.className = 'svc-edit-cat-tag';
            tag.innerHTML = escapeHtml(cat) + '<button class="svc-edit-cat-tag-remove" onclick="removeEditCategory(\'' + escapeAttr(cat) + '\')">&times;</button>';
            wrap.appendChild(tag);
        })(editCategories[i]);
    }
    var clearEl = document.getElementById('svcEditCatClear');
    if (clearEl) { clearEl.style.display = editCategories.length > 0 ? 'inline-block' : 'none'; }
}

function renderEditCatMenu() {
    var menu = document.getElementById('svcEditCatMenu');
    if (!menu) { return; }
    menu.innerHTML = '';
    for (var i = 0; i < availableCategories.length; i++) {
        var cat = availableCategories[i];
        var selected = editCategories.indexOf(cat) > -1;
        (function (c, sel) {
            var btn = document.createElement('button');
            btn.className = 'svc-edit-cat-option';
            btn.textContent = c + (sel ? ' ✓' : '');
            if (sel) { btn.classList.add('svc-selected'); }
            btn.addEventListener('click', function () {
                if (sel) {
                    removeEditCategory(c);
                } else {
                    addEditCategory(c);
                }
            });
            menu.appendChild(btn);
        })(cat, selected);
    }
}

function addEditCategory(cat) {
    if (editCategories.indexOf(cat) > -1) { return; }
    editCategories.push(cat);
    renderEditCatTags(editCategories);
    renderEditCatMenu();
}

function removeEditCategory(cat) {
    var idx = editCategories.indexOf(cat);
    if (idx > -1) {
        editCategories.splice(idx, 1);
        renderEditCatTags(editCategories);
        renderEditCatMenu();
    }
}

function clearEditCategories() {
    editCategories = [];
    renderEditCatTags(editCategories);
    renderEditCatMenu();
}

function toggleEditCatMenu() {
    renderEditCatMenu();
    var menu = document.getElementById('svcEditCatMenu');
    if (menu) {
        var open = menu.classList.contains('svc-open');
        menu.classList.toggle('svc-open');
        var box = document.getElementById('svcEditCat');
        if (box) { box.classList.toggle('svc-open', !open); }
    }
}

function closeEditCatMenu() {
    var menu = document.getElementById('svcEditCatMenu');
    if (menu) { menu.classList.remove('svc-open'); }
    var box = document.getElementById('svcEditCat');
    if (box) { box.classList.remove('svc-open'); }
}

/* ─── Edit images ─── */
function addImagePrompt() {
    showToast('Image upload coming soon');
}

/* ─── Save edit ─── */
function saveEditChanges() {
    var list = servicesData[viewTab];
    if (!list) { return; }
    var item = null;
    for (var i = 0; i < list.length; i++) {
        if (list[i].id === viewItemId) { item = list[i]; break; }
    }
    if (!item) { return; }

    var title = document.getElementById('svcEditTitle').value.trim();
    if (!title) {
        showToast('Title is required');
        return;
    }

    item.name = title;
    item.location = document.getElementById('svcEditLocation').value.trim();
    item.categories = editCategories.slice();
    item.details = document.getElementById('svcEditDetails').value;
    item.checkIn = document.getElementById('svcEditCheckIn').value;
    item.checkOut = document.getElementById('svcEditCheckOut').value;
    item.food = document.getElementById('svcEditFoodVal').textContent;
    item.roomSize = document.getElementById('svcEditRoomVal').textContent;
    item.bedType = document.getElementById('svcEditBedVal').textContent;
    var inclusionsRaw = document.getElementById('svcEditInclusions').value;
    var inclusions = [];
    var parts = inclusionsRaw.split('\n');
    for (var bi = 0; bi < parts.length; bi++) {
        var p = parts[bi].trim();
        if (p) { inclusions.push(p); }
    }
    item.inclusions = inclusions.length ? inclusions : [];

    saveServicesData(servicesData);
    closeEditModal();
    renderTable();
    showToast(serviceLabelFor(viewTab) + ' saved');
}

/* ─── Edit Food / Room / Bed dropdowns ─── */
function toggleEditFoodMenu() {
    var dd = document.getElementById('svcEditFood');
    var menu = document.getElementById('svcEditFoodMenu');
    if (!menu) { return; }
    var already = menu.classList.contains('svc-open');
    closeEditFoodMenu();
    if (!already) { menu.classList.add('svc-open'); if (dd) { dd.classList.add('svc-open'); } }
}
function closeEditFoodMenu() {
    var menu = document.getElementById('svcEditFoodMenu');
    if (menu) { menu.classList.remove('svc-open'); }
    var dd = document.getElementById('svcEditFood');
    if (dd) { dd.classList.remove('svc-open'); }
}
function setEditFood(val) {
    document.getElementById('svcEditFoodVal').textContent = val;
    closeEditFoodMenu();
}

function toggleEditRoomMenu() {
    var dd = document.getElementById('svcEditRoom');
    var menu = document.getElementById('svcEditRoomMenu');
    if (!menu) { return; }
    var already = menu.classList.contains('svc-open');
    closeEditRoomMenu();
    if (!already) { menu.classList.add('svc-open'); if (dd) { dd.classList.add('svc-open'); } }
}
function closeEditRoomMenu() {
    var menu = document.getElementById('svcEditRoomMenu');
    if (menu) { menu.classList.remove('svc-open'); }
    var dd = document.getElementById('svcEditRoom');
    if (dd) { dd.classList.remove('svc-open'); }
}
function setEditRoom(val) {
    document.getElementById('svcEditRoomVal').textContent = val;
    closeEditRoomMenu();
}

function toggleEditBedMenu() {
    var dd = document.getElementById('svcEditBed');
    var menu = document.getElementById('svcEditBedMenu');
    if (!menu) { return; }
    var already = menu.classList.contains('svc-open');
    closeEditBedMenu();
    if (!already) { menu.classList.add('svc-open'); if (dd) { dd.classList.add('svc-open'); } }
}
function closeEditBedMenu() {
    var menu = document.getElementById('svcEditBedMenu');
    if (menu) { menu.classList.remove('svc-open'); }
    var dd = document.getElementById('svcEditBed');
    if (dd) { dd.classList.remove('svc-open'); }
}
function setEditBed(val) {
    document.getElementById('svcEditBedVal').textContent = val;
    closeEditBedMenu();
}

/* ─── Delete ─── */
function confirmDeleteActivity() {
    closeEditModal();
    var overlay = document.getElementById('svcDeleteConfirm');
    if (overlay) {
        overlay.classList.add('svc-show');
        overlay.style.display = 'flex';
    }
}

function closeDeleteConfirm() {
    var overlay = document.getElementById('svcDeleteConfirm');
    if (overlay) {
        overlay.classList.remove('svc-show');
        overlay.style.display = 'none';
    }
}

function doDeleteActivity() {
    var list = servicesData[viewTab];
    if (list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].id === viewItemId) {
                list.splice(i, 1);
                break;
            }
        }
        saveServicesData(servicesData);
    }
    closeDeleteConfirm();
    renderTable();
    showToast('Activity deleted');
}

function closeViewModal() {
    closeViewTypeMenu();
    closeViewOverlay('svcViewModal');
}

/* ─── New item modal ─── */
var newCategories = [];

function openNewItemModal() {
    var cfg = tabConfigFor(servicesTab);
    var idPrefix = cfg.prefix;

    var labelEl = document.getElementById('svcNewIdLabel');
    if (labelEl) { labelEl.textContent = serviceLabelFor(servicesTab) + ' :'; }
    document.getElementById('svcNewId').textContent = '#' + idPrefix + '-AUTO';
    document.getElementById('svcItemName').value = '';
    document.getElementById('svcItemLocation').value = '';
    document.getElementById('svcItemDetails').value = '';
    document.getElementById('svcItemCheckIn').value = '';
    document.getElementById('svcItemCheckOut').value = '';
    document.getElementById('svcNewFoodVal').textContent = 'Select Food Provided';
    document.getElementById('svcNewRoomVal').textContent = 'Select No. of People';
    document.getElementById('svcNewBedVal').textContent = 'Select Bed Type';
    document.getElementById('svcItemInclusions').value = '';

    newCategories = [];
    renderNewCatTags();
    renderNewCatMenu();
    openNewOverlay('svcNewItemModal');
}

function closeNewModal() {
    closeNewTypeMenu();
    closeNewCatMenu();
    closeNewFoodMenu();
    closeNewRoomMenu();
    closeNewBedMenu();
    closeNewOverlay('svcNewItemModal');
}

/* ─── New type dropdown ─── */
function toggleNewTypeMenu() {
    var menu = document.getElementById('svcNewTypeMenu');
    var already = menu ? menu.classList.contains('svc-open') : false;
    closeNewTypeMenu();
    if (!already) {
        menu.classList.add('svc-open');
        var trigger = document.getElementById('svcNewType');
        if (trigger) { trigger.classList.add('svc-open'); }
    }
}

function closeNewTypeMenu() {
    var menu = document.getElementById('svcNewTypeMenu');
    if (menu) { menu.classList.remove('svc-open'); }
    var trigger = document.getElementById('svcNewType');
    if (trigger) { trigger.classList.remove('svc-open'); }
}

function setNewType(status) {
    var valEl = document.getElementById('svcNewTypeVal');
    if (valEl) { valEl.textContent = status; }
    var pill = document.getElementById('svcNewType');
    if (pill) { pill.classList.add('svc-has-value'); }
    closeNewTypeMenu();
}

/* ─── New categories ─── */
function renderNewCatTags() {
    var wrap = document.getElementById('svcNewCatTags');
    var placeholder = document.getElementById('svcNewCatPlaceholder');
    var clear = document.getElementById('svcNewCatClear');
    if (!wrap) { return; }
    wrap.innerHTML = '';
    for (var i = 0; i < newCategories.length; i++) {
        (function (cat) {
            var tag = document.createElement('span');
            tag.className = 'svc-new-cat-tag';
            tag.innerHTML = escapeHtml(cat) + '<button class="svc-new-cat-tag-remove" onclick="removeNewCategory(\'' + escapeAttr(cat) + '\')">&times;</button>';
            wrap.appendChild(tag);
        })(newCategories[i]);
    }
    if (placeholder) { placeholder.style.display = newCategories.length > 0 ? 'none' : 'inline-block'; }
    if (clear) { clear.style.display = newCategories.length > 0 ? 'inline-block' : 'none'; }
}

function renderNewCatMenu() {
    var menu = document.getElementById('svcNewCatMenu');
    if (!menu) { return; }
    menu.innerHTML = '';
    for (var i = 0; i < availableCategories.length; i++) {
        var cat = availableCategories[i];
        var selected = newCategories.indexOf(cat) > -1;
        (function (c, sel) {
            var btn = document.createElement('button');
            btn.className = 'svc-new-cat-option';
            btn.textContent = c + (sel ? ' ✓' : '');
            if (sel) { btn.classList.add('svc-selected'); }
            btn.addEventListener('click', function () {
                if (sel) { removeNewCategory(c); }
                else { addNewCategory(c); }
            });
            menu.appendChild(btn);
        })(cat, selected);
    }
}

function addNewCategory(cat) {
    if (newCategories.indexOf(cat) > -1) { return; }
    newCategories.push(cat);
    renderNewCatTags();
    renderNewCatMenu();
}

function removeNewCategory(cat) {
    var idx = newCategories.indexOf(cat);
    if (idx > -1) {
        newCategories.splice(idx, 1);
        renderNewCatTags();
        renderNewCatMenu();
    }
}

function clearNewCategories() {
    newCategories = [];
    renderNewCatTags();
    renderNewCatMenu();
}

function toggleNewCatMenu() {
    renderNewCatMenu();
    var menu = document.getElementById('svcNewCatMenu');
    if (menu) {
        var open = menu.classList.contains('svc-open');
        menu.classList.toggle('svc-open');
        var box = document.getElementById('svcNewCat');
        if (box) { box.classList.toggle('svc-open', !open); }
    }
}

function closeNewCatMenu() {
    var menu = document.getElementById('svcNewCatMenu');
    if (menu) { menu.classList.remove('svc-open'); }
    var box = document.getElementById('svcNewCat');
    if (box) { box.classList.remove('svc-open'); }
}

/* ─── Save new activity ─── */
function saveNewItem() {
    var name = document.getElementById('svcItemName').value.trim();
    if (!name) {
        showToast('Title is required');
        return;
    }

    if (newCategories.length === 0) { newCategories = ['Basic']; }

    var list = servicesData[servicesTab];
    var nextId = 1;
    for (var j = 0; j < list.length; j++) {
        if (list[j].id >= nextId) { nextId = list[j].id + 1; }
    }

    var inclusionsRaw = document.getElementById('svcItemInclusions').value;
    var inclusions = [];
    var parts = inclusionsRaw.split('\n');
    for (var bi = 0; bi < parts.length; bi++) {
        var p = parts[bi].trim();
        if (p) { inclusions.push(p); }
    }

    list.push({
        id: nextId,
        image: 'new-image.png',
        imageCount: 1,
        name: name,
        location: document.getElementById('svcItemLocation').value.trim() || '—',
        categories: newCategories.slice(),
        details: document.getElementById('svcItemDetails').value,
        checkIn: document.getElementById('svcItemCheckIn').value.trim() || '25 Mar, Sat 2 PM',
        checkOut: document.getElementById('svcItemCheckOut').value.trim() || '26 Mar, Sat 2 PM',
        food: document.getElementById('svcNewFoodVal').textContent,
        roomSize: document.getElementById('svcNewRoomVal').textContent,
        bedType: document.getElementById('svcNewBedVal').textContent,
        inclusions: inclusions
    });

    saveServicesData(servicesData);
    closeNewModal();
    renderTable();
    showToast(serviceLabelFor(servicesTab) + ' added');
}

/* ─── New Food / Room / Bed dropdowns ─── */
function toggleNewFoodMenu() {
    var dd = document.getElementById('svcNewFood');
    var menu = document.getElementById('svcNewFoodMenu');
    if (!menu) { return; }
    var already = menu.classList.contains('svc-open');
    closeNewFoodMenu();
    if (!already) { menu.classList.add('svc-open'); if (dd) { dd.classList.add('svc-open'); } }
}
function closeNewFoodMenu() {
    var menu = document.getElementById('svcNewFoodMenu');
    if (menu) { menu.classList.remove('svc-open'); }
    var dd = document.getElementById('svcNewFood');
    if (dd) { dd.classList.remove('svc-open'); }
}
function setNewFood(val) {
    document.getElementById('svcNewFoodVal').textContent = val;
    closeNewFoodMenu();
}

function toggleNewRoomMenu() {
    var dd = document.getElementById('svcNewRoom');
    var menu = document.getElementById('svcNewRoomMenu');
    if (!menu) { return; }
    var already = menu.classList.contains('svc-open');
    closeNewRoomMenu();
    if (!already) { menu.classList.add('svc-open'); if (dd) { dd.classList.add('svc-open'); } }
}
function closeNewRoomMenu() {
    var menu = document.getElementById('svcNewRoomMenu');
    if (menu) { menu.classList.remove('svc-open'); }
    var dd = document.getElementById('svcNewRoom');
    if (dd) { dd.classList.remove('svc-open'); }
}
function setNewRoom(val) {
    document.getElementById('svcNewRoomVal').textContent = val;
    closeNewRoomMenu();
}

function toggleNewBedMenu() {
    var dd = document.getElementById('svcNewBed');
    var menu = document.getElementById('svcNewBedMenu');
    if (!menu) { return; }
    var already = menu.classList.contains('svc-open');
    closeNewBedMenu();
    if (!already) { menu.classList.add('svc-open'); if (dd) { dd.classList.add('svc-open'); } }
}
function closeNewBedMenu() {
    var menu = document.getElementById('svcNewBedMenu');
    if (menu) { menu.classList.remove('svc-open'); }
    var dd = document.getElementById('svcNewBed');
    if (dd) { dd.classList.remove('svc-open'); }
}
function setNewBed(val) {
    document.getElementById('svcNewBedVal').textContent = val;
    closeNewBedMenu();
}

/* ─── Profile menu ─── */
function toggleProfileMenu() {
    var menu = document.getElementById('svcProfileMenu');
    if (menu) {
        if (menu.classList.contains('svc-open')) { menu.classList.remove('svc-open'); }
        else { menu.classList.add('svc-open'); }
    }
}

function profilePlaceholder(e) {
    if (e && e.preventDefault) { e.preventDefault(); }
    closeProfileMenu();
    showToast('Coming soon');
}

/* ─── Sidebar / Navigation ─── */
function closeProfileMenu() {
    var menu = document.getElementById('svcProfileMenu');
    if (menu) { menu.classList.remove('svc-open'); }
}

/* ─── Toast ─── */
var toastTimer = null;

function showToast(msg) {
    var toast = document.getElementById('svcToast');
    var msgEl = document.getElementById('svcToastMsg');
    if (!toast || !msgEl) { return; }
    msgEl.textContent = msg;
    toast.classList.add('svc-show');
    if (toastTimer) { clearTimeout(toastTimer); }
    toastTimer = setTimeout(function () {
        toast.classList.remove('svc-show');
    }, 2500);
}

/* ─── Utilities ─── */
function padZero(n) {
    return (n < 10) ? ('0' + n) : ('' + n);
}

function escapeHtml(text) {
    if (!text) { return ''; }
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeAttr(text) {
    if (!text) { return ''; }
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;');
}

/* ─── View overlay helpers ─── */
function openViewOverlay(id) {
    var el = document.getElementById(id);
    if (el) {
        el.classList.add('svc-show');
        el.style.display = 'flex';
    }
}

function closeViewOverlay(id) {
    var el = document.getElementById(id);
    if (el) {
        el.classList.remove('svc-show');
        el.style.display = 'none';
    }
    closeViewTypeMenu();
}

function openEditOverlay(id) {
    var el = document.getElementById(id);
    if (el) {
        el.classList.add('svc-show');
        el.style.display = 'flex';
    }
}

function closeEditOverlay(id) {
    var el = document.getElementById(id);
    if (el) {
        el.classList.remove('svc-show');
        el.style.display = 'none';
    }
    closeEditTypeMenu();
    closeEditCatMenu();
}

function openNewOverlay(id) {
    var el = document.getElementById(id);
    if (el) {
        el.classList.add('svc-show');
        el.style.display = 'flex';
    }
}

function closeNewOverlay(id) {
    var el = document.getElementById(id);
    if (el) {
        el.classList.remove('svc-show');
        el.style.display = 'none';
    }
    closeNewTypeMenu();
    closeNewCatMenu();
}

/* ─── Global events ─── */
document.addEventListener('click', function (e) {
    var target = e.target;
    if (!target) { return; }

    /* close status menus on outside click */
    if (!target.closest('.svc-status-menu') && !target.closest('.svc-status-pill')) {
        closeAllStatusMenus();
    }

    /* close view type menu on outside click */
    if (!target.closest('.svc-view-type-menu') && !target.closest('.svc-view-type')) {
        closeViewTypeMenu();
    }

    /* close edit type menu on outside click */
    if (!target.closest('.svc-edit-type-menu') && !target.closest('.svc-edit-type')) {
        closeEditTypeMenu();
    }

    /* close edit category menu on outside click */
    if (!target.closest('.svc-edit-cat-menu') && !target.closest('.svc-edit-cat') && !target.closest('.svc-edit-cat-arrow')) {
        closeEditCatMenu();
    }

    /* close edit food/room/bed dropdowns on outside click */
    if (!target.closest('.svc-edit-dropdown-menu') && !target.closest('.svc-edit-dropdown')) {
        closeEditFoodMenu();
        closeEditRoomMenu();
        closeEditBedMenu();
    }

    /* close new type menu on outside click */
    if (!target.closest('.svc-new-type-menu') && !target.closest('.svc-new-type')) {
        closeNewTypeMenu();
    }

    /* close new category menu on outside click */
    if (!target.closest('.svc-new-cat-menu') && !target.closest('.svc-new-cat') && !target.closest('.svc-new-cat-arrow')) {
        closeNewCatMenu();
    }

    /* close new food/room/bed dropdowns on outside click */
    if (!target.closest('.svc-new-dropdown-menu') && !target.closest('.svc-new-dropdown')) {
        closeNewFoodMenu();
        closeNewRoomMenu();
        closeNewBedMenu();
    }

    /* close profile menu on outside click */
    if (!target.closest('.svc-profile')) {
        closeProfileMenu();
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeNewModal();
        closeViewModal();
        closeEditModal();
        closeDeleteConfirm();
        closeAllStatusMenus();
        closeViewTypeMenu();
        closeEditTypeMenu();
        closeEditCatMenu();
        closeEditFoodMenu();
        closeEditRoomMenu();
        closeEditBedMenu();
        closeNewTypeMenu();
        closeNewCatMenu();
        closeProfileMenu();
    }
});

/* open new activity modal on overlay click */
var newOverlay = document.getElementById('svcNewItemModal');
if (newOverlay) {
    newOverlay.addEventListener('click', function (e) {
        if (e.target === this) { closeNewModal(); }
    });
}

/* open view modal on overlay click */
var viewOverlay = document.getElementById('svcViewModal');
if (viewOverlay) {
    viewOverlay.addEventListener('click', function (e) {
        if (e.target === this) { closeViewModal(); }
    });
}

/* open edit modal on overlay click */
var editOverlay = document.getElementById('svcEditModal');
if (editOverlay) {
    editOverlay.addEventListener('click', function (e) {
        if (e.target === this) { closeEditModal(); }
    });
}

/* open delete confirm on overlay click */
var confirmOverlay = document.getElementById('svcDeleteConfirm');
if (confirmOverlay) {
    confirmOverlay.addEventListener('click', function (e) {
        if (e.target === this) { closeDeleteConfirm(); }
    });
}

/* ─── Init ─── */
switchServiceTab('activities');
initializeMobileMenu();

/* ─── Mobile menu ─── */
function initializeMobileMenu() {
    var mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function () {
            var sidebar = document.getElementById('sidebar');
            var overlay = document.getElementById('sidebarOverlay');
            if (sidebar) { sidebar.classList.toggle('active'); }
            if (overlay) { overlay.classList.toggle('active'); }
        });
    }

    var sidebarOverlay = document.getElementById('sidebarOverlay');
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function () {
            var sidebar = document.getElementById('sidebar');
            if (sidebar) { sidebar.classList.remove('active'); }
            this.classList.remove('active');
        });
    }

    var mobileProfileBtn = document.getElementById('mobileProfileBtn');
    if (mobileProfileBtn) {
        mobileProfileBtn.addEventListener('click', function () {
            if (window.confirm('Do you want to logout?')) {
                window.location.href = 'admin-login.html';
            }
        });
    }

    var navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    for (var i = 0; i < navItems.length; i++) {
        (function (item) {
            item.addEventListener('click', function () {
                if (window.innerWidth <= 768) {
                    var sidebar = document.getElementById('sidebar');
                    var overlay = document.getElementById('sidebarOverlay');
                    if (sidebar) { sidebar.classList.remove('active'); }
                    if (overlay) { overlay.classList.remove('active'); }
                }
            });
        })(navItems[i]);
    }
}