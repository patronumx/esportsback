const express = require('express');
const router = express.Router();
const teamController = require('../../controllers/teamController');
const eventController = require('../../controllers/eventController');
const mediaController = require('../../controllers/mediaController');
const performanceController = require('../../controllers/performanceController');
const feedbackController = require('../../controllers/feedbackController');
const analyticsController = require('../../controllers/analyticsController');
const { auth, authorize } = require('../../middleware/auth');

// Middleware to ensure user is a team manager or player
const isTeam = authorize('team-manager');

router.get('/dashboard', auth, isTeam, teamController.getTeamDashboard);
router.get('/events', auth, isTeam, eventController.getTeamEvents);
// router.get('/media', auth, isTeam, mediaController.getTeamMedia); // Reuse getMedia with filters
router.get('/performance', auth, isTeam, (req, res) => {
    // Need to fetch team ID first, similar to dashboard
    // For now redirecting or reusing logic
    res.json({ message: 'Use specific performance endpoint' });
});
router.get('/analytics/meta', auth, isTeam, (req, res) => {
    // Fetch analytics for this team
    res.json({ message: 'Analytics for team' });
});

router.post('/feedback/create', auth, isTeam, feedbackController.createFeedback);

module.exports = router;
