import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Shield, Database, Cpu, CheckCircle, Code, Layers, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Full Stack Development Innovative Assignment</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          About Eventora
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          A smart, full-stack event discovery, publishing, and ticket management platform built using the modern MERN stack. Designed specifically with clear architecture, understandable logic, and robust functionality.
        </p>
      </div>

      {/* Core Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">End-to-End Event Lifecycle</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            From creation and capacity tracking by organizers to instant booking and digital ticket generation for attendees.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Role-Based Access Control</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Strict three-tier permissions (Attendee, Organizer, Admin) verified at both the Express REST API middleware and React client layers.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Live Capacity Management</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Real-time validation prevents overbooking. Cancelling a confirmed booking immediately restores available capacity.
          </p>
        </div>
      </div>

      {/* Technology Stack Architecture */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Technology Stack & Architecture
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Engineered with student-friendly, industry-standard practices without overengineering.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs font-bold uppercase text-indigo-600 mb-1">Frontend</p>
            <h4 className="text-base font-bold text-slate-900">React.js & Vite</h4>
            <p className="text-xs text-slate-500 mt-1">
              Component-based SPA, React Router DOM v6, Tailwind CSS, and Lucide React icons.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs font-bold uppercase text-indigo-600 mb-1">Backend</p>
            <h4 className="text-base font-bold text-slate-900">Node.js & Express</h4>
            <p className="text-xs text-slate-500 mt-1">
              Modular REST API architecture, MVC-style route controllers, and centralized error handling.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs font-bold uppercase text-indigo-600 mb-1">Database</p>
            <h4 className="text-base font-bold text-slate-900">MongoDB & Mongoose</h4>
            <p className="text-xs text-slate-500 mt-1">
              Schemas for Users, Events, and Bookings with relational ObjectId references and virtuals.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs font-bold uppercase text-indigo-600 mb-1">Security</p>
            <h4 className="text-base font-bold text-slate-900">JWT & bcrypt</h4>
            <p className="text-xs text-slate-500 mt-1">
              Bcrypt password salt hashing, signed JWT auth tokens with HTTP-only cookies and bearer headers.
            </p>
          </div>
        </div>
      </div>

      {/* College Viva Guide Callout */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Code className="w-4 h-4" />
          <span>College Evaluation Summary</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold">
          Key Project Highlights to Explain in Viva
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <span>Demonstrates complete MERN CRUD workflow across 3 distinct roles.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <span>Live capacity increment/decrement ensures inventory integrity.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <span>Digital printable tickets styled with clean CSS `@media print` rules.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <span>Pre-seeded with realistic data across technology, music, and business events.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default About;
