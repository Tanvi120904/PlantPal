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

// --- 7. START SERVER WITH SOCKET.IO ---
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your React app URL
    methods: ["GET", "POST"],
  },
});


// --- 8. SOCKET.IO EVENTS ---
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  // Example mock data event
  socket.emit("sensor:update", {
    moisture: Math.floor(Math.random() * 100),
    pump: false,
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// --- 9. RUN SERVER ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
