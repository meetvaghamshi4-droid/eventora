const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

/**
 * @desc    Get Attendee Dashboard Stats & Recent Activity
 * @route   GET /api/dashboard/attendee
 * @access  Private (Attendee / All)
 */
exports.getAttendeeDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get all bookings of this user
    const bookings = await Booking.find({ user: userId })
      .populate('event', 'title date time location city poster ticketPrice status')
      .sort({ bookingDate: -1 });

    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter((b) => b.bookingStatus === 'Confirmed');

    // Total tickets count
    const totalTickets = confirmedBookings.reduce((sum, b) => sum + b.quantity, 0);

    // Upcoming events booked
    const now = new Date();
    const upcomingBookings = confirmedBookings.filter(
      (b) => b.event && new Date(b.event.date) >= now
    );

    res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        confirmedBookingsCount: confirmedBookings.length,
        totalTickets,
        upcomingEventsCount: upcomingBookings.length,
      },
      recentBookings: bookings.slice(0, 5),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Organizer Dashboard Stats & Recent Activity
 * @route   GET /api/dashboard/organizer
 * @access  Private (Organizer / Admin)
 */
exports.getOrganizerDashboard = async (req, res, next) => {
  try {
    const organizerId = req.user.id;

    // Find all events created by this organizer
    const events = await Event.find({ organizer: organizerId }).sort({ date: 1 });
    const eventIds = events.map((e) => e._id);

    // Find all bookings for these events
    const bookings = await Booking.find({
      event: { $in: eventIds },
      bookingStatus: 'Confirmed',
    })
      .populate('user', 'name email')
      .populate('event', 'title')
      .sort({ bookingDate: -1 });

    // Calculate metrics
    const totalEvents = events.length;
    const totalBookings = bookings.length;
    const totalTicketsSold = bookings.reduce((sum, b) => sum + b.quantity, 0);
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

    // Upcoming events
    const now = new Date();
    const upcomingEvents = events.filter((e) => new Date(e.date) >= now);

    res.status(200).json({
      success: true,
      stats: {
        totalEvents,
        totalBookings,
        totalTicketsSold,
        totalRevenue,
        upcomingEventsCount: upcomingEvents.length,
      },
      upcomingEvents: upcomingEvents.slice(0, 5),
      recentRegistrations: bookings.slice(0, 5),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Admin Dashboard Stats & Overview
 * @route   GET /api/dashboard/admin
 * @access  Private (Admin)
 */
exports.getAdminDashboard = async (req, res, next) => {
  try {
    // Counts
    const totalUsers = await User.countDocuments();
    const totalAttendees = await User.countDocuments({ role: 'attendee' });
    const totalOrganizers = await User.countDocuments({ role: 'organizer' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    const totalEvents = await Event.countDocuments();
    const publishedEvents = await Event.countDocuments({ status: 'published' });

    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ bookingStatus: 'Confirmed' });

    // Platform revenue calculation
    const revenueAggregation = await Booking.aggregate([
      { $match: { bookingStatus: 'Confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

    // Recent events & bookings
    const recentEvents = await Event.find()
      .populate('organizer', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('event', 'title ticketPrice')
      .sort({ bookingDate: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalAttendees,
        totalOrganizers,
        totalAdmins,
        totalEvents,
        publishedEvents,
        totalBookings,
        confirmedBookings,
        totalRevenue,
      },
      recentEvents,
      recentBookings,
    });
  } catch (error) {
    next(error);
  }
};
