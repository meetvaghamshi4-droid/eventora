const Event = require('../models/Event');
const Booking = require('../models/Booking');

/**
 * @desc    Get all events with search, category filter, city filter, and sorting
 * @route   GET /api/events
 * @access  Public
 */
exports.getEvents = async (req, res, next) => {
  try {
    const { search, category, city, sort, status } = req.query;

    // Build query object
    let query = {};

    // For public users, only show published events unless explicitly specified by admin
    if (status && req.user && req.user.role === 'admin') {
      query.status = status;
    } else {
      query.status = 'published';
    }

    // Keyword search on title or description
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { location: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // City filter
    if (city && city !== 'All') {
      query.city = { $regex: `^${city.trim()}$`, $options: 'i' };
    }

    // Sorting
    let sortOptions = { date: 1 }; // Default: upcoming first
    if (sort === 'date-desc') {
      sortOptions = { date: -1 };
    } else if (sort === 'price-asc') {
      sortOptions = { ticketPrice: 1 };
    } else if (sort === 'price-desc') {
      sortOptions = { ticketPrice: -1 };
    } else if (sort === 'created-desc') {
      sortOptions = { createdAt: -1 };
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .sort(sortOptions);

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'organizer',
      'name email phone'
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found with the requested ID.',
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Private (Organizer / Admin)
 */
exports.createEvent = async (req, res, next) => {
  try {
    // Add current user as organizer
    req.body.organizer = req.user.id;

    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Event created successfully!',
      event,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update event details
 * @route   PUT /api/events/:id
 * @access  Private (Organizer owner / Admin)
 */
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    // Verify ownership: only organizer who created the event or admin can edit
    if (
      event.organizer.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this event.',
      });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Event updated successfully!',
      event,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete event
 * @route   DELETE /api/events/:id
 * @access  Private (Organizer owner / Admin)
 */
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    // Verify ownership
    if (
      event.organizer.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this event.',
      });
    }

    // Also cancel or clean up related bookings if any
    await Booking.updateMany(
      { event: req.params.id },
      { bookingStatus: 'Cancelled' }
    );

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all events created by current organizer
 * @route   GET /api/events/mine
 * @access  Private (Organizer)
 */
exports.getMyEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ organizer: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    next(error);
  }
};
