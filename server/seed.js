const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Event = require('./models/Event');
const Booking = require('./models/Booking');

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for database seeding...');

    // Clear existing data
    await User.deleteMany();
    await Event.deleteMany();
    await Booking.deleteMany();
    console.log('🧹 Cleaned previous users, events, and bookings.');

    // Pre-hash password for fast, consistent seeding
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const organizerPassword = await bcrypt.hash('organizer123', salt);
    const attendeePassword = await bcrypt.hash('attendee123', salt);

    // 1. Create Users
    const users = await User.insertMany([
      {
        name: 'Eventora Admin',
        email: 'admin@eventora.com',
        password: adminPassword,
        role: 'admin',
        phone: '+91 98765 00001',
        bio: 'Eventora Platform Administrator & Moderator',
      },
      {
        name: 'TechSprint Global',
        email: 'organizer@eventora.com',
        password: organizerPassword,
        role: 'organizer',
        phone: '+91 98765 00002',
        bio: 'Premier technology conferences and developer summits in India',
      },
      {
        name: 'Acoustic Beats Live',
        email: 'music@eventora.com',
        password: organizerPassword,
        role: 'organizer',
        phone: '+91 98765 00003',
        bio: 'Curator of live music performances and cultural festivals',
      },
      {
        name: 'Rahul Sharma',
        email: 'attendee@eventora.com',
        password: attendeePassword,
        role: 'attendee',
        phone: '+91 98765 00004',
        bio: 'Computer Science student & tech enthusiast',
      },
      {
        name: 'Priya Patel',
        email: 'priya@eventora.com',
        password: attendeePassword,
        role: 'attendee',
        phone: '+91 98765 00005',
        bio: 'Designer & startup enthusiast',
      },
    ]);

    const adminUser = users[0];
    const techOrganizer = users[1];
    const musicOrganizer = users[2];
    const rahulAttendee = users[3];
    const priyaAttendee = users[4];

    console.log(`👤 Created ${users.length} sample users (Admin, Organizers, Attendees).`);

    // 2. Create Sample Events
    const events = await Event.insertMany([
      {
        title: 'Full Stack AI Developer Summit 2026',
        description: 'Explore the future of web architecture, generative AI agents, modern MERN stacks, and high-performance cloud development with leading engineers and industry keynote speakers.',
        category: 'Technology',
        organizer: techOrganizer._id,
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // in 14 days
        time: '09:30 AM - 05:30 PM',
        location: 'KTPO Trade Center, Whitefield',
        city: 'Bengaluru',
        poster: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        ticketPrice: 499,
        totalCapacity: 150,
        ticketsBooked: 2,
        status: 'published',
      },
      {
        title: 'Indie Fusion Sunset Music Festival',
        description: 'A magical open-air evening featuring top indie acoustic bands, live folk fusion, artisan food stalls, and mesmerizing sunset aesthetics.',
        category: 'Music & Concerts',
        organizer: musicOrganizer._id,
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // in 20 days
        time: '05:00 PM - 10:30 PM',
        location: 'Bandra Amphitheatre, Carter Road',
        city: 'Mumbai',
        poster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
        ticketPrice: 799,
        totalCapacity: 250,
        ticketsBooked: 1,
        status: 'published',
      },
      {
        title: 'National Startup Pitch & Angel Investor Mixer',
        description: 'Connect early-stage founders with visionary angel investors, venture funds, and experienced startup mentors. Live pitch sessions and networking dinner included.',
        category: 'Business & Startup',
        organizer: techOrganizer._id,
        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // in 8 days
        time: '11:00 AM - 04:00 PM',
        location: 'Cyber City Convention Hall, DLF Phase 2',
        city: 'Delhi NCR',
        poster: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80',
        ticketPrice: 0, // Free event
        totalCapacity: 80,
        ticketsBooked: 1,
        status: 'published',
      },
      {
        title: 'Modern UI/UX Design & Figma Hands-on Workshop',
        description: 'A zero-to-one practical masterclass covering responsive layouts, design tokens, micro-interactions, and creating design systems that developers love.',
        category: 'Workshops & Education',
        organizer: techOrganizer._id,
        date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // in 25 days
        time: '10:00 AM - 02:00 PM',
        location: 'T-Hub Innovation Hub, Gachibowli',
        city: 'Hyderabad',
        poster: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80',
        ticketPrice: 199,
        totalCapacity: 60,
        ticketsBooked: 0,
        status: 'published',
      },
      {
        title: 'Contemporary Art & Photography Exhibition',
        description: 'Discover breathtaking contemporary visual art, digital canvas installations, and documentary photography by upcoming Indian creative artists.',
        category: 'Arts & Culture',
        organizer: musicOrganizer._id,
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // in 30 days
        time: '10:00 AM - 07:00 PM',
        location: 'National Gallery of Modern Art, Palace Road',
        city: 'Bengaluru',
        poster: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80',
        ticketPrice: 150,
        totalCapacity: 100,
        ticketsBooked: 0,
        status: 'published',
      },
      {
        title: 'City Marathon & 10K Fitness Run',
        description: 'Join over 2,000 energetic runners for our annual city health marathon. Finisher medals, energy refreshments, timing chips, and medical assistance provided.',
        category: 'Sports & Fitness',
        organizer: techOrganizer._id,
        date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // in 45 days
        time: '05:30 AM - 09:30 AM',
        location: 'Cubbon Park Entrance, MG Road',
        city: 'Bengaluru',
        poster: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&auto=format&fit=crop&q=80',
        ticketPrice: 350,
        totalCapacity: 300,
        ticketsBooked: 0,
        status: 'published',
      },
    ]);

    console.log(`🎉 Created ${events.length} realistic sample events.`);

    // 3. Create Sample Bookings
    const bookings = await Booking.insertMany([
      {
        bookingReference: 'EVT-7X92K4',
        user: rahulAttendee._id,
        event: events[0]._id, // Summit
        quantity: 2,
        ticketPrice: 499,
        totalAmount: 998,
        bookingStatus: 'Confirmed',
        paymentStatus: 'Paid',
        attendeeName: 'Rahul Sharma',
        attendeeEmail: 'attendee@eventora.com',
        attendeePhone: '+91 98765 00004',
        bookingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        bookingReference: 'EVT-3B88P1',
        user: priyaAttendee._id,
        event: events[1]._id, // Concert
        quantity: 1,
        ticketPrice: 799,
        totalAmount: 799,
        bookingStatus: 'Confirmed',
        paymentStatus: 'Paid',
        attendeeName: 'Priya Patel',
        attendeeEmail: 'priya@eventora.com',
        attendeePhone: '+91 98765 00005',
        bookingDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        bookingReference: 'EVT-9Q44L8',
        user: rahulAttendee._id,
        event: events[2]._id, // Startup pitch (Free)
        quantity: 1,
        ticketPrice: 0,
        totalAmount: 0,
        bookingStatus: 'Confirmed',
        paymentStatus: 'Free',
        attendeeName: 'Rahul Sharma',
        attendeeEmail: 'attendee@eventora.com',
        attendeePhone: '+91 98765 00004',
        bookingDate: new Date(),
      },
    ]);

    console.log(`🎟️ Created ${bookings.length} sample bookings with valid references.`);
    console.log('----------------------------------------------------');
    console.log('✨ SEEDING COMPLETE! Test Accounts Ready:');
    console.log('👑 Admin:     admin@eventora.com     / admin123');
    console.log('🏢 Organizer: organizer@eventora.com / organizer123');
    console.log('🎵 Organizer: music@eventora.com     / organizer123');
    console.log('👤 Attendee:  attendee@eventora.com  / attendee123');
    console.log('👤 Attendee:  priya@eventora.com     / attendee123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
