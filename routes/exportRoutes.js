const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const Team = require('../models/Team');
const Event = require('../models/Event');
const Performance = require('../models/Performance');

router.use(protect);
router.use(authorize('admin', 'moderator'));

// Helper to convert JSON to CSV
const toCSV = (items, fields) => {
    if (!items.length) return '';
    const header = fields.join(',') + '\n';
    const rows = items.map(item => {
        return fields.map(field => {
            let val = item;
            field.split('.').forEach(key => val = val ? val[key] : '');
            return `"${String(val || '').replace(/"/g, '""')}"`;
        }).join(',');
    }).join('\n');
    return header + rows;
};

router.get('/teams', async (req, res, next) => {
    try {
        const teams = await Team.find();
        const csv = toCSV(teams, ['name', 'game', 'region', 'email']);
        res.header('Content-Type', 'text/csv');
        res.attachment('teams.csv');
        res.send(csv);
    } catch (error) {
        next(error);
    }
});

router.get('/events', async (req, res, next) => {
    try {
        const events = await Event.find().populate('team', 'name');
        const csv = toCSV(events, ['title', 'team.name', 'startTime', 'type', 'location', 'status']);
        res.header('Content-Type', 'text/csv');
        res.attachment('events.csv');
        res.send(csv);
    } catch (error) {
        next(error);
    }
});

router.get('/performance', async (req, res, next) => {
    try {
        const performances = await Performance.find().populate('team', 'name');
        const csv = toCSV(performances, ['team.name', 'tournamentName', 'placement', 'earnings', 'date']);
        res.header('Content-Type', 'text/csv');
        res.attachment('performance.csv');
        res.send(csv);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
