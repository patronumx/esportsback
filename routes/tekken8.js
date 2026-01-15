const express = require('express');
const router = express.Router();
const Tekken8Registration = require('../models/Tekken8Registration');
const multer = require('multer');
const { uploadImage } = require('../services/cloudinaryService');

const jwt = require('jsonwebtoken');

// Admin Credentials (Hardcoded for specific event admin usage)
const ADMIN_USER = process.env.TEKKEN_ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.TEKKEN_ADMIN_PASS || 'tekken8admin2026';
const JWT_SECRET = process.env.JWT_SECRET || 'tekken8_secret_key_2026';

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

const upload = multer(); // Memory storage for Cloudinary

// POST /api/tekken8/register
router.post('/register', upload.single('paymentScreenshot'), async (req, res) => {
    try {
        const { fullName, email, phoneNumber, couponCode } = req.body;
        const file = req.file;

        // Validation
        if (!fullName || !email || !phoneNumber || !file) {
            return res.status(400).json({ message: 'Please fill in all required fields and attach proof of payment.' });
        }

        // Check for duplicate email
        const existingUser = await Tekken8Registration.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Registration with this Email already exists.' });
        }

        // Upload to Cloudinary
        let paymentScreenshotUrl = '';
        try {
            const result = await uploadImage(file.buffer);
            paymentScreenshotUrl = result.secure_url;
        } catch (uploadError) {
            console.error('Cloudinary Upload Error:', uploadError);
            return res.status(500).json({ message: 'Failed to upload payment screenshot.' });
        }

        const newRegistration = new Tekken8Registration({
            fullName,
            email,
            phoneNumber,
            couponCode,
            paymentScreenshot: paymentScreenshotUrl
        });

        await newRegistration.save();

        res.status(201).json({ message: 'Registration successful! We will review your entry.', data: newRegistration });
    } catch (err) {
        console.error('Tekken 8 Registration Error:', err);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

// POST /api/tekken8/admin/login
router.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ success: true, token });
    }
    return res.status(401).json({ message: 'Invalid Credentials' });
});

// GET /api/tekken8/registrations (Admin Protected)
router.get('/registrations', verifyAdmin, async (req, res) => {
    try {
        const registrations = await Tekken8Registration.find().sort({ createdAt: -1 });
        res.json(registrations);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching registrations' });
    }
});

module.exports = router;
