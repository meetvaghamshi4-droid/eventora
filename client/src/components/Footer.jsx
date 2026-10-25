import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Heart, Shield, CheckCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Eventora</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Discover extraordinary events, book seamless digital passes, and empower organizers to host memorable experiences.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-indigo-400 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Full Stack MERN Platform</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/events" className="hover:text-white transition">
                  All Events
                </Link>
              </li>
              <li>
                <Link to="/events?category=Technology" className="hover:text-white transition">
                  Tech Summits
                </Link>
              </li>
              <li>
                <Link to="/events?category=Music+%26+Concerts" className="hover:text-white transition">
                  Live Concerts
                </Link>
              </li>
              <li>
                <Link to="/events?category=Business+%26+Startup" className="hover:text-white transition">
                  Startup Conferences
                </Link>
              </li>
              <li>
                <Link to="/events?category=Workshops+%26+Education" className="hover:text-white transition">
                  Interactive Workshops
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Account */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About Eventora
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Support & Contact
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Attendee Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition">
                  Host An Event (Organizer)
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-white transition">
                  Administration
                </Link>
              </li>
            </ul>
          </div>

          {/* College Project Context */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Project Details
            </h4>
            <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/60 text-xs space-y-2">
              <p className="font-semibold text-indigo-300">
                Full Stack Development Innovative Assignment
              </p>
              <p className="text-slate-400">
                Built with MongoDB, Express.js, React.js, and Node.js. Designed with clean, modular, and student-friendly logic for college demonstration & viva.
              </p>
              <div className="pt-1 flex items-center gap-1.5 text-slate-400">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>JWT Authentication & RBAC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Eventora. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for Web Technology Demonstration
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
