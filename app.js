// Nyay Legal Services - Frontend JavaScript

let currentUser = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    setupEventListeners();
});

function setupEventListeners() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth/user');
        if (response.ok) {
            const user = await response.json();
            currentUser = user;
            showDashboard();
        } else {
            showLogin();
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        showLogin();
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('emailSelect').value;
    
    if (!email) {
        alert('Please select a role');
        return;
    }
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        const result = await response.json();
        
        if (result.success) {
            currentUser = result.user;
            showDashboard();
            loadDashboardData();
        } else {
            alert('Login failed. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please check your connection.');
    }
}

function showLogin() {
    document.getElementById('loginPage').classList.add('active');
    document.getElementById('dashboardPage').classList.remove('active');
}

function showDashboard() {
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('dashboardPage').classList.add('active');
    
    if (currentUser) {
        updateUserInfo();
        showRoleDashboard();
    }
}

function updateUserInfo() {
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');
    
    if (userName && currentUser) {
        userName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }
    
    if (userRole && currentUser) {
        userRole.textContent = currentUser.role;
        userRole.className = `role-badge ${currentUser.role}`;
    }
}

function showRoleDashboard() {
    // Hide all dashboards
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('advocateDashboard').style.display = 'none';
    document.getElementById('customerDashboard').style.display = 'none';
    
    // Show appropriate dashboard
    if (currentUser) {
        const dashboardId = currentUser.role + 'Dashboard';
        const dashboard = document.getElementById(dashboardId);
        if (dashboard) {
            dashboard.style.display = 'block';
        }
    }
}

async function loadDashboardData() {
    try {
        // Load dashboard stats
        const statsResponse = await fetch('/api/dashboard/stats');
        if (statsResponse.ok) {
            const stats = await statsResponse.json();
            updateDashboardStats(stats);
        }
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    }
}

function updateDashboardStats(stats) {
    // Update stats based on current user role
    if (currentUser.role === 'admin') {
        updateElement('totalUsers', stats.totalUsers || 0);
        updateElement('totalAdvocates', stats.totalAdvocates || 0);
        updateElement('monthlyRevenue', stats.monthlyRevenue || '₹0');
    } else if (currentUser.role === 'advocate') {
        updateElement('totalCases', stats.totalCases || 0);
        updateElement('totalClients', stats.totalClients || 0);
        updateElement('monthlyEarnings', stats.monthlyEarnings || '₹0');
    } else if (currentUser.role === 'customer') {
        updateElement('activeServices', stats.activeServices || 0);
        updateElement('upcomingAppointments', stats.upcomingAppointments || 0);
        updateElement('totalDocuments', stats.totalDocuments || 0);
    }
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

async function logout() {
    try {
        await fetch('/api/logout', { method: 'POST' });
        currentUser = null;
        showLogin();
    } catch (error) {
        console.error('Logout error:', error);
        // Still show login page even if logout request fails
        showLogin();
    }
}