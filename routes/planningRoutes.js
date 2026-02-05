const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const MatchPlan = require('../models/MatchPlan');

// Protect all routes
router.use(protect);

// @desc    Get ALL plans (Admin)
// @desc    Get ALL plans (Admin)
// @route   GET /api/planning/admin/all
router.get('/admin/all', authorize('admin'), async (req, res) => {
    try {
        const plans = await MatchPlan.find({})
            .populate('team', 'name logoUrl') // Populating from Team model
            .sort({ updatedAt: -1 });
        res.json(plans);
    } catch (error) {
        console.error('Error fetching all plans:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update Admin Feedback for a plan
// @route   PUT /api/planning/admin/feedback/:id
router.put('/admin/feedback/:id', authorize('admin'), async (req, res) => {
    try {
        const { adminFeedback } = req.body;
        const plan = await MatchPlan.findByIdAndUpdate(
            req.params.id,
            { adminFeedback },
            { new: true }
        ).populate('team', 'name logoUrl');

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.json(plan);
    } catch (error) {
        console.error('Error updating feedback:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all plans for the team (Summary)
// @route   GET /api/planning
router.get('/', async (req, res) => {
    try {
        const plans = await MatchPlan.find({ team: req.user.teamId })
            .select('tournamentName dates updatedAt createdAt')
            .sort({ updatedAt: -1 });
        res.json(plans);
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get single plan details
// @route   GET /api/planning/:id
router.get('/:id', async (req, res) => {
    try {
        const plan = await MatchPlan.findOne({ _id: req.params.id, team: req.user.teamId });
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.json(plan);
    } catch (error) {
        console.error('Error fetching plan:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create new plan
// @route   POST /api/planning
router.post('/', async (req, res) => {
    try {
        const { tournamentName, dates, matches } = req.body;

        if (!tournamentName) {
            return res.status(400).json({ message: 'Tournament Name is required' });
        }

        const plan = await MatchPlan.create({
            team: req.user.teamId,
            tournamentName,
            dates,
            matches: matches || []
        });

        res.status(201).json(plan);
    } catch (error) {
        console.error('Error creating plan:', error);
        res.status(500).json({ message: error.message, error: error });
    }
});

// @desc    Update plan
// @route   PUT /api/planning/:id
router.put('/:id', async (req, res) => {
    try {
        const { tournamentName, dates, matches } = req.body;

        const plan = await MatchPlan.findOneAndUpdate(
            { _id: req.params.id, team: req.user.teamId },
            {
                tournamentName,
                dates,
                matches
            },
            { new: true }
        );

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        res.json(plan);
    } catch (error) {
        console.error('Error updating plan:', error);
        res.status(500).json({ message: error.message, error: error });
    }
});

// @desc    Delete plan
// @route   DELETE /api/planning/:id
router.delete('/:id', async (req, res) => {
    try {
        const plan = await MatchPlan.findOneAndDelete({ _id: req.params.id, team: req.user.teamId });
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.json({ message: 'Plan removed' });
    } catch (error) {
        console.error('Error deleting plan:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
