const express = require('express');
const router = express.Router();
const analyticsController = require('../../controllers/analyticsController');
const { auth, authorize } = require('../../middleware/auth');

router.get('/meta/:teamId', auth, authorize('super-admin', 'admin'), analyticsController.getMetaAnalytics);
router.get('/overview', auth, authorize('super-admin', 'admin'), analyticsController.getOverview);

module.exports = router;
