const mongoose = require('mongoose');

const socialAnalyticsSnapshotSchema = new mongoose.Schema({
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    platform: { type: String },
    followers: { type: Number },
    reach: { type: Number },
    engagementRate: { type: Number },
    impressions: { type: Number },
    topPosts: [mongoose.Schema.Types.Mixed], // Array of objects
    capturedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SocialAnalyticsSnapshot', socialAnalyticsSnapshotSchema);
