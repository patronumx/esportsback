const express = require('express');
const router = express.Router();
const { getGuideline, updateGuideline } = require('../controllers/guidelineController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get is public (or protected, we'll keep it open for now so teams can read it easily)
router.get('/:type', getGuideline);

// Update is Admin only
router.post('/', protect, authorize('admin'), updateGuideline);

module.exports = router;
