const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'Root',
        database: process.env.DB_NAME || 'caraxes2026'
    });

    try {
        console.log('Adding team_member_names to bookings...');
        await connection.query('ALTER TABLE bookings ADD COLUMN team_member_names TEXT DEFAULT NULL');
    } catch (e) {
        console.log('team_member_names might already exist or error:', e.message);
    }

    try {
        console.log('Adding contact_email to bookings...');
        await connection.query('ALTER TABLE bookings ADD COLUMN contact_email VARCHAR(255) DEFAULT NULL');
    } catch (e) {
        console.log('contact_email might already exist or error:', e.message);
    }

    console.log('Migration step 2 complete.');
    process.exit(0);
}
migrate();
