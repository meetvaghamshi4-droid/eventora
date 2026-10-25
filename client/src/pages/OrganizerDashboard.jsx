import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Calendar,
  Ticket,
  Users,
  IndianRupee,
  PlusCircle,
  ArrowRight,
  Clock,
  Layers,
  Eye,
} from 'lucide-react';

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizerStats = async () => {
      try {
        const res = await API.get('/dashboard/organizer');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load organizer dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizerStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading organizer analytics..." />
      </div>
    );
  }

  const stats = data?.stats || {
    totalEvents: 0,
    totalBookings: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
    upcomingEventsCount: 0,
  };

  const upcomingEvents = data?.upcomingEvents || [];
  const recentRegistrations = data?.recentRegistrations || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Host & Organizer Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user?.name || 'Organizer'} Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Monitor real-time ticket sales, capacity, and attendee registrations.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            to="/organizer/events"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 transition"
          >
            Manage Events
          </Link>
          <Link
            to="/organizer/create-event"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm transition shadow-lg shadow-indigo-600/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Event</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          subtitle="Hosted by you"
          icon={Layers}
          color="indigo"
        />
        <StatCard
          title="Confirmed Bookings"
          value={stats.totalBookings}
          subtitle="Total orders processed"
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="Tickets Sold"
          value={stats.totalTicketsSold}
          subtitle="Total attendee passes"
          icon={Ticket}
          color="amber"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue}`}
          subtitle="Gross ticket earnings"
          icon={IndianRupee}
          color="emerald"
        />
      </div>

      {/* 2-Column Section: Upcoming Events & Recent Attendee Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events Hosted */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Your Upcoming Events</h3>
              <p className="text-xs text-slate-500">Events scheduled to take place soon</p>
            </div>
            <Link
              to="/organizer/events"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              All Events
            </Link>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {upcomingEvents.map((evt) => (
                <div key={evt._id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{evt.title}</h4>
                    <p className="text-xs text-slate-500">
                      {new Date(evt.date).toLocaleDateString()} • {evt.city}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-slate-900">
                      {evt.ticketsBooked} / {evt.totalCapacity}
                    </p>
                    <Link
                      to={`/organizer/events/${evt._id}/bookings`}
                      className="text-[11px] font-semibold text-indigo-600 hover:underline"
                    >
                      View Attendees
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-500 bg-slate-50 rounded-2xl">
              No upcoming events scheduled. Create one today!
            </div>
          )}
        </div>

        {/* Recent Registrations */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Registrations</h3>
              <p className="text-xs text-slate-500">Latest tickets booked across your events</p>
            </div>
          </div>

          {recentRegistrations.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentRegistrations.map((reg) => (
                <div key={reg._id} className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{reg.attendeeName}</h4>
                    <p className="text-xs text-slate-500">
                      {reg.event?.title || 'Event'} • {reg.quantity} pass(es)
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-mono font-bold text-slate-700">
                      {reg.bookingReference}
                    </p>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      {reg.totalAmount === 0 ? 'Free' : `₹${reg.totalAmount}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-500 bg-slate-50 rounded-2xl">
              No recent attendee registrations yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
