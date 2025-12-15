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
        // Find the player profile associated with the user
        let player;
        if (req.user.playerId) {
            player = await Player.findById(req.user.playerId);
        } else if (req.user.role === 'player') {
            // Fallback: try to find by some other relation if playerId is missing on user? 
            // For now assume playerId is populated on User creation/login.
            return res.status(404).json({ message: 'Player profile not found linked to user' });
        }

        if (!player) {
            return res.status(404).json({ message: 'Player profile not found' });
        }

        // Find Recruitment Posts that match this player's stats
        // We match: Role (exact) ONLY as requested
        let matches = await RecruitmentPost.find({
            status: 'Open',
            role: player.role
        }).populate('team', 'name logoUrl phoneNumber socialLinks'); // Get team name/logo/contact

        // Experience and Age filters removed as per user request (only Role matches required)

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
            req.user.playerId,
            updateData,
            { new: true }
        );

        if (!player) {
            return res.status(404).json({ message: 'Player profile not found' });
        }

        res.json(player);
    } catch (error) {
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
