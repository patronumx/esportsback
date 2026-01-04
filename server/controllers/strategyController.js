const Strategy = require('../models/Strategy');

// @desc    Create a new strategy
// @route   POST /api/strategies
// @access  Private (Team)
const createStrategy = async (req, res) => {
    try {
        const { mapName, title, description, objects, thumbnailUrl, type } = req.body;

        const strategy = new Strategy({
            team: req.user._id, // Assigning to the logged in user/team
            mapName,
            title,
            description,
            objects,
            thumbnailUrl,
            createdBy: req.user._id,
            type: type || 'general'
        });

        // Log what we're saving to debug
        console.log('Saving strategy with objects:', JSON.stringify(objects, null, 2));

        const createdStrategy = await strategy.save();
        res.status(201).json(createdStrategy);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all strategies for the logged in team
// @route   GET /api/strategies
// @access  Private (Team)
const getTeamStrategies = async (req, res) => {
    try {
        const strategies = await Strategy.find({ team: req.user._id }).sort({ updatedAt: -1 });
        res.json(strategies);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get a single strategy
// @route   GET /api/strategies/:id
// @access  Private (Team)
const getStrategyById = async (req, res) => {
    try {
        const strategy = await Strategy.findById(req.params.id);

        if (!strategy) {
            return res.status(404).json({ message: 'Strategy not found' });
        }

        // Ensure ownership
        if (strategy.team.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(strategy);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update a strategy
// @route   PUT /api/strategies/:id
// @access  Private (Team)
const updateStrategy = async (req, res) => {
    try {
        const { mapName, title, description, objects, thumbnailUrl, type } = req.body;
        const strategy = await Strategy.findById(req.params.id);

        if (!strategy) {
            return res.status(404).json({ message: 'Strategy not found' });
        }

        if (strategy.team.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        strategy.mapName = mapName || strategy.mapName;
        strategy.title = title || strategy.title;
        strategy.description = description || strategy.description;
        strategy.objects = objects || strategy.objects;
        strategy.thumbnailUrl = thumbnailUrl || strategy.thumbnailUrl;
        strategy.type = type || strategy.type;

        // Mark objects as modified for Mongoose Mixed type
        if (objects) {
            strategy.markModified('objects');
            console.log('Updating strategy with objects:', JSON.stringify(objects, null, 2));
        }

        const updatedStrategy = await strategy.save();
        res.json(updatedStrategy);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a strategy
// @route   DELETE /api/strategies/:id
// @access  Private (Team)
const deleteStrategy = async (req, res) => {
    try {
        const strategy = await Strategy.findById(req.params.id);

        if (!strategy) {
            return res.status(404).json({ message: 'Strategy not found' });
        }

        if (strategy.team.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await strategy.deleteOne();
        res.json({ message: 'Strategy removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createStrategy,
    getTeamStrategies,
    getStrategyById,
    updateStrategy,
    deleteStrategy
};
