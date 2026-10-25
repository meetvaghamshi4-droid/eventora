import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Users, Ticket, ArrowLeft, Calendar, Mail, Phone, CheckCircle, IndianRupee } from 'lucide-react';

const EventBookings = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const res = await API.get(`/bookings/event/${id}`);
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch attendee records.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading registered attendees..." />
      </div>
    );
  }

  const bookings = data?.bookings || [];
  const eventTitle = data?.eventTitle || 'Event Attendees';

  // Metrics
  const totalTicketsBooked = bookings.reduce(
    (sum, b) => (b.bookingStatus === 'Confirmed' ? sum + b.quantity : sum),
    0
  );
  const totalRevenue = bookings.reduce(
    (sum, b) => (b.bookingStatus === 'Confirmed' ? sum + b.totalAmount : sum),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link
        to="/organizer/events"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Events</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Attendee Registry
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {eventTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official registration list and digital pass references
          </p>
        </div>

        {/* Quick Summary Pill */}
        <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm text-xs">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Confirmed Passes</p>
            <p className="font-extrabold text-slate-900 text-sm">{totalTicketsBooked}</p>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Collection</p>
            <p className="font-extrabold text-indigo-600 text-sm">
              {totalRevenue === 0 ? 'Free' : `₹${totalRevenue}`}
            </p>
          </div>
        </div>
      </div>

      {error ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {error}
        </div>
      ) : bookings.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Attendee</th>
                  <th className="py-4 px-4">Contact Info</th>
                  <th className="py-4 px-4">Booking Ref</th>
                  <th className="py-4 px-4">Passes</th>
                  <th className="py-4 px-4">Amount</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Registered On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {b.attendeeName}
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-slate-800">{b.attendeeEmail}</p>
                      {b.attendeePhone && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{b.attendeePhone}</p>
                      )}
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
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 max-w-md mx-auto space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No attendees yet</h3>
          <p className="text-xs text-slate-500">
            Share your event link to start receiving attendee bookings and registrations.
          </p>
        </div>
      )}
    </div>
  );
};

export default EventBookings;
