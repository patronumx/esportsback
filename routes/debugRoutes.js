const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
    try {
        const dbState = mongoose.connection.readyState;
        const stateMap = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting',
        };

        res.json({
            status: 'online',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            db: {
                state: stateMap[dbState] || 'unknown',
                host: mongoose.connection.host,
                name: mongoose.connection.name
            },
            env: {
                node_env: process.env.NODE_ENV,
                has_mongo_uri: !!process.env.MONGO_URI,
                has_jwt_secret: !!process.env.JWT_SECRET,
                vercel: !!process.env.VERCEL
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
