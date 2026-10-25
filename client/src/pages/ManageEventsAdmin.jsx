import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import {
  Calendar,
  Shield,
  Trash2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

const ManageEventsAdmin = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEventToDelete, setSelectedEventToDelete] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchEvents = async () => {
    try {
      const res = await API.get('/admin/events');
      if (res.data.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      const res = await API.put(`/admin/events/${eventId}/status`, { status: newStatus });
      if (res.data.success) {
        setMessage({
          text: `Event status updated to "${newStatus}".`,
          type: 'success',
        });
        setEvents((prev) =>
          prev.map((e) => (e._id === eventId ? { ...e, status: newStatus } : e))
        );
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to update status.',
        type: 'error',
      });
    }
  };

  const handleDeleteClick = (evt) => {
    setSelectedEventToDelete(evt);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedEventToDelete) return;

    try {
      const res = await API.delete(`/events/${selectedEventToDelete._id}`);
      if (res.data.success) {
        setMessage({
          text: `Event "${selectedEventToDelete.title}" removed successfully.`,
          type: 'success',
        });
        setEvents((prev) => prev.filter((e) => e._id !== selectedEventToDelete._id));
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to delete event.',
        type: 'error',
      });
    }
  };

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
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
          Listing Moderation
        </p>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Manage All Events
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review, moderate publication status, and oversee listings across Eventora.
        </p>
      </div>

      {/* Message Banner */}
      {message.text && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage({ text: '', type: '' })}
            className="text-xs hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Events Table */}
      {loading ? (
        <LoadingSpinner text="Fetching all platform events..." />
      ) : events.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Event Details</th>
                  <th className="py-4 px-4">Organizer</th>
                  <th className="py-4 px-4">Date & City</th>
                  <th className="py-4 px-4">Sales / Cap</th>
                  <th className="py-4 px-4">Status & Moderation</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {events.map((evt) => (
                  <tr key={evt._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={evt.poster || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=80&auto=format&fit=crop&q=80'}
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
                          <span className="text-[11px] text-slate-400 font-medium">
                            {evt.category} • {evt.ticketPrice === 0 ? 'Free' : `₹${evt.ticketPrice}`}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-semibold text-slate-900">{evt.organizer?.name || 'Organizer'}</p>
                      <p className="text-[11px] text-slate-400">{evt.organizer?.email}</p>
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-semibold text-slate-800">
                        {new Date(evt.date).toLocaleDateString()}
                      </p>
                      <p className="text-[11px] text-slate-400">{evt.city}</p>
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-900">
                      {evt.ticketsBooked} / {evt.totalCapacity}
                    </td>

                    {/* Moderation Status Dropdown */}
                    <td className="py-4 px-4">
                      <select
                        value={evt.status}
                        onChange={(e) => handleStatusChange(evt._id, e.target.value)}
                        className={`py-1 px-2.5 text-xs rounded-lg border focus:outline-none font-bold ${
                          evt.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : evt.status === 'draft'
                            ? 'bg-slate-50 text-slate-700 border-slate-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/events/${evt._id}`}
                          title="Open live page"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <p className="text-sm text-slate-500">No events registered on the platform.</p>
        </div>
      )}

      {/* Delete Event Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Admin Event Removal?"
        message={`Are you sure you want to remove "${selectedEventToDelete?.title}"? All associated bookings will be set to Cancelled.`}
        confirmText="Yes, Remove Event"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default ManageEventsAdmin;
