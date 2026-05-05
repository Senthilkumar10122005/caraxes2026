const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Root',
    database: process.env.DB_NAME || 'caraxes2026',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function initializeDb() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'Root'
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'caraxes2026'}`);
        await connection.end();

        const dbConn = await pool.getConnection();

        // Safely check if tables exist
        await dbConn.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(20) NOT NULL,
                department VARCHAR(255) NOT NULL,
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
                location VARCHAR(255) NOT NULL,
                ticket_price DECIMAL(10,2) DEFAULT 0.00,
                total_seats INT NOT NULL,
                available_seats INT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await dbConn.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                booking_id VARCHAR(100) UNIQUE NOT NULL,
                user_id INT NOT NULL,
                event_id INT NOT NULL,
                team_name VARCHAR(255) DEFAULT NULL,
                team_members INT DEFAULT 1,
                team_member_names TEXT DEFAULT NULL,
                contact_email VARCHAR(255) DEFAULT NULL,
                status ENUM('VALID', 'USED') DEFAULT 'VALID',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
            )
        `);

        // Seed Data
        const bcrypt = require('bcryptjs');
        const [existingAdmins] = await dbConn.query('SELECT COUNT(*) as count FROM users WHERE role="admin"');
        if (existingAdmins[0].count === 0) {
            const hash = await bcrypt.hash('admin123', 10);
            await dbConn.query('INSERT INTO users (name, email, phone, department, password_hash, role) VALUES (?, ?, ?, ?, ?, "admin")', 
                ['Admin User', 'admin@caraxes.com', '0000000000', 'Management', hash]
            );
        }

        const [existingEvents] = await dbConn.query('SELECT COUNT(*) as count FROM events');
        if (existingEvents[0].count === 0) {
            await dbConn.query(`
                INSERT INTO events (title, description, image, date, time, location, ticket_price, total_seats, available_seats)
                VALUES 
                ('Code Clash', 'Test your logical thinking and coding skills.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800', '2026-03-15', '11:00 AM', 'Lab 1 & 2', 0.00, 150, 150),
                ('Hackathon', 'Build innovative real-world solutions under pressure.', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800', '2026-03-15', '11:00 AM', 'Innovation Lab', 250.00, 200, 200),
                ('Paper Presentation', 'Showcase your research and technical communication skills.', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', '2026-03-15', '11:00 AM', 'Seminar Hall', 100.00, 100, 100),
                ('Treasure Hunt', 'Follow the clues, solve the riddles.', 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=800', '2026-03-16', '11:00 AM', 'Campus Wide', 50.00, 300, 300),
                ('Quiz Mania', 'Test your knowledge across various domains.', 'https://images.unsplash.com/photo-1534330207226-e13fa1536326?w=800', '2026-03-16', '11:00 AM', 'Mini Auditorium', 0.00, 250, 250),
                ('Debugging Battle', 'Find and squash the most complex bugs.', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800', '2026-03-15', '02:00 PM', 'Lab 3', 0.00, 100, 100),
                ('Web Design', 'Craft the most beautiful and responsive web interfaces.', 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800', '2026-03-16', '10:00 AM', 'Lab 4', 0.00, 120, 120),
                ('E-Sports', 'Compete in high-octane gaming tournaments.', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800', '2026-03-16', '01:00 PM', 'Main Auditorium', 150.00, 200, 200)
            `);
        }

        dbConn.release();
        console.log('Database rewritten properly with MVC V2 schema.');
    } catch (err) {
        console.error('Error initializing Database:', err);
    }
}

const ready = initializeDb();

module.exports = {
    ready,
    getConnection: async () => { await ready; return await pool.getConnection(); },
    query: async (sql, params = []) => { await ready; const [rows, fields] = await pool.execute(sql, params); return [rows, fields]; }
};
