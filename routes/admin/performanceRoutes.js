const express = require('express');
const router = express.Router();
const performanceController = require('../../controllers/performanceController');
const { auth, authorize } = require('../../middleware/auth');

router.post('/:teamId/add', auth, authorize('super-admin', 'admin'), performanceController.addPerformance);
router.put('/:performanceId/update', auth, authorize('super-admin', 'admin'), performanceController.updatePerformance);
router.get('/:teamId', auth, performanceController.getTeamPerformance);

module.exports = router;
