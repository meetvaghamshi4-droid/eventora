import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import {
  Calendar,
  Ticket,
  Users,
  IndianRupee,
  PlusCircle,
  Edit,
  Trash2,
  Layers,
  MapPin,
  X,
  CheckCircle,
  AlertCircle,
  Save,
} from 'lucide-react';

const CATEGORIES = [
  'Technology',
  'Music & Concerts',
  'Business & Startup',
  'Workshops & Education',
  'Arts & Culture',
  'Sports & Fitness',
  'Community & Social',
  'Other',
];

const CITIES = ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'];

const OrganizerPortal = () => {
  const { user } = useAuth();

  // Active tab: 'events' or 'create'
  const [activeTab, setActiveTab] = useState('events');

  // Stats and Events list
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ text: '', type: '' });

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  // Attendees Drawer modal
  const [attendeeModalOpen, setAttendeeModalOpen] = useState(false);
  const [attendeeEvent, setAttendeeEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [attendeesLoading, setAttendeesLoading] = useState(false);

  // Create / Edit Event Form state
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    category: 'Technology',
    date: '',
    time: '10:00 AM',
    location: '',
    city: 'Bengaluru',
    poster: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    ticketPrice: 0,
    totalCapacity: 100,
    status: 'published',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Load Organizer Data
  const loadOrganizerData = async () => {
    try {
      const [dashRes, eventsRes] = await Promise.all([
        API.get('/dashboard/organizer'),
        API.get('/events/mine'),
      ]);

      if (dashRes.data.success) {
        setStats(dashRes.data.stats);
      }
      if (eventsRes.data.success) {
        setEvents(eventsRes.data.events);
      }
    } catch (err) {
      console.error('Failed to load organizer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizerData();
  }, []);

  // Form input handler
  const handleFormChange = (e) => {
    const { name, value, type } = e.target;
    setEventForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  // Submit Event Form (Create or Edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setNotification({ text: '', type: '' });

    try {
      if (editingEventId) {
        // Update existing event
        const res = await API.put(`/events/${editingEventId}`, eventForm);
        if (res.data.success) {
          setNotification({ text: 'Event updated successfully!', type: 'success' });
          setEditingEventId(null);
          setActiveTab('events');
          loadOrganizerData();
        }
      } else {
        // Create new event
        const res = await API.post('/events', eventForm);
        if (res.data.success) {
          setNotification({ text: 'Event published successfully!', type: 'success' });
          // Reset form
          setEventForm({
            title: '',
            description: '',
            category: 'Technology',
            date: '',
            time: '10:00 AM',
            location: '',
            city: 'Bengaluru',
            poster: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
            ticketPrice: 0,
            totalCapacity: 100,
            status: 'published',
          });
          setActiveTab('events');
          loadOrganizerData();
        }
      }
    } catch (err) {
      setNotification({
        text: err.response?.data?.message || 'Error saving event.',
        type: 'error',
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  // Switch to Edit Mode
  const startEditEvent = (evt) => {
    setEditingEventId(evt._id);
    const formattedDate = evt.date ? new Date(evt.date).toISOString().split('T')[0] : '';
    setEventForm({
      title: evt.title || '',
      description: evt.description || '',
      category: evt.category || 'Technology',
      date: formattedDate,
      time: evt.time || '10:00 AM',
      location: evt.location || '',
      city: evt.city || 'Bengaluru',
      poster: evt.poster || '',
      ticketPrice: evt.ticketPrice || 0,
      totalCapacity: evt.totalCapacity || 100,
      status: evt.status || 'published',
    });
    setActiveTab('create');
  };

  // Delete Event
  const handleDeleteClick = (evt) => {
    setEventToDelete(evt);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      const res = await API.delete(`/events/${eventToDelete._id}`);
      if (res.data.success) {
        setNotification({
          text: `Event "${eventToDelete.title}" deleted.`,
          type: 'success',
        });
        setEvents((prev) => prev.filter((e) => e._id !== eventToDelete._id));
        loadOrganizerData();
      }
    } catch (err) {
      setNotification({
        text: err.response?.data?.message || 'Failed to delete event.',
        type: 'error',
      });
    }
  };

  // View Attendees Modal
  const openAttendeesModal = async (evt) => {
    setAttendeeEvent(evt);
    setAttendeeModalOpen(true);
    setAttendeesLoading(true);
    try {
      const res = await API.get(`/bookings/event/${evt._id}`);
      if (res.data.success) {
        setAttendees(res.data.bookings);
      }
    } catch (err) {
      console.error('Failed to load attendees:', err);
    } finally {
      setAttendeesLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading organizer portal..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Host & Organizer Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user?.name || 'Organizer'} Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Manage your events, view registered attendees, and post new listings.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingEventId(null);
            setEventForm({
              title: '',
              description: '',
              category: 'Technology',
              date: '',
              time: '10:00 AM',
              location: '',
              city: 'Bengaluru',
              poster: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
              ticketPrice: 0,
              totalCapacity: 100,
              status: 'published',
            });
            setActiveTab('create');
          }}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm transition shadow-lg shadow-indigo-600/30 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Create New Event</span>
        </button>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Hosted Events"
          value={stats.totalEvents}
          subtitle="All created events"
          icon={Layers}
          color="indigo"
        />
        <StatCard
          title="Passes Sold"
          value={stats.totalTicketsSold}
          subtitle="Total attendee spots"
          icon={Ticket}
          color="amber"
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          subtitle="Confirmed orders"
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue}`}
          subtitle="Ticket collections"
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

      {/* Tab Switcher */}
      <div className="border-b border-slate-200 flex gap-4">
        <button
          onClick={() => setActiveTab('events')}
          className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'events'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>My Events ({events.length})</span>
        </button>

        <button
          onClick={() => {
            if (!editingEventId) {
              setEventForm({
                title: '',
                description: '',
                category: 'Technology',
                date: '',
                time: '10:00 AM',
                location: '',
                city: 'Bengaluru',
                poster: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
                ticketPrice: 0,
                totalCapacity: 100,
                status: 'published',
              });
            }
            setActiveTab('create');
          }}
          className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'create'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>{editingEventId ? 'Edit Event Details' : 'Create New Event'}</span>
        </button>
      </div>

      {/* TAB 1: MY EVENTS LIST */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          {events.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                      <th className="py-4 px-6">Event</th>
                      <th className="py-4 px-4">Date & City</th>
                      <th className="py-4 px-4">Price</th>
                      <th className="py-4 px-4">Capacity Progress</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {events.map((evt) => {
                      const percentage = Math.min(
                        100,
                        Math.round(((evt.ticketsBooked || 0) / evt.totalCapacity) * 100)
                      );
                      return (
                        <tr key={evt._id} className="hover:bg-slate-50/70 transition">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  evt.poster ||
                                  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&auto=format&fit=crop&q=80'
                                }
                                alt=""
                                className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                              />
                              <div>
                                <Link
                                  to={`/events/${evt._id}`}
                                  className="font-bold text-slate-900 hover:text-indigo-600 line-clamp-1"
                                >
                                  {evt.title}
                                </Link>
                                <span className="text-[11px] text-slate-400">
                                  {evt.category}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <p className="font-semibold text-slate-900">
                              {new Date(evt.date).toLocaleDateString()}
                            </p>
                            <p className="text-[11px] text-slate-400">{evt.city}</p>
                          </td>

                          <td className="py-4 px-4 font-bold text-slate-900">
                            {evt.ticketPrice === 0 ? (
                              <span className="text-emerald-600">Free</span>
                            ) : (
                              `₹${evt.ticketPrice}`
                            )}
                          </td>

                          <td className="py-4 px-4 min-w-[140px]">
                            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
                              <span>
                                {evt.ticketsBooked} / {evt.totalCapacity}
                              </span>
                              <span className="text-slate-400">{percentage}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                evt.status === 'published'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : evt.status === 'draft'
                                  ? 'bg-slate-100 text-slate-700'
                                  : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              {evt.status}
                            </span>
                          </td>

                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openAttendeesModal(evt)}
                                title="View Attendees"
                                className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition"
                              >
                                <Users className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => startEditEvent(evt)}
                                title="Edit Event"
                                className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteClick(evt)}
                                title="Delete Event"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 max-w-md mx-auto space-y-3">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No events created yet</h3>
              <p className="text-xs text-slate-500">
                Click the tab above to create and publish your first event on Eventora!
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CREATE / EDIT EVENT FORM */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 max-w-3xl">
          <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {editingEventId ? 'Edit Event Details' : 'Create New Event Listing'}
              </h3>
              <p className="text-xs text-slate-500">
                {editingEventId
                  ? 'Update venue, timing, capacity or description.'
                  : 'Fill in event info to publish it immediately for attendees.'}
              </p>
            </div>
            {editingEventId && (
              <button
                type="button"
                onClick={() => {
                  setEditingEventId(null);
                  setActiveTab('events');
                }}
                className="text-xs text-slate-500 hover:underline"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={eventForm.title}
                onChange={handleFormChange}
                placeholder="e.g. AI & Full Stack Developer Summit"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={eventForm.category}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={eventForm.status}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="published">Published (Active)</option>
                  <option value="draft">Draft (Hidden)</option>
                  {editingEventId && <option value="cancelled">Cancelled</option>}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Description *
              </label>
              <textarea
                name="description"
                rows="3"
                required
                value={eventForm.description}
                onChange={handleFormChange}
                placeholder="Describe key sessions, guest speakers, agenda, or benefits..."
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Event Date *
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  value={eventForm.date}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Time / Schedule *
                </label>
                <input
                  type="text"
                  name="time"
                  required
                  value={eventForm.time}
                  onChange={handleFormChange}
                  placeholder="e.g. 10:00 AM - 04:00 PM"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Venue Address *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={eventForm.location}
                  onChange={handleFormChange}
                  placeholder="e.g. Convention Hall, Whitefield"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  City *
                </label>
                <select
                  name="city"
                  value={eventForm.city}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Ticket Price (₹) (0 for Free admission)
                </label>
                <input
                  type="number"
                  min="0"
                  name="ticketPrice"
                  required
                  value={eventForm.ticketPrice}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Total Seat Capacity *
                </label>
                <input
                  type="number"
                  min="1"
                  name="totalCapacity"
                  required
                  value={eventForm.totalCapacity}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Poster Image URL
              </label>
              <input
                type="url"
                name="poster"
                value={eventForm.poster}
                onChange={handleFormChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="submit"
                disabled={formSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition shadow-sm disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>
                  {formSubmitting
                    ? 'Saving Event...'
                    : editingEventId
                    ? 'Save Event Changes'
                    : 'Publish Event'}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Event Listing?"
        message={`Are you sure you want to delete "${eventToDelete?.title}"? All existing attendee passes will be set to Cancelled.`}
        confirmText="Yes, Delete Event"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onClose={() => setDeleteModalOpen(false)}
      />

      {/* Attendees Drawer Modal */}
      {attendeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  Attendee Registry
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {attendeeEvent?.title}
                </h3>
              </div>
              <button
                onClick={() => setAttendeeModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Table */}
            <div className="overflow-y-auto flex-1 my-4">
              {attendeesLoading ? (
                <LoadingSpinner text="Fetching attendee passes..." />
              ) : attendees.length > 0 ? (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold">
                      <th className="pb-2">Attendee</th>
                      <th className="pb-2">Contact</th>
                      <th className="pb-2">Ref Code</th>
                      <th className="pb-2">Passes</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attendees.map((a) => (
                      <tr key={a._id} className="py-2.5">
                        <td className="py-2.5 font-bold text-slate-900">{a.attendeeName}</td>
                        <td className="py-2.5 text-slate-500">
                          <p>{a.attendeeEmail}</p>
                          {a.attendeePhone && <p className="text-[10px]">{a.attendeePhone}</p>}
                        </td>
                        <td className="py-2.5 font-mono font-bold text-indigo-600">
                          {a.bookingReference}
                        </td>
                        <td className="py-2.5 font-semibold text-slate-900">{a.quantity}</td>
                        <td className="py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              a.bookingStatus === 'Confirmed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {a.bookingStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-xs text-slate-500">
                  No attendees have booked passes for this event yet.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setAttendeeModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerPortal;
