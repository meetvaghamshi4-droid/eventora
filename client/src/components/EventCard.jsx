import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

const EventCard = ({ event }) => {
  if (!event) return null;

  // Format date nicely
  const formatDate = (dateString) => {
    try {
      const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch {
      return dateString;
    }
  };

  const remaining = Math.max(0, event.totalCapacity - (event.ticketsBooked || 0));
  const isSoldOut = remaining <= 0;

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300">
      {/* Poster Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={event.poster || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-white/90 text-slate-800 backdrop-blur-md shadow-sm">
          {event.category || 'Event'}
        </span>

        {/* Status / Sold Out Badge */}
        {isSoldOut ? (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full bg-rose-600 text-white shadow-sm">
            Sold Out
          </span>
        ) : remaining < 15 ? (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500 text-white shadow-sm">
            Only {remaining} left!
          </span>
        ) : null}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          {/* Date & Time */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-600">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {formatDate(event.date)} • {event.time || '10:00 AM'}
            </span>
          </div>

          {/* Event Title */}
          <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition">
            <Link to={`/events/${event._id}`}>{event.title}</Link>
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Venue & City */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {event.location}, {event.city}
            </span>
          </div>
        </div>

        {/* Footer info: Price & CTA Button */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Price
            </p>
            <p className="text-base font-extrabold text-slate-900">
              {event.ticketPrice === 0 ? (
                <span className="text-emerald-600">Free</span>
              ) : (
                `₹${event.ticketPrice}`
              )}
            </p>
          </div>

          <Link
            to={`/events/${event._id}`}
            className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white group-hover:bg-indigo-600 transition shadow-sm"
          >
            <span>{isSoldOut ? 'View Event' : 'Book Now'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
