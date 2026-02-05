const AuditLog = require('../models/AuditLog');

const logAction = (action, targetResource) => {
    return async (req, res, next) => {
        // We hook into the response 'finish' event to log only successful actions or attempts
        res.on('finish', async () => {
            if (res.statusCode >= 200 && res.statusCode < 400) {
                try {
                    const log = new AuditLog({
                        action,
                        performedBy: req.user ? req.user.id : 'System',
                        targetResource,
                        targetId: req.params.id || req.params.teamId || req.params.eventId || req.params.mediaId || req.params.feedbackId || 'N/A',
                        details: JSON.stringify(req.body) // Be careful with sensitive data here
                    });
                    await log.save();
                } catch (err) {
                    console.error('Audit Log Error:', err);
                }
            }
        });
        next();
    };
};

module.exports = logAction;
