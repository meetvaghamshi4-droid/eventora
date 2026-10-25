const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllEventsAdmin,
  updateEventStatusAdmin,
  getAllBookingsAdmin,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require admin role
router.use(protect, authorize('admin'));

// Users management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Events management
router.get('/events', getAllEventsAdmin);
router.put('/events/:id/status', updateEventStatusAdmin);

// Bookings management
router.get('/bookings', getAllBookingsAdmin);

module.exports = router;
