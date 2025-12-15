const Team = require('../models/Team');
const Event = require('../models/Event');
const Media = require('../models/Media');
const Performance = require('../models/Performance');
const Notification = require('../models/Notification');
const Player = require('../models/Player');

// Helper to generate random numbers within a range
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateTeamDashboardStats = async (teamId) => {
    const team = await Team.findById(teamId).populate('players');
    const players = team?.players || [];

    // Real DB Data
    const upcomingEvents = await Event.find({ team: teamId, startTime: { $gte: new Date() }, status: 'Upcoming' }).limit(5).sort({ startTime: 1 });
    const recentMedia = await Media.find({ team: teamId }).limit(5).sort({ createdAt: -1 });
    const recentPerformance = await Performance.findOne({ team: teamId }).sort({ date: -1 });
    const unreadNotifications = await Notification.countDocuments({ $or: [{ team: teamId }, { team: null }], isRead: false });

    // Real DB Data Aggregation
    const mediaCount = await Media.aggregate([
        { $match: { team: team._id } },
        { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Count specific tags for Interviews and Sponsor Clips
    const tagCounts = await Media.aggregate([
        { $match: { team: team._id } },
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } }
    ]);

    const getTagCount = (tag) => tagCounts.find(t => t._id.toLowerCase() === tag.toLowerCase())?.count || 0;

    const reelsCount = mediaCount.find(m => m._id === 'video')?.count || 0;
    const photosCount = mediaCount.find(m => m._id === 'image')?.count || 0;
    const interviewsCount = getTagCount('interview');
    const sponsorClipsCount = getTagCount('sponsor');

    // Mapping DB types to Dashboard Home cards
    const home = {
        reels: reelsCount,
        photos: photosCount,
        interviews: interviewsCount,
        sponsorClips: sponsorClipsCount,
    };

    // Content Log - Real Media Items
    const contentLog = recentMedia.map(media => ({
        id: media._id,
        title: media.title,
        status: media.status || 'posted', // Default to posted if status missing
        link: media.url,
        date: media.createdAt
    }));

    // Sponsor Exposure - Aggregating top tags as "Sponsors"
    // Filter out common non-sponsor tags if needed, for now taking top 5 tags that are NOT 'interview' or 'sponsor'
    const sponsorExposure = tagCounts
        .filter(t => !['interview', 'sponsor', 'highlight', 'clip'].includes(t._id.toLowerCase()))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(t => ({
            brand: t._id.charAt(0).toUpperCase() + t._id.slice(1),
            type: 'Partner', // Placeholder type
            appearances: t.count
        }));

    // Player Visibility - Checking player names in tags
    const playerVisibility = players.map(player => {
        const mentionCount = getTagCount(player.ign) + getTagCount(player.name);
        return {
            name: player.ign || player.name,
            views: `${randomInt(1, 10)}K`, // Mock views for now
            match: mentionCount > 5 ? 'High' : mentionCount > 2 ? 'Medium' : 'Low',
            sponsorMatches: mentionCount,
            profileImage: player.avatarUrl
        };
    }).sort((a, b) => b.sponsorMatches - a.sponsorMatches).slice(0, 5);

    // Keep Social Insights Mocked but slightly dynamic
    const socialInsights = {
        totalEngagement: `${(reelsCount * 1.5 + photosCount * 0.5).toFixed(1)}K`, // Rough estimate based on content
        bestPerformingClip: recentMedia[0]?.title || 'No recent content',
        growth: `+${randomInt(5, 15)}%`,
        avgViewsPerPost: `${randomInt(10, 50)}K`,
        topPlatform: 'Instagram'
    };

    return {
        home,
        contentLog,
        sponsorExposure,
        socialInsights,
        playerVisibility,
        recentTournaments: [],
        upcomingEvents: upcomingEvents.map(e => ({
            id: e._id,
            name: e.title,
            date: e.startTime,
            opponent: e.notes || 'TBD', // Using notes as opponent/details for now
            status: e.status
        })),
        recentPerformance: recentPerformance ? {
            tournament: recentPerformance.tournamentName,
            placement: recentPerformance.placement,
            eliminations: recentPerformance.eliminations,
            matches: recentPerformance.matchesPlayed
        } : null,
        unreadNotifications,
        teamRoster: players, // Keeping for backward compat if needed
        activeRoster: team.roster || [] // The manual roster with new fields
    };
};

module.exports = {
    generateTeamDashboardStats
};
