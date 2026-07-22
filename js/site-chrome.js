/**
 * Shared header/footer behavior for sub-pages (matches homepage).
 * Usage: initSiteChrome({ base: '../' }) or initSiteChrome({ base: '' })
 */
function initSiteChrome(options) {
  const base = (options && options.base) || '';
  const siteHeader = document.getElementById('site-header');
  if (!siteHeader) return;

  // Sticky header scroll
  window.addEventListener('scroll', () => {
    siteHeader.classList.toggle('header-scrolled', window.scrollY > 100);
  });

  // Mobile menu
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');

  function openMobileMenu() {
    if (mobileMenuOverlay) {
      mobileMenuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileMenu() {
    if (mobileMenuOverlay) {
      mobileMenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', (e) => {
      if (e.target === mobileMenuOverlay) closeMobileMenu();
    });
  }
  document.querySelectorAll('.mobile-nav-links a:not(.mobile-contact-btn)').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Book a Trip modal
  injectBookTripModal(base);
  setupBookTripModal(base);

  const mobileBookBtn = document.getElementById('mobile-book-trip-btn');
  if (mobileBookBtn) {
    mobileBookBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileMenu();
      openBAT();
    });
  }

  const contactBtn = document.getElementById('contact-us-btn');
  if (contactBtn) contactBtn.addEventListener('click', openBAT);
}

