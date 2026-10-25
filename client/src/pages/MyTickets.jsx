import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Printer,
  CheckCircle,
  XCircle,
  ArrowLeft,
  User,
  ShieldCheck,
  QrCode,
} from 'lucide-react';

const MyTickets = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await API.get(`/bookings/${id}`);
        if (res.data.success) {
          setBooking(res.data.booking);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load ticket details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Generating digital ticket..." />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Ticket Not Available</h2>
        <p className="text-sm text-slate-500">{error || 'Unable to locate ticket pass.'}</p>
        <Link
          to="/my-bookings"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Bookings</span>
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    try {
      const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch {
      return dateString;
    }
  };

  const event = booking.event || {};

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* Action Navigation Header (Hidden in Print) */}
      <div className="no-print flex items-center justify-between">
        <Link
          to="/my-bookings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Bookings</span>
        </Link>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Print Pass</span>
        </button>
      </div>

      {/* Printable Digital Ticket Card */}
      <div
        id="printable-ticket"
        className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden"
      >
        {/* Ticket Header Banner */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Ticket className="w-4 h-4" />
              <span>Official Eventora Digital Pass</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {event.title || 'Event Pass'}
            </h1>
            <p className="text-xs text-slate-400">
              {event.category || 'General Admission'}
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                booking.bookingStatus === 'Confirmed'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {booking.bookingStatus === 'Confirmed' ? (
                <CheckCircle className="w-3.5 h-3.5" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              <span>{booking.bookingStatus}</span>
            </span>
            <p className="text-[11px] text-slate-400 font-mono mt-1">
              Ref: <span className="font-bold text-white">{booking.bookingReference}</span>
            </p>
          </div>
        </div>

        {/* Ticket Content Grid */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Main Info Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
            {/* Date & Time */}
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Date & Schedule
              </p>
              <p className="text-base font-bold text-slate-900">
                {formatDate(event.date)}
              </p>
              <p className="text-xs text-slate-600 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>{event.time || '10:00 AM'}</span>
              </p>
            </div>

            {/* Venue & Location */}
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Venue Location
              </p>
              <p className="text-base font-bold text-slate-900">{event.city}</p>
              <p className="text-xs text-slate-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>{event.location}</span>
              </p>
            </div>

            {/* Attendee Info */}
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Attendee Details
              </p>
              <p className="text-base font-bold text-slate-900">
                {booking.attendeeName}
              </p>
              <p className="text-xs text-slate-500">{booking.attendeeEmail}</p>
            </div>

            {/* Ticket Seats & Payment */}
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Quantity & Tier
              </p>
              <p className="text-base font-bold text-indigo-600">
                {booking.quantity} {booking.quantity === 1 ? 'Pass' : 'Passes'}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                Total Paid: {booking.totalAmount === 0 ? 'Free Entry' : `₹${booking.totalAmount}`} ({booking.paymentStatus})
              </p>
            </div>
          </div>

          {/* Ticket Verification & QR Graphic */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300">
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-xs font-bold text-slate-900">Pass Verification Code</p>
              <p className="font-mono text-xl sm:text-2xl font-black text-indigo-600 tracking-wider">
                {booking.bookingReference}
              </p>
              <p className="text-[11px] text-slate-400">
                Present this digital ticket or printed pass at the venue reception for admission.
              </p>
            </div>

            {/* Visual QR / Barcode element */}
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm shrink-0">
              <div className="w-24 h-24 bg-slate-900 flex items-center justify-center text-white rounded-lg p-1.5">
                {/* SVG QR Code Simulation */}
                <svg className="w-full h-full fill-white" viewBox="0 0 100 100">
                  <rect x="0" y="0" width="30" height="30" />
                  <rect x="5" y="5" width="20" height="20" fill="black" />
                  <rect x="10" y="10" width="10" height="10" fill="white" />

                  <rect x="70" y="0" width="30" height="30" />
                  <rect x="75" y="5" width="20" height="20" fill="black" />
                  <rect x="80" y="10" width="10" height="10" fill="white" />

                  <rect x="0" y="70" width="30" height="30" />
                  <rect x="5" y="75" width="20" height="20" fill="black" />
                  <rect x="10" y="80" width="10" height="10" fill="white" />

                  <rect x="40" y="20" width="10" height="30" />
                  <rect x="25" y="45" width="20" height="10" />
                  <rect x="55" y="45" width="15" height="15" />
                  <rect x="70" y="70" width="25" height="25" />
                </svg>
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-1 font-bold">
                VERIFIED PASS
              </span>
            </div>
          </div>

          {/* Footer Terms */}
          <div className="pt-2 text-[11px] text-slate-400 space-y-1">
            <p>• This digital pass is non-transferable and issued under Eventora terms of service.</p>
            <p>• Organizer: {event.organizer?.name || 'Verified Eventora Organizer'} • Generated: {new Date(booking.bookingDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTickets;
