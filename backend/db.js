const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Root',
    database: process.env.DB_NAME || 'caraxes2026',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Initialization function to ensure table exists
// Initialization function to ensure database and table exist
async function initializeDb() {
    try {
        // First connection without database to ensure DB exists
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'Root'
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'caraxes2026'}`);
        await connection.end();

        const dbConn = await pool.getConnection();
        console.log('Connected to MySQL Database.');

        await dbConn.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('user', 'admin') DEFAULT 'user',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await dbConn.query(`
            CREATE TABLE IF NOT EXISTS events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                image VARCHAR(255),
                date DATE NOT NULL,
                time VARCHAR(50) NOT NULL,
                venue VARCHAR(255) NOT NULL,
                total_seats INT NOT NULL,
                available_seats INT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await dbConn.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                booking_id VARCHAR(100) UNIQUE NOT NULL,
                event_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                department VARCHAR(255) NOT NULL,
                ticket_type VARCHAR(50) DEFAULT 'Standard',
                status ENUM('VALID', 'USED') DEFAULT 'VALID',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
            )
        `);

        const bcrypt = require('bcryptjs');
        
        // Seed Default Admin
        const [existingAdmins] = await dbConn.query('SELECT COUNT(*) as count FROM users WHERE role="admin"');
        if (existingAdmins[0].count === 0) {
            const hash = await bcrypt.hash('admin123', 10);
            await dbConn.query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, "admin")', ['Admin User', 'admin@caraxes.com', hash]);
            console.log('Default Admin inserted.');
        }

        // Insert extracted sample events if none exist
        const [existingEvents] = await dbConn.query('SELECT COUNT(*) as count FROM events');
        if (existingEvents[0].count === 0) {
            await dbConn.query(`
                INSERT INTO events (title, description, image, date, time, venue, total_seats, available_seats)
                VALUES 
                ('Code Clash', 'Test your logical thinking and coding skills. Solve complex algorithmic problems within the time limit to emerge victorious.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800', '2026-03-15', '11:00 AM', 'Lab 1 & 2', 150, 150),
                ('Hackathon', 'Build innovative real-world solutions under pressure. Bring your ideas to life and impress the judges.', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800', '2026-03-15', '11:00 AM', 'Innovation Lab', 200, 200),
                ('Paper Presentation', 'Showcase your research and technical communication skills. Present on cutting-edge technologies.', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800', '2026-03-15', '11:00 AM', 'Seminar Hall', 100, 100),
                ('Debugging Battle', 'Find and fix the hidden bugs in the provided source code. Speed and accuracy are the keys to winning.', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800', '2026-03-15', '11:00 AM', 'Lab 3', 120, 120),
                ('Web Design Challenge', 'Design a responsive, beautiful UI from scratch based on a theme using HTML, CSS, and JS.', 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800', '2026-03-15', '11:00 AM', 'Lab 4', 100, 100),
                ('Treasure Hunt', 'Follow the clues, solve the riddles, and race across the campus to find the hidden treasure.', 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=800', '2026-03-16', '11:00 AM', 'Campus Wide', 300, 300),
                ('Quiz Mania', 'Test your knowledge across various domains including tech, pop culture, and sports.', 'https://images.unsplash.com/photo-1534330207226-e13fa1536326?auto=format&fit=crop&w=800', '2026-03-16', '11:00 AM', 'Mini Auditorium', 250, 250),
                ('Connections', 'Connect the visual clues on the screen to find the underlying word or phrase.', 'https://images.unsplash.com/photo-1510251197878-a2e6d2cb590c?auto=format&fit=crop&w=800', '2026-03-16', '11:00 AM', 'Seminar Hall 2', 150, 150),
                ('Photography Contest', 'Capture the spirit of Caraxes 2026. Submit your best shots based on the given theme.', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800', '2026-03-16', '11:00 AM', 'Campus', 100, 100),
                ('Fun Games Arena', 'Relax and have fun! Participate in minute-to-win-it games, VR setup, and more.', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800', '2026-03-16', '11:00 AM', 'Ground Floor Lobby', 500, 500)
            `);
            console.log('Sample events inserted.');
        }

        dbConn.release();
        console.log('MySQL Database and Table verified.');
    } catch (err) {
        console.error('Error connecting/initializing MySQL Database:', err);
    }
}

// Start initialization and export the promise
const ready = initializeDb();

const dbWrapper = {
    ready, // Exported promise for scripts that need to wait
    getConnection: async () => {
        await ready;
        return await pool.getConnection();
    },
    query: async (sql, params = []) => {
        await ready;
        // Compatibility wrapper for server.js
        const [rows, fields] = await pool.execute(sql, params);
        return [rows, fields];
    }
};

module.exports = dbWrapper;
