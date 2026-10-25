import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import {
  Ticket,
  Calendar,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
  Printer,
} from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // All, Confirmed, Cancelled

  // Cancellation modal state
  const [selectedBookingToCancel, setSelectedBookingToCancel] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState({ text: '', type: '' });

  const fetchBookings = async () => {
    try {
      const res = await API.get('/bookings/mine');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelClick = (booking) => {
    setSelectedBookingToCancel(booking);
    setCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!selectedBookingToCancel) return;

    try {
      const res = await API.put(`/bookings/${selectedBookingToCancel._id}/cancel`);
      if (res.data.success) {
        setActionMessage({
          text: `Booking ${selectedBookingToCancel.bookingReference} has been cancelled successfully. Capacity released.`,
          type: 'success',
        });
        // Update booking state locally
        setBookings((prev) =>
          prev.map((b) =>
            b._id === selectedBookingToCancel._id
              ? { ...b, bookingStatus: 'Cancelled' }
              : b
          )
        );
      }
    } catch (err) {
      setActionMessage({
        text: err.response?.data?.message || 'Failed to cancel booking.',
        type: 'error',
      });
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'All') return true;
    return b.bookingStatus === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Pass Management
          </p>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Bookings & Passes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            View your digital tickets, print passes, or cancel reservations
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl self-start sm:self-auto">
          {['All', 'Confirmed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === status
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Action Notification Message */}
      {actionMessage.text && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{actionMessage.text}</span>
          <button
            onClick={() => setActionMessage({ text: '', type: '' })}
            className="text-xs hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Bookings List */}
      {loading ? (
        <LoadingSpinner text="Fetching your bookings..." />
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-slate-300 transition"
            >
              {/* Event & Pass Details */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full md:w-auto">
                <img
                  src={
                    b.event?.poster ||
                    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&auto=format&fit=crop&q=80'
                  }
                  alt={b.event?.title || 'Event'}
                  className="w-full sm:w-28 h-28 object-cover rounded-xl bg-slate-100 shrink-0"
                />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        b.bookingStatus === 'Confirmed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {b.bookingStatus}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Ref: <span className="font-bold text-slate-700">{b.bookingReference}</span>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {b.event?.title || 'Event Information'}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      <span>
                        {b.event?.date ? new Date(b.event.date).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      <span>
                        {b.event?.location}, {b.event?.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Ticket className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="font-semibold text-slate-800">
                        {b.quantity} {b.quantity === 1 ? 'Ticket' : 'Tickets'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Action Buttons */}
              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-left md:text-right">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    Amount
                  </p>
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
                    <Ticket className="w-3.5 h-3.5" />
                    <span>View Ticket</span>
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
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 max-w-md mx-auto space-y-4">
          <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No bookings match this filter</h3>
          <p className="text-xs text-slate-500">
            Browse our catalog to discover live events, concerts, and workshops!
          </p>
          <Link
            to="/events"
            className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition"
          >
            Explore Events
          </Link>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={cancelModalOpen}
        title="Cancel Ticket Reservation?"
        message={`Are you sure you want to cancel booking ${selectedBookingToCancel?.bookingReference}? This will release ${selectedBookingToCancel?.quantity} ticket(s) back to the event capacity immediately.`}
        confirmText="Yes, Cancel Booking"
        confirmVariant="danger"
        onConfirm={confirmCancel}
        onClose={() => setCancelModalOpen(false)}
      />
    </div>
  );
};

export default MyBookings;
