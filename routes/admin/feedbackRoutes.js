const express = require('express');
const router = express.Router();
const feedbackController = require('../../controllers/feedbackController');
const { auth, authorize } = require('../../middleware/auth');

router.get('/pending', auth, authorize('super-admin', 'admin'), feedbackController.getPendingFeedback);
router.post('/:feedbackId/respond', auth, authorize('super-admin', 'admin'), feedbackController.updateFeedback);
router.post('/:feedbackId/resolve', auth, authorize('super-admin', 'admin'), feedbackController.updateFeedback);

module.exports = router;
