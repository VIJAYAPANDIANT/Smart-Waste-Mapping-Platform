const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');

// Import modular routes
const authRoutes = require('./routes/auth');
const wasteRoutes = require('./routes/waste');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 1. Mount API Routes
app.use('/', authRoutes);
app.use('/', wasteRoutes);

// 2. Handle Static Files (Frontend)
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));



// Conditional listener for local development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`SmartWaste Server is running on http://localhost:${PORT}`);
    });
}

// Export for Vercel
module.exports = app;
