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
            CREATE TABLE IF NOT EXISTS registrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                college VARCHAR(255) NOT NULL,
                department VARCHAR(255) NOT NULL,
                year VARCHAR(50) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                email VARCHAR(255) NOT NULL,
                event_name VARCHAR(255) NOT NULL,
                team_name VARCHAR(255),
                team_members TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_registration (email, event_name)
            )
        `);

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
