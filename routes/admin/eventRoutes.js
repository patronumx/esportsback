const express = require('express');
const router = express.Router();
const eventController = require('../../controllers/eventController');
const { auth, authorize } = require('../../middleware/auth');

router.post('/create', auth, authorize('super-admin', 'admin'), eventController.createEvent);
router.put('/:eventId/update', auth, authorize('super-admin', 'admin'), eventController.updateEvent);
router.delete('/:eventId/delete', auth, authorize('super-admin', 'admin'), eventController.deleteEvent);
router.get('/', auth, eventController.getEvents);

module.exports = router;
