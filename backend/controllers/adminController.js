const db = require('../models/db');

exports.getStats = async (req, res) => {
    try {
        const [users] = await db.query('SELECT COUNT(*) as count FROM users');
        const [events] = await db.query('SELECT COUNT(*) as count FROM events');
        const [bookings] = await db.query('SELECT COUNT(*) as count FROM bookings');

        res.json({
            success: true,
            stats: {
                totalUsers: users[0].count,
                totalEvents: events[0].count,
                totalBookings: bookings[0].count
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch stats' });
    }
};

exports.addEvent = async (req, res) => {
    try {
        const { title, description, image, date, time, location, ticket_price, total_seats } = req.body;
        await db.query(`
            INSERT INTO events (title, description, image, date, time, location, ticket_price, total_seats, available_seats) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [title, description, image, date, time, location, ticket_price, total_seats, total_seats]);
        res.json({ success: true, message: 'Event added successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add event' });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        await db.query('DELETE FROM events WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete event' });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, name, email, phone, department, role, created_at FROM users ORDER BY created_at DESC');
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete user' });
    }
};

exports.getBookings = async (req, res) => {
    try {
        const [bookings] = await db.query(`
            SELECT b.*, e.title as event_name, u.name as user_name, u.email, u.phone, u.department 
            FROM bookings b 
            JOIN events e ON b.event_id = e.id 
            JOIN users u ON b.user_id = u.id
            ORDER BY b.created_at DESC
        `);
        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.scanTicket = async (req, res) => {
    try {
        const { booking_id } = req.body;
        const [bookings] = await db.query('SELECT status FROM bookings WHERE booking_id = ?', [booking_id]);
        
        if (bookings.length === 0) return res.status(404).json({ success: false, message: 'Invalid Ticket ID' });
        if (bookings[0].status === 'USED') return res.status(400).json({ success: false, message: 'Ticket already used' });

        await db.query("UPDATE bookings SET status = 'USED' WHERE booking_id = ?", [booking_id]);
        res.json({ success: true, message: 'Ticket validated successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
