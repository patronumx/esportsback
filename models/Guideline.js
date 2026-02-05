const mongoose = require('mongoose');

const guidelineSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    content: {
        type: String,
        default: ''
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Guideline', guidelineSchema);
