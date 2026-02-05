const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const VideoAnalysis = require('../models/VideoAnalysis');

// @desc    Save new analysis
// @route   POST /api/video-analysis
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { title, videoUrl, annotations, thumbnail } = req.body;

        const analysis = await VideoAnalysis.create({
            user: req.user._id,
            title,
            videoUrl,
            annotations,
            thumbnail
        });

        res.status(201).json(analysis);
    } catch (error) {
        console.error('Error saving analysis:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get user's analyses
// @route   GET /api/video-analysis
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const analyses = await VideoAnalysis.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(analyses);
    } catch (error) {
        console.error('Error fetching analyses:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get analysis by ID
// @route   GET /api/video-analysis/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const analysis = await VideoAnalysis.findById(req.params.id);

        if (!analysis) {
            return res.status(404).json({ message: 'Analysis not found' });
        }

        // Ensure user owns it
        if (analysis.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(analysis);
    } catch (error) {
        console.error('Error fetching analysis:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete analysis
// @route   DELETE /api/video-analysis/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const analysis = await VideoAnalysis.findById(req.params.id);

        if (!analysis) {
            return res.status(404).json({ message: 'Analysis not found' });
        }

        if (analysis.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await analysis.deleteOne();
        res.json({ message: 'Analysis removed' });
    } catch (error) {
        console.error('Error deleting analysis:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
