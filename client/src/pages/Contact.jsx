import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, HelpCircle } from 'lucide-react';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const faqs = [
    {
      q: 'How does event ticketing work on Eventora?',
      a: 'Browse any event, select the desired quantity, and book tickets instantly. For free events, registration is immediate. A digital pass with a unique reference number is issued instantly.',
    },
    {
      q: 'Can I cancel my booked tickets?',
      a: 'Yes, attendees can cancel confirmed tickets from their "My Bookings" page. Cancelling releases the seats back to the event capacity in real-time.',
    },
    {
      q: 'How do I become an event organizer?',
      a: 'Select "Event Organizer" during registration, or an administrator can upgrade your account from the Admin Panel. Organizers can create, edit, manage events, and view attendee lists.',
    },
    {
      q: 'Can I print my digital ticket?',
      a: 'Yes, each booking has a dedicated ticket page equipped with a "Print Ticket" button formatted specifically for desktop and mobile printing.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Get in Touch
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Contact & Support
        </h1>
        <p className="text-sm text-slate-600">
          Have questions about the platform, ticket booking, or organizer tools? We are here to help.
        </p>
      </div>

      {/* Main Grid: Form (Left) & Info (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4 animate-in fade-in">
              <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto" />
              <h3 className="text-2xl font-bold text-slate-900">Message Received!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you for contacting Eventora. For this demonstration project, your message has been logged successfully.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setSubject('');
                  setMessage('');
                }}
                className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Send us a Message</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ticket Booking Inquiry / Organizer Question"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Message
                </label>
                <textarea
                  rows="4"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message or inquiry here..."
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-md shadow-indigo-200"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Contact Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h4 className="text-base font-bold text-slate-900">Project Support Info</h4>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-indigo-600 mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Email Address</p>
                  <p className="font-semibold text-slate-800">support@eventora.local</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-indigo-600 mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Phone</p>
                  <p className="font-semibold text-slate-800">+91 98765 00000</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-indigo-600 mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Campus / Location</p>
                  <p className="font-semibold text-slate-800">Department of Computer Science & Engineering</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
            <h4 className="text-sm font-bold text-indigo-950">Quick Demonstration Tip</h4>
            <p className="text-xs text-indigo-800 leading-relaxed">
              For your project demo or viva, all seeded user accounts can be logged in with a single click from the Login page.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <h4 className="text-sm font-bold text-slate-900">{faq.q}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
