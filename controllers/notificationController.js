const Notification = require('../models/Notification');

// Create a notification (Internal use)
exports.createNotification = async (recipientId, recipientModel, title, message, type = 'info') => {
    try {
        await Notification.create({
            recipient: recipientId,
            recipientModel,
            title,
            message,
            type
        });
    } catch (err) {
        console.error('Error creating notification:', err);
    }
};

// Get notifications for logged-in user
exports.getNotifications = async (req, res) => {
    try {
        // Determine recipient model based on user role
        // If user has 'teamName', they are a Team (or Team Manager acting as Team)
        // If user has 'role' that is admin/super-admin, they are Admin

        // However, our auth middleware attaches `req.user`.
        // If it's a team manager, `req.user` is the Team document (or similar).
        // If it's an admin, `req.user` is the Admin document.

        // Let's assume req.user._id is the recipient.
        // We need to know if it's an Admin or Team.

        let recipientModel;
        if (req.user.role === 'team-manager') {
            recipientModel = 'Team'; // Or 'User' if we unified? 
            // Wait, Team Manager is a role in Admin schema? Or Team schema?
            // Let's check auth middleware and models.
        } else {
            recipientModel = 'Admin';
        }

        // Actually, let's look at how we distinguish.
        // In `auth.js`, we might be attaching the user.
        // If `req.user.role` exists and is 'team-manager', it might be an Admin doc or Team doc.
        // Let's check `Admin.js` and `Team.js`.

        // Based on previous steps:
        // Admin schema has role: ['super-admin', 'admin', 'moderator', 'team-manager']
        // So they are all in Admin collection?
        // Wait, `Team` model exists.
        // `authController.js` handles login.

        // Let's assume for now we use the ID from req.user.
        // And we might need to pass the model type in the query or infer it.
        // For simplicity, let's try to infer from role.

        const isTeam = req.user.role === 'team-manager';
        recipientModel = isTeam ? 'Team' : 'Admin';
        // Wait, if team manager is an Admin document, then recipientModel is Admin.
        // But if we want to notify the "Team" entity, we might need the Team ID.
        // If the user IS the team manager, they are an Admin doc.
        // But maybe we want to link it to the Team ID?

        // Let's check `Admin.js` again.
        // It has `teamName`.

        // If we want to notify a specific user, we use their Admin ID.
        recipientModel = 'Admin';

        const notifications = await Notification.find({
            recipient: req.user._id,
            recipientModel
        }).sort({ createdAt: -1 });

        res.json(notifications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Mark as read
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        // Check ownership
        if (notification.recipient.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        notification.read = true;
        await notification.save();
        res.json(notification);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Mark all as read
exports.markAllAsRead = async (req, res) => {
    try {
        let recipientModel = req.user.role === 'team-manager' ? 'Admin' : 'Admin'; // Assuming all users are in Admin collection for auth

        await Notification.updateMany(
            { recipient: req.user._id, recipientModel, read: false },
            { $set: { read: true } }
        );
        res.json({ message: 'All marked as read' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
