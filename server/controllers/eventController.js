const Event = require('../models/Event');

// Admin: Create Event
exports.createEvent = async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        const event = await newEvent.save();
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Admin: Update Event
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.eventId, req.body, { new: true });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Admin: Delete Event
exports.deleteEvent = async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.eventId);
        res.json({ message: 'Event deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All Events
exports.getEvents = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = { name: { $regex: search, $options: 'i' } };
        }
        const events = await Event.find(query).sort({ startDate: 1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Team: Get Assigned Events
exports.getTeamEvents = async (req, res) => {
    try {
        // Find events assigned to this team OR global events
        // Need to find team ID first based on teamName
        const Team = require('../models/Team');
        const team = await Team.findOne({ name: { $regex: new RegExp(`^${req.user.teamName}$`, 'i') } });

        if (!team) return res.status(404).json({ message: 'Team not found' });

        const events = await Event.find({
            $or: [
                { assignedTeams: team._id },
                { isGlobal: true }
            ]
        }).sort({ startDate: 1 });

        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
