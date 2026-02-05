const Team = require('../models/Team');
const Player = require('../models/Player');
const Event = require('../models/Event');
const Media = require('../models/Media');
const Feedback = require('../models/Feedback'); // Assuming RevisionRequest is Feedback model

exports.getAdminDashboard = async (req, res) => {
    try {
        // Parallelize queries for performance
        const [
            teamCount,
            playerCount,
            openRevisions,
            upcomingEvents,
            recentMedia
        ] = await Promise.all([
            Team.countDocuments(),
            Player.countDocuments(),
            Feedback.countDocuments({ status: 'open' }), // Assuming 'open' status for revisions
            Event.find({ startTime: { $gte: new Date() } })
                .sort({ startTime: 1 })
                .limit(5)
                .populate('team', 'name logo'), // Populate team info
            Media.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('team', 'name')
        ]);

        res.json({
            success: true,
            data: {
                stats: {
                    totalTeams: teamCount,
                    totalPlayers: playerCount,
                    openRevisions: openRevisions
                },
                upcomingEvents,
                recentMedia
            }
        });
    } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
