const mongoose = require('mongoose');

const matchPlanSchema = new mongoose.Schema({
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
        // REMOVED unique: true to allow multiple plans per team
    },
    tournamentName: {
        type: String,
        required: true,
        trim: true
    },
    dates: {
        type: String, // Allowing flexible string for now e.g. "Jan 10 - Jan 15"
        trim: true
    },
    adminFeedback: {
        type: String,
        trim: true
    },
    matches: [{
        id: Number,
        map: String,

        // --- Core Strategy ---
        activeScenario: { type: String, default: 'A' }, // 'A', 'B', 'C'
        scenarios: {
            A: {
                label: { type: String, default: 'Plan A (Primary)' },
                rotation: String,
                vehicle: String,
                timing: String,
                risk: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' }
            },
            B: {
                label: { type: String, default: 'Plan B (Contingency)' },
                rotation: String,
                vehicle: String,
                timing: String,
                risk: { type: String, enum: ['Low', 'Medium', 'High'], default: 'High' }
            },
            C: {
                label: { type: String, default: 'Plan C (Emergency)' },
                rotation: String,
                vehicle: String,
                timing: String,
                risk: { type: String, enum: ['Low', 'Medium', 'High'], default: 'High' }
            }
        },
        drop: String, // Global for the match
        chokePoints: [String], // "Bridge Camp", etc.

        // --- Live Reference ---
        callouts: [String],
        emergencyProtocols: [String],

        // --- Opponent Intel ---
        opponentPlaystyle: [String], // "Edge", "Aggressive"
        keyPlayerNotes: String,

        // --- Post Match ---
        postMatch: {
            planVsReality: String,
            mistakeTags: [String],
            score: Number
        },

        // Legacy / General
        objectives: String,
        notes: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('MatchPlan', matchPlanSchema);
