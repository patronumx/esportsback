const Performance = require('../models/Performance');

// Admin: Add Performance
exports.addPerformance = async (req, res) => {
    try {
        const newPerformance = new Performance({
            ...req.body,
            team: req.params.teamId
        });
        const performance = await newPerformance.save();
        res.json(performance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Admin: Update Performance
exports.updatePerformance = async (req, res) => {
    try {
        const performance = await Performance.findByIdAndUpdate(req.params.performanceId, req.body, { new: true });
        if (!performance) return res.status(404).json({ message: 'Performance record not found' });
        res.json(performance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Team Performance
exports.getTeamPerformance = async (req, res) => {
    try {
        const performance = await Performance.find({ team: req.params.teamId }).sort({ date: -1 });
        res.json(performance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
