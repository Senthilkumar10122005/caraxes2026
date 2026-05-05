const db = require('../models/db');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

global.otpStore = global.otpStore || {};

exports.sendOtp = async (req, res) => {
    try {
        const { contact_email } = req.body;
        if (!contact_email) return res.status(400).json({ success: false, message: 'Email required for OTP.' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        global.otpStore[contact_email] = { otp, expires: Date.now() + 10 * 60 * 1000 };

        const mailOptions = {
            from: `"Caraxes 2026 Admin" <${process.env.SMTP_USER}>`,
            to: contact_email,
            subject: 'Caraxes 2026 - Booking Verification OTP',
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2>Your OTP for Caraxes Ticket Booking</h2>
                    <p style="font-size: 24px; font-weight: bold; color: #0ea5e9;">${otp}</p>
                    <p>This OTP will expire in 10 minutes.</p>
                </div>
            `
        };

        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            await transporter.sendMail(mailOptions);
        } else {
            console.log(`[DEV MODE] OTP for ${contact_email} is ${otp}`);
        }

        res.json({ success: true, message: 'OTP sent successfully!' });
    } catch (error) {
        console.error('OTP Send Error:', error.message);
        const storedOtp = global.otpStore[contact_email]?.otp;
        console.log(`[FALLBACK DEV MODE] OTP for ${contact_email} is ${storedOtp}`);
        res.json({ success: true, message: `OTP email failed (${error.message}). Check terminal for OTP.` });
    }
};

exports.bookTicket = async (req, res) => {
    try {
        const { event_id, team_name, team_members, team_member_names, contact_email, otp } = req.body;
        const user_id = req.user.id;

        if (!event_id) return res.status(400).json({ success: false, message: 'Event ID required.' });
        if (!contact_email) return res.status(400).json({ success: false, message: 'Contact email required.' });
        if (!otp) return res.status(400).json({ success: false, message: 'OTP required.' });

        const storedOtpData = global.otpStore[contact_email];
        if (!storedOtpData || storedOtpData.otp !== otp || Date.now() > storedOtpData.expires) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
        }

        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            const [events] = await connection.query('SELECT available_seats, title, image, location, date, time FROM events WHERE id = ? FOR UPDATE', [event_id]);
            if (events.length === 0) throw new Error('Event not found');
            if (events[0].available_seats <= 0) throw new Error('Tickets sold out');

            const event = events[0];
            const booking_id = `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

            const tName = team_name || null;
            const tMembers = team_members ? parseInt(team_members) : 1;
            const tNames = team_member_names || null;
            const cEmail = contact_email || req.user.email;

            await connection.query(
                'INSERT INTO bookings (booking_id, user_id, event_id, team_name, team_members, team_member_names, contact_email) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [booking_id, user_id, event_id, tName, tMembers, tNames, cEmail]
            );

            await connection.query('UPDATE events SET available_seats = available_seats - 1 WHERE id = ?', [event_id]);
            
            // Clear OTP
            delete global.otpStore[contact_email];
            
            await connection.commit();
            connection.release();

            // Fire off beautiful styled Email asynchronously
            setImmediate(async () => {
                const imageUrl = event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';
                const emailHtml = `
                <div style="font-family: Arial, sans-serif; max-w-xl; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b;">
                    <img src="${imageUrl}" style="width: 100%; height: 200px; object-fit: cover;" alt="Event Image" />
                    <div style="padding: 30px;">
                        <h1 style="color: #38bdf8; margin-top: 0;">🎟️ Ticket Confirmed!</h1>
                        <p style="font-size: 16px; color: #94a3b8;">Hello ${req.user.name}, you are successfully registered for <strong>${event.title}</strong>.</p>
                        
                        <div style="background: #1e293b; border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #38bdf8;">
                            <p style="margin: 0 0 10px 0;"><span style="color: #64748b;">Booking ID:</span> <strong style="color: #fff; font-family: monospace; font-size: 18px;">${booking_id}</strong></p>
                            <p style="margin: 0 0 10px 0;"><span style="color: #64748b;">Date & Time:</span> <strong style="color: #fff;">${new Date(event.date).toLocaleDateString()} at ${event.time}</strong></p>
                            <p style="margin: 0 0 10px 0;"><span style="color: #64748b;">Venue / Location:</span> <strong style="color: #fff;">${event.location}</strong></p>
                            ${tName ? `<p style="margin: 0 0 10px 0;"><span style="color: #64748b;">Team Name:</span> <strong style="color: #f43f5e;">${tName}</strong></p>
                            <p style="margin: 0 0 10px 0;"><span style="color: #64748b;">Team Size:</span> <strong style="color: #fff;">${tMembers} Members</strong></p>
                            <p style="margin: 0;"><span style="color: #64748b;">Members:</span> <span style="color: #cbd5e1; font-style: italic;">${tNames}</span></p>` : ''}
                        </div>
                        
                        <p style="font-size: 14px; color: #64748b; text-align: center; margin-bottom: 0;">Please keep this Booking ID handy. Thanks for joining Caraxes 2026!</p>
                    </div>
                </div>
                `;

                try {
                    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
                        await transporter.sendMail({
                            from: `"Caraxes 2026 Admin" <${process.env.SMTP_USER}>`,
                            to: cEmail,
                            subject: `Ticket Confirmed: ${event.title}`,
                            html: emailHtml
                        });
                    }
                } catch (emailErr) {
                    console.error("Email failed", emailErr);
                }
            });

            res.status(201).json({ success: true, booking_id, message: 'Ticket Booked successfully!' });
        } catch (txnError) {
            await connection.rollback();
            connection.release();
            res.status(400).json({ success: false, message: txnError.message });
        }
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.getTicket = async (req, res) => {
    try {
        const [bookings] = await db.query(`
            SELECT b.*, e.title as event_name, e.location, e.date, e.time, u.name as user_name, u.email, u.phone 
            FROM bookings b 
            JOIN events e ON b.event_id = e.id 
            JOIN users u ON b.user_id = u.id
            WHERE b.booking_id = ?
        `, [req.params.booking_id]);

        if (bookings.length === 0) return res.status(404).json({ success: false, message: 'Ticket not found' });
        res.json({ success: true, ticket: bookings[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
