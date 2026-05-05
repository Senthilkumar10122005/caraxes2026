# Caraxes 2026 - Event Management System

**Caraxes 2026** is a comprehensive, full-stack college event management and ticketing platform designed to handle user registrations, OTP-verified ticket bookings, team management, and automated E-Ticket distribution.

This README is designed to explain the architecture, features, and technical decisions made during the development of this platform, specifically tailored for jury evaluation.

---

## 🏗️ 1. Technical Architecture & Tech Stack

This project strictly follows the **MVC (Model-View-Controller)** architecture pattern.

*   **Frontend (View):** Built using **React.js (Vite)** and styled with **Tailwind CSS**. We implemented a custom "Aurora Glass" UI design system utilizing backdrop filters, dynamic gradients, and CSS animations to give it a premium, modern feel.
*   **Backend (Controller):** Built with **Node.js** and **Express.js**. It handles business logic, API routing, email generation, and secure communication with the database.
*   **Database (Model):** Powered by **MySQL** using the `mysql2` package for fast, asynchronous, and secure database interactions.

---

## ✨ 2. Key Features & How They Were Built

### A. Two-Step OTP Booking & Team Registration
When a user books a ticket, the system differentiates between "Individual" and "Team" events. 
*   **Logic:** For team events (like Hackathons), the frontend actively enforces team size limits (e.g., Min 2, Max 4) and requires the user to input the names of all team members.
*   **OTP Verification:** Before the database is updated, the backend generates a random 6-digit OTP, stores it temporarily in the server's RAM (memory) with a 10-minute expiration timestamp, and emails it to the user.
*   **Security:** This ensures that fake emails cannot be used to hoard tickets.

### B. Transactional Seat Management (Preventing Overbooking)
**Jury Question:** *"What happens if two people try to book the exact last ticket at the very same millisecond?"*
*   **Our Solution:** We used **MySQL Transactions** combined with `FOR UPDATE` row-level locking. 
*   **How it works:** When a booking request comes in, the database locks the `events` row, checks if `available_seats > 0`, inserts the booking, decrements the seats, and then `COMMIT`s the transaction. If any error occurs, it triggers a `ROLLBACK`, ensuring data consistency and guaranteeing we never sell more tickets than available.

### C. Automated HTML E-Ticketing
*   **Logic:** Upon successful OTP verification, the backend generates a randomized `Booking ID` (e.g., `TKT-A8F9B2`).
*   **Implementation:** We utilized **Nodemailer** alongside standard SMTP protocols. The backend dynamically constructs a styled HTML email injecting the user's data (Event Name, Location, Team Members, Booking ID) and fires the email asynchronously so the user's UI doesn't freeze while waiting for the email to send.

### D. AI Event Chatbot (Groq API)
*   **Implementation:** We integrated the **Llama-3.1-8B** model via the **Groq API** to serve as a smart assistant.
*   **Contextual Intelligence:** Rather than letting the AI hallucinate, we injected a rigid `SYSTEM_PROMPT` containing the exact dates, timings, venues, and coordinator names for all 8 events. The AI acts exclusively as an expert on the Caraxes 2026 symposium.

### E. Security & Authentication
*   **Passwords:** Passwords are never stored in plain text. They are hashed using **bcryptjs**.
*   **Session Management:** User sessions are managed statelessly using **JWT (JSON Web Tokens)**. When a user logs in, they receive a JWT token stored in their `localStorage`, which is then attached as a `Bearer` token to every subsequent API request to authenticate them.

---

## 🗄️ 3. Database Schema Overview

The MySQL database (`caraxes2026`) utilizes a normalized relational structure:
1.  **`users` table:** Stores `id`, `name`, `email`, `password_hash`, and `role` (admin/user).
2.  **`events` table:** Stores event details, `total_seats`, and crucially, `available_seats` which dynamically updates.
3.  **`bookings` table:** The junction table. It links `user_id` and `event_id` via **Foreign Keys**. It handles `ON DELETE CASCADE` (meaning if an event is canceled and deleted, all associated bookings are automatically removed). It also stores `team_name`, `team_member_names`, and `contact_email`.

---

## 🚀 4. How to Run the Project Locally

**Step 1: Start the Backend server**
```bash
cd backend
# Ensure .env is configured with DB credentials, JWT_SECRET, and SMTP details
node server.js
```
*(Note: Upon startup, `db.js` automatically checks if the database exists and seeds it with the default events and the Master Admin account).*

**Step 2: Start the Frontend React application**
```bash
cd frontend
npm run dev
```

---

## 🎯 5. Summary for the Jury
This project proves our capability to design and implement a full-stack, production-ready system. We moved past simple CRUD operations by implementing real-world enterprise patterns like **Database Transactions**, **Stateful OTP flows**, **Stateless JWT Auth**, and **Third-Party AI Integration**, all wrapped in a custom-built, highly responsive frontend architecture.
