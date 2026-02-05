const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { adminLogin, teamLogin } = require('../controllers/authController');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', adminLogin);

// @desc    Auth team & get token
// @route   POST /api/auth/team/login
// @access  Public
router.post('/team/login', teamLogin);

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { registerPlayer, registerTeam } = require('../controllers/authController');

// @desc    Register a new player
// @route   POST /api/auth/register/player
// @access  Public
router.post('/register/player', registerPlayer);

// @desc    Register a new team
// @route   POST /api/auth/register/team
// @access  Public
router.post('/register/team', upload.single('logo'), registerTeam);

// @desc    Register a new user (Admin only or initial setup)
// @route   POST /api/auth/register
// @access  Public (for now, should be protected later)
router.post('/register', async (req, res) => {
    const { name, email, password, role, teamId } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            teamId
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
