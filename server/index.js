const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(compression());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Middleware
app.use(cors({
    origin: true,        // allow ngrok + localhost dynamically
    credentials: true    // REQUIRED for login/session
}));

app.use(express.json());

const { errorHandler } = require('./middleware/errorHandler');

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/admin/analytics', require('./routes/analyticsRoutes'));
app.use('/api/admin/export', require('./routes/exportRoutes'));
app.use('/api/team', require('./routes/teamRoutes'));
app.use('/api/player', require('./routes/playerRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

app.get('/', (req, res) => {
    res.send('Esports Management API is running');
});

// Error Handler
app.use(errorHandler);

const connectDB = require('./config/db');

// Start server if run directly (Local Development)
if (require.main === module) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }).catch(err => {
        console.error('Database connection failed', err);
        process.exit(1);
    });
}

module.exports = app;
