const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

exports.register = async (req, res) => {
    try {
        const { name, email, phone, department, password } = req.body;
        if (!name || !email || !password || !phone || !department) return res.status(400).json({ success: false, message: 'All fields required' });

        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ success: false, message: 'Email already registered' });

        const hash = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (name, email, phone, department, password_hash, role) VALUES (?, ?, ?, ?, ?, "user")', 
            [name, email, phone, department, hash]);
        
        res.status(201).json({ success: true, message: 'Registration successful. You can log in now.' });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });

        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(404).json({ success: false, message: 'Invalid credentials' });

        const user = users[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET || 'secret123', { expiresIn: '24h' });
        res.json({ success: true, token, user: { id: user.id, name: user.name, role: user.role, email: user.email, phone: user.phone, department: user.department }});
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
