const mongoose = require('mongoose');

const performanceLogSchema = new mongoose.Schema({
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    tournamentName: {
        type: String,
        // The following line from the instruction snippet is syntactically incorrect as a property of tournamentName.
        // Assuming the intent was to modify tournamentName's definition or add a comment.
        // For faithfulness to the instruction, I'm placing it as provided, but it will result in an invalid schema definition.
        // If the intent was to make tournamentName optional, its 'required' property should be removed or set to false.
        // If the intent was to add a new field named 'tournamentName' with type String, it should be outside this definition.
        // Given the instruction, I'm inserting the new fields after the existing tournamentName field.
        required: true,
        trim: true
    },
    tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament' }, // Link to specific tournament
    day: { type: Number },
    matchNumber: { type: Number },
    category: {
        type: String,
        enum: ['scrim', 'tournament', 'official'],
        default: 'scrim'
    },
    screenshotUrl: {
        type: String,
        // required: true // Made optional for now in case manual entry is allowed without image
    },
    rank: {
        type: Number,
        required: true
    },
    kills: {
        type: Number,
        required: true
    },
    matchCount: {
        type: Number,
        default: 1
    },
    maps: [{
        type: String,
        enum: ['Erangel', 'Miramar', 'Sanhok', 'Rondo']
    }],
    points: { // Can be auto-calculated or manual
        type: Number,
        default: 0
    },
    notes: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const PLACEMENT_POINTS = {
    1: 10,
    2: 6,
    3: 5,
    4: 4,
    5: 3,
    6: 2,
    7: 1,
    8: 1
};

// Auto-calculate points if not provided
performanceLogSchema.pre('save', async function () {
    if (this.points === 0 || this.points === undefined) {
        const placementPts = PLACEMENT_POINTS[this.rank] || 0;
        this.points = this.kills + placementPts;
    }
});

module.exports = mongoose.model('PerformanceLog', performanceLogSchema);
