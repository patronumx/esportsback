const express = require('express');
const router = express.Router();
const mediaController = require('../../controllers/mediaController');
const { auth, authorize } = require('../../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Memory storage for Cloudinary

router.post('/upload', auth, authorize('super-admin', 'admin'), upload.single('file'), mediaController.uploadMedia);
router.get('/', auth, mediaController.getMedia); // Filter by query params (teamId, eventId, etc.)
router.delete('/:mediaId', auth, authorize('super-admin', 'admin'), mediaController.deleteMedia);

module.exports = router;
