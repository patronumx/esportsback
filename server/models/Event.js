const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['tournament', 'scrim', 'media-day', 'meeting'], default: 'scrim' },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    location: { type: String },
    notes: { type: String },
    schedule: [{
        day: { type: Number, required: true },
        date: { type: Date },
        matches: [{
            matchOrder: { type: Number, required: true },
            map: { type: String, required: true },
            time: { type: String }, // Optional specific time for match
            status: { type: String, default: 'Pending' }
        }]
    }],
    status: { type: String, enum: ['Upcoming', 'Completed', 'Cancelled'], default: 'Upcoming' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
