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
        { id: 1, image: 'SeaView.png', imageCount: 3, name: 'Sea View Resort', location: 'Havelock', categories: ['Premium', 'Couple'], status: 'Static' },
        { id: 2, image: 'BeachHouse.png', imageCount: 2, name: 'Beach House', location: 'Bali', categories: ['Luxury'], status: 'Popular' }
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

    var labels = { activities: 'Activities', hotels: 'Hotels', sightseeings: 'Sight Seeings' };
    var titles = { activities: 'Most Liked Activities', hotels: 'Most Liked Hotels', sightseeings: 'Most Liked Sight Seeings' };
    var infoTexts = {
        activities: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        hotels: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
        sightseeings: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.'
    };

    var infoTitle = document.querySelector('.svc-info-title');
    var infoDesc = document.querySelector('.svc-info-desc');
    var tableTitle = document.querySelector('.svc-table-title');
    var addBtn = document.querySelector('.svc-table-add-btn');

    if (infoTitle) { infoTitle.textContent = labels[tab]; }
    if (infoDesc) { infoDesc.textContent = infoTexts[tab]; }
    if (tableTitle) { tableTitle.textContent = titles[tab]; }
    if (addBtn) { addBtn.textContent = 'New ' + labels[tab].replace('Sight Seeings', 'Sightseeing'); }

    renderTable();
}

/* ─── Render table ─── */
function renderTable() {
    var tbody = document.getElementById('svcTableBody');
    if (!tbody) { return; }

    var rows = servicesData[servicesTab] || [];
    var prefix = { activities: 'ACT', hotels: 'HTL', sightseeings: 'STG' };
    var idPrefix = prefix[servicesTab] || 'ACT';

    tbody.innerHTML = '';

    if (rows.length === 0) {
        var emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="7" style="text-align:center;color:#777777;padding:24px 10px;">No records found</td>';
        tbody.appendChild(emptyRow);
        return;
    }

    for (var i = 0; i < rows.length; i++) {
        var item = rows[i];
        var tr = document.createElement('tr');

        var catHtml = '';
        for (var c = 0; c < item.categories.length; c++) {
            catHtml += '<span class="svc-cat-tag">' + escapeHtml(item.categories[c]) + '</span>';
        }

        tr.innerHTML =
            '<td class="svc-td-id" onclick="openViewModal(\'' + servicesTab + '\',' + item.id + ')">#' + idPrefix + '-' + padZero(item.id) + '</td>' +
            '<td class="svc-td-image"><span class="svc-image-chip">' +
                '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.4"/><circle cx="6" cy="6" r="1.2" fill="currentColor"/><path d="M3 12l3.5-3.5 2.5 2 4-4L14 12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>' +
                escapeHtml(item.image) + '</span><span class="svc-image-count">+' + item.imageCount + '</span></td>' +
            '<td class="svc-td-name" onclick="openViewModal(\'' + servicesTab + '\',' + item.id + ')">' + escapeHtml(item.name) + '</td>' +
            '<td class="svc-td-location">' + escapeHtml(item.location) + '</td>' +
            '<td><div class="svc-cat-tags">' + catHtml + '</div></td>' +
            '<td><div class="svc-status-wrap">' +
                '<div class="svc-status-pill" onclick="toggleStatusMenu(' + item.id + ')"><span>' + escapeHtml(item.status) + '</span>' +
                '<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5L5 6.5 8 3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
                '<div class="svc-status-menu" id="svcStatusMenu_' + item.id + '">' +
                    '<button class="svc-status-option" onclick="setStatus(' + item.id + ',\'Static\')">Static</button>' +
                    '<button class="svc-status-option" onclick="setStatus(' + item.id + ',\'Popular\')">Popular</button>' +
                    '<button class="svc-status-option" onclick="setStatus(' + item.id + ',\'Inactive\')">Inactive</button>' +
                    '<button class="svc-status-option" onclick="setStatus(' + item.id + ',\'Featured\')">Featured</button>' +
                '</div>' +
            '</div></td>' +
            '<td class="svc-td-action"><button class="svc-view-btn" onclick="openViewModal(\'' + servicesTab + '\',' + item.id + ')">View Details</button></td>';

        tbody.appendChild(tr);
    }
}

/* ─── Status menu ─── */
function toggleStatusMenu(id) {
    var menu = document.getElementById('svcStatusMenu_' + id);
    if (!menu) { return; }
    var open = menu.classList.contains('svc-open');
    closeAllStatusMenus();
    if (!open) { menu.classList.add('svc-open'); }
}

