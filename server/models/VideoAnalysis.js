const mongoose = require('mongoose');

const videoAnalysisSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    annotations: {
        type: Array,
        default: []
    },
    thumbnail: {
        type: String // Optional: store a thumbnail URL if we generate one
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('VideoAnalysis', videoAnalysisSchema);
