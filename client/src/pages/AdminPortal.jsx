import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import {
  Users,
  Calendar,
  Ticket,
  IndianRupee,
  Shield,
  Trash2,
  ExternalLink,
  Layers,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const AdminPortal = () => {
  const { user: currentUser } = useAuth();

  // Active tab: 'users', 'events', or 'bookings'
  const [activeTab, setActiveTab] = useState('users');

  // Stats & Tables Data
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ text: '', type: '' });

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('user'); // 'user' or 'event'

  // Load All Admin Data
  const loadAdminData = async () => {
    try {
      const [dashRes, usersRes, eventsRes, bookingsRes] = await Promise.all([
        API.get('/dashboard/admin'),
        API.get('/admin/users'),
        API.get('/admin/events'),
        API.get('/admin/bookings'),
      ]);

      if (dashRes.data.success) setStats(dashRes.data.stats);
      if (usersRes.data.success) setUsers(usersRes.data.users);
      if (eventsRes.data.success) setEvents(eventsRes.data.events);
      if (bookingsRes.data.success) setBookings(bookingsRes.data.bookings);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Update User Role
  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await API.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        setNotification({ text: `User role updated to "${newRole}".`, type: 'success' });
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      setNotification({
        text: err.response?.data?.message || 'Failed to update role.',
        type: 'error',
      });
    }
  };

  // Update Event Status
  const handleStatusChange = async (eventId, newStatus) => {
    try {
      const res = await API.put(`/admin/events/${eventId}/status`, { status: newStatus });
      if (res.data.success) {
        setNotification({ text: `Event status updated to "${newStatus}".`, type: 'success' });
        setEvents((prev) =>
          prev.map((e) => (e._id === eventId ? { ...e, status: newStatus } : e))
        );
      }
    } catch (err) {
      setNotification({
        text: err.response?.data?.message || 'Failed to update event status.',
        type: 'error',
      });
    }
  };

  // Open Delete Confirm
  const promptDeleteUser = (u) => {
    if (u._id === currentUser._id) {
      setNotification({ text: 'You cannot delete your own admin account.', type: 'error' });
      return;
    }
    setItemToDelete(u);
    setDeleteType('user');
    setDeleteModalOpen(true);
  };

  const promptDeleteEvent = (e) => {
    setItemToDelete(e);
    setDeleteType('event');
    setDeleteModalOpen(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (deleteType === 'user') {
        const res = await API.delete(`/admin/users/${itemToDelete._id}`);
        if (res.data.success) {
          setNotification({ text: `User "${itemToDelete.name}" deleted.`, type: 'success' });
          setUsers((prev) => prev.filter((u) => u._id !== itemToDelete._id));
        }
      } else {
        const res = await API.delete(`/events/${itemToDelete._id}`);
        if (res.data.success) {
          setNotification({ text: `Event "${itemToDelete.title}" deleted.`, type: 'success' });
          setEvents((prev) => prev.filter((e) => e._id !== itemToDelete._id));
        }
      }
    } catch (err) {
      setNotification({
        text: err.response?.data?.message || 'Failed to delete resource.',
        type: 'error',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading admin control center..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
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
            Manage users, moderate event listings, and audit ticket bookings in one place.
          </p>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers || 0}
          subtitle={`${stats.totalAttendees || 0} Attendees • ${stats.totalOrganizers || 0} Hosts`}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="All Events"
          value={stats.totalEvents || 0}
          subtitle={`${stats.publishedEvents || 0} published live`}
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalBookings || 0}
          subtitle={`${stats.confirmedBookings || 0} confirmed`}
          icon={Ticket}
          color="amber"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue || 0}`}
          subtitle="Platform ticket volume"
          icon={IndianRupee}
          color="emerald"
        />
      </div>

      {/* Notification Toast */}
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
      <div className="border-b border-slate-200 flex gap-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'users'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'events'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Events ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'bookings'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>All Bookings ({bookings.length})</span>
        </button>
      </div>

      {/* TAB 1: USERS */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role Badge</th>
                  <th className="py-3 px-4">Change Role</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : u.role === 'organizer'
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="py-1 px-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                      >
                        <option value="attendee">Attendee</option>
                        <option value="organizer">Organizer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {u._id !== currentUser._id ? (
                        <button
                          type="button"
                          onClick={() => promptDeleteUser(u)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Current User</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: EVENTS */}
      {activeTab === 'events' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Organizer</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Booked / Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {events.map((e) => (
                  <tr key={e._id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <Link
                        to={`/events/${e._id}`}
                        className="font-bold text-slate-900 hover:text-indigo-600"
                      >
                        {e.title}
                      </Link>
                      <p className="text-[11px] text-slate-400">
                        {e.category} • {e.city}
                      </p>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-800">
                      {e.organizer?.name || 'Organizer'}
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900">
                      {e.ticketPrice === 0 ? 'Free' : `₹${e.ticketPrice}`}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {e.ticketsBooked} / {e.totalCapacity}
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={e.status}
                        onChange={(ev) => handleStatusChange(e._id, ev.target.value)}
                        className={`py-1 px-2 text-xs rounded-lg border font-bold ${
                          e.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : e.status === 'draft'
                            ? 'bg-slate-50 text-slate-700 border-slate-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => promptDeleteEvent(e)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Attendee</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Ref Code</th>
                  <th className="py-3 px-4">Tickets</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{b.attendeeName}</p>
                      <p className="text-[11px] text-slate-400">{b.attendeeEmail}</p>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {b.event?.title || 'Unknown Event'}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                      {b.bookingReference}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{b.quantity}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {b.totalAmount === 0 ? 'Free' : `₹${b.totalAmount}`}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.bookingStatus === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400">
                      {new Date(b.bookingDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title={`Delete ${deleteType === 'user' ? 'User Account' : 'Event Listing'}?`}
        message={`Are you sure you want to permanently delete "${
          deleteType === 'user' ? itemToDelete?.name : itemToDelete?.title
        }"?`}
        confirmText="Yes, Delete"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default AdminPortal;
