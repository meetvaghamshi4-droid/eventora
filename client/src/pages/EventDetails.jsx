import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  ShieldCheck,
  CheckCircle,
  Share2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking form state
  const [quantity, setQuantity] = useState(1);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [attendeePhone, setAttendeePhone] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState('');

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/events/${id}`);
        if (res.data.success) {
          setEvent(res.data.event);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Pre-populate attendee details from logged-in user
  useEffect(() => {
    if (user) {
      setAttendeeName(user.name || '');
      setAttendeeEmail(user.email || '');
      setAttendeePhone(user.phone || '');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading event details..." />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Event Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'This event does not exist.'}</p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>
      </div>
    );
  }

  const remaining = Math.max(0, event.totalCapacity - (event.ticketsBooked || 0));
  const isSoldOut = remaining <= 0;
  const totalPrice = (event.ticketPrice || 0) * quantity;

  // Handle ticket booking
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }

    setBookingLoading(true);
    setBookingError('');

    try {
      const payload = {
        eventId: event._id,
        quantity: parseInt(quantity, 10),
        attendeeName,
        attendeeEmail,
        attendeePhone,
      };

      const res = await API.post('/bookings', payload);

      if (res.data.success) {
        setBookingSuccess(res.data.booking);
        // Update remaining count locally
        setEvent((prev) => ({
          ...prev,
          ticketsBooked: prev.ticketsBooked + parseInt(quantity, 10),
        }));
      }
    } catch (err) {
      setBookingError(
        err.response?.data?.message || 'Booking could not be completed. Please try again.'
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back Button */}
      <Link
        to="/events"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events</span>
      </Link>

      {/* Main Grid: Details (Left) + Booking Box (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Columns: Poster, Details, Description */}
        <div className="lg:col-span-2 space-y-8">
          {/* Banner Image */}
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-100 shadow-md">
            <img
              src={event.poster || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80'}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 px-3.5 py-1 text-xs font-bold rounded-full bg-white/95 text-slate-900 shadow-md backdrop-blur-md">
              {event.category}
            </span>
          </div>

          {/* Title & Quick Info */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {event.title}
            </h1>

            {/* Event Meta Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200/80">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Date & Time</p>
                  <p className="text-sm font-bold text-slate-900">{formatDate(event.date)}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{event.time || '10:00 AM'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200/80">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Location & City</p>
                  <p className="text-sm font-bold text-slate-900">{event.city}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{event.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-slate-900">About this Event</h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Organizer Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base">
                {event.organizer?.name ? event.organizer.name.charAt(0) : 'O'}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Organized by</p>
                <h4 className="text-base font-bold text-slate-900">
                  {event.organizer?.name || 'Verified Event Organizer'}
                </h4>
                <p className="text-xs text-slate-500">{event.organizer?.email}</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Host</span>
            </div>
          </div>
        </div>

        {/* Right Column: Ticket Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Ticket Price
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900">
                  {event.ticketPrice === 0 ? (
                    <span className="text-emerald-600">Free Admission</span>
                  ) : (
                    `₹${event.ticketPrice}`
                  )}
                </span>
                {event.ticketPrice > 0 && (
                  <span className="text-xs text-slate-400 font-medium">/ person</span>
                )}
              </div>
            </div>

            {/* Capacity Status */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-600">Remaining Availability:</span>
                <span
                  className={`font-bold ${
                    isSoldOut ? 'text-rose-600' : remaining < 15 ? 'text-amber-600' : 'text-slate-900'
                  }`}
                >
                  {isSoldOut ? 'Sold Out' : `${remaining} of ${event.totalCapacity} spots left`}
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      ((event.ticketsBooked || 0) / event.totalCapacity) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Booking Form or Confirmation */}
            {bookingSuccess ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <div>
                  <h3 className="text-lg font-bold text-emerald-900">Booking Confirmed!</h3>
                  <p className="text-xs text-emerald-700 mt-1">
                    Reference ID: <span className="font-mono font-bold">{bookingSuccess.bookingReference}</span>
                  </p>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    to={`/ticket/${bookingSuccess._id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition shadow-sm"
                  >
                    View & Print Ticket
                  </Link>
                  <Link
                    to="/my-bookings"
                    className="w-full py-2 px-4 rounded-xl text-emerald-800 text-xs font-medium hover:bg-emerald-100 transition"
                  >
                    Go to My Bookings
                  </Link>
                </div>
              </div>
            ) : isSoldOut ? (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-center text-sm font-semibold text-rose-700">
                This event is currently sold out. Check back later or explore other events!
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-4">
                {bookingError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                    {bookingError}
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Tickets
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold disabled:opacity-40 transition flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-extrabold text-base text-slate-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(Math.min(10, remaining), q + 1))}
                      disabled={quantity >= Math.min(10, remaining)}
                      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold disabled:opacity-40 transition flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Attendee Details inputs */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Attendee Name
                    </label>
                    <input
                      type="text"
                      required
                      value={attendeeName}
                      onChange={(e) => setAttendeeName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={attendeeEmail}
                      onChange={(e) => setAttendeeEmail(e.target.value)}
                      placeholder="ticket-delivery@email.com"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                {/* Live Total calculation */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Total Price:</span>
                  <span className="text-xl font-extrabold text-slate-900">
                    {totalPrice === 0 ? 'Free' : `₹${totalPrice}`}
                  </span>
                </div>

                {/* Submit Book Button */}
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-lg shadow-indigo-200 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  <span>
                    {bookingLoading
                      ? 'Processing Pass...'
                      : !isAuthenticated
                      ? 'Log In to Confirm Booking'
                      : event.ticketPrice === 0
                      ? 'Confirm Free Booking'
                      : `Book Now • ₹${totalPrice}`}
                  </span>
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  Instant digital pass generation • Official QR ticket pass
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
