const express = require('express');
const router = express.Router();
const adminDashboardController = require('../../controllers/adminDashboardController');
const { auth, requireAdmin } = require('../../middleware/auth');

// GET /api/admin/dashboard
router.get('/dashboard', auth, requireAdmin, adminDashboardController.getAdminDashboard);

module.exports = router;
