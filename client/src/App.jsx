import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import ExploreEvents from './pages/ExploreEvents';
import EventDetails from './pages/EventDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';

// Unified Simplified Portals
import Dashboard from './pages/Dashboard';
import OrganizerPortal from './pages/OrganizerPortal';
import AdminPortal from './pages/AdminPortal';
import MyTickets from './pages/MyTickets';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      {/* Streamlined Navbar */}
      <Navbar />

      {/* Main Content View */}
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<ExploreEvents />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Printable Ticket View */}
          <Route
            path="/ticket/:id"
            element={
              <ProtectedRoute>
                <MyTickets />
              </ProtectedRoute>
            }
          />

          {/* 1. Unified Attendee Dashboard (Stats + My Bookings + Profile) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/my-bookings" element={<Navigate to="/dashboard" replace />} />
          <Route path="/profile" element={<Navigate to="/dashboard" replace />} />

          {/* 2. Unified Organizer Portal (Stats + My Events + Create Event + Attendees) */}
          <Route
            path="/organizer"
            element={
              <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                <OrganizerPortal />
              </ProtectedRoute>
            }
          />
          <Route path="/organizer/dashboard" element={<Navigate to="/organizer" replace />} />
          <Route path="/organizer/events" element={<Navigate to="/organizer" replace />} />
          <Route path="/organizer/create-event" element={<Navigate to="/organizer" replace />} />

          {/* 3. Unified Admin Portal (Platform Stats + Users + Events + Bookings) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPortal />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="/admin/users" element={<Navigate to="/admin" replace />} />
          <Route path="/admin/events" element={<Navigate to="/admin" replace />} />
          <Route path="/admin/bookings" element={<Navigate to="/admin" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Clean Footer */}
      <Footer />
    </div>
  );
}

export default App;
