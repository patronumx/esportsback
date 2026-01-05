const mongoose = require('mongoose');

const mapDropSchema = new mongoose.Schema({
    mapName: {
        type: String,
        required: true,
        enum: ['ERANGEL', 'MIRAMAR', 'RONDO', 'SANHOK', 'VIKENDI']
    },
    objects: [mongoose.Schema.Types.Mixed], // Flexible schema to support logos, zones, polylines etc.
    title: {
        type: String, // Event Name e.g. "PMGC"
        default: ''
    },
    stage: {
        type: String, // e.g. "Gauntlet Stage"
        default: ''
    },
    day: {
        type: String, // e.g. "Day 1"
        default: ''
    },
    matchNumber: {
        type: String, // e.g. "Match 1" or "M1" or "Rondo"
        default: ''
    },
    visibleToTeams: {
        type: Boolean,
        default: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Admin who updated it
    }
}, { timestamps: true });
mapDropSchema.index({ updatedAt: -1 });

// Ensure only one global map state exists per mapName (or just one single latest document?)
// For now, let's assume we just want the "latest" one generally, or latest per mapName.
// Let's create a static method to get the singleton-like latest state.

module.exports = mongoose.model('MapDrop', mapDropSchema);
