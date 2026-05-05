const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'Root',
            database: process.env.DB_NAME || 'caraxes2026'
        });
        await conn.query(`
            INSERT INTO events (title, description, image, date, time, location, ticket_price, total_seats, available_seats)
            VALUES 
            ('Debugging Battle', 'Find and squash the most complex bugs.', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800', '2026-03-15', '02:00 PM', 'Lab 3', 0.00, 100, 100),
            ('Web Design', 'Craft the most beautiful and responsive web interfaces.', 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800', '2026-03-16', '10:00 AM', 'Lab 4', 0.00, 120, 120),
            ('E-Sports', 'Compete in high-octane gaming tournaments.', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800', '2026-03-16', '01:00 PM', 'Main Auditorium', 150.00, 200, 200)
        `);
        console.log('Inserted new events!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
run();
