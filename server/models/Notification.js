const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null }, // null for global
    title: { type: String },
    message: { type: String },
    type: { type: String, enum: ['info', 'alert', 'update'], default: 'info' },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