function closeAllStatusMenus() {
    var menus = document.querySelectorAll('.svc-status-menu');
    for (var i = 0; i < menus.length; i++) {
        menus[i].classList.remove('svc-open');
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

    var prefix = { activities: 'ACT', hotels: 'HTL', sightseeings: 'STG' };
    var idPrefix = prefix[tab] || 'ACT';

    document.getElementById('svcViewId').textContent = '#' + idPrefix + '-' + padZero(item.id);
    document.getElementById('svcViewTypeVal').textContent = item.status;
    document.getElementById('svcViewTitle').textContent = item.name;
    document.getElementById('svcViewLocation').textContent = item.location;
    document.getElementById('svcViewDetails').textContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ac metus volutpat, venenatis erat eu, vehicula velit. Duis lobortis tempus felis, et finibus justo mattis ac. Praesent pellentesque fermentum mattis.';

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
    if (menu) {
        closeViewTypeMenu();
        menu.classList.add('svc-open');
    }
}

function closeViewTypeMenu() {
    var menu = document.getElementById('svcViewTypeMenu');
    if (menu) { menu.classList.remove('svc-open'); }
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
    document.getElementById('svcViewTypeVal').textContent = status;
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

    var prefix = { activities: 'ACT', hotels: 'HTL', sightseeings: 'STG' };
    var idPrefix = prefix[viewTab] || 'ACT';

    document.getElementById('svcEditId').textContent = '#' + idPrefix + '-' + padZero(item.id);
    document.getElementById('svcEditTypeVal').textContent = item.status;
    document.getElementById('svcEditTitle').value = item.name;
    document.getElementById('svcEditLocation').value = item.location;
    document.getElementById('svcEditDetails').value = item.details || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ac metus volutpat, venenatis erat eu, vehicula velit. Duis lobortis tempus felis, et finibus justo mattis ac. Praesent pellentesque fermentum mattis.';

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
    if (menu) {
        closeEditTypeMenu();
        menu.classList.add('svc-open');
    }
}

function closeEditTypeMenu() {
    var menu = document.getElementById('svcEditTypeMenu');
    if (menu) { menu.classList.remove('svc-open'); }
}

function setEditType(status) {
    document.getElementById('svcEditTypeVal').textContent = status;
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
        if (menu.classList.contains('svc-open')) { menu.classList.remove('svc-open'); }
        else { menu.classList.add('svc-open'); }
    }
}

function closeEditCatMenu() {
    var menu = document.getElementById('svcEditCatMenu');
    if (menu) { menu.classList.remove('svc-open'); }
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
    item.status = document.getElementById('svcEditTypeVal').textContent;
    item.categories = editCategories.slice();
    item.details = document.getElementById('svcEditDetails').value;

    saveServicesData(servicesData);
    closeEditModal();
    renderTable();
    showToast('Activity saved');
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
    var prefix = { activities: 'ACT', hotels: 'HTL', sightseeings: 'STG' };
    var idPrefix = prefix[servicesTab] || 'ACT';

    document.getElementById('svcNewId').textContent = '#' + idPrefix + '-AUTO';
    document.getElementById('svcNewTypeVal').textContent = 'Select';
    document.getElementById('svcItemName').value = '';
    document.getElementById('svcItemLocation').value = '';
    document.getElementById('svcItemDetails').value = '';

    newCategories = [];
    renderNewCatTags();
    renderNewCatMenu();
    openNewOverlay('svcNewItemModal');
}

function closeNewModal() {
    closeNewTypeMenu();
    closeNewCatMenu();
    closeNewOverlay('svcNewItemModal');
}

/* ─── New type dropdown ─── */
function toggleNewTypeMenu() {
    var menu = document.getElementById('svcNewTypeMenu');
    if (menu) {
        closeNewTypeMenu();
        menu.classList.add('svc-open');
    }
}

function closeNewTypeMenu() {
    var menu = document.getElementById('svcNewTypeMenu');
    if (menu) { menu.classList.remove('svc-open'); }
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
        if (menu.classList.contains('svc-open')) { menu.classList.remove('svc-open'); }
        else { menu.classList.add('svc-open'); }
    }
}

function closeNewCatMenu() {
    var menu = document.getElementById('svcNewCatMenu');
    if (menu) { menu.classList.remove('svc-open'); }
}

/* ─── Save new activity ─── */
function saveNewItem() {
    var name = document.getElementById('svcItemName').value.trim();
    if (!name) {
        showToast('Title is required');
        return;
    }

    var type = document.getElementById('svcNewTypeVal').textContent;
    if (type === 'Select') {
        showToast('Please select a Type');
        return;
    }

    if (newCategories.length === 0) { newCategories = ['Basic']; }

    var list = servicesData[servicesTab];
    var nextId = 1;
    for (var j = 0; j < list.length; j++) {
        if (list[j].id >= nextId) { nextId = list[j].id + 1; }
    }

    list.push({
        id: nextId,
        image: 'new-image.png',
        imageCount: 1,
        name: name,
        location: document.getElementById('svcItemLocation').value.trim() || '—',
        categories: newCategories.slice(),
        status: type,
        details: document.getElementById('svcItemDetails').value
    });

    saveServicesData(servicesData);
    closeNewModal();
    renderTable();
    showToast('Activity added');
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

    /* close new type menu on outside click */
    if (!target.closest('.svc-new-type-menu') && !target.closest('.svc-new-type')) {
        closeNewTypeMenu();
    }

    /* close new category menu on outside click */
    if (!target.closest('.svc-new-cat-menu') && !target.closest('.svc-new-cat') && !target.closest('.svc-new-cat-arrow')) {
        closeNewCatMenu();
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