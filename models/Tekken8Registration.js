const mongoose = require('mongoose');

const tekken8RegistrationSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    couponCode: { type: String },
    paymentScreenshot: { type: String, required: true }, // Cloudinary URL
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Tekken8Registration', tekken8RegistrationSchema);
