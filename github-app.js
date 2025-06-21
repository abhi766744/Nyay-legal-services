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

// Add click handlers for action buttons with realistic functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('action-btn')) {
        const action = e.target.textContent.trim();
        
        if (action.includes('Book Legal Service')) {
            showServiceBookingModal();
        } else if (action.includes('Find Advocates')) {
            showAdvocateSearchModal();
        } else if (action.includes('Schedule Consultation')) {
            showConsultationModal();
        }
    }
});

function showServiceBookingModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Book Legal Service</h3>
            <div class="service-options">
                <div class="service-option" onclick="selectService('GST Filing')">
                    <i class="fas fa-file-invoice"></i>
                    <span>GST Filing - ₹2,500</span>
                </div>
                <div class="service-option" onclick="selectService('ITR Filing')">
                    <i class="fas fa-calculator"></i>
                    <span>ITR Filing - ₹1,800</span>
                </div>
                <div class="service-option" onclick="selectService('Legal Consultation')">
                    <i class="fas fa-gavel"></i>
                    <span>Legal Consultation - ₹3,000</span>
                </div>
                <div class="service-option" onclick="selectService('Contract Drafting')">
                    <i class="fas fa-file-contract"></i>
                    <span>Contract Drafting - ₹5,000</span>
                </div>
            </div>
            <button onclick="closeModal()" class="btn-secondary">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function showAdvocateSearchModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Find Qualified Advocates</h3>
            <div class="advocate-list">
                <div class="advocate-item">
                    <div class="advocate-info">
                        <h4>Advocate Rajesh Sharma</h4>
                        <p>Corporate Law Specialist • 8 years experience</p>
                        <p>Rating: ⭐⭐⭐⭐⭐ (4.9/5) • ₹2,500/hour</p>
                    </div>
                    <button onclick="bookAdvocate('Rajesh Sharma')" class="btn-primary">Book Consultation</button>
                </div>
                <div class="advocate-item">
                    <div class="advocate-info">
                        <h4>Advocate Priya Patel</h4>
                        <p>Tax Law Expert • 6 years experience</p>
                        <p>Rating: ⭐⭐⭐⭐⭐ (4.8/5) • ₹2,200/hour</p>
                    </div>
                    <button onclick="bookAdvocate('Priya Patel')" class="btn-primary">Book Consultation</button>
                </div>
                <div class="advocate-item">
                    <div class="advocate-info">
                        <h4>Advocate Kumar Singh</h4>
                        <p>Criminal Law Specialist • 12 years experience</p>
                        <p>Rating: ⭐⭐⭐⭐⭐ (4.9/5) • ₹3,000/hour</p>
                    </div>
                    <button onclick="bookAdvocate('Kumar Singh')" class="btn-primary">Book Consultation</button>
                </div>
            </div>
            <button onclick="closeModal()" class="btn-secondary">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function showConsultationModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Schedule Consultation</h3>
            <div class="consultation-form">
                <div class="form-group">
                    <label>Select Date</label>
                    <input type="date" id="consultationDate" min="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label>Select Time</label>
                    <select id="consultationTime">
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Consultation Type</label>
                    <select id="consultationType">
                        <option value="video">Video Call - ₹2,000</option>
                        <option value="office">Office Visit - ₹2,500</option>
                        <option value="phone">Phone Call - ₹1,500</option>
                    </select>
                </div>
                <button onclick="scheduleConsultation()" class="btn-primary">Schedule Appointment</button>
            </div>
            <button onclick="closeModal()" class="btn-secondary">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function selectService(serviceName) {
    alert(`Service Selected: ${serviceName}\n\nYour service request has been submitted. Our team will contact you within 24 hours to proceed with the booking.`);
    closeModal();
}

function bookAdvocate(advocateName) {
    alert(`Consultation Booked with ${advocateName}\n\nYour consultation request has been sent. The advocate will contact you within 2 hours to confirm the appointment.`);
    closeModal();
}

function scheduleConsultation() {
    const date = document.getElementById('consultationDate').value;
    const time = document.getElementById('consultationTime').value;
    const type = document.getElementById('consultationType').value;
    
    if (!date) {
        alert('Please select a date for your consultation.');
        return;
    }
    
    alert(`Consultation Scheduled!\n\nDate: ${date}\nTime: ${time}\nType: ${type}\n\nConfirmation details will be sent to your registered email address.`);
    closeModal();
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}