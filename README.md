# Eventora — Smart Event Management & Booking Platform

> **Full Stack Development (MERN Stack) | Clean, Streamlined & Student-Friendly Implementation**

---

## 🌟 Overview

**Eventora** is a complete, full-stack event ticketing and management web application built using the modern **MERN stack** (MongoDB, Express.js, React.js, Node.js).

The application has been simplified into an intuitive **3-Portal Architecture** (Attendee, Organizer, Admin) so it is clean, pleasant to use, and effortless to demonstrate and explain during a college viva.

---

## 🧭 Simplified Architecture: 3 Unified Portals

Instead of dozens of scattered, confusing pages, the application is organized into **3 role-specific portals**:

```
                       ┌──────────────────────┐
                       │   Public Experience  │
                       │ Home • Explore Events│
                       │ Event Details & Pass │
                       └──────────┬───────────┘
                                  │ (Login with 1-click Demo)
        ┌─────────────────────────┼─────────────────────────┐
        ▼                         ▼                         ▼
┌──────────────────┐    ┌──────────────────┐     ┌──────────────────┐
│ Attendee Portal  │    │ Organizer Portal │     │   Admin Center   │
│   (/dashboard)   │    │   (/organizer)   │     │     (/admin)     │
├──────────────────┤    ├──────────────────┤     ├──────────────────┤
│ • Active Passes  │    │ • Sales & Revenue│     │ • Platform Stats │
│ • Order History  │    │ • My Events List │     │ • User Roles     │
│ • Cancel & Print │    │ • Create Event   │     │ • Event Moderation
│ • Profile Edit   │    │ • Attendee List  │     │ • All Bookings   │
└──────────────────┘    └──────────────────┘     └──────────────────┘
```

---

## 🚀 Key Features

### 1. Public Discovery & Booking
- **Hero & Search**: Search by title, keyword, city, or category (*Technology, Music, Business, Workshops, Arts, Sports*).
- **Live Event Details**: High-resolution banner, date, venue, organizer badge, description, and real-time seat availability bar.
- **Pass Reservation**: Select ticket quantity, calculate total live, and reserve passes with instant capacity decrement.

### 2. Unified Attendee Portal (`/dashboard`)
- **Active Passes & History**: All booked tickets in one place.
- **Digital Printable Pass**: Click *"View & Print"* to get an official pass with unique booking reference code (e.g. `EVT-7X92K4`) formatted for clean browser printing (`window.print()`).
- **Cancellation with Capacity Release**: Cancelling a reservation immediately restores available capacity for other users.
- **Profile Settings**: Simple tab to update name and phone number.

### 3. Unified Organizer Portal (`/organizer`)
- **Performance Metrics**: Real-time stats on tickets sold, hosted events, and total gross revenue (₹).
- **My Events List**: Live capacity progress bars (`ticketsBooked / totalCapacity`), edit listing, and delete listing.
- **Attendee Registry Modal**: 1-click view of all registered attendee names, emails, phones, and booking references for each event.
- **Create / Edit Event Tab**: Clean form with instant poster preview, date, schedule, venue, ticket price, and seat capacity.

### 4. Unified Admin Center (`/admin`)
- **Global Overview**: Platform metrics for total users, events, orders, and total ticket collection.
- **User Governance Tab**: Table of registered users with inline role promotion (`attendee` ⇄ `organizer` ⇄ `admin`) and account deletion.
- **Event Moderation Tab**: Review all listings with inline publication status changer (`published`, `draft`, `cancelled`).
- **Booking Audit Tab**: Platform-wide transaction history.

---

## 🔑 1-Click Demo Accounts

On the [Login page](http://localhost:5173/login), click any quick-fill button to log in instantly:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@eventora.com` | `admin123` | Full administrative control, user moderation, all events and bookings |
| **🏢 Organizer** | `organizer@eventora.com` | `organizer123` | Create & edit events, track capacity, view attendee lists |
| **🎵 Organizer 2** | `music@eventora.com` | `organizer123` | Live concerts and cultural festival management |
| **👤 Attendee** | `attendee@eventora.com` | `attendee123` | Book tickets, view and print digital passes, cancel reservations |
| **👤 Attendee 2** | `priya@eventora.com` | `attendee123` | Independent attendee account |

---

## ⚡ How to Run the Project

### 1. Start Backend Server
```bash
cd server
npm run dev
# Server running on http://localhost:5000 (connected to MongoDB)
```

### 2. Start Frontend Client
```bash
cd client
npm run dev
# Client running on http://localhost:5173
```

### 3. Database Tools
- **View Database in Terminal**: `npm run db:view` (prints formatted console tables of `users`, `events`, and `bookings`).
- **Re-seed Sample Data**: `npm --prefix server run seed`

---

## 🎓 Viva & Demonstration Cheat-Sheet

Here are 5 core questions examiners ask during viva presentations, along with concise student answers:

### Q1: How does capacity validation prevent overbooking?
> *"When a booking request arrives, the backend controller checks `event.totalCapacity - event.ticketsBooked`. If the requested quantity exceeds the remaining seats, the server rejects it. If valid, the booking is created and `event.ticketsBooked` is incremented. When an attendee cancels, capacity is safely released back."*

### Q2: How does Role-Based Access Control (RBAC) work?
> *"We use signed JSON Web Tokens (JWT). The token contains the user's `id` and `role`. On every protected request, our backend `protect` middleware verifies the token and attaches `req.user`. Then `authorize('organizer', 'admin')` verifies permissions before executing controller logic. The frontend also uses `ProtectedRoute` to guard routes."*

### Q3: Why use Mongoose schemas with a NoSQL database?
> *"MongoDB is schema-less by default, but production applications need data integrity. Mongoose enforces required fields, defaults, data types, email regex validation, and relational references between Users, Events, and Bookings using ObjectIds."*

### Q4: How does the digital pass print cleanly?
> *"In `client/src/index.css`, we use CSS `@media print` rules. When `window.print()` is triggered, all navigation elements and buttons are hidden (`display: none`), and only the ticket pass card is sent to the printer or saved as PDF."*

### Q5: How do frontend and backend connect in development?
> *"Our Vite configuration (`vite.config.js`) proxies all `/api` requests to `http://localhost:5000`. This allows seamless API communication without CORS configuration issues in development."*
