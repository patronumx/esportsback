const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    message: {
        type: String
    },
    adminComments: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
