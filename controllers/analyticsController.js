const SocialAnalytics = require('../models/SocialAnalytics');

// Admin: Get Meta Analytics
exports.getMetaAnalytics = async (req, res) => {
    try {
        // Mock data for now as per spec request for "dummy data"
        const analytics = {
            teamId: req.params.teamId,
            platform: 'Instagram',
            followers: 15000,
            engagementRate: 4.5,
            reach: 50000,
            impressions: 120000,
            postsCount: 45,
            growth: '+12%'
        };
        res.json(analytics);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Admin: Overview
exports.getOverview = async (req, res) => {
    try {
        res.json({
            totalTeams: 40,
            activeEvents: 3,
            totalPlayers: 200,
            pendingFeedback: 5
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
