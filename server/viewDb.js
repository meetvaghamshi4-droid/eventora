const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const Event = require('./models/Event');
const Booking = require('./models/Booking');

dotenv.config({ path: path.join(__dirname, '.env') });

const viewDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventora';
    await mongoose.connect(mongoURI);

    console.log('\n======================================================');
    console.log('📦 EVENTORA DATABASE VIEWER');
    console.log(`🔗 Connected to: ${mongoURI}`);
    console.log('======================================================\n');

    // 1. Users
    const users = await User.find().select('name email role phone createdAt');
    console.log(`👤 USERS COLLECTION (${users.length} documents):`);
    console.table(
      users.map((u) => ({
        ID: u._id.toString(),
        Name: u.name,
        Email: u.email,
        Role: u.role,
        Phone: u.phone || 'N/A',
      }))
    );

    // 2. Events
    const events = await Event.find().populate('organizer', 'name email');
    console.log(`\n🎉 EVENTS COLLECTION (${events.length} documents):`);
    console.table(
      events.map((e) => ({
        ID: e._id.toString(),
        Title: e.title.length > 28 ? e.title.substring(0, 25) + '...' : e.title,
        Category: e.category,
        City: e.city,
        Price: e.ticketPrice === 0 ? 'Free' : `₹${e.ticketPrice}`,
        Capacity: `${e.ticketsBooked} / ${e.totalCapacity}`,
        Status: e.status,
      }))
    );

    // 3. Bookings
    const bookings = await Booking.find().populate('event', 'title');
    console.log(`\n🎟️ BOOKINGS COLLECTION (${bookings.length} documents):`);
    if (bookings.length > 0) {
      console.table(
        bookings.map((b) => ({
          Ref: b.bookingReference,
          Attendee: b.attendeeName,
          Email: b.attendeeEmail,
          Event: b.event?.title ? (b.event.title.length > 25 ? b.event.title.substring(0, 22) + '...' : b.event.title) : 'Unknown',
          Tickets: b.quantity,
          Total: b.totalAmount === 0 ? 'Free' : `₹${b.totalAmount}`,
          Status: b.bookingStatus,
        }))
      );
    } else {
      console.log('No bookings recorded yet.');
    }

    console.log('\n======================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('Error reading database:', err);
    process.exit(1);
  }
};

viewDatabase();
