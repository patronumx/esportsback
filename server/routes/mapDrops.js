const express = require('express');
const router = express.Router();
const MapDrop = require('../models/MapDrop');
// Middleware to check admin role - assuming you have one or will basic protect it
// const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get latest map drop state
// @route   GET /api/map-drops/latest
// @access  Public (Teams/Players need to see it)
router.get('/latest', async (req, res) => {
    try {
        // Find the most recently updated map drop
        const mapDrop = await MapDrop.findOne().sort({ updatedAt: -1 }).lean();

        if (!mapDrop) {
            // Return default if nothing exists
            return res.status(200).json({
                mapName: 'ERANGEL',
                objects: []
            });
        }
        res.status(200).json(mapDrop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc   // Get all map drops (Summary for history list)
router.get('/', async (req, res) => {
    try {
        const maps = await MapDrop.find({}, 'title stage day matchNumber mapName updatedAt visibleToTeams')
            .sort({ updatedAt: -1 })
            .lean();
        res.json(maps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create/Update Map Drop
router.post('/', async (req, res) => {
    try {
        // If we want to "update" an existing one by ID, we should probably support that too.
        // For now, the requirement implies "Publishing" a new state or overwriting "Latest".
        // But with history, every "Publish" might be a new entry or updating an existing one.
        // Let's stick to "Create New" for history preservation unless ID is provided.

        const { mapName, objects, visibleToTeams, title, stage, day, matchNumber, id } = req.body;

        let mapDrop;
        if (id) {
            // Update existing
            mapDrop = await MapDrop.findByIdAndUpdate(
                id,
                { mapName, objects, visibleToTeams, title, stage, day, matchNumber },
                { new: true }
            );
        } else {
            // Create new
            mapDrop = new MapDrop({
                mapName,
                objects,
                visibleToTeams,
                title,
                stage,
                day,
                matchNumber
                // updatedBy: req.user._id 
            });
            await mapDrop.save();
        }

        res.status(201).json(mapDrop);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get specific map drop by ID (for loading history)
router.get('/:id', async (req, res) => {
    try {
        const map = await MapDrop.findById(req.params.id).lean();
        if (!map) return res.status(404).json({ message: 'Map not found' });
        res.json(map);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete Map Drop
router.delete('/:id', async (req, res) => {
    try {
        const map = await MapDrop.findByIdAndDelete(req.params.id);
        if (!map) return res.status(404).json({ message: 'Map not found' });
        res.json({ message: 'Map deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
