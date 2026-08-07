# Admin Web Application

This folder contains all admin-related files for the Trip On website.

## 📁 Folder Structure

```
webapp/
├── admin-dashboard.html    # Main admin dashboard (Leads Database)
├── admin-login.html        # Admin login page
├── admin-styles.css        # Shared styles for admin pages
├── js/
│   ├── admin-dashboard.js  # Dashboard functionality
│   └── admin-login.js      # Login functionality
├── docs/
│   ├── EDIT-FEATURE.md              # Edit lead feature documentation
│   ├── GENERATE-TICKET-FEATURE.md   # Ticket generation feature docs
│   ├── LEAD-MANAGEMENT-GUIDE.md     # Complete lead management guide
│   ├── QUICK-REFERENCE.md           # Quick reference for admin tasks
│   ├── QUICK-START-GUIDE.md         # Getting started guide
│   └── UPDATED-FEATURES.md          # Latest feature updates
└── README.md               # This file
```

## 🚀 Getting Started

### Admin Login
1. Open `admin-login.html` in your browser
2. Use admin credentials to sign in
3. You'll be redirected to the dashboard

### Admin Dashboard
- View all leads in the database
- Add new leads manually
- Edit existing lead information
- Update lead status (Interested, Follow-up, Converted, etc.)
- Assign leads to team members
- Generate tickets for bookings

## 📖 Documentation

All feature documentation is available in the `docs/` folder:
- **Quick Start**: See `QUICK-START-GUIDE.md`
- **Lead Management**: See `LEAD-MANAGEMENT-GUIDE.md`
- **Feature Guides**: Check individual feature MD files

## 🔗 File Paths

All file paths are relative to the webapp folder:
- CSS: `admin-styles.css`
- JavaScript: `js/admin-dashboard.js`, `js/admin-login.js`
- Assets: `../assets/images/` (parent directory)

## 🛠️ Key Features

1. **Lead Database Management**
   - View, add, edit, and delete leads
   - Filter and search capabilities
   - Status tracking

2. **Lead Status Options**
   - Interested
   - Follow-up
   - Converted
   - Special
   - No Interest

3. **Team Assignment**
   - Assign leads to team members
   - Track lead ownership

4. **Ticket Generation**
   - Generate trip tickets from leads
   - Book a Trip modal integration

## 📝 Notes

- All admin files are now organized in this webapp folder
- The folder structure keeps HTML, CSS, JS, and documentation separate
- Easy to maintain and scale
