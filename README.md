# Caraxes 2026: College Event Ticket Booking System

A secure, full-stack, enterprise-grade Event Management and Ticketing Platform engineered specifically for college symposiums. Built using a modern React frontend and a robust MVC-pattern Node.js backend.

## 🚀 Tech Stack Highlights

**Frontend:**
- **React.js (Vite)**: Lightning-fast component rendering and hot-module reloading.
- **Tailwind CSS v4**: Utility-first styling utilizing dark-mode aesthetics and glassmorphism UI principles.
- **React Router Dom**: Client-side routing for seamless Single Page Application (SPA) navigation.
- **React Hot Toast**: Beautiful, animated synchronous notification popups.
- **Axios**: Promised-based HTTP client for rigorous backend API integration.

**Backend:**
- **Node.js & Express.js**: Asynchronous event-driven backend handling RESTful operations.
- **Model-View-Controller (MVC) Architecture**: Codebase is rigorously divided into `models`, `routes`, and `controllers` for maximum scalability and maintainability.
- **JSON Web Tokens (JWT)**: Stateless, cryptographically signed authentication for route protection (`authMiddleware`).
- **Bcrypt.js**: Advanced salt & hash algorithms protecting plaintext user passwords.
- **Nodemailer**: Automated SMTP pipeline dispatching high-resolution HTML styling for Ticket Confirmations.

**Database:**
- **MySQL**: Relational database architecture mapping 3 distinct tables (`users`, `events`, `bookings`) utilizing primary keys, auto-increment tracking, and recursive Foreign Keys with `ON DELETE CASCADE` properties.

---

## 🌟 Core Features & Modules

### 1. Advanced Authentication & Session Handling
- Split role architecture distinguishing regular `user` from master `admin`.
- Deeply enforced authentication context pushing unverified traffic out of protected pathways.
- Re-entry verification automatically logs users back into their specific Dashboard natively via LocalStorage caching.

### 2. Participant Booking Flow (Users)
- **Dynamic Events Roster**: Fetches live availability, times, locations, and pricing securely from MySQL.
- **One-Click Automation**: Booking forms automatically hydrate dynamically from the authenticated user's JWT payload (no typing out names/emails repeatedly).
- **Concurrent Integrity**: SQL transactional locks (`FOR UPDATE`) prevent double-booking or over-drafting total seat capacity.
- **Instant SMTP Dispatch**: Upon a successful SQL transaction, a highly-aesthetic digital entry badge is emailed directly to the user's inbox in real-time.

### 3. Absolute Admin Control Suite (Manager)
Protected strictly behind the `admin` network. This suite provides supreme analytical and management power:
- **Analytic Aggregators**: Live quantitative metrics calculating Total Revenues, Total Registrations, and Live Capacity.
- **Gate Validator Engine**: Security terminal allowing administrators to quickly type a Booking Reference ID natively marking the SQL tuple as `USED`—permanently blocking multiple check-ins.
- **Event Orchestration (CRUD)**: Create new symposium activities with direct parameters (Price, Limit, Location) or delete obsolete ones. Deleting an event atomically cascades to delete all associated user bookings.
- **User Oversight**: Full index viewing matrix of registered participants with one-click user deletion capabilities.
- **CSV Data Extraction**: Export dynamic tables of participant interactions directly into Excel/Sheets for physical roll-call.

---

## 📁 Repository Structure Overview

```text
/spark2026/
├── /backend/                        # Node.js Express Server Environment
│   ├── server.js                    # The root application wrapper mounting all middleware
│   ├── /models/db.js                # MySQL Connection Pool & Schema Initializer
│   ├── /middleware/auth.js          # JWT Interceptor filtering User/Admin access levels
│   ├── /routes/                     # Express Routers mapping endpoints
│   │   ├── authRoutes.js            # Registration, Login integrations
│   │   ├── adminRoutes.js           # Protected Management routes
│   │   ├── bookingRoutes.js         # Transaction endpoints
│   │   └── eventRoutes.js           # Public/Private API reads
│   └── /controllers/                # Raw Javascript Business Logic
│       ├── authController.js        # Hashing & validation pipelines
│       ├── adminController.js       # CRUD operations and Aggregations
│       ├── bookingController.js     # Nodemailer and Transactional safety loops
│       └── eventController.js       # Event pipeline handlers
│
└── /frontend/                       # React.js Vite Application
    ├── index.html                   # Entry point Document Object Model
    ├── /src/                        # Core React Directory
    │   ├── App.jsx                  # React Router mapping component trees
    │   ├── AuthContext.jsx          # Global State Management defining user sessions
    │   ├── index.css                # Base Tailwind configuration variables
    │   └── /pages/
    │       ├── Admin.jsx            # Multi-tab Dashboard UI
    │       ├── Dashboard.jsx        # User Symposium Index
    │       ├── Home.jsx             # Public Landing Area
    │       ├── Login/Register.jsx   # Authentication Portal UIs
    │       ├── Booking.jsx          # Event specific checkout process
    │       └── Ticket.jsx           # Rendered Digital Pass template
```

---

## 🛠️ Developer Setup & Startup

To run this application locally, ensure you have Node.js and a MySQL server active.

**1. Database Configuration**
A `.env` file must be present in `/backend/` containing:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_SQL_PASSWORD
DB_NAME=caraxes2026
JWT_SECRET=super_secret_key
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

**2. Node Server Initialization**
The system is equipped with an auto-seeding framework. Running the backend for the very first time will automatically drop/build the schemas and seed 5 Technical events alongside a master Admin login credentials (`admin@caraxes.com` / `admin123`).
```bash
cd backend
npm install
node server.js
```

**3. React Client Initialization**
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173/` inside your browser to view the application!
