# 🎟️ Eventora — Smart Event Management & Booking Platform

A full-stack **MERN** (MongoDB, Express, React, Node.js) web app for discovering events, booking tickets, and managing events. It has three role-based portals: **Attendee**, **Organizer**, and **Admin**.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Demo Accounts](#-demo-accounts)
- [API Reference](#-api-reference)
- [Database Models](#-database-models)
- [How It Works](#-how-it-works)
- [Deployment](#-deployment)
- [Available Scripts](#-available-scripts)

---

## ✨ Features

### 🌐 Public
- Home page, event search and filtering (title, city, category)
- Event details with live seat availability
- Register / Login, About and Contact pages

### 👤 Attendee Portal — `/dashboard`
- Book tickets with live total price calculation
- View all bookings (active and history)
- Printable digital pass with a unique reference code (e.g. `EVT-7X92K4`)
- Cancel a booking, which releases the seats back to the event
- Edit profile (name, phone)

### 🏢 Organizer Portal — `/organizer`
- Stats: tickets sold, events hosted, total revenue (₹)
- Create, edit, and delete events
- Capacity progress bars for each event
- View the attendee list (name, email, phone, booking reference) per event

### 👑 Admin Portal — `/admin`
- Platform-wide statistics
- User management: change roles (`attendee` / `organizer` / `admin`) and delete users
- Event moderation: set status to `published`, `draft`, or `cancelled`
- View all bookings across the platform

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Tailwind CSS, Axios, Lucide React |
| **Backend** | Node.js, Express, Mongoose |
| **Database** | MongoDB (local or Atlas) |
| **Auth** | JWT, bcryptjs, cookie-parser |
| **Tools** | Morgan (logging), CORS, dotenv |

---

## 📁 Project Structure

```
eventora/
├── package.json              # Root helper scripts
├── README.md
│
├── server/                   # Backend API
│   ├── server.js             # Entry point
│   ├── seed.js               # Demo data seeder
│   ├── viewDb.js             # Print DB contents in terminal
│   ├── .env.example
│   ├── config/db.js          # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js           # protect + authorize (JWT & roles)
│   │   └── error.js          # Central error handler
│   ├── models/               # User, Event, Booking
│   ├── controllers/          # auth, event, booking, dashboard, admin
│   └── routes/               # Route definitions
│
└── client/                   # Frontend (React + Vite)
    ├── index.html
    ├── vite.config.js        # Dev server + /api proxy
    ├── tailwind.config.js
    ├── .env.example
    └── src/
        ├── main.jsx
        ├── App.jsx           # Routes
        ├── index.css         # Tailwind + print styles
        ├── services/api.js   # Axios instance
        ├── context/AuthContext.jsx
        ├── components/       # Navbar, Footer, EventCard, StatCard, ...
        └── pages/            # Home, ExploreEvents, EventDetails, Login,
                              # Register, Dashboard, MyTickets,
                              # OrganizerPortal, AdminPortal, ...
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/try/download/community) running locally, **or** a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Clone the repository
```bash
git clone https://github.com/meetvaghamshi4-droid/eventora.git
cd eventora
```

### 2. Install dependencies
```bash
npm run install:all
```
Or install manually:
```bash
npm install
npm --prefix server install
npm --prefix client install
```

### 3. Configure environment variables
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```
Then edit `server/.env` (see [Environment Variables](#-environment-variables)).

### 4. Seed the database (optional but recommended)
```bash
npm run seed
```
This **clears** the existing data and inserts demo users, events, and bookings.

### 5. Run the app
Open **two terminals**:

```bash
# Terminal 1 — Backend (http://localhost:5000)
npm run server

# Terminal 2 — Frontend (http://localhost:5173)
npm run client
```

Open **http://localhost:5173** in your browser.
Check that the API is up: **http://localhost:5000/api/health**

---

## 🔐 Environment Variables

### `server/.env`
| Variable | Description | Example |
|---|---|---|
| `PORT` | API server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/eventora` |
| `JWT_SECRET` | Secret used to sign tokens (use a long random string) | `change_me_to_a_long_random_string` |
| `JWT_EXPIRE` | Token lifetime | `7d` |
| `CLIENT_URL` | Frontend URL (for CORS) | `http://localhost:5173` |

### `client/.env`
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL. Leave empty in development (Vite proxies `/api`). In production, set it to e.g. `https://your-backend.onrender.com/api` |

> ⚠️ Never commit your real `.env` files. They are already listed in `.gitignore`.

---

## 🔑 Demo Accounts

After running `npm run seed`:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@eventora.com` | `admin123` |
| Organizer | `organizer@eventora.com` | `organizer123` |
| Organizer 2 | `music@eventora.com` | `organizer123` |
| Attendee | `attendee@eventora.com` | `attendee123` |
| Attendee 2 | `priya@eventora.com` | `attendee123` |

> These are for development only. Remove or change them before any public deployment.

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

### Auth — `/auth`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Create an account |
| POST | `/login` | Public | Log in, returns JWT |
| POST | `/logout` | Public | Log out |
| GET | `/me` | Private | Get the current user |
| PUT | `/profile` | Private | Update profile |

### Events — `/events`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List events |
| GET | `/:id` | Public | Event details |
| GET | `/mine` | Organizer/Admin | Events created by me |
| POST | `/` | Organizer/Admin | Create event |
| PUT | `/:id` | Organizer/Admin | Update event |
| DELETE | `/:id` | Organizer/Admin | Delete event |

### Bookings — `/bookings`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Private | Book tickets |
| GET | `/mine` | Private | My bookings |
| GET | `/:id` | Owner/Organizer/Admin | Single booking (digital pass) |
| PUT | `/:id/cancel` | Private | Cancel and release seats |
| GET | `/event/:eventId` | Organizer/Admin | Attendees of an event |

### Dashboards — `/dashboard`
| Method | Endpoint | Access |
|---|---|---|
| GET | `/attendee` | Private |
| GET | `/organizer` | Organizer/Admin |
| GET | `/admin` | Admin |

### Admin — `/admin` (Admin only)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | List all users |
| PUT | `/users/:id/role` | Change a user's role |
| DELETE | `/users/:id` | Delete a user |
| GET | `/events` | List all events |
| PUT | `/events/:id/status` | Set event status |
| GET | `/bookings` | List all bookings |

---

## 🗄 Database Models

**User** — `name`, `email` (unique), `password` (hashed), `role` (`attendee` | `organizer` | `admin`), `phone`, `bio`

**Event** — `title`, `description`, `category`, `organizer` → User, `date`, `time`, `location`, `city`, `poster`, `ticketPrice`, `totalCapacity`, `ticketsBooked`, `status` (`published` | `draft` | `cancelled`)

**Booking** — `bookingReference` (unique), `user` → User, `event` → Event, `quantity`, `ticketPrice`, `totalAmount`, `bookingStatus` (`Confirmed` | `Cancelled`), `paymentStatus` (`Free` | `Paid` | `Pending`), `attendeeName`, `attendeeEmail`, `attendeePhone`

---

## ⚙️ How It Works

- **Authentication:** On login the server returns a signed JWT. The frontend stores it in `localStorage` and sends it as an `Authorization: Bearer <token>` header (an HTTP-only cookie is also supported).
- **Role-based access:** The `protect` middleware verifies the token and loads the user. `authorize(...roles)` then restricts routes by role. On the frontend, `ProtectedRoute` guards pages the same way.
- **Overbooking prevention:** Before creating a booking, the server checks `totalCapacity − ticketsBooked` and rejects requests that exceed it. Cancelling a booking gives the seats back.
- **Printable pass:** `@media print` rules in `index.css` hide the navigation and buttons, so only the ticket prints or saves as PDF.
- **Dev proxy:** Vite proxies `/api` to `http://localhost:5000`, so no CORS setup is needed in development.

---

## ☁️ Deployment

GitHub Pages can only serve static files, so it can host the **frontend only**. Deploy the full app like this:

| Part | Suggested service |
|---|---|
| Database | MongoDB Atlas (free tier) |
| Backend (`server/`) | Render or Railway. Set `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `CLIENT_URL` |
| Frontend (`client/`) | GitHub Pages, Netlify, or Vercel |

**Frontend steps:**
1. Set `VITE_API_URL=https://<your-backend-url>/api` in `client/.env`.
2. Run `npm --prefix client run build`.
3. Publish `client/dist/`.
4. For GitHub Pages: set `base: '/<repo-name>/'` in `vite.config.js`, and use `HashRouter` (or a 404 redirect) so page refreshes don't break routes.
5. Add the deployed frontend URL to `CLIENT_URL` on the backend.

---

## 📜 Available Scripts

**Root**
| Command | Description |
|---|---|
| `npm run install:all` | Install root, server, and client dependencies |
| `npm run server` | Start the backend in watch mode |
| `npm run client` | Start the Vite dev server |
| `npm run seed` | Reset and seed the database |
| `npm run db:view` | Print users, events, and bookings in the terminal |

**Client:** `npm run build` (production build), `npm run preview` (preview the build)

---

## 👨‍💻 Author

Built by  

Contributions, issues, and feature requests are welcome!
