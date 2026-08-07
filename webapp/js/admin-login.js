// Admin Login JavaScript

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation (replace with actual authentication)
    if (email && password) {
        // Simulate login
        console.log('Logging in with:', email);
        
        // Store session (in real app, use proper authentication)
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminEmail', email);
        
        // Redirect to dashboard
        window.location.href = 'admin-dashboard.html';
    } else {
        alert('Please enter both email and password');
    }
});

// Check if already logged in
window.addEventListener('DOMContentLoaded', function() {
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        window.location.href = 'admin-dashboard.html';
    }
});
