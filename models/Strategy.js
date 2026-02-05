const mongoose = require('mongoose');

const strategySchema = new mongoose.Schema({
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    mapName: {
        type: String, // 'Erangel', 'Miramar', 'Sanhok', 'Vikendi', 'Livik', 'Karakin', 'Nusa'
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    objects: {
        type: [mongoose.Schema.Types.Mixed], // Preserve exact structure of objects with all properties
        required: true,
        default: []
    },
    thumbnailUrl: {
        type: String // Cloudinary URL
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Who created it (coach? igl?)
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: ['general', 'rotation', 'drop', 'simulation'],
        default: 'general'
    },
    linkedMapDropId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MapDrop',
        default: null
    }
}, {
    timestamps: true
});

const Strategy = mongoose.model('Strategy', strategySchema);

module.exports = Strategy;
