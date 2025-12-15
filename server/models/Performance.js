const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    tournamentName: { type: String, required: true },
    placement: { type: String },
    date: { type: Date, required: true },
    earnings: { type: Number },
    eliminations: { type: Number, default: 0 },
    matchesPlayed: { type: Number, default: 0 },
    region: { type: String },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Performance', performanceSchema);
