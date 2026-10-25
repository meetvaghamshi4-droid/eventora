const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an event title'],
      trim: true,
      maxlength: [120, 'Title cannot be more than 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add an event description'],
    },
    category: {
      type: String,
      required: [true, 'Please select an event category'],
      enum: [
        'Technology',
        'Music & Concerts',
        'Business & Startup',
        'Arts & Culture',
        'Workshops & Education',
        'Sports & Fitness',
        'Community & Social',
        'Other',
      ],
      default: 'Technology',
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Please specify the event date'],
    },
    time: {
      type: String,
      required: [true, 'Please specify the event start time'],
      default: '10:00 AM',
    },
    location: {
      type: String,
      required: [true, 'Please specify the venue address or online link'],
    },
    city: {
      type: String,
      required: [true, 'Please specify the city'],
      trim: true,
      default: 'Bengaluru',
    },
    poster: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    },
    ticketPrice: {
      type: Number,
      required: [true, 'Please specify the ticket price (0 for free events)'],
      default: 0,
      min: [0, 'Ticket price cannot be negative'],
    },
    totalCapacity: {
      type: Number,
      required: [true, 'Please specify the total maximum capacity'],
      min: [1, 'Capacity must be at least 1 ticket'],
    },
    ticketsBooked: {
      type: Number,
      default: 0,
      min: [0, 'Booked tickets cannot be negative'],
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'cancelled'],
      default: 'published',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for remaining tickets
eventSchema.virtual('remainingCapacity').get(function () {
  return Math.max(0, this.totalCapacity - this.ticketsBooked);
});

// Virtual for isSoldOut
eventSchema.virtual('isSoldOut').get(function () {
  return this.ticketsBooked >= this.totalCapacity;
});

// Configure JSON serialization to include virtuals
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
