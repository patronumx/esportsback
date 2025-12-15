const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true }, // Slug-like ID
    game: { type: String, required: true }, // e.g. 'PUBG Mobile', 'Tekken 8'
    logoUrl: { type: String }, // Cloudinary URL
    region: { type: String },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true }, // Contact email
    ownerName: { type: String, required: true },
    socialLinks: {
        instagram: String,
        youtube: String, // Keeping others just in case, but will only populate instagram from UI
        twitch: String,
        tiktok: String,
        facebook: String,
        twitter: String,
        discord: String
    },
    // Relations
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }], // Linked registered players

    // Manual Roster Display (as requested)
    roster: [{
        name: String,
        role: String,
        ign: String, // In-game Name
        uid: String, // In-game UID
        experience: String, // For Staff
        age: String, // For Staff
        socialLinks: {
            instagram: String,
            twitter: String,
            discord: String
        },
        image: String
    }],

    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    media: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
    performances: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Performance' }],

    // Pro Team Flag
    isPro: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
