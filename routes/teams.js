const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const auth = require('../middleware/auth');

// @route   GET api/teams
// @desc    Get all teams (Admin) or specific team (Team Manager)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        let teams;
        if (req.admin.role === 'admin') {
            teams = await Team.find();
        } else {
            // Case insensitive match for team name
            teams = await Team.find({
                name: { $regex: new RegExp(`^${req.admin.teamName}$`, 'i') }
            });
        }
        res.json(teams);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/teams
// @desc    Create a new team
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
    if (req.admin.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { id, name, logo, region, stage, players } = req.body;

    try {
        const newTeam = new Team({
            id,
            name,
            logo,
            region,
            stage,
            players
        });

        const team = await newTeam.save();
        res.json(team);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/teams/:id
// @desc    Update a team
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { name, logo, region, stage, players } = req.body;

    try {
        let team = await Team.findOne({ id: req.params.id });

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Check permissions
        if (req.admin.role !== 'admin') {
            // Team managers can only update their own team
            if (team.name.toLowerCase() !== req.admin.teamName.toLowerCase()) {
                return res.status(403).json({ message: 'Access denied. You can only edit your own team.' });
            }
            // Optional: Prevent team managers from changing critical fields like ID, Name, Region if desired
            // For now, we allow updating players primarily
        }

        team.name = name || team.name;
        team.logo = logo || team.logo;
        team.region = region || team.region;
        team.stage = stage || team.stage;
        team.players = players || team.players;

        await team.save();
        res.json(team);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
