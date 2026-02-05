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
const PerformanceLog = require('../models/PerformanceLog');
const Tournament = require('../models/Tournament');
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

// Confirm Event Attendance
router.put('/events/:id/confirm', async (req, res) => {
    try {
        const event = await Event.findOneAndUpdate(
            { _id: req.params.id, team: req.user.teamId },
            {
                confirmationStatus: 'Confirmed',
                // notificationSent: false // Optionally reset or keep handling separate
            },
            { new: true }
        );
        if (!event) return res.status(404).json({ message: 'Event not found' });
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

// Add Team Performance
router.post('/performance', async (req, res) => {
    try {
        const { tournamentName, placement, earnings, wins, eliminations, matchesPlayed, date, region } = req.body;

        const performance = await Performance.create({
            team: req.user.teamId,
            tournamentName,
            placement,
            earnings: earnings || 0,
            wins: wins || 0,
            eliminations: eliminations || 0,
            matchesPlayed: matchesPlayed || 0,
            date: date || new Date(),
            region
        });

        // Log
        await AuditLog.create({
            action: 'ADD_PERFORMANCE',
            performedBy: req.user._id,
            targetResource: 'Performance',
            targetId: performance._id,
            details: { tournamentName, placement }
        });

        res.status(201).json(performance);
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
        // Fetch latest snapshot for each platform
        // Simple approach: Find last 5 snapshots for this team (assuming 1 per platform)
        // Better: Aggregate to get latest per platform
        const latestStats = await SocialAnalyticsSnapshot.aggregate([
            { $match: { team: req.user.teamId } },
            { $sort: { capturedAt: -1 } },
            {
                $group: {
                    _id: "$platform",
                    followers: { $first: "$followers" },
                    engagementRate: { $first: "$engagementRate" },
                    reach: { $first: "$reach" },
                    impressions: { $first: "$impressions" },
                    capturedAt: { $first: "$capturedAt" }
                }
            }
        ]);

        const totals = latestStats.reduce((acc, curr) => ({
            totalFollowers: acc.totalFollowers + (curr.followers || 0),
            totalReach: acc.totalReach + (curr.reach || 0),
            avgEngagement: acc.avgEngagement + (curr.engagementRate || 0),
            totalImpressions: acc.totalImpressions + (curr.impressions || 0)
        }), { totalFollowers: 0, totalReach: 0, avgEngagement: 0, totalImpressions: 0 });

        if (latestStats.length > 0) {
            totals.avgEngagement = (totals.avgEngagement / latestStats.length).toFixed(2);
        }

        res.json({
            overview: totals,
            platforms: latestStats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/analytics/history', async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const history = await SocialAnalyticsSnapshot.aggregate([
            {
                $match: {
                    team: req.user.teamId,
                    capturedAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$capturedAt" } },
                    totalFollowers: { $sum: "$followers" },
                    avgEngagement: { $avg: "$engagementRate" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json(history.map(h => ({
            date: h._id,
            followers: h.totalFollowers,
            engagement: parseFloat(h.avgEngagement.toFixed(2))
        })));
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
// Update Manual Roster and Sync to Players
router.post('/roster', async (req, res) => {
    try {
        const { roster } = req.body; // Expecting array of { name, role, ... }
        console.log('Received Roster Sync Request:', JSON.stringify(roster, null, 2));
        const teamId = req.user.teamId;

        // Validate
        if (roster && roster.length > 8) {
            return res.status(400).json({ message: 'Roster cannot exceed 8 players' });
        }

        // 1. Update the legacy 'roster' field (for backward compat if needed, or UI display)
        const team = await Team.findByIdAndUpdate(
            teamId,
            { roster },
            { new: true }
        );

        // 2. Sync to Player Documents
        // Strategy: We will iterate through the roster provided. 
        // We attempt to find existing Players by UID or IGN+Team.
        // If found, update. If not, create.
        // Then we update the Team.players array to match this list.

        const playerIds = [];
        const processedPlayerIds = new Set();

        for (const p of roster) {
            if (!p.name && !p.ign) continue; // Skip empty entries

            let player = null;

            // 1. Try to find by specific ID (Best for updates)
            if (p._id) {
                player = await Player.findById(p._id);
            }

            // 2. Try to find by UID
            if (!player && p.uid) {
                player = await Player.findOne({ team: teamId, uid: p.uid });
            }

            // 3. Try to find by IGN
            if (!player && p.ign) {
                player = await Player.findOne({ team: teamId, ign: p.ign });
            }

            // 4. CRITICAL: Prevent duplicate linking in the same roster
            if (player && processedPlayerIds.has(player._id.toString())) {
                console.log(`[Roster Sync] Conflict: Player ${player.ign} (${player._id}) already processed in this batch. treating as new entry.`);
                player = null; // Force creation of a NEW player for this slot
            }

            const playerData = {
                team: teamId,
                name: p.name || p.ign,
                ign: p.ign || p.name,
                role: p.role,
                uid: p.uid,
                avatarUrl: p.image, // Map image to avatarUrl
                image: p.image,    // Keep consistency
                socialLinks: p.socialLinks || {}
            };
            console.log(`[Roster Sync] Processing Player: ${playerData.name}, Role: ${playerData.role}`);

            if (player) {
                // Update existing
                player = await Player.findByIdAndUpdate(player._id, playerData, { new: true });
            } else {
                // Create new
                player = await Player.create(playerData);
            }

            playerIds.push(player._id);
            processedPlayerIds.add(player._id.toString());
        }

        // 3. Update Team.players relation
        // We replace the players list with the newly synced list. 
        // Note: This effectively removes players from the 'players' array if they were removed from the 'roster' array in UI.
        // However, the actual Player documents remain in DB (orphaned from team list, but still have teamId).
        // Optionally we could unset teamId for removed players, but let's stick to updating the list for now.

        await Team.findByIdAndUpdate(teamId, { players: playerIds });

        // populate players for response
        const updatedTeam = await Team.findById(teamId).populate('players');

        res.json(updatedTeam);
    } catch (error) {
        console.error("Roster Sync Error:", error);
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
                notes,
                schedule,
                // Force Reset Notifications
                notificationSent: false,
                lastNotificationSentAt: null
            },
            { new: true }
        );

        console.log(`[Team Route] Event ${req.params.id} updated. Unconditionally reset notification timer.`);

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



// ... imports

// [Existing code]

// Performance Logging Routes

// Upload Match Result
router.post('/performance/log', upload.single('file'), async (req, res) => {
    try {
        const { tournamentName, category, rank, kills, notes, matchCount, maps } = req.body;

        // Validation
        if (!tournamentName || !rank || !kills) {
            return res.status(400).json({ message: 'Tournament Name, Rank, and Kills are required' });
        }

        const parsedRank = parseInt(rank);
        const parsedKills = parseInt(kills);
        const parsedMatchCount = parseInt(matchCount) || 1;

        let parsedMaps = [];
        if (maps) {
            try {
                parsedMaps = JSON.parse(maps); // Expecting JSON array string from frontend
            } catch (e) {
                parsedMaps = typeof maps === 'string' ? [maps] : maps;
            }
        }

        let screenshotUrl = null;

        if (req.file) {
            const result = await uploadImage(req.file.buffer);
            screenshotUrl = result.secure_url;
        }

        const log = await PerformanceLog.create({
            team: req.user.teamId,
            tournamentName,
            category: category || 'scrim', // Default
            rank: parsedRank,
            kills: parsedKills,
            matchCount: parsedMatchCount,
            maps: parsedMaps,
            screenshotUrl,
            notes
        });

        res.status(201).json(log);
    } catch (error) {
        console.error('Log Upload Error:', error);
        res.status(500).json({ message: 'Failed to save result: ' + error.message });
    }
});


// --- Tournament Management Routes ---

// Create Tournament (and Sync Event)
router.post('/tournament', async (req, res) => {
    try {
        const { name, totalDays, matchesPerDay, mapOrder } = req.body;

        // 1. Create Tournament Config
        const tournament = await Tournament.create({
            team: req.user.teamId,
            name,
            totalDays,
            matchesPerDay,
            mapOrder: mapOrder || []
        });

        // 2. Auto-create Event for Scheduler
        // Generate Schedule
        const schedule = [];
        const startDate = new Date();

        for (let i = 0; i < totalDays; i++) {
            const matches = [];
            for (let j = 0; j < matchesPerDay; j++) {
                matches.push({
                    matchOrder: j + 1,
                    map: (mapOrder && mapOrder[j]) ? mapOrder[j] : 'Erangel', // Use default or Erangel
                    status: 'Pending'
                });
            }

            const dayDate = new Date(startDate);
            dayDate.setDate(startDate.getDate() + i);

            schedule.push({
                day: i + 1,
                date: dayDate,
                matches
            });
        }

        // Import Event model if not already (assuming it's avail in scope or required at top)
        const Event = require('../models/Event');
        await Event.create({
            team: req.user.teamId,
            title: name,
            type: 'tournament',
            startTime: startDate,
            schedule,
            status: 'Upcoming'
        });

        res.status(201).json(tournament);
    } catch (error) {
        console.error("Tournament Creation Error:", error);
        res.status(500).json({ message: 'Failed to create tournament' });
    }
});

// Get Tournaments
router.get('/tournaments', async (req, res) => {
    try {
        const tournaments = await Tournament.find({ team: req.user.teamId }).sort({ createdAt: -1 });
        res.json(tournaments);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tournaments' });
    }
});

// --- Performance Logs ---
router.get('/performance/logs', async (req, res) => {
    try {
        const logs = await PerformanceLog.find({ team: req.user.teamId })
            .sort({ date: -1 })
            .limit(50);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Log
router.delete('/performance/log/:id', async (req, res) => {
    try {
        await PerformanceLog.findOneAndDelete({ _id: req.params.id, team: req.user.teamId });
        res.json({ message: 'Log deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Team Settings (Notifications)
router.put('/settings', async (req, res) => {
    try {
        const { whatsapp, instagram } = req.body;
        const team = await Team.findByIdAndUpdate(
            req.user.teamId,
            {
                'notificationContact.whatsapp': whatsapp,
                'notificationContact.instagram': instagram
            },
            { new: true }
        );
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update settings' });
    }
});

module.exports = router;
