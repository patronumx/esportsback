const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage, uploadVideo } = require('../services/cloudinaryService');
const { protect } = require('../middleware/authMiddleware');

const upload = multer(); // Memory storage

router.post('/', protect, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileType = req.file.mimetype.split('/')[0];
        let result;

        if (fileType === 'image') {
            result = await uploadImage(req.file.buffer);
        } else if (fileType === 'video') {
            result = await uploadVideo(req.file.buffer);
        } else {
            return res.status(400).json({ message: 'Unsupported file type' });
        }

        res.json({
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
            resource_type: result.resource_type
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
});

module.exports = router;
