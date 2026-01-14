const express = require('express');
const router = express.Router();
const Tekken8Registration = require('../models/Tekken8Registration');
const multer = require('multer');
const { uploadImage } = require('../services/cloudinaryService');

const upload = multer(); // Memory storage for Cloudinary

// POST /api/tekken8/register
router.post('/register', upload.single('paymentScreenshot'), async (req, res) => {
    try {
        const { fullName, inGameName, email, phoneNumber, couponCode } = req.body;
        const file = req.file;

        // Validation
        if (!fullName || !inGameName || !email || !phoneNumber || !file) {
            return res.status(400).json({ message: 'Please fill in all required fields and attach proof of payment.' });
        }

        // Check for duplicate email or ign
        const existingUser = await Tekken8Registration.findOne({ $or: [{ email }, { inGameName }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Registration with this Email or IGN already exists.' });
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
            inGameName,
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

// GET /api/tekken8/registrations (Admin only - placeholder for now)
router.get('/registrations', async (req, res) => {
    try {
        const registrations = await Tekken8Registration.find().sort({ createdAt: -1 });
        res.json(registrations);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching registrations' });
    }
});

module.exports = router;
