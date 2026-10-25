import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import {
  Calendar,
  PlusCircle,
  Edit,
  Trash2,
  Users,
  Eye,
  CheckCircle,
  AlertCircle,
  MapPin,
} from 'lucide-react';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEventToDelete, setSelectedEventToDelete] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchMyEvents = async () => {
    try {
      const res = await API.get('/events/mine');
      if (res.data.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.error('Failed to load organizer events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleDeleteClick = (event) => {
    setSelectedEventToDelete(event);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedEventToDelete) return;

    try {
      const res = await API.delete(`/events/${selectedEventToDelete._id}`);
      if (res.data.success) {
        setMessage({
          text: `Event "${selectedEventToDelete.title}" deleted successfully.`,
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Event Management
          </p>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage My Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track live sales, edit listings, view registered attendees, or remove events.
          </p>
        </div>

        <Link
          to="/organizer/create-event"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm transition shadow-md shadow-indigo-200 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Event</span>
        </Link>
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

      {/* Events Table or Empty State */}
      {loading ? (
        <LoadingSpinner text="Loading your events..." />
      ) : events.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Event Details</th>
                  <th className="py-4 px-4">Date & City</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Capacity & Sales</th>
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
                      {/* Title & Category */}
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
                              className="font-bold text-slate-900 hover:text-indigo-600 transition line-clamp-1"
                            >
                              {evt.title}
                            </Link>
                            <span className="text-[11px] text-slate-400 font-medium">
                              {evt.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Date & City */}
                      <td className="py-4 px-4">
                        <p className="font-semibold text-slate-800">
                          {new Date(evt.date).toLocaleDateString()}
                        </p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          <span>{evt.city}</span>
                        </p>
                      </td>

                      {/* Ticket Price */}
                      <td className="py-4 px-4 font-bold text-slate-900">
                        {evt.ticketPrice === 0 ? (
                          <span className="text-emerald-600">Free</span>
                        ) : (
                          `₹${evt.ticketPrice}`
                        )}
                      </td>

                      {/* Capacity Bar */}
                      <td className="py-4 px-4 min-w-[160px]">
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

                      {/* Status */}
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

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/organizer/events/${evt._id}/bookings`}
                            title="View Attendees"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition"
                          >
                            <Users className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/organizer/edit-event/${evt._id}`}
                            title="Edit Event"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition"
                          >
                            <Edit className="w-4 h-4" />
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 max-w-md mx-auto space-y-4">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No events created yet</h3>
          <p className="text-xs text-slate-500">
            Publish your first summit, concert, workshop or networking session on Eventora today!
          </p>
          <Link
            to="/organizer/create-event"
            className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition"
          >
            Create Your First Event
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Event Listing?"
        message={`Are you sure you want to delete "${selectedEventToDelete?.title}"? All existing bookings will be cancelled.`}
        confirmText="Yes, Delete Event"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default ManageEvents;
