const express = require('express');
const router = express.Router();
const {
  getAttendeeDashboard,
  getOrganizerDashboard,
  getAdminDashboard,
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

// All dashboard endpoints require authentication
router.use(protect);

router.get('/attendee', getAttendeeDashboard);
router.get('/organizer', authorize('organizer', 'admin'), getOrganizerDashboard);
router.get('/admin', authorize('admin'), getAdminDashboard);

module.exports = router;
