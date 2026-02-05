const mongoose = require('mongoose');

const RotationSchema = new mongoose.Schema({
    teamId: {
        type: String, // 'global' or ObjectId string
        required: true
    },
    mapId: {
        type: String, // erangel, miramar, rondo
        required: true
    },
    objects: [{
        id: String,
        tool: String, // polyline, marker, logo, text...
        x: Number,
        y: Number,
        points: [{ x: Number, y: Number }], // For lines
        radius: Number, // For circles/zones
        bounds: [[Number]], // For rectangles
        color: String,
        text: String, // For text labels
        fontSize: Number, // For text labels
        layer: {
            type: String,
            enum: ['primary', 'alternate', 'emergency'],
            default: 'primary'
        },
        phase: Number,
        logoSrc: String, // For logos
        width: Number, // For logos
        height: Number, // For logos
        rotation: Number, // For logos
        strokeWidth: Number, // For polylines
        dash: [Number], // For flight paths
        properties: Object // Any extra data
    }],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure one rotation plan per team per map
RotationSchema.index({ teamId: 1, mapId: 1 }, { unique: true });

module.exports = mongoose.model('Rotation', RotationSchema);
