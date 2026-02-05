const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: { type: String },
    username: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['super-admin', 'admin', 'moderator', 'team-manager'], default: 'team-manager' },
    teamName: { type: String },
    region: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', adminSchema);
