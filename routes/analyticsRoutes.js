const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const Team = require('../models/Team');
const Event = require('../models/Event');
const Media = require('../models/Media');
const RevisionRequest = require('../models/RevisionRequest');
const Performance = require('../models/Performance');

router.use(protect);
router.use(authorize('admin'));

router.get('/overview', async (req, res, next) => {
    try {
        // Teams per Game
        const teamsPerGame = await Team.aggregate([
            { $group: { _id: '$game', count: { $sum: 1 } } }
        ]);

        // Events per Month (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const eventsPerMonth = await Event.aggregate([
            { $match: { startTime: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $month: '$startTime' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Top Active Teams (by events)
        const topActiveTeams = await Event.aggregate([
            { $group: { _id: '$team', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'teams', localField: '_id', foreignField: '_id', as: 'team' } },
            { $unwind: '$team' },
            { $project: { name: '$team.name', count: 1 } }
        ]);

        // Revision Stats
        const revisionStats = await RevisionRequest.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Media Uploads Timeline (Last 6 Months)
        const mediaUploadsTimeline = await Media.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            data: {
                teamsPerGame,
                eventsPerMonth,
                topActiveTeams,
                revisionStats,
                mediaUploadsTimeline
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
