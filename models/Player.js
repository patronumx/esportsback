const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }, // Optional (Free Agent)
    ign: { type: String, required: true },
    name: { type: String },
    email: { type: String }, // Saved from registration
    role: { type: String }, // e.g. 'IGL', 'Fragger', 'Support'
    avatarUrl: { type: String }, // Cloudinary URL
    experience: { type: String }, // e.g. '1 Year', '2 Years'
    age: { type: Number },
    lookingForTeam: { type: Boolean, default: false },
    device: { type: String }, // e.g. 'iPhone 11', 'Red Magic'
    phone: { type: String }, // Contact number for recruitment
    socialLinks: {
        youtube: String,
        twitch: String,
        tiktok: String,
        instagram: String,
        facebook: String,
        twitter: String,
        discord: String
    },
    stats: {
        kills: Number,
        assists: Number,
        deaths: Number,
        custom: mongoose.Schema.Types.Mixed
    },
    achievements: [{
        title: { type: String, required: true },
        event: { type: String },
        placement: { type: String },
        description: { type: String },
        montageLink: { type: String }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
