const db = require('../models/db');

exports.getAllEvents = async (req, res) => {
    try {
        const [events] = await db.query('SELECT * FROM events ORDER BY date ASC');
        res.json({ success: true, events });
    } catch (error) {
        console.error('Fetch events error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
