import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Ticket,
  Calendar,
  Shield,
  ArrowLeft,
  CheckCircle,
  XCircle,
  IndianRupee,
} from 'lucide-react';

const ManageBookingsAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get('/admin/bookings');
        if (res.data.success) {
          setBookings(res.data.bookings);
        }
      } catch (err) {
        console.error('Failed to load admin bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filtered = bookings.filter((b) => {
    if (filter === 'All') return true;
    return b.bookingStatus === filter;
  });

  const totalRevenue = bookings.reduce(
    (sum, b) => (b.bookingStatus === 'Confirmed' ? sum + b.totalAmount : sum),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link
        to="/admin/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Dashboard</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
            Platform Transactions
          </p>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage All Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Audit reservations, ticket references, and order statuses across Eventora.
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

      {/* Table */}
      {loading ? (
        <LoadingSpinner text="Fetching all platform bookings..." />
      ) : filtered.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Attendee</th>
                  <th className="py-4 px-4">Event</th>
                  <th className="py-4 px-4">Ref Code</th>
                  <th className="py-4 px-4">Passes</th>
                  <th className="py-4 px-4">Amount</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Date Booked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filtered.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900">{b.attendeeName}</p>
                      <p className="text-[11px] text-slate-400">{b.attendeeEmail}</p>
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-800">
                      {b.event?.title || 'Unknown Event'}
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-indigo-600">
                      {b.bookingReference}
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-900">
                      {b.quantity}
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-900">
                      {b.totalAmount === 0 ? 'Free' : `₹${b.totalAmount}`}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.bookingStatus === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right text-slate-400">
                      {new Date(b.bookingDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <p className="text-sm text-slate-500">No bookings match the selected criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ManageBookingsAdmin;
