// plantpal-backend/index.js

// --- 1. CORE DEPENDENCIES ---
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const scheduleRoutes = require('./routes/schedule');

// --- 2. SECURITY MIDDLEWARE IMPORT ---
// This must be available before protected routes are defined
const protect = require('./middleware/auth'); 

// --- 3. INITIALIZATION ---
// Load environment variables (MUST be first)
dotenv.config();

// Initialize the Express application instance
const app = express();

// Connect to the database (called after dotenv.config() so it can read MONGO_URI)
connectDB();


// --- 4. GLOBAL MIDDLEWARE ---
app.use(express.json()); // Allows parsing of JSON request body
app.use(cors());         // Allows frontend connection


// --- 5. ROUTE IMPORTS ---
const authRoutes = require('./routes/auth');
const plantRoutes = require('./routes/plants'); 
const dashboardRoutes = require('./routes/dashboard');


// --- 6. DEFINE API ENDPOINTS (Public and Protected) ---

// Map route files to base paths
app.use('/api/auth', authRoutes);    
app.use('/api/plants', plantRoutes); 
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/schedule', scheduleRoutes);

// Test Protected Route (Requires JWT Token in header to succeed)
app.get('/api/user/profile', protect, (req, res) => {
    // req.user is supplied by the 'protect' middleware after token validation
    res.json({ 
        message: `Welcome, ${req.user.email}`,
        userId: req.user._id 
    });
});

// Simple Test Route
app.get('/', (req, res) => {
    res.send('PlantPal API is running successfully.');
});


// --- 7. START SERVER ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));