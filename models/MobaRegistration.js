const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ign: { type: String, required: true },
    phone: { type: String, required: true },
    serverId: { type: String, required: true },
    deviceName: { type: String, required: true }
});

const mobaRegistrationSchema = new mongoose.Schema({
    teamName: { type: String, required: true },
    country: { type: String, required: true },
    game: { type: String, enum: ['HOK', 'MLBB'], required: true },
    players: {
        type: [playerSchema],
        validate: [arrayLimit, '{PATH} must have exactly 5 players']
    },
    substitutes: {
        type: [playerSchema],
        default: []
    },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

function arrayLimit(val) {
    return val.length === 5;
}

module.exports = mongoose.model('MobaRegistration', mobaRegistrationSchema);
