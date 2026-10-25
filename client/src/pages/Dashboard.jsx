import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Compass,
  User,
  Phone,
  Save,
  Printer,
  AlertCircle,
} from 'lucide-react';

const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Active tab: 'bookings' or 'profile'
  const [activeTab, setActiveTab] = useState('bookings');

  // Bookings & Stats state
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookingsCount: 0,
    totalTickets: 0,
    upcomingEventsCount: 0,
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cancellation modal
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [notification, setNotification] = useState({ text: '', type: '' });

  // Profile form state
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileBio, setProfileBio] = useState(user?.bio || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Load Attendee Data
  const loadData = async () => {
    try {
      const [dashRes, bookRes] = await Promise.all([
        API.get('/dashboard/attendee'),
        API.get('/bookings/mine'),
      ]);

      if (dashRes.data.success) {
        setStats(dashRes.data.stats);
      }
      if (bookRes.data.success) {
        setBookings(bookRes.data.bookings);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Cancel Booking
  const handleCancelClick = (b) => {
    setBookingToCancel(b);
    setCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!bookingToCancel) return;
    try {
      const res = await API.put(`/bookings/${bookingToCancel._id}/cancel`);
      if (res.data.success) {
        setNotification({
          text: `Booking ${bookingToCancel.bookingReference} was cancelled and seat capacity released.`,
          type: 'success',
        });
        // Update local state
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingToCancel._id ? { ...b, bookingStatus: 'Cancelled' } : b
          )
        );
        // Refresh stats
        const dashRes = await API.get('/dashboard/attendee');
        if (dashRes.data.success) setStats(dashRes.data.stats);
      }
    } catch (err) {
      setNotification({
        text: err.response?.data?.message || 'Failed to cancel booking.',
        type: 'error',
      });
    }
  };

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setNotification({ text: '', type: '' });

    try {
      const res = await updateProfile({
        name: profileName,
        phone: profilePhone,
        bio: profileBio,
      });
      if (res?.success) {
        setNotification({ text: 'Profile updated successfully!', type: 'success' });
      }
    } catch (err) {
      setNotification({
        text: err.response?.data?.message || 'Failed to update profile.',
        type: 'error',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Attendee Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Attendee'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            View your tickets, manage reservations, and discover upcoming events.
          </p>
        </div>

        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm transition shadow-lg shadow-indigo-600/30 self-start sm:self-auto"
        >
          <Compass className="w-4 h-4" />
          <span>Browse More Events</span>
        </Link>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Passes"
          value={stats.confirmedBookingsCount}
          subtitle="Confirmed bookings"
          icon={CheckCircle}
          color="emerald"
        />
        <StatCard
          title="Total Tickets"
          value={stats.totalTickets}
          subtitle="Total attendee passes"
          icon={Ticket}
          color="indigo"
        />
        <StatCard
          title="Upcoming Events"
          value={stats.upcomingEventsCount}
          subtitle="Happening soon"
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="All Bookings"
          value={stats.totalBookings}
          subtitle="Total order history"
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Notification Toast Banner */}
      {notification.text && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{notification.text}</span>
          <button
            onClick={() => setNotification({ text: '', type: '' })}
            className="text-xs underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Unified Tab Switcher */}
      <div className="border-b border-slate-200 flex gap-4">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'bookings'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>My Tickets & Bookings ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>
      </div>

      {/* TAB 1: MY TICKETS & BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.length > 0 ? (
            bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-slate-300 transition"
              >
                {/* Event Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <img
                    src={
                      b.event?.poster ||
                      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&auto=format&fit=crop&q=80'
                    }
                    alt=""
                    className="w-full sm:w-24 h-24 object-cover rounded-xl bg-slate-100 shrink-0"
                  />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.bookingStatus === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Ref: <strong className="text-slate-700">{b.bookingReference}</strong>
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {b.event?.title || 'Event Name'}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        {b.event?.date ? new Date(b.event.date).toLocaleDateString() : 'N/A'}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                        {b.event?.city || 'Location'}
                      </span>
                      <span className="font-semibold text-slate-800">
                        {b.quantity} {b.quantity === 1 ? 'Pass' : 'Passes'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-5 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Total Price</p>
                    <p className="text-base font-extrabold text-slate-900">
                      {b.totalAmount === 0 ? (
                        <span className="text-emerald-600">Free</span>
                      ) : (
                        `₹${b.totalAmount}`
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/ticket/${b._id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs transition shadow-sm"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View & Print</span>
                    </Link>

                    {b.bookingStatus === 'Confirmed' && (
                      <button
                        type="button"
                        onClick={() => handleCancelClick(b)}
                        className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 max-w-md mx-auto space-y-3">
              <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No bookings yet</h3>
              <p className="text-xs text-slate-500">
                You haven't reserved any passes yet. Explore concerts, tech summits, and workshops!
              </p>
              <Link
                to="/events"
                className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition"
              >
                Browse Events
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 max-w-2xl">
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Personal Bio
              </label>
              <textarea
                rows="3"
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                placeholder="Student, developer, music lover..."
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition shadow-sm disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{savingProfile ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Cancellation Modal */}
      <ConfirmModal
        isOpen={cancelModalOpen}
        title="Cancel Ticket Reservation?"
        message={`Are you sure you want to cancel booking ${bookingToCancel?.bookingReference}? This will release ${bookingToCancel?.quantity} ticket(s) back to the event capacity.`}
        confirmText="Yes, Cancel Booking"
        confirmVariant="danger"
        onConfirm={confirmCancel}
        onClose={() => setCancelModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
