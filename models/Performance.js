const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    tournamentName: { type: String, required: true },
    placement: { type: String },
    date: { type: Date, required: true },
    earnings: { type: Number },
    eliminations: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    matchesPlayed: { type: Number, default: 0 },
    region: { type: String },
    notes: { type: String },
    playerStats: [{
        player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
        ign: { type: String, required: true },
        kills: { type: Number, default: 0 },
        assists: { type: Number, default: 0 },
        deaths: { type: Number, default: 0 },
        matches: { type: Number, default: 0 },
        mvpCount: { type: Number, default: 0 }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Performance', performanceSchema);
