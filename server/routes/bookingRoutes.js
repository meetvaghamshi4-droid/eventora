const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getEventBookings,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

// All booking routes require authentication
router.use(protect);

// Create new ticket booking
router.post('/', createBooking);

// Get current attendee's bookings
router.get('/mine', getMyBookings);

// Get single booking (for digital ticket)
router.get('/:id', getBookingById);

// Cancel booking and release tickets
router.put('/:id/cancel', cancelBooking);

// Get attendees for a specific event (Organizer / Admin)
router.get('/event/:eventId', authorize('organizer', 'admin'), getEventBookings);

module.exports = router;
