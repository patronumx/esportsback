const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    url: { type: String, required: true }, // Cloudinary URL
    type: { type: String, enum: ['image', 'video'], required: true },
    category: { type: String, enum: ['general', 'interview', 'sponsor'], default: 'general' },
    title: String,
    folder: { type: String, default: 'General' },
    tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);
