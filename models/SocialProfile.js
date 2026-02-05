const mongoose = require('mongoose');

const socialProfileSchema = new mongoose.Schema({
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    platform: { type: String, enum: ['facebook', 'instagram'], required: true },
    pageId: { type: String },
    accessToken: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('SocialProfile', socialProfileSchema);
