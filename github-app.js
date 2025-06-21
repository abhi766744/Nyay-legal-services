// Nyay Legal Services - GitHub Pages Version (Client-Side Only)

let currentUser = null;

// Mock data for GitHub Pages deployment (since no backend)
const mockUsers = [
  { id: '1', email: 'admin@nyay.com', role: 'admin', firstName: 'Admin', lastName: 'User' },
  { id: '2', email: 'advocate@nyay.com', role: 'advocate', firstName: 'Legal', lastName: 'Advocate' },
  { id: '3', email: 'customer@nyay.com', role: 'customer', firstName: 'Customer', lastName: 'User' }
];

const mockStats = {
  admin: {
    totalUsers: 156,
    totalAdvocates: 23,
    monthlyRevenue: '₹2,45,000'
  },
  advocate: {
    totalCases: 12,
    totalClients: 45,
    monthlyEarnings: '₹85,000'
  },
  customer: {
    activeServices: 3,
    upcomingAppointments: 2,
    totalDocuments: 8
  }
};

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

function checkAuthStatus() {
    // Check localStorage for saved user
    const savedUser = localStorage.getItem('nyay_current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    } else {
        showLogin();
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('emailSelect').value;
    
    if (!email) {
        alert('Please select a role');
        return;
    }
    
    // Find user in mock data
    const user = mockUsers.find(u => u.email === email);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('nyay_current_user', JSON.stringify(user));
        showDashboard();
        loadDashboardData();
    } else {
        alert('Login failed. Please try again.');
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
        loadDashboardData();
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

function loadDashboardData() {
    if (!currentUser) return;
    
    const stats = mockStats[currentUser.role];
    if (stats) {
        updateDashboardStats(stats);
    }
}

function updateDashboardStats(stats) {
    // Update stats based on current user role
    if (currentUser.role === 'admin') {
        updateElement('totalUsers', stats.totalUsers);
        updateElement('totalAdvocates', stats.totalAdvocates);
        updateElement('monthlyRevenue', stats.monthlyRevenue);
    } else if (currentUser.role === 'advocate') {
        updateElement('totalCases', stats.totalCases);
        updateElement('totalClients', stats.totalClients);
        updateElement('monthlyEarnings', stats.monthlyEarnings);
    } else if (currentUser.role === 'customer') {
        updateElement('activeServices', stats.activeServices);
        updateElement('upcomingAppointments', stats.upcomingAppointments);
        updateElement('totalDocuments', stats.totalDocuments);
    }
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function logout() {
    localStorage.removeItem('nyay_current_user');
    currentUser = null;
    showLogin();
}

// Add click handlers for action buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('action-btn')) {
        const action = e.target.textContent.trim();
        alert(`${action} feature coming soon!\n\nThis is a demo version of Nyay Legal Services platform.`);
    }
});