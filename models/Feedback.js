const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    type: { type: String, enum: ['Revision', 'General', 'Bug'], required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'], default: 'Pending' },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    attachments: [{ type: String }], // URLs to reference media
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, // Or TeamUser
        role: { type: String }, // 'Admin' or 'Team'
        text: { type: String },
        createdAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
