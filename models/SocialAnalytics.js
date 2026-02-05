const mongoose = require('mongoose');

const socialAnalyticsSchema = new mongoose.Schema({
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    platform: { type: String, enum: ['Instagram', 'Facebook', 'Twitter', 'YouTube', 'TikTok'], required: true },
    followers: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    postsCount: { type: Number, default: 0 },
    data: { type: mongoose.Schema.Types.Mixed }, // Flexible field for raw API data
    fetchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SocialAnalytics', socialAnalyticsSchema);
