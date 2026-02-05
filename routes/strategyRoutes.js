const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    createStrategy,
    getTeamStrategies,
    getStrategyById,
    updateStrategy,
    deleteStrategy
} = require('../controllers/strategyController');

const router = express.Router();

router.route('/')
    .post(protect, authorize('team', 'admin'), createStrategy)
    .get(protect, authorize('team', 'admin'), getTeamStrategies);

router.route('/:id')
    .get(protect, authorize('team', 'admin'), getStrategyById)
    .put(protect, authorize('team', 'admin'), updateStrategy)
    .delete(protect, authorize('team', 'admin'), deleteStrategy);

module.exports = router;
