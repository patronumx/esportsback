const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema({
    actorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    actorName: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    targetType: {
        type: String,
        enum: ['team', 'player', 'event', 'media', 'performance', 'revision', 'system'],
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    details: {
        type: Object,
        required: false
    },
    ipAddress: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SystemLog', systemLogSchema);
