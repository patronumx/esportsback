const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Player = require('../models/Player');
const Team = require('../models/Team');

exports.adminLogin = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user;
        if (email) {
            user = await User.findOne({ email });
        } else if (username) {
            user = await User.findOne({ username });
        }

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid Credentials' });
        }

        let teamData = null;
        let playerData = null;

        if (user.teamId) {
            teamData = await Team.findById(user.teamId);
        }

        if (user.playerId) {
            playerData = await Player.findById(user.playerId);
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            teamId: teamData ? teamData._id : undefined,
            playerId: playerData ? playerData._id : undefined,
            isPro: teamData ? teamData.isPro : false
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    success: true,
                    data: {
                        token,
                        user: {
                            _id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            teamName: teamData ? teamData.name : undefined,
                            teamId: teamData ? teamData._id : undefined,
                            teamLogo: teamData ? teamData.logoUrl : undefined,
                            isPro: teamData ? teamData.isPro : false,
                            ign: playerData ? playerData.ign : undefined,
                            playerId: playerData ? playerData._id : undefined,
                            avatarUrl: playerData ? playerData.avatarUrl : undefined,
                            // Player specific fields
                            lookingForTeam: playerData ? playerData.lookingForTeam : undefined,
                            experience: playerData ? playerData.experience : undefined,
                            age: playerData ? playerData.age : undefined,
                            device: playerData ? playerData.device : undefined,
                            phone: playerData ? playerData.phone : undefined,
                            socialLinks: playerData ? playerData.socialLinks : undefined,
                            stats: playerData ? playerData.stats : undefined,
                            playerRole: playerData ? playerData.role : undefined
                        }
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, error: 'Server Error: ' + err.message, stack: err.stack });
    }
};

exports.teamLogin = async (req, res) => {
    // For now, teams use the same login mechanism but we can separate if needed.
    // The spec asks for POST /api/auth/team/login
    // We can reuse the logic or add specific team checks.
    return exports.adminLogin(req, res);
};

// Register Player
exports.registerPlayer = async (req, res) => {
    const { fullName, ign, email, password, phone, socialLinks, role, age, experience } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Create User
        user = new User({
            name: fullName,
            email,
            password,
            phone,
            role: 'player'
        });

        const newUser = await user.save();

        // Create Player Profile linked to User (indirectly via logic or direct link if needed later)
        // Here we link User -> Player
        const player = new Player({
            ign,
            name: fullName,
            email, // Save email here as well
            socialLinks,
            role: (role && role !== 'player') ? role : 'Assaulter',
            age: age || null,
            experience: experience || 'Beginner'
            // Team is optional/null for now
        });

        const newPlayer = await player.save();

        // Update User with Player ID
        newUser.playerId = newPlayer._id;
        await newUser.save();

        const payload = {
            id: newUser.id,
            email: newUser.email,
            role: 'player',
            playerId: newPlayer._id
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({
                    success: true,
                    data: {
                        token,
                        user: {
                            _id: newUser.id,
                            name: newUser.name,
                            email: newUser.email,
                            role: 'player',
                            ign: newPlayer.ign,
                            playerId: newPlayer._id,
                            avatarUrl: newPlayer.avatarUrl
                        }
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, error: 'Server Error: ' + err.message });
    }
};

const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Register Team
exports.registerTeam = async (req, res) => {
    // req.body fields (text)
    const { teamName, email, password, phoneNumber, ownerName, instagram, region } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Handle Image Upload
        let logoUrl = '';
        if (req.file) {
            console.log('Starting Cloudinary upload for:', req.file.originalname);
            const uploadFromBuffer = (buffer) => {
                return new Promise((resolve, reject) => {
                    let stream = cloudinary.uploader.upload_stream(
                        { folder: 'esports/teams' },
                        (error, result) => {
                            if (result) {
                                console.log('Cloudinary upload success:', result.secure_url);
                                resolve(result);
                            } else {
                                console.error('Cloudinary upload failed:', error);
                                reject(error);
                            }
                        }
                    );
                    streamifier.createReadStream(buffer).pipe(stream);
                });
            };

            try {
                const result = await uploadFromBuffer(req.file.buffer);
                logoUrl = result.secure_url;
            } catch (error) {
                console.error('Cloudinary Upload Error Details:', error);
                return res.status(500).json({ success: false, message: 'Image upload failed' });
            }
        } else {
            console.log('No file received for upload');
        }

        // Create User
        user = new User({
            name: ownerName, // User name should be Owner's Name
            email,
            password,
            phone: phoneNumber, // Save phone to User model too if desired, or just Team. Using team field here.
            role: 'team'
        });

        const newUser = await user.save();

        // Create Team Profile
        // Generating a simple slug for ID
        const slug = teamName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

        const team = new Team({
            name: teamName,
            id: slug,
            game: 'PUBG Mobile', // Default
            logoUrl: logoUrl, // Saved from Cloudinary
            region: region || 'Global', // Use provided region or default
            phoneNumber,
            email, // Save email to Team model
            ownerName,
            socialLinks: {
                instagram: instagram || ''
            }
        });

        const newTeam = await team.save();

        // Update User with Team ID
        newUser.teamId = newTeam._id;
        await newUser.save();

        const payload = {
            id: newUser.id,
            email: newUser.email,
            role: 'team',
            teamId: newTeam._id
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({
                    success: true,
                    data: {
                        token,
                        user: {
                            _id: newUser.id,
                            name: newUser.name,
                            email: newUser.email,
                            role: 'team',
                            teamName: newTeam.name,
                            teamId: newTeam._id,
                            teamLogo: newTeam.logoUrl
                        }
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, error: 'Server Error: ' + err.message });
    }
};
