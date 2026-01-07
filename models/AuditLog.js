const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    action: { type: String, required: true }, // e.g., "CREATE_TEAM", "DELETE_PLAYER"
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    targetResource: { type: String }, // e.g., "Team", "Event"
    targetId: { type: mongoose.Schema.Types.ObjectId },
    details: { type: mongoose.Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
