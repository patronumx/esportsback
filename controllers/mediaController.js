const Media = require('../models/Media');
const cloudinary = require('../config/cloudinary');
// Helper to upload buffer
const uploadFromBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            { folder: 'esports_media', resource_type: 'auto' },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        const streamifier = require('streamifier');
        streamifier.createReadStream(buffer).pipe(stream);
    });
};

// Admin: Upload Media
exports.uploadMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { type, category, team, event, player, tags } = req.body;

        const result = await uploadFromBuffer(req.file.buffer);

        const newMedia = new Media({
            url: result.secure_url,
            publicId: result.public_id,
            type: type || (result.resource_type === 'video' ? 'Video' : 'Image'),
            category,
            team,
            event,
            player,
            tags: tags ? tags.split(',') : [],
            uploadedBy: req.user.id
        });

        await newMedia.save();

        res.json(newMedia);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Get Media (Filtered)
exports.getMedia = async (req, res) => {
    try {
        const { teamId, eventId, type, search, limit } = req.query;
        const query = {};
        if (teamId) query.team = teamId;
        if (eventId) query.event = eventId;
        if (type) query.type = type;
        if (search) {
            query.$or = [
                { tags: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        let mediaQuery = Media.find(query).sort({ createdAt: -1 });
        if (limit) mediaQuery = mediaQuery.limit(parseInt(limit));

        const media = await mediaQuery;
        res.json(media);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Admin: Delete Media
exports.deleteMedia = async (req, res) => {
    try {
        const media = await Media.findById(req.params.mediaId);
        if (!media) return res.status(404).json({ message: 'Media not found' });

        await cloudinary.uploader.destroy(media.publicId);
        await media.deleteOne();

        res.json({ message: 'Media deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
