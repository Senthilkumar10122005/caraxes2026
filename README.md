# SPARK 2026 - Department Symposium

Welcome to the ultimate college tech-fest platform! This repository contains a fully responsive, modern web application built with HTML5, CSS3, Vanilla JS, and a Node.js/Express backend with a MySQL database.

## Features Included
- **Frontend**: Glassmorphism UI, Responsive design, animated backgrounds, countdown timer, dynamic modals.
- **Backend**: Express.js server, MySQL connection, prevent duplicate registrations, endpoint `/api/register`.
- Complete adherence to the free symposium model!

## Prerequisites
- Node.js (v14 or higher)
- MySQL Server

## Step 1: Database Setup
1. Open your MySQL client (e.g. phpMyAdmin, MySQL Workbench, or CLI).
2. Create a database named `spark2026`:
   ```sql
   CREATE DATABASE spark2026;
   USE spark2026;
   ```
3. Create the `registrations` table:
   ```sql
   CREATE TABLE registrations (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       college VARCHAR(255) NOT NULL,
       department VARCHAR(255) NOT NULL,
       year VARCHAR(50) NOT NULL,
       phone VARCHAR(20) NOT NULL,
       email VARCHAR(255) NOT NULL,
       event_name VARCHAR(100) NOT NULL,
       team_name VARCHAR(255),
       team_members TEXT,
       timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

## Step 2: Backend Setup
1. Navigate to the `backend` folder in your terminal:
   ```bash
   cd backend
   ```
2. Install dependencies (if not already done via the agent):
   ```bash
   npm install
   ```
3. Configure environment variables in `backend/.env`:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=spark2026
   PORT=3000
   ```
4. Run the backend server:
   ```bash
   node server.js
   ```

## Step 3: Frontend Execution
1. The frontend can be served statically by the backend server. If you start the backend server, simply navigate to:
   ```
   http://localhost:3000/
   ```
2. Alternatively, you can open `frontend/index.html` directly in your browser. (Note: Make sure the backend server is running on `localhost:3000` so the fetch APIs work properly via the fallback absolute URL in `main.js`).

## Enjoy the event! 🎉🔥
