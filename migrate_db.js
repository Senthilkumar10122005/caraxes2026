const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'Root',
        database: process.env.DB_NAME || 'caraxes2026'
    });

    try {
        console.log('Adding team_name to bookings...');
        await connection.query('ALTER TABLE bookings ADD COLUMN team_name VARCHAR(255) DEFAULT NULL');
    } catch (e) {
        console.log('team_name might already exist or error:', e.message);
    }

    try {
        console.log('Adding team_members to bookings...');
        await connection.query('ALTER TABLE bookings ADD COLUMN team_members INT DEFAULT 1');
    } catch (e) {
        console.log('team_members might already exist or error:', e.message);
    }

    console.log('Migration complete.');
    process.exit(0);
}
migrate();
