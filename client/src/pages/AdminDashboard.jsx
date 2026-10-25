import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Users,
  Calendar,
  Ticket,
  IndianRupee,
  Shield,
  Layers,
  CheckCircle,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await API.get('/dashboard/admin');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading platform administration data..." />
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentEvents = data?.recentEvents || [];
  const recentBookings = data?.recentBookings || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Platform Administrator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Admin Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Global management of users, event listings, bookings, and platform revenue.
          </p>
        </div>

        {/* Quick Nav Links */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <Link
            to="/admin/users"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/events"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition"
          >
            Manage Events
          </Link>
          <Link
            to="/admin/bookings"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition shadow-md shadow-purple-600/30"
          >
            All Bookings
          </Link>
        </div>
      </div>

      {/* Global Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Users"
          value={stats.totalUsers || 0}
          subtitle={`${stats.totalAttendees || 0} Attendees • ${stats.totalOrganizers || 0} Organizers`}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Total Events"
          value={stats.totalEvents || 0}
          subtitle={`${stats.publishedEvents || 0} Published Live`}
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings || 0}
          subtitle={`${stats.confirmedBookings || 0} Confirmed Orders`}
          icon={Ticket}
          color="amber"
        />
        <StatCard
          title="Platform Revenue"
          value={`₹${stats.totalRevenue || 0}`}
          subtitle="Processed ticket volume"
          icon={IndianRupee}
          color="emerald"
        />
      </div>

      {/* 2-Column Tables: Recent Events & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Events Added */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Recent Events</h3>
            <Link to="/admin/events" className="text-xs font-semibold text-indigo-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentEvents.map((evt) => (
              <div key={evt._id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{evt.title}</h4>
                  <p className="text-xs text-slate-500">
                    Host: {evt.organizer?.name || 'Organizer'} • {evt.category}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    evt.status === 'published'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {evt.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Platform Bookings */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Recent Platform Bookings</h3>
            <Link to="/admin/bookings" className="text-xs font-semibold text-indigo-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentBookings.map((b) => (
              <div key={b._id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{b.user?.name || 'Attendee'}</h4>
                  <p className="text-xs text-slate-500">
                    {b.event?.title || 'Event'} • Ref: <span className="font-mono">{b.bookingReference}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900">
                    {b.totalAmount === 0 ? 'Free' : `₹${b.totalAmount}`}
                  </p>
                  <span className="text-[10px] font-bold text-emerald-600">
                    {b.bookingStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
