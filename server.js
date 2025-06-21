import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import session from 'express-session';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'nyay-legal-services-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// In-memory data store (replace with database in production)
let users = [
  { id: '1', email: 'admin@nyay.com', role: 'admin', firstName: 'Admin', lastName: 'User' },
  { id: '2', email: 'advocate@nyay.com', role: 'advocate', firstName: 'Legal', lastName: 'Advocate' },
  { id: '3', email: 'customer@nyay.com', role: 'customer', firstName: 'Customer', lastName: 'User' }
];

// Routes
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// Auth routes
app.post('/api/login', (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);
  
  if (user) {
    req.session.userId = user.id;
    res.json({ success: true, user });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/auth/user', (req, res) => {
  if (req.session.userId) {
    const user = users.find(u => u.id === req.session.userId);
    res.json(user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
  const stats = {
    totalUsers: users.length,
    totalAdvocates: users.filter(u => u.role === 'advocate').length,
    totalCases: '0',
    completedCases: '0',
    monthlyRevenue: '₹0'
  };
  res.json(stats);
});

// Service categories
app.get('/api/service-categories', (req, res) => {
  const categories = [
    { id: 1, name: 'Legal Consultation', description: 'Professional legal advice' },
    { id: 2, name: 'GST Filing', description: 'GST registration and filing services' },
    { id: 3, name: 'ITR Filing', description: 'Income Tax Return filing' },
    { id: 4, name: 'Contract Drafting', description: 'Legal document preparation' }
  ];
  res.json(categories);
});

// Service requests
app.get('/api/service-requests', (req, res) => {
  res.json([]);
});

// Advocates
app.get('/api/advocates', (req, res) => {
  const advocates = users.filter(u => u.role === 'advocate').map(user => ({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    specialization: 'Corporate Law',
    experience: 5,
    rating: 4.8,
    totalReviews: 25,
    languages: ['English', 'Hindi'],
    hourlyRate: 2000,
    isVerified: true
  }));
  res.json(advocates);
});

// Appointments
app.get('/api/appointments', (req, res) => {
  res.json([]);
});

// Mobile APK download
app.get('/nyay-mobile-app.apk', (req, res) => {
  // Serve a placeholder APK file
  res.setHeader('Content-Type', 'application/vnd.android.package-archive');
  res.setHeader('Content-Disposition', 'attachment; filename="nyay-mobile-app.apk"');
  res.send('APK placeholder - Replace with actual APK file');
});

app.listen(PORT, () => {
  console.log(`Nyay Legal Services server running on port ${PORT}`);
});