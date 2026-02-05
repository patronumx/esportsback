const express = require('express');
const router = express.Router();
const Rotation = require('../models/Rotation');
const Team = require('../models/Team');

// Get rotations for a specific team and map
router.get('/:mapId/:teamId', async (req, res) => {
    try {
        const { mapId, teamId } = req.params;
        let rotation = await Rotation.findOne({ mapId, teamId });

        if (!rotation) {
            // Fallback to global default
            rotation = await Rotation.findOne({ mapId, teamId: 'global' });
        }

        if (!rotation) {
            return res.json({ objects: [] });
        }
        res.json(rotation);
    } catch (err) {
        console.error('Error fetching rotations:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Save (Create or Update) rotations
router.post('/save', async (req, res) => {
    try {
        const { teamId, mapId, objects } = req.body;

        if (!teamId || !mapId) {
            return res.status(400).json({ message: 'Missing teamId (or global) or mapId' });
        }

        const rotation = await Rotation.findOneAndUpdate(
            { teamId, mapId },
            {
                teamId,
                mapId,
                objects,
                updatedAt: Date.now()
            },
            { upsert: true, new: true }
        );

        res.json(rotation);
    } catch (err) {
        console.error('Error saving rotations:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
