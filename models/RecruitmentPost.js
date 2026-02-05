const mongoose = require('mongoose');

const recruitmentPostSchema = new mongoose.Schema({
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    role: { type: String, required: true },
    experience: { type: String, required: true }, // e.g. '1 Year', '2 Years'
    age: { type: Number }, // Required age (or min age)
    minDevice: { type: String }, // e.g. 'iPhone 11', '90 FPS'
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' }
}, { timestamps: true });

module.exports = mongoose.model('RecruitmentPost', recruitmentPostSchema);
