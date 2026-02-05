const mongoose = require('mongoose');

const whatsappSessionSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Key name (e.g., 'creds', 'pre-key-1')
    data: { type: mongoose.Schema.Types.Mixed, required: true } // Session data
}, { _id: false }); // We manually set _id, so disable auto-ObjectId

module.exports = mongoose.model('WhatsAppSession', whatsappSessionSchema);
