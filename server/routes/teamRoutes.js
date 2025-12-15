const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const Team = require('../models/Team');
const Player = require('../models/Player');
const Event = require('../models/Event');
const Media = require('../models/Media');
const Performance = require('../models/Performance');
const RevisionRequest = require('../models/RevisionRequest');
const Notification = require('../models/Notification');
const { generateDummyAnalytics } = require('../services/socialAnalyticsService');
const multer = require('multer');
const { uploadImage, uploadVideo } = require('../services/cloudinaryService');

const upload = multer(); // Memory storage

// Protect all team routes
router.use(protect);
router.use(authorize('team'));

const { generateTeamDashboardStats } = require('../services/dashboardService');
const AuditLog = require('../models/AuditLog');
const SocialAnalyticsSnapshot = require('../models/SocialAnalyticsSnapshot');

// Helper to ensure team accesses only their own data
const ensureTeamAccess = (req, res, next) => {
    if (req.user.teamId.toString() !== req.params.teamId && !req.user.teamId) { // Check if user has teamId
        // Actually, we should just use req.user.teamId for queries instead of params where possible
    }
    next();
};

router.get('/dashboard', async (req, res) => {
    try {
        const teamId = req.user.teamId;
        const dashboardData = await generateTeamDashboardStats(teamId);
        res.json(dashboardData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/events', async (req, res) => {
    try {
        const events = await Event.find({ team: req.user.teamId }).sort({ startTime: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/events/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const event = await Event.findOneAndUpdate(
            { _id: req.params.id, team: req.user.teamId },
            { status },
            { new: true }
        );
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/media', async (req, res) => {
    try {
        const media = await Media.find({ team: req.user.teamId }).sort({ createdAt: -1 });
        res.json(media);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/performance-history', async (req, res) => {
    try {
        const performance = await Performance.find({ team: req.user.teamId }).sort({ date: -1 });
        res.json(performance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/roster', async (req, res) => {
    try {
        const team = await Team.findById(req.user.teamId).populate('players');
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/social-analytics', async (req, res) => {
    try {
        const data = generateDummyAnalytics(req.user.teamId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/analytics/history', async (req, res) => {
    try {
        // Mock history data for now, or fetch from SocialAnalyticsSnapshot if available
        const history = [];
        const today = new Date();
        for (let i = 30; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            history.push({
                date: date.toISOString().split('T')[0],
                followers: 10000 + Math.floor(Math.random() * 5000) + (i * 100),
                engagement: 2.5 + (Math.random() * 1.5)
            });
        }
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/request-revision', async (req, res) => {
    try {
        const request = await RevisionRequest.create({
            team: req.user.teamId,
            ...req.body
        });

        // Log activity
        await AuditLog.create({
            action: 'REQUEST_REVISION',
            performedBy: req.user._id, // Assuming user ID is available, might need to adjust model if it expects Admin ref
            targetResource: 'RevisionRequest',
            targetId: request._id,
            details: { title: req.body.title }
        });

        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/revision-requests', async (req, res) => {
    try {
        const requests = await RevisionRequest.find({ team: req.user.teamId }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/notifications', async (req, res) => {
    try {
        const notifications = await Notification.find({ $or: [{ team: req.user.teamId }, { team: null }] }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/notifications/:id/read', async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/audit-logs', async (req, res) => {
    try {
        const logs = await AuditLog.find({
            $or: [
                { team: req.user.teamId },
                { performedBy: req.user._id, performedByModel: 'User' } // Check if user performed action. Adjust as per AuditLog schema
            ]
        })
            .sort({ timestamp: -1 })
            .limit(20);
        res.json(logs);
    } catch (error) {
        // If AuditLog doesn't exist or query fails, return empty array to not break frontend
        console.error("Audit log fetch error:", error);
        res.json([]);
    }
});

// Update Manual Roster
router.post('/roster', async (req, res) => {
    try {
        const { roster } = req.body; // Expecting array of { name, role, image }

        // Validate if needed (e.g. max 6 players)
        if (roster && roster.length > 6) {
            return res.status(400).json({ message: 'Roster cannot exceed 6 players' });
        }

        const team = await Team.findByIdAndUpdate(
            req.user.teamId,
            { roster },
            { new: true }
        );

        res.json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Scout Players
router.get('/scout', async (req, res) => {
    try {
        const { role, age, experience, search, device } = req.query;

        let query = { lookingForTeam: true }; // Only show players looking for team

        if (role && role !== 'All' && role !== 'Role') {
            query.role = role;
        }

        if (age) {
            query.age = age;
        }

        if (experience && experience !== 'All' && experience !== 'Experience') {
            // Match the start of the string (e.g. "4" matches "4" and "4 Years")
            // Also handle "5+" -> matches "5", "5+", "5 Years" etc.
            const cleanExp = experience.replace(/\D/g, ''); // Extract number "4" from "4 Years"
            if (cleanExp) {
                // Match start, then digit, then either non-digit or end of string
                // Prevents "1" from matching "10"
                query.experience = { $regex: '^' + cleanExp + '(\\D|$)', $options: 'i' };
            } else {
                // Fallback for non-numeric like "Beginner" if we had it
                query.experience = experience;
            }
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { ign: { $regex: search, $options: 'i' } }
            ];
        }

        if (device) {
            query.device = { $regex: device, $options: 'i' };
        }

        const players = await Player.find(query);
        res.json(players);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create Recruitment Post
const RecruitmentPost = require('../models/RecruitmentPost');

router.post('/recruitment', async (req, res) => {
    try {
        const { role, experience, age, minDevice } = req.body;

        const post = await RecruitmentPost.create({
            team: req.user.teamId,
            role,
            experience,
            age,
            minDevice
        });

        // Find matches
        const query = {
            role,
            lookingForTeam: true
        };
        // Team specifies MINIMUM age, so player age must be >= this value
        if (age) query.age = { $gte: age };

        let matchingPlayers = await Player.find(query);

        // Filter by Experience manually
        const requiredExp = parseInt(experience) || 0;
        matchingPlayers = matchingPlayers.filter(player => {
            const playerExp = parseInt(player.experience) || 0;
            return playerExp >= requiredExp;
        });

        // Notify matching players (mock notification logic for now as Player doesn't have User account linking fully clear yet)
        // In a real scenario, we'd look up the User associated with the Player and create a notification for them.
        // For now, we'll return matches to the team.

        res.status(201).json({ post, matches: matchingPlayers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Team's Recruitment Posts
router.get('/recruitment', async (req, res) => {
    try {
        const posts = await RecruitmentPost.find({ team: req.user.teamId }).sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Recruitment Post
router.delete('/recruitment/:id', async (req, res) => {
    try {
        const post = await RecruitmentPost.findOneAndDelete({ _id: req.params.id, team: req.user.teamId });
        if (!post) {
            return res.status(404).json({ message: 'Recruitment post not found' });
        }
        res.json({ message: 'Recruitment post deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Recruitment Status (Close/Open)
router.put('/recruitment/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const post = await RecruitmentPost.findOneAndUpdate(
            { _id: req.params.id, team: req.user.teamId },
            { status },
            { new: true }
        );
        if (!post) {
            return res.status(404).json({ message: 'Recruitment post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Recruitment Post Details
router.put('/recruitment/:id', async (req, res) => {
    try {
        const { role, experience, age, minDevice } = req.body;
        const post = await RecruitmentPost.findOneAndUpdate(
            { _id: req.params.id, team: req.user.teamId },
            { role, experience, age, minDevice },
            { new: true }
        );
        if (!post) {
            return res.status(404).json({ message: 'Recruitment post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create Event (Detailed Schedule)
router.post('/events', async (req, res) => {
    try {
        const { title, type, startTime, endTime, location, notes, totalDays, matchesPerDay, schedule } = req.body;

        // If simple event creation, basic defaults
        let eventSchedule = schedule;

        // If automated generation is requested (optional, can be done on frontend too)
        if (!eventSchedule && totalDays && matchesPerDay) {
            // Logic to generate placeholder schedule could go here, but for now we expect full schedule from frontend
        }

        const event = await Event.create({
            team: req.user.teamId,
            title,
            type,
            startTime,
            endTime,
            location,
            notes,
            schedule: eventSchedule // Save the detailed schedule
        });

        // Log
        await AuditLog.create({
            action: 'CREATE_EVENT',
            performedBy: req.user._id,
            targetResource: 'Event',
            targetId: event._id,
            details: { title }
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Event
router.put('/events/:id', async (req, res) => {
    try {
        const { title, type, startTime, endTime, location, notes, totalDays, matchesPerDay, schedule } = req.body;

        const event = await Event.findOneAndUpdate(
            { _id: req.params.id, team: req.user.teamId },
            {
                title,
                type,
                startTime,
                endTime,
                location,
                notes,
                schedule
            },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Log
        await AuditLog.create({
            action: 'UPDATE_EVENT',
            performedBy: req.user._id,
            targetResource: 'Event',
            targetId: event._id,
            details: { title }
        });

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Event
router.delete('/events/:id', async (req, res) => {
    try {
        const event = await Event.findOneAndDelete({ _id: req.params.id, team: req.user.teamId });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Log
        await AuditLog.create({
            action: 'DELETE_EVENT',
            performedBy: req.user._id,
            targetResource: 'Event',
            targetId: event._id,
            details: { title: event.title }
        });

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Upload Media
router.post('/media', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileType = req.file.mimetype.split('/')[0];
        let result;
        let type;

        if (fileType === 'image') {
            result = await uploadImage(req.file.buffer);
            type = 'image';
        } else if (fileType === 'video') {
            result = await uploadVideo(req.file.buffer);
            type = 'video';
        } else {
            return res.status(400).json({ message: 'Unsupported file type' });
        }

        // Create Media Document
        const media = await Media.create({
            team: req.user.teamId,
            url: result.secure_url,
            type,
            category: req.body.category || 'general',
            title: req.body.title || 'Untitled',
            folder: 'Team Uploads'
        });

        // Link to Team
        await Team.findByIdAndUpdate(req.user.teamId, {
            $push: { media: media._id }
        });

        // Log
        await AuditLog.create({
            action: 'UPLOAD_MEDIA',
            performedBy: req.user._id,
            targetResource: 'Media',
            targetId: media._id,
            details: { type, url: result.secure_url }
        });

        res.status(201).json(media);
    } catch (error) {
        console.error('Media Upload Error:', error);
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
});

// Delete Media
router.delete('/media/:id', async (req, res) => {
    try {
        const media = await Media.findOneAndDelete({ _id: req.params.id, team: req.user.teamId });

        if (!media) {
            return res.status(404).json({ message: 'Media not found' });
        }

        // Remove from Team
        await Team.findByIdAndUpdate(req.user.teamId, {
            $pull: { media: req.params.id }
        });

        // Log
        await AuditLog.create({
            action: 'DELETE_MEDIA',
            performedBy: req.user._id,
            targetResource: 'Media',
            targetId: media._id
        });

        res.json({ message: 'Media deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Team Logo
router.put('/logo', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const result = await uploadImage(req.file);

        const team = await Team.findByIdAndUpdate(
            req.user.teamId,
            { logoUrl: result.secure_url },
            { new: true }
        );

        await AuditLog.create({
            team: req.user.teamId,
            action: 'updated_logo',
            details: 'Updated team logo'
        });

        res.json({ message: 'Logo updated', logoUrl: result.secure_url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/roster/:playerId/photo', upload.single('file'), async (req, res) => {
    try {
        const { playerId } = req.params;
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const result = await uploadImage(req.file);

        const team = await Team.findOneAndUpdate(
            { _id: req.user.teamId, 'roster._id': playerId },
            { $set: { 'roster.$.image': result.secure_url } },
            { new: true }
        );

        if (!team) {
            return res.status(404).json({ message: 'Player not found in roster' });
        }

        await AuditLog.create({
            team: req.user.teamId,
            action: 'updated_player_photo',
            details: `Updated photo for roster member ${playerId}`
        });

        res.json({ message: 'Photo updated', imageUrl: result.secure_url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Team Social Links
router.put('/socials', async (req, res) => {
    try {
        const { instagram, twitter, facebook, discord, tiktok } = req.body;
        const team = await Team.findByIdAndUpdate(
            req.user.teamId,
            {
                $set: {
                    'socialLinks.instagram': instagram,
                    'socialLinks.twitter': twitter,
                    'socialLinks.facebook': facebook,
                    'socialLinks.discord': discord,
                    'socialLinks.tiktok': tiktok
                }
            },
            { new: true }
        );
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Service Requests
router.post('/requests', async (req, res) => {
    try {
        const { type, message } = req.body;
        const ServiceRequest = require('../models/ServiceRequest');

        // Check for pending request of same type
        const existing = await ServiceRequest.findOne({
            team: req.user.teamId,
            type,
            status: 'pending'
        });

        if (existing) {
            return res.status(400).json({ message: 'A pending request for this service already exists.' });
        }

        const request = await ServiceRequest.create({
            team: req.user.teamId,
            user: req.user._id,
            type,
            message
        });

        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
