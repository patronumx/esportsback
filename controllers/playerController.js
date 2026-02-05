const Player = require('../models/Player');
const Team = require('../models/Team');

// Get all players with search
exports.getPlayers = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const players = await Player.find(query);
        res.json(players);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Admin: Update Player
exports.updatePlayer = async (req, res) => {
    try {
        const player = await Player.findByIdAndUpdate(req.params.playerId, req.body, { new: true });
        if (!player) return res.status(404).json({ message: 'Player not found' });
        res.json(player);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Admin: Delete Player
exports.deletePlayer = async (req, res) => {
    try {
        const player = await Player.findById(req.params.playerId);
        if (!player) return res.status(404).json({ message: 'Player not found' });

        // Remove from Team
        await Team.updateMany(
            { players: player._id },
            { $pull: { players: player._id } }
        );

        await player.deleteOne();
        res.json({ message: 'Player deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
