const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

// Public route to fetch all events
router.get('/', getEvents);

// Organizer's own events (must be defined before /:id to avoid matching id="mine")
router.get('/mine', protect, authorize('organizer', 'admin'), getMyEvents);

// Public route to get event details
router.get('/:id', getEventById);

// Protected routes for Organizer and Admin
router.post('/', protect, authorize('organizer', 'admin'), createEvent);
router.put('/:id', protect, authorize('organizer', 'admin'), updateEvent);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent);

module.exports = router;
