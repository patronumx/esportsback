const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const Player = require('../models/Player');
const RecruitmentPost = require('../models/RecruitmentPost');

router.use(protect);
router.use(authorize('player', 'team')); // Allow players (and teams for debug if needed)

// Get matches for a player
router.get('/matches', async (req, res) => {
    try {
        let playerId = req.user.playerId;

        // Self-Healing: If session missing playerId, try to resolve via email
        if (!playerId) {
            const playerByEmail = await Player.findOne({ email: req.user.email });
            if (playerByEmail) {
                console.log(`[Matches] Self-healing: Found player ${playerByEmail._id} for user ${req.user.email}`);
                playerId = playerByEmail._id;

                // Optional: Persist this fix to User model so future logins might be cleaner?
                // Ideally login handles this, but we can do a lazy fix here if User model is available.
                // const User = require('../models/User');
                // await User.findByIdAndUpdate(req.user._id, { playerId: playerId });
            }
        }

        let player;
        if (playerId) {
            player = await Player.findById(playerId);
        }

        if (!player) {
            // Last resort: Create a fresh profile? Or just return 404.
            // For now, consistent with logic, return 404 if TRULY no profile exists.
            return res.status(404).json({ message: 'Player profile not found. Please complete your recruitment profile.' });
        }

        // Find Recruitment Posts that match this player's stats
        let matches = await RecruitmentPost.find({
            status: 'Open',
            role: player.role
        }).populate('team', 'name logoUrl phoneNumber socialLinks');

        res.json({ matches, playerDevice: player.device });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get ALL open recruitment posts (Browse Teams view)
router.get('/all-recruitment-posts', async (req, res) => {
    try {
        const posts = await RecruitmentPost.find({ status: 'Open' })
            .populate('team', 'name logoUrl region phoneNumber') // Populate team details including phone
            .sort({ createdAt: -1 }); // Newest first
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Recruitment Profile
router.put('/recruitment', async (req, res) => {
    try {
        const { role, age, experience, device, phone, instagram, avatarUrl } = req.body;
        const User = require('../models/User'); // Import User model

        let playerId = req.user.playerId;

        // self-healing: If user has no playerId, try to find or create one
        if (!playerId) {
            console.log(`[Recruitment Update] User ${req.user._id} missing playerId. Attempting self-healing...`);

            // Try to find by email
            let player = await Player.findOne({ email: req.user.email });

            if (!player) {
                // Create new Player profile
                console.log(`[Recruitment Update] No existing Player profile found for ${req.user.email}. Creating new one.`);
                player = await Player.create({
                    name: req.user.name,
                    email: req.user.email,
                    ign: req.user.name, // Default IGN to name
                    role: role || 'Player',
                    experience: experience || 'Beginner',
                    device: device,
                    phone: phone,
                    socialLinks: { instagram }
                    // Additional defaults as needed
                });
            } else {
                console.log(`[Recruitment Update] Found existing Player profile ${player._id}. Linking to user.`);
            }

            // Link to User
            playerId = player._id;
            await User.findByIdAndUpdate(req.user._id, { playerId: playerId });

            // Update req.user for consistency in this request if needed (though we use playerId var now)
            req.user.playerId = playerId;
        }

        const updateData = {
            role,
            age,
            experience,
            device,
            phone,
            avatarUrl,
            lookingForTeam: req.body.lookingForTeam !== undefined ? req.body.lookingForTeam : true
        };

        if (instagram !== undefined) {
            updateData['socialLinks.instagram'] = instagram;
        }

        const player = await Player.findByIdAndUpdate(
            playerId,
            updateData,
            { new: true }
        );

        if (!player) {
            return res.status(404).json({ message: 'Player profile not found' });
        }

        res.json(player);
    } catch (error) {
        console.error("Recruitment Update Error:", error);
        res.status(500).json({ message: error.message });
    }
});

// Browse Teams (Public for players)
const Team = require('../models/Team');

router.get('/teams', async (req, res) => {
    try {
        // Fetch all teams, maybe sort by name or creation
        const teams = await Team.find({}).select('name logoUrl game region').sort({ createdAt: -1 });
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Specific Team Details (Public for players)
router.get('/teams/:id', async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
            .select('-password -__v') // Exclude sensitive data
            .populate('roster', 'ign avatarUrl role stats'); // Populate roster details

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
