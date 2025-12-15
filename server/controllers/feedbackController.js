const Feedback = require('../models/Feedback');
const Team = require('../models/Team');

// Team: Create Feedback
exports.createFeedback = async (req, res) => {
    try {
        const team = await Team.findOne({ name: { $regex: new RegExp(`^${req.user.teamName}$`, 'i') } });
        if (!team) return res.status(404).json({ message: 'Team not found' });

        const newFeedback = new Feedback({
            ...req.body,
            team: team._id
        });
        const feedback = await newFeedback.save();
        res.json(feedback);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Admin: Get Pending Feedback
exports.getPendingFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({ status: 'Pending' }).populate('team');
        res.json(feedback);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const { createNotification } = require('./notificationController');

// Admin: Resolve/Respond Feedback
exports.updateFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(req.params.feedbackId, req.body, { new: true });
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

        // Notify Team on Status Change
        if (req.body.status) {
            await createNotification(
                feedback.team,
                'Team',
                'Feedback Status Update',
                `Your feedback "${feedback.subject}" is now ${req.body.status}.`
            );
        }

        res.json(feedback);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
