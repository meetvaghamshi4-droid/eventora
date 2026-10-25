import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Search,
  Sparkles,
  ArrowRight,
  Calendar,
  Ticket,
  ShieldCheck,
  Compass,
  Cpu,
  Music,
  Briefcase,
  Palette,
  GraduationCap,
  Activity,
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeEvents = async () => {
      try {
        const res = await API.get('/events');
        if (res.data.success) {
          setEvents(res.data.events);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeEvents();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/events');
    }
  };

  const categories = [
    { name: 'Technology', icon: Cpu, count: 'Tech & AI' },
    { name: 'Music & Concerts', icon: Music, count: 'Live Bands' },
    { name: 'Business & Startup', icon: Briefcase, count: 'Pitch & Meetups' },
    { name: 'Workshops & Education', icon: GraduationCap, count: 'Hands-on' },
    { name: 'Arts & Culture', icon: Palette, count: 'Exhibits' },
    { name: 'Sports & Fitness', icon: Activity, count: 'Marathons' },
  ];

  const featuredEvents = events.slice(0, 3);
  const upcomingEvents = events.slice(3, 7);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Subtle badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Event Management & Booking Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Discover Events. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600">
              Create Memories.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            From tech hackathons and startup mixers to live acoustic concerts and art masterclasses. Find and book verified tickets in seconds.
          </p>

          {/* Search Box Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-2 p-2 bg-white rounded-2xl shadow-xl shadow-indigo-100/50 border border-slate-200/80"
          >
            <div className="flex items-center gap-3 px-3 w-full flex-1">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search by event title, topic, or venue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Category Tags */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-400">Popular:</span>
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.name}
                to={`/events?category=${encodeURIComponent(cat.name)}`}
                className="px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 transition shadow-sm"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Browse Categories
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore by Interest
            </h2>
          </div>
          <Link
            to="/events"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/events?category=${encodeURIComponent(cat.name)}`}
                className="group p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition text-center flex flex-col items-center justify-center space-y-2.5"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition flex items-center justify-center shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition">
                    {cat.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">{cat.count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Events
            </h2>
          </div>
          <Link
            to="/events"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
          >
            <span>Explore All Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading featured events..." />
        ) : featuredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((evt) => (
              <EventCard key={evt._id} event={evt} />
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">No events found in the database.</p>
          </div>
        )}
      </section>

      {/* How Eventora Works (3 Steps) */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Effortless Experience
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              How Eventora Works
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Booking passes and attending events has never been simpler.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Discover & Choose</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Filter by topic, venue city, and date to locate exciting happenings near you.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Instant Confirmation</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Select your ticket quantity with live remaining-seat validation and zero friction.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Digital Pass & Print</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Access your verified booking pass anytime, complete with booking ID and print format.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Mark Your Calendar
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Upcoming Experiences
              </h2>
            </div>
            <Link
              to="/events"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingEvents.map((evt) => (
              <EventCard key={evt._id} event={evt} />
            ))}
          </div>
        </section>
      )}

      {/* Organizer Call To Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              For Event Creators
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Host Your Next Event on Eventora
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Create an organizer profile in seconds. Manage ticket capacity, track live registrations, and give your attendees a premier digital ticketing experience.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm transition shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <span>Start Organizing Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold text-sm transition border border-slate-700"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