function injectBookTripModal(base) {
  if (document.getElementById('bat-overlay')) return;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
  <div class="bat-overlay" id="bat-overlay" role="dialog" aria-modal="true" aria-labelledby="bat-title">
    <div class="bat-modal" id="bat-modal">
      <button class="bat-close" id="bat-close" aria-label="Close booking form"><i class="fa-solid fa-xmark"></i></button>
      <div class="bat-form-view" id="bat-form-view">
        <div class="bat-header">
          <div class="bat-header-icon"><i class="fa-solid fa-plane-departure"></i></div>
          <h2 class="bat-title" id="bat-title">Book a Trip</h2>
          <p class="bat-subtitle">Fill in your details and we'll plan the perfect trip for you!</p>
        </div>
        <form id="bat-form" novalidate>
          <div class="bat-field-group">
            <label for="bat-name">Full Name <span class="bat-required">*</span></label>
            <div class="bat-input-wrap" id="bat-field-name">
              <i class="fa-solid fa-user bat-field-icon"></i>
              <input type="text" id="bat-name" placeholder="Enter your full name" required>
            </div>
            <span class="bat-error" id="bat-name-error">Please enter a valid name (letters only)</span>
          </div>
          <div class="bat-field-group">
            <label for="bat-destination">Destination <span class="bat-required">*</span></label>
            <div class="bat-input-wrap" id="bat-field-destination">
              <i class="fa-solid fa-location-dot bat-field-icon"></i>
              <select id="bat-destination" required>
                <option value="">Select a destination</option>
                <option value="Bali" selected>Bali</option>
              </select>
            </div>
            <span class="bat-error" id="bat-destination-error">Please select a destination</span>
          </div>
          <div class="bat-field-group">
            <label for="bat-phone">Phone Number <span class="bat-required">*</span></label>
            <div class="bat-input-wrap" id="bat-field-phone">
              <i class="fa-solid fa-phone bat-field-icon"></i>
              <input type="tel" id="bat-phone" placeholder="Enter your phone number" inputmode="numeric" maxlength="15" required>
            </div>
            <span class="bat-error" id="bat-phone-error">Please enter a valid phone number</span>
          </div>
          <div class="bat-row">
            <div class="bat-field-group">
              <label for="bat-days">No. of Days <span class="bat-required">*</span></label>
              <div class="bat-input-wrap" id="bat-field-days">
                <i class="fa-solid fa-calendar-days bat-field-icon"></i>
                <select id="bat-days" required>
                  <option value="">Select days</option>
                  <option>3 Days</option><option>4 Days</option><option>5 Days</option>
                  <option>6 Days</option><option>7 Days</option><option>8 Days</option>
                  <option>9 Days</option><option>10 Days</option><option>10+ Days</option>
                </select>
              </div>
              <span class="bat-error" id="bat-days-error">Please select duration</span>
            </div>
            <div class="bat-field-group">
              <label for="bat-people">No. of People <span class="bat-required">*</span></label>
              <div class="bat-input-wrap" id="bat-field-people">
                <i class="fa-solid fa-users bat-field-icon"></i>
                <select id="bat-people" required>
                  <option value="">Select travelers</option>
                  <option>1 Person</option><option>2 Persons</option><option>3 Persons</option>
                  <option>4 Persons</option><option>5 Persons</option><option>6–10 Persons</option><option>10+ Persons</option>
                </select>
              </div>
              <span class="bat-error" id="bat-people-error">Please select travelers</span>
            </div>
          </div>
          <div class="bat-field-group">
            <label for="bat-travel-date">Travel On <span class="bat-required">*</span></label>
            <div class="bat-input-wrap" id="bat-field-travel-date">
              <i class="fa-solid fa-calendar-check bat-field-icon"></i>
              <input type="text" id="bat-travel-date" placeholder="Select travel date" readonly required>
            </div>
            <span class="bat-error" id="bat-travel-date-error">Please select your travel date</span>
          </div>
          <button type="submit" class="bat-submit-btn" id="bat-submit-btn">
            <i class="fa-solid fa-paper-plane"></i> Submit Details
          </button>
        </form>
      </div>
    </div>
  </div>
  <div class="bat-cal-overlay" id="bat-cal-overlay">
    <div class="bat-cal-modal">
      <div class="bat-cal-header">
        <button type="button" class="bat-cal-nav" id="bat-cal-prev"><i class="fa-solid fa-chevron-left"></i></button>
        <div class="bat-cal-month-year" id="bat-cal-month-year">July 2026</div>
        <button type="button" class="bat-cal-nav" id="bat-cal-next"><i class="fa-solid fa-chevron-right"></i></button>
      </div>
      <div class="bat-cal-weekdays"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div>
      <div class="bat-cal-days" id="bat-cal-days"></div>
      <div class="bat-cal-footer">
        <button type="button" class="bat-cal-today-btn" id="bat-cal-today">Today</button>
        <button type="button" class="bat-cal-clear-btn" id="bat-cal-clear">Clear</button>
      </div>
    </div>
  </div>
  <div class="bat-ty-overlay" id="bat-ty-overlay">
    <div class="bat-ty-modal">
      <button class="bat-ty-close" id="bat-ty-close"><i class="fa-solid fa-xmark"></i></button>
      <div class="bat-ty-icon">
        <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
          <circle class="bat-ty-circle" cx="26" cy="26" r="24" fill="none" stroke="#0E5A36" stroke-width="2.5"/>
          <path class="bat-ty-tick" fill="none" stroke="#0E5A36" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M14 27l8 8 16-16"/>
        </svg>
      </div>
      <p class="bat-ty-tag">BOOKING RECEIVED</p>
      <h2 class="bat-ty-title">Thank You!</h2>
      <p class="bat-ty-sub">We've received your trip details. Our team will contact you shortly.</p>
      <div class="bat-ty-summary">
        <div class="bat-ty-row"><span><i class="fa-solid fa-user"></i> Name</span><strong id="bat-ty-name">—</strong></div>
        <div class="bat-ty-row"><span><i class="fa-solid fa-location-dot"></i> Destination</span><strong id="bat-ty-destination">—</strong></div>
        <div class="bat-ty-row"><span><i class="fa-solid fa-phone"></i> Phone</span><strong id="bat-ty-phone">—</strong></div>
        <div class="bat-ty-row"><span><i class="fa-solid fa-calendar-days"></i> Duration</span><strong id="bat-ty-days">—</strong></div>
        <div class="bat-ty-row"><span><i class="fa-solid fa-users"></i> Travelers</span><strong id="bat-ty-people">—</strong></div>
        <div class="bat-ty-row"><span><i class="fa-solid fa-calendar-check"></i> Travel On</span><strong id="bat-ty-date">—</strong></div>
      </div>
      <button class="bat-ty-btn" id="bat-ty-explore-btn"><i class="fa-solid fa-compass"></i> Explore Packages</button>
      <p class="bat-ty-note">Our team will call you within 24 hours.</p>
    </div>
  </div>
  <div class="toast-notification" id="toast-notification">
    <i class="fa-solid fa-circle-check"></i>
    <span id="toast-text">Success!</span>
  </div>`;

  while (wrapper.firstChild) {
    document.body.appendChild(wrapper.firstChild);
  }

  const exploreBtn = document.getElementById('bat-ty-explore-btn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      document.getElementById('bat-ty-overlay').classList.remove('active');
      document.body.style.overflow = '';
      window.location.href = base + 'packages.html';
    });
  }
}

function openBAT() {
  const overlay = document.getElementById('bat-overlay');
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeBAT() {
  const overlay = document.getElementById('bat-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast-notification');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;
  toastText.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

function setupBookTripModal(base) {
  const batClose = document.getElementById('bat-close');
  const batOverlay = document.getElementById('bat-overlay');
  const batForm = document.getElementById('bat-form');
  const batName = document.getElementById('bat-name');
  const batPhone = document.getElementById('bat-phone');

  if (batClose) batClose.addEventListener('click', closeBAT);
  if (batOverlay) {
    batOverlay.addEventListener('click', (e) => {
      if (e.target === batOverlay) closeBAT();
    });
  }

  if (batName) {
    batName.addEventListener('input', function () {
      this.value = this.value.replace(/[^A-Za-z\s]/g, '');
    });
  }
  if (batPhone) {
    batPhone.addEventListener('input', function () {
      this.value = this.value.replace(/[^0-9]/g, '');
    });
  }

  const batCalOverlay = document.getElementById('bat-cal-overlay');
  const batCalDays = document.getElementById('bat-cal-days');
  const batCalMonthYear = document.getElementById('bat-cal-month-year');
  const batTravelDate = document.getElementById('bat-travel-date');
  let batCalDate = new Date();
  let batSelectedDate = null;
  const BAT_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function renderBatCalendar(year, month) {
    if (!batCalDays || !batCalMonthYear) return;
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLast = new Date(year, month, 0).getDate();
    batCalMonthYear.textContent = BAT_MONTHS[month] + ' ' + year;
    batCalDays.innerHTML = '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = firstDay; i > 0; i--) {
      const d = document.createElement('div');
      d.className = 'bat-cal-day bat-cal-other';
      d.textContent = prevLast - i + 1;
      batCalDays.appendChild(d);
    }

    for (let day = 1; day <= lastDate; day++) {
      const d = document.createElement('div');
      d.className = 'bat-cal-day';
      d.textContent = day;
      const thisDate = new Date(year, month, day);
      if (thisDate < today) {
        d.classList.add('bat-cal-disabled');
      } else {
        if (batSelectedDate && day === batSelectedDate.getDate() && month === batSelectedDate.getMonth() && year === batSelectedDate.getFullYear()) {
          d.classList.add('bat-cal-selected');
        }
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
          d.classList.add('bat-cal-today');
        }
        d.addEventListener('click', () => {
          batSelectedDate = new Date(year, month, day);
          if (batTravelDate) {
            batTravelDate.value = batSelectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
          }
          batCalOverlay.classList.remove('active');
        });
      }
      batCalDays.appendChild(d);
    }

    const remaining = (firstDay + lastDate) <= 35 ? 35 - (firstDay + lastDate) : 42 - (firstDay + lastDate);
    for (let day = 1; day <= remaining; day++) {
      const d = document.createElement('div');
      d.className = 'bat-cal-day bat-cal-other';
      d.textContent = day;
      batCalDays.appendChild(d);
    }
  }

  if (batTravelDate) {
    batTravelDate.addEventListener('click', () => {
      batCalOverlay.classList.add('active');
      renderBatCalendar(batCalDate.getFullYear(), batCalDate.getMonth());
    });
  }
  if (batCalOverlay) {
    batCalOverlay.addEventListener('click', (e) => {
      if (e.target === batCalOverlay) batCalOverlay.classList.remove('active');
    });
  }
  const batCalPrev = document.getElementById('bat-cal-prev');
  const batCalNext = document.getElementById('bat-cal-next');
  const batCalToday = document.getElementById('bat-cal-today');
  const batCalClear = document.getElementById('bat-cal-clear');

  if (batCalPrev) {
    batCalPrev.addEventListener('click', () => {
      batCalDate.setMonth(batCalDate.getMonth() - 1);
      renderBatCalendar(batCalDate.getFullYear(), batCalDate.getMonth());
    });
  }
  if (batCalNext) {
    batCalNext.addEventListener('click', () => {
      batCalDate.setMonth(batCalDate.getMonth() + 1);
      renderBatCalendar(batCalDate.getFullYear(), batCalDate.getMonth());
    });
  }
  if (batCalToday) {
    batCalToday.addEventListener('click', () => {
      const t = new Date();
      batSelectedDate = t;
      batCalDate = new Date(t);
      if (batTravelDate) {
        batTravelDate.value = t.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }
      batCalOverlay.classList.remove('active');
    });
  }
  if (batCalClear) {
    batCalClear.addEventListener('click', () => {
      batSelectedDate = null;
      if (batTravelDate) batTravelDate.value = '';
      batCalOverlay.classList.remove('active');
    });
  }

  if (batForm) {
    batForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('bat-name').value.trim();
      const dest = document.getElementById('bat-destination').value;
      const phone = document.getElementById('bat-phone').value.trim();
      const days = document.getElementById('bat-days').value;
      const people = document.getElementById('bat-people').value;
      const date = document.getElementById('bat-travel-date').value.trim();
      let valid = true;

      function fe(wId, eId, cond) {
        document.getElementById(wId).classList.toggle('bat-error-field', !cond);
        document.getElementById(eId).classList.toggle('visible', !cond);
        if (!cond) valid = false;
      }

      fe('bat-field-name', 'bat-name-error', name && /^[A-Za-z\s]+$/.test(name));
      fe('bat-field-destination', 'bat-destination-error', !!dest);
      fe('bat-field-phone', 'bat-phone-error', phone && /^[0-9]{7,15}$/.test(phone));
      fe('bat-field-days', 'bat-days-error', !!days);
      fe('bat-field-people', 'bat-people-error', !!people);
      fe('bat-field-travel-date', 'bat-travel-date-error', !!date);

      if (!valid) {
        showToast('Please fill in all fields correctly');
        return;
      }

      const btn = document.getElementById('bat-submit-btn');
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Details';
        btn.disabled = false;
        closeBAT();
        document.getElementById('bat-ty-name').textContent = name;
        document.getElementById('bat-ty-destination').textContent = dest;
        document.getElementById('bat-ty-phone').textContent = phone;
        document.getElementById('bat-ty-days').textContent = days;
        document.getElementById('bat-ty-people').textContent = people;
        document.getElementById('bat-ty-date').textContent = date;
        setTimeout(() => {
          document.getElementById('bat-ty-overlay').classList.add('active');
          document.body.style.overflow = 'hidden';
        }, 200);
        batForm.reset();
        batSelectedDate = null;
      }, 900);
    });
  }

  const batTyClose = document.getElementById('bat-ty-close');
  const batTyOverlay = document.getElementById('bat-ty-overlay');
  if (batTyClose) {
    batTyClose.addEventListener('click', () => {
      batTyOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  if (batTyOverlay) {
    batTyOverlay.addEventListener('click', (e) => {
      if (e.target === batTyOverlay) {
        batTyOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeBAT();
      if (batCalOverlay) batCalOverlay.classList.remove('active');
      if (batTyOverlay) {
        batTyOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });
}
