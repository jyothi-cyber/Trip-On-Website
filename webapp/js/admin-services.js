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

    /* update modal title */
    var newItemTitle = document.getElementById('svcNewItemTitle');
    if (newItemTitle) { newItemTitle.textContent = 'New ' + labels[tab].replace('Sight Seeings', 'Sightseeing'); }

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
function openViewModal(tab, id) {
    var list = servicesData[tab] || [];
    var item = null;
    for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) { item = list[i]; break; }
    }
    if (!item) { return; }

    var prefix = { activities: 'ACT', hotels: 'HTL', sightseeings: 'STG' };
    var idPrefix = prefix[tab] || 'ACT';
    var label = { activities: 'Activity', hotels: 'Hotel', sightseeings: 'Sightseeing' };

    document.getElementById('svcViewStatus').textContent = item.status;
    document.getElementById('svcViewId').textContent = '#' + idPrefix + '-' + padZero(item.id);
    document.getElementById('svcViewName').textContent = item.name;
    document.getElementById('svcViewLocation').textContent = item.location;
    document.getElementById('svcViewCategory').textContent = item.categories.join(', ');
    document.getElementById('svcViewDesc').textContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus.';

    var titleEl = document.querySelector('#svcViewModal .svc-modal-title');
    if (titleEl) {
        titleEl.textContent = serviceLabelFor(tab) + ' Details';
    }

    openModal('svcViewModal');
}

function serviceLabelFor(tab) {
    if (tab === 'hotels') { return 'Hotel'; }
    if (tab === 'sightseeings') { return 'Sightseeing'; }
    return 'Activity';
}

/* ─── New item modal ─── */
function openNewItemModal() {
    var labels = { activities: 'Activity', hotels: 'Hotel', sightseeings: 'Sightseeing' };
    document.getElementById('svcNewItemTitle').textContent = 'New ' + labels[servicesTab];
    document.getElementById('svcItemName').value = '';
    document.getElementById('svcItemImage').value = '';
    document.getElementById('svcItemLocation').value = '';
    document.getElementById('svcItemCategory').value = '';
    document.getElementById('svcItemStatus').value = 'Static';
    openModal('svcNewItemModal');
}

function saveNewItem() {
    var name = document.getElementById('svcItemName').value.trim();
    if (!name) {
        showToast('Name is required');
        return;
    }

    var categoriesRaw = document.getElementById('svcItemCategory').value.trim();
    var categories = [];
    if (categoriesRaw) {
        var parts = categoriesRaw.split(',');
        for (var i = 0; i < parts.length; i++) {
            var p = parts[i].trim();
            if (p) { categories.push(p); }
        }
    }
    if (categories.length === 0) { categories = ['Basic']; }

    var list = servicesData[servicesTab];
    var nextId = 1;
    for (var j = 0; j < list.length; j++) {
        if (list[j].id >= nextId) { nextId = list[j].id + 1; }
    }

    list.push({
        id: nextId,
        image: document.getElementById('svcItemImage').value.trim() || 'new-image.png',
        imageCount: 1,
        name: name,
        location: document.getElementById('svcItemLocation').value.trim() || '—',
        categories: categories,
        status: document.getElementById('svcItemStatus').value
    });

    saveServicesData(servicesData);
    closeModal('svcNewItemModal');
    renderTable();
    showToast('Added successfully');
}

/* ─── Ticket modal ─── */
function openNewTicketModal() {
    document.getElementById('svcTicketTitle').value = '';
    document.getElementById('svcTicketDesc').value = '';
    openModal('svcNewTicketModal');
}

function saveTicket() {
    var title = document.getElementById('svcTicketTitle').value.trim();
    if (!title) {
        showToast('Ticket title is required');
        return;
    }
    closeModal('svcNewTicketModal');
    showToast('Ticket created: ' + title);
}

/* ─── Modal helpers ─── */
function openModal(id) {
    var modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('svc-show');
        modal.style.display = 'flex';
    }
}

function closeModal(id) {
    var modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('svc-show');
        modal.style.display = 'none';
    }
    closeAllStatusMenus();
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

/* ─── Sidebar ─── */
function toggleSidebar() {
    var dash = document.getElementById('svcDashboard');
    if (dash) { dash.classList.toggle('svc-collapsed'); }
}

/* ─── Navigation ─── */
function goToDashboard() {
    window.location.href = 'admin-dashboard.html';
}

function goHome() {
    window.location.href = 'admin-dashboard.html';
}

function pagePlaceholder(e) {
    if (e && e.preventDefault) { e.preventDefault(); }
    showToast('Page not implemented yet');
}

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

/* ─── Global events ─── */
document.addEventListener('click', function (e) {
    var target = e.target;
    if (!target) { return; }

    /* close status menus on outside click */
    if (!target.closest('.svc-status-menu') && !target.closest('.svc-status-pill')) {
        closeAllStatusMenus();
    }

    /* close profile menu on outside click */
    if (!target.closest('.svc-profile')) {
        closeProfileMenu();
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeModal('svcNewTicketModal');
        closeModal('svcNewItemModal');
        closeModal('svcViewModal');
        closeAllStatusMenus();
        closeProfileMenu();
    }
});

/* open modals on overlay click */
var overlayIds = ['svcNewTicketModal', 'svcNewItemModal', 'svcViewModal'];
for (var oi = 0; oi < overlayIds.length; oi++) {
    (function (id) {
        document.getElementById(id).addEventListener('click', function (e) {
            if (e.target === this) { closeModal(id); }
        });
    })(overlayIds[oi]);
}

/* ─── Init ─── */
switchServiceTab('activities');