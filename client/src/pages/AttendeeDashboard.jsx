import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Ticket,
  Calendar,
  Clock,
  ArrowRight,
  Compass,
  CheckCircle,
  XCircle,
  User,
  Shield,
} from 'lucide-react';

const AttendeeDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/dashboard/attendee');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load attendee dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading your dashboard..." />
      </div>
    );
  }

  const stats = data?.stats || {
    totalBookings: 0,
    confirmedBookingsCount: 0,
    totalTickets: 0,
    upcomingEventsCount: 0,
  };

  const recentBookings = data?.recentBookings || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Attendee Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {user?.name || 'Attendee'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Track your event bookings, view passes, and discover upcoming experiences.
          </p>
        </div>

        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm transition shadow-lg shadow-indigo-600/30 self-start sm:self-auto"
        >
          <Compass className="w-4 h-4" />
          <span>Explore More Events</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          subtitle="All-time registrations"
          icon={Calendar}
          color="indigo"
        />
        <StatCard
          title="Confirmed Bookings"
          value={stats.confirmedBookingsCount}
          subtitle="Active reservations"
          icon={CheckCircle}
          color="emerald"
        />
        <StatCard
          title="Tickets Held"
          value={stats.totalTickets}
          subtitle="Total attendee passes"
          icon={Ticket}
          color="purple"
        />
        <StatCard
          title="Upcoming Events"
          value={stats.upcomingEventsCount}
          subtitle="Events starting soon"
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Recent Bookings Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recent Bookings</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Your latest event registrations and tickets
            </p>
          </div>
          <Link
            to="/my-bookings"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
          >
            <span>View All Bookings</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {recentBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                  <th className="pb-3 px-3">Event</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3">Ref ID</th>
                  <th className="pb-3 px-3">Tickets</th>
                  <th className="pb-3 px-3">Amount</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-3 font-semibold text-slate-900">
                      {b.event?.title || 'Unknown Event'}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">
                      {b.event?.date ? new Date(b.event.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-600">
                      {b.bookingReference}
                    </td>
                    <td className="py-3.5 px-3 font-medium">{b.quantity}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-900">
                      {b.totalAmount === 0 ? 'Free' : `₹${b.totalAmount}`}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          b.bookingStatus === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        to={`/ticket/${b._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-xs transition"
                      >
                        <Ticket className="w-3 h-3" />
                        <span>Ticket</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <Ticket className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No bookings yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't booked any event passes yet. Explore upcoming summits, concerts, and meetups now!
            </p>
            <Link
              to="/events"
              className="inline-block mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition"
            >
              Browse Events
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendeeDashboard;
