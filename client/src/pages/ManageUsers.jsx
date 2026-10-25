import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import {
  Users,
  Shield,
  Trash2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  UserCheck,
} from 'lucide-react';

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await API.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        setMessage({
          text: `Updated user role to "${newRole}".`,
          type: 'success',
        });
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to update user role.',
        type: 'error',
      });
    }
  };

  const handleDeleteClick = (user) => {
    if (user._id === currentUser._id) {
      setMessage({
        text: 'You cannot delete your own admin account.',
        type: 'error',
      });
      return;
    }
    setSelectedUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUserToDelete) return;

    try {
      const res = await API.delete(`/admin/users/${selectedUserToDelete._id}`);
      if (res.data.success) {
        setMessage({
          text: `User "${selectedUserToDelete.name}" was successfully removed.`,
          type: 'success',
        });
        setUsers((prev) => prev.filter((u) => u._id !== selectedUserToDelete._id));
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to delete user.',
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
          User Governance
        </p>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Manage Platform Users
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          View registered accounts, assign organizer or administrator roles, and maintain user access.
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

      {/* Users Table */}
      {loading ? (
        <LoadingSpinner text="Fetching platform users..." />
      ) : users.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">User Details</th>
                  <th className="py-4 px-4">Contact Phone</th>
                  <th className="py-4 px-4">Current Role</th>
                  <th className="py-4 px-4">Modify Role</th>
                  <th className="py-4 px-4">Joined Date</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-[11px] text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-600">
                      {u.phone || '—'}
                    </td>

                    <td className="py-4 px-4">
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

                    {/* Change Role Selector */}
                    <td className="py-4 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="py-1 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                      >
                        <option value="attendee">Attendee</option>
                        <option value="organizer">Organizer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td className="py-4 px-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6 text-right">
                      {u._id !== currentUser._id ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(u)}
                          title="Delete user"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
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
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <p className="text-sm text-slate-500">No users found.</p>
        </div>
      )}

      {/* Delete User Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Remove User Account?"
        message={`Are you sure you want to permanently delete user "${selectedUserToDelete?.name}" (${selectedUserToDelete?.email})?`}
        confirmText="Yes, Delete User"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default ManageUsers;
