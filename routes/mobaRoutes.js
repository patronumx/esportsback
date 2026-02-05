const express = require('express');
const router = express.Router();
const MobaRegistration = require('../models/MobaRegistration');

const HokRegistration = require('../models/HokRegistration');

const jwt = require('jsonwebtoken');

// Admin Credentials
const ADMIN_USER = process.env.MOBA_ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.MOBA_ADMIN_PASS || 'moba2026';
const JWT_SECRET = process.env.JWT_SECRET || 'moba_secret_key_2026';

// Middleware for Admin Auth
const verifyAdmin = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

console.log('[MobaRoutes] Loaded');

// Login Route
router.post('/admin/login', (req, res) => {
    console.log('[MobaRoutes] Login attempt:', req.body);
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ success: true, token });
    }
    return res.status(401).json({ message: 'Invalid Credentials' });
});


// Register a team
router.post('/register', async (req, res) => {
    try {
        const { teamName, country, game, players, substitutes } = req.body;

        // Validation for required fields is handled by Mongoose model, but we can add extra checks if needed
        if (!teamName || !country || !game || !players || players.length !== 5) {
            return res.status(400).json({ message: 'All fields are required, including 5 main players.' });
        }

        let newRegistration;
        if (game === 'HOK') {
            newRegistration = new HokRegistration({
                teamName,
                country,
                game,
                players,
                substitutes
            });
        } else {
            newRegistration = new MobaRegistration({
                teamName,
                country,
                game,
                players,
                substitutes
            });
        }

        await newRegistration.save();

        res.status(201).json({ message: 'Registration successful!', registration: newRegistration });
    } catch (error) {
        console.error('MOBA Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
});

// Get MLBB registrations
router.get('/mlbb/registrations', verifyAdmin, async (req, res) => {
    try {
        const registrations = await MobaRegistration.find({ game: 'MLBB' }).sort({ createdAt: -1 });
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching MLBB registrations' });
    }
});

// Get HOK registrations
router.get('/hok/registrations', verifyAdmin, async (req, res) => {
    try {
        const registrations = await HokRegistration.find().sort({ createdAt: -1 });
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching HOK registrations' });
    }
});

// Get all registrations (Legacy/Admin support)
router.get('/', verifyAdmin, async (req, res) => {
    try {
        const { game } = req.query;
        if (game === 'HOK') {
            const registrations = await HokRegistration.find().sort({ createdAt: -1 });
            return res.json(registrations);
        }

        // Default to MobaRegistration (MLBB)
        const registrations = await MobaRegistration.find(game ? { game } : {}).sort({ createdAt: -1 });
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching registrations' });
    }
});


// WhatsApp Service
let whatsappService;
try {
    whatsappService = require('../services/whatsappService');
} catch (e) {
    console.warn('WhatsApp Service not available in this environment');
}

// ... (Rest of imports matching existing file until routes)

// Generic Helper to get Model based on Game Param (handled via route params)
const getModel = (game) => {
    return (game && game.toLowerCase() === 'hok') ? HokRegistration : MobaRegistration;
};

// ==========================================
// SHARED ADMIN ROUTES (MLBB & HOK)
// ==========================================

// DELETE /:game/registration/:id
router.delete('/:game/registration/:id', verifyAdmin, async (req, res) => {
    try {
        const Model = getModel(req.params.game);
        const deletedRegistration = await Model.findByIdAndDelete(req.params.id);

        if (!deletedRegistration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        res.json({ message: 'Registration deleted successfully' });
    } catch (err) {
        console.error('Delete Error:', err);
        res.status(500).json({ message: 'Failed to delete registration' });
    }
});

// PUT /:game/registration/:id
router.put('/:game/registration/:id', verifyAdmin, async (req, res) => {
    try {
        const Model = getModel(req.params.game);
        // We update the whole body, assuming the frontend sends the correct structure
        const updatedRegistration = await Model.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedRegistration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        res.json(updatedRegistration);
    } catch (err) {
        console.error('Update Error:', err);
        res.status(500).json({ message: 'Failed to update registration' });
    }
});

// GET /:game/admin/whatsapp/status
router.get('/:game/admin/whatsapp/status', verifyAdmin, (req, res) => {
    if (!whatsappService) {
        return res.status(503).json({ message: 'WhatsApp Service Unavailable' });
    }
    try {
        const status = whatsappService.getStatus();
        if (status.status === 'disconnected') {
            whatsappService.initialize().catch(err => console.error('Auto-init failed:', err));
        }
        res.json(status);
    } catch (e) {
        console.error('Status Error:', e);
        res.status(500).json({ message: 'Error fetching status', error: e.message });
    }
});

// POST /:game/admin/notify
router.post('/:game/admin/notify', verifyAdmin, async (req, res) => {
    const { phoneNumber, message, registrationId } = req.body;
    const Model = getModel(req.params.game);

    if (!phoneNumber || !message) {
        return res.status(400).json({ message: 'Phone number and message are required' });
    }

    if (!whatsappService) {
        return res.status(503).json({ message: 'WhatsApp Service Unavailable' });
    }

    try {
        const result = await whatsappService.sendMessage(phoneNumber, message);

        if (registrationId) {
            await Model.findByIdAndUpdate(registrationId, { isVerified: true });
        }

        res.json({ success: true, result });
    } catch (err) {
        console.error('WhatsApp Notification Error:', err);
        if (err.message === 'WhatsApp client is not ready') {
            return res.status(503).json({ message: 'WhatsApp Client Not Ready', error: err.message });
        }
        res.status(500).json({ message: 'Failed to send WhatsApp message', error: err.message });
    }
});

module.exports = router;
