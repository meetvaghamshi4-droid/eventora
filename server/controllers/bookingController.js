const Booking = require('../models/Booking');
const Event = require('../models/Event');

/**
 * Generate a clean, unique booking reference ID (e.g., EVT-8X92K4)
 */
const generateBookingRef = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'EVT-';
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
};

/**
 * @desc    Create a new booking (Free or Paid)
 * @route   POST /api/bookings
 * @access  Private (Attendee / All logged-in users)
 */
exports.createBooking = async (req, res, next) => {
  try {
    const { eventId, quantity = 1, attendeeName, attendeeEmail, attendeePhone } = req.body;

    const numTickets = parseInt(quantity, 10);
    if (isNaN(numTickets) || numTickets < 1) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid ticket quantity of at least 1.',
      });
    }

    // 1. Fetch event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    // 2. Validate event status
    if (event.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Bookings are only allowed for active, published events.',
      });
    }

    // 3. Validate ticket capacity
    const availableTickets = event.totalCapacity - event.ticketsBooked;
    if (availableTickets <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Sorry, this event is already sold out!',
      });
    }

    if (numTickets > availableTickets) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableTickets} ticket(s) remaining for this event. You requested ${numTickets}.`,
      });
    }

    // 4. Calculate total amount
    const ticketPrice = event.ticketPrice || 0;
    const totalAmount = ticketPrice * numTickets;

    // 5. Generate unique booking reference
    let bookingReference;
    let isUnique = false;
    while (!isUnique) {
      bookingReference = generateBookingRef();
      const existing = await Booking.findOne({ bookingReference });
      if (!existing) isUnique = true;
    }

    // 6. Create booking record
    const booking = await Booking.create({
      bookingReference,
      user: req.user.id,
      event: event._id,
      quantity: numTickets,
      ticketPrice,
      totalAmount,
      bookingStatus: 'Confirmed',
      paymentStatus: ticketPrice === 0 ? 'Free' : 'Paid',
      attendeeName: attendeeName || req.user.name,
      attendeeEmail: attendeeEmail || req.user.email,
      attendeePhone: attendeePhone || req.user.phone || '',
    });

    // 7. Update ticketsBooked count on the event
    event.ticketsBooked += numTickets;
    await event.save();

    // Populate event details for immediate confirmation display
    const populatedBooking = await Booking.findById(booking._id).populate({
      path: 'event',
      select: 'title date time location city poster ticketPrice',
    });

    res.status(201).json({
      success: true,
      message: 'Tickets booked successfully! Confirmation and digital ticket generated.',
      booking: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all bookings for the logged-in attendee
 * @route   GET /api/bookings/mine
 * @access  Private
 */
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: 'event',
        select: 'title date time location city poster ticketPrice status',
      })
      .sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single booking by ID (for Digital Ticket view)
 * @route   GET /api/bookings/:id
 * @access  Private
 */
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'event',
        select: 'title description date time location city poster ticketPrice category organizer',
        populate: {
          path: 'organizer',
          select: 'name email phone',
        },
      })
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Authorize: only the booking owner, organizer of the event, or admin can view
    const isOwner = booking.user._id.toString() === req.user.id;
    const isOrganizer =
      booking.event &&
      booking.event.organizer &&
      booking.event.organizer._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isOrganizer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this ticket.',
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel a booking and release capacity
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private
 */
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Verify ownership or admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this booking.',
      });
    }

    if (booking.bookingStatus === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled.',
      });
    }

    // Update booking status
    booking.bookingStatus = 'Cancelled';
    await booking.save();

    // Release capacity back to the event
    const event = await Event.findById(booking.event);
    if (event) {
      event.ticketsBooked = Math.max(0, event.ticketsBooked - booking.quantity);
      await event.save();
    }

    res.status(200).json({
      success: true,
      message: 'Booking successfully cancelled. Capacity has been released.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get attendee list & bookings for a specific event (Organizer / Admin)
 * @route   GET /api/bookings/event/:eventId
 * @access  Private (Organizer / Admin)
 */
exports.getEventBookings = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    // Check ownership: must be the event organizer or admin
    if (
      event.organizer.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view attendees for this event.',
      });
    }

    const bookings = await Booking.find({ event: req.params.eventId })
      .populate('user', 'name email phone')
      .sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      eventTitle: event.title,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};
