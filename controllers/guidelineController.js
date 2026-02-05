const Guideline = require('../models/Guideline');

// @desc    Get guideline by type
// @route   GET /api/guidelines/:type
// @access  Public (or Protected depending on need, mostly read is public/team, write is admin)
const getGuideline = async (req, res) => {
    try {
        const { type } = req.params;
        const guideline = await Guideline.findOne({ type });

        if (!guideline) {
            // Return empty default if not found, don't 404
            return res.json({ type, content: '' });
        }

        res.json(guideline);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update or Create guideline
// @route   POST /api/guidelines
// @access  Private/Admin
const updateGuideline = async (req, res) => {
    try {
        const { type, content } = req.body;

        if (!type) {
            return res.status(400).json({ message: 'Type is required' });
        }

        // Upsert
        const guideline = await Guideline.findOneAndUpdate(
            { type },
            {
                content,
                updatedBy: req.user._id,
                lastUpdated: Date.now()
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(guideline);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getGuideline,
    updateGuideline
};
