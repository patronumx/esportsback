const Team = require('../models/Team');
const Player = require('../models/Player');

// Admin: Create Team
exports.createTeam = async (req, res) => {
    const { id, name, logo, region, stage, socials } = req.body;
    try {
        const newTeam = new Team({
            id, name, logo, region, stage, socials
        });
        const team = await newTeam.save();
        res.json(team);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Admin: Update Team
exports.updateTeam = async (req, res) => {
    try {
        const team = await Team.findOne({ id: req.params.teamId });
        if (!team) return res.status(404).json({ message: 'Team not found' });

        Object.assign(team, req.body);
        await team.save();
        res.json(team);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Admin: Delete Team
exports.deleteTeam = async (req, res) => {
    try {
        await Team.findOneAndDelete({ id: req.params.teamId });
        res.json({ message: 'Team deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Admin: Add Player to Team
exports.addPlayer = async (req, res) => {
    try {
        const team = await Team.findOne({ id: req.params.teamId });
        if (!team) return res.status(404).json({ message: 'Team not found' });

        const newPlayer = new Player(req.body);
        const player = await newPlayer.save();

        team.players.push(player._id);
        await team.save();

        res.json(player);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All Teams (Public/Admin)
exports.getTeams = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = { name: { $regex: search, $options: 'i' } };
        }
        const teams = await Team.find(query).populate('players');
        res.json(teams);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Team Dashboard (Team Manager)
exports.getTeamDashboard = async (req, res) => {
    try {
        // req.user.teamName is set by auth middleware
        const team = await Team.findOne({ name: { $regex: new RegExp(`^${req.user.teamName}$`, 'i') } })
            .populate('players')
            .populate('events')
            .populate('media');

        if (!team) return res.status(404).json({ message: 'Team not found' });
        res.json(team);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
