// --- 1. CORE DEPENDENCIES ---
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const scheduleRoutes = require('./routes/schedule');
const pestRoutes = require('./routes/pest'); // NEW IMPORT

// Note: Your middleware file seems to be named 'auth.js', not 'authMiddleware.js'
// Ensure the path is correct for your project structure.
const protect = require('./middleware/auth'); 

// --- 3. INITIALIZATION ---
dotenv.config();
const app = express();
connectDB();

// --- 4. GLOBAL MIDDLEWARE ---
app.use(express.json());
app.use(cors());

// --- 5. ROUTE IMPORTS ---
const authRoutes = require('./routes/auth');
const plantRoutes = require('./routes/plants'); 
const dashboardRoutes = require('./routes/dashboard');

// --- 6. DEFINE API ENDPOINTS ---
app.use('/api/auth', authRoutes);     
app.use('/api/plants', plantRoutes); 
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/pest', pestRoutes); // NEW ENDPOINT


// ✅ The test protected route has been removed from here.
// Its logic is now correctly placed in routes/auth.js.

// Simple Test Route
app.get('/', (req, res) => {
    res.send('PlantPal API is running successfully.');
});

// --- 7. START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));