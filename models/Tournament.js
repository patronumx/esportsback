const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    name: { type: String, required: true },
    totalDays: { type: Number, required: true, default: 1 },
    matchesPerDay: { type: Number, required: true, default: 1 },
    mapOrder: [{ type: String }], // Default maps for matches (e.g. ['Rondo', 'Erangel', ...])
    startDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Tournament', tournamentSchema);
