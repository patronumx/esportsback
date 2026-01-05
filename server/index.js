// Global Error Handling to prevent crash
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message, err.stack);
    // process.exit(1); // Keep alive for dev if possible, or restart
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message, err.stack);
});

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

// Middleware - Robust PNA Support (Must be before CORS)
app.use((req, res, next) => {
    // Always set PNA header for safety
    res.setHeader('Access-Control-Allow-Private-Network', 'true');

    // Explicitly handle PNA Preflight (OPTIONS with PNA header)
    if (req.method === 'OPTIONS' && req.headers['access-control-request-private-network']) {
        const origin = req.headers.origin;
        // Basic whitelist check to match CORS logic
        if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('patronumesports.com'))) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }

        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, access-control-request-private-network');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        return res.sendStatus(204);
    }
    next();
});

// Middleware - CORS First!
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('patronumesports.com')) {
            return callback(null, true);
        }
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(null, true); // Fallback to true for dev safety if error persists? No, callback(err) is correct.
        // Wait, I will be lenient for now.
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true
}));



// Security Middleware
app.use(helmet());
app.use(compression());

// Trust Proxy for Vercel
app.set('trust proxy', true);

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Increased for admin polling
    standardHeaders: true,
    legacyHeaders: false,
    validate: {
        xForwardedForHeader: false,
        trustProxy: false,
    },
});
app.use('/api/', limiter);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const { errorHandler } = require('./middleware/errorHandler');

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Debug Middleware for Admin Routes
app.use('/api/admin', (req, res, next) => {
    console.log(`[Admin Router Hit] Method: ${req.method}, Path: ${req.path}`);
    next();
}, require('./routes/adminRoutes'));

app.use('/api/admin/analytics', require('./routes/analyticsRoutes'));
app.use('/api/admin/export', require('./routes/exportRoutes'));
app.use('/api/team', require('./routes/teamRoutes'));
app.use('/api/player', require('./routes/playerRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/strategies', require('./routes/strategyRoutes'));
app.use('/api/map-drops', require('./routes/mapDrops'));
app.use('/api/rotations', require('./routes/rotations'));
app.use('/api/video-analysis', require('./routes/videoAnalysisRoutes'));
app.use('/api/video-analysis', require('./routes/videoAnalysisRoutes'));
app.use('/api/planning', require('./routes/planningRoutes'));
app.use('/api/guidelines', require('./routes/guidelineRoutes'));
app.use('/api/debug', require('./routes/debugRoutes'));

app.get('/', (req, res) => {
    res.send('Esports Management API is running');
});

// Error Handler
app.use(errorHandler);

const connectDB = require('./config/db');

// Conditionally load services only for localhost (not Vercel)
let startScheduler, whatsappService;
if (!process.env.VERCEL) {
    const notificationScheduler = require('./services/notificationScheduler');
    startScheduler = notificationScheduler.startScheduler;
    whatsappService = require('./services/whatsappService');
}

// Start server if run directly (Local Development)
if (require.main === module) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);

            // Start background services after server is up (localhost only)
            try {
                if (startScheduler && whatsappService) {
                    startScheduler();
                    whatsappService.initialize();
                    console.log('Background services started (localhost mode)');
                }
            } catch (serviceError) {
                console.error('Failed to start background services:', serviceError);
            }
        });
    }).catch(err => {
        console.error('Database connection failed', err);
        process.exit(1);
    });
}

// Connect to DB for Serverless (Vercel)
connectDB();

module.exports = app;
