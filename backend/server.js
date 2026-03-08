require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');
const nodemailer = require('nodemailer');
const axios = require('axios');
const Jimp = require('jimp');
const QRCode = require('qrcode');
const fs = require('fs');
const os = require('os');

// Ensure temp directory exists for generated tickets
const tempDir = process.env.VERCEL_ENV ? path.join(os.tmpdir(), 'temp_tickets') : path.join(__dirname, 'temp_tickets');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const techEvents = ['Code Clash', 'Hackathon', 'Paper Presentation', 'Debugging Battle', 'Web Design Challenge'];
const nonTechEvents = ['Treasure Hunt', 'Quiz Mania', 'Connections', 'Photography Contest', 'Fun Games Arena'];

// Event Metadata for QR Code
const eventMetadata = {
    'Code Clash': { venue: 'Lab 1 & 2', time: '11:00 AM' },
    'Hackathon': { venue: 'Innovation Lab', time: '11:00 AM' },
    'Paper Presentation': { venue: 'Seminar Hall', time: '11:00 AM' },
    'Debugging Battle': { venue: 'Lab 3', time: '11:00 AM' },
    'Web Design Challenge': { venue: 'Lab 4', time: '11:00 AM' },
    'Treasure Hunt': { venue: 'Campus Wide', time: '11:00 AM' },
    'Quiz Mania': { venue: 'Mini Auditorium', time: '11:00 AM' },
    'Connections': { venue: 'Seminar Hall 2', time: '11:00 AM' },
    'Photography Contest': { venue: 'Campus', time: 'All Day' },
    'Fun Games Arena': { venue: 'Ground Floor Lobby', time: 'Ongoing' }
};

// Email Transporter (Configure with user credentials)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files if we want to run both from same origin (Optional, but good for local dev)
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Caraxes 2026 Backend is running' });
});

// Registration Endpoint
app.post('/api/register', async (req, res) => {
    try {
        const {
            name, college, department, year, phone, email,
            event_name, team_name, team_members
        } = req.body;

        // Basic Validation
        if (!name || !college || !department || !year || !phone || !email || !event_name) {
            return res.status(400).json({ success: false, message: 'All required fields must be filled.' });
        }

        // Check Event Type
        const isTechEvent = techEvents.includes(event_name);
        const isNonTechEvent = nonTechEvents.includes(event_name);

        if (!isTechEvent && !isNonTechEvent) {
            return res.status(400).json({ success: false, message: 'Invalid event selected.' });
        }

        // Check for duplicate registration and type limits
        const [existing] = await db.query(
            'SELECT event_name FROM registrations WHERE email = ?',
            [email]
        );

        let hasTech = false;
        let hasNonTech = false;
        let alreadyRegisteredForEvent = false;

        for (let row of existing) {
            if (row.event_name === event_name) alreadyRegisteredForEvent = true;
            if (techEvents.includes(row.event_name)) hasTech = true;
            if (nonTechEvents.includes(row.event_name)) hasNonTech = true;
        }

        if (alreadyRegisteredForEvent) {
            return res.status(409).json({
                success: false,
                message: 'You have already registered for this event with this email.'
            });
        }

        if (isTechEvent && hasTech) {
            return res.status(409).json({
                success: false,
                message: 'You can only register for ONE Technical event.'
            });
        }

        if (isNonTechEvent && hasNonTech) {
            return res.status(409).json({
                success: false,
                message: 'You can only register for ONE Non-Technical event.'
            });
        }

        // --- Dynamic Ticket Generation ---
        const uniqueId = `TICKET-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const ticketPath = path.join(tempDir, `${uniqueId}.png`);
        let generatedTicketPath = path.join(__dirname, 'assets', 'caraxes_ticket.png'); // fallback

        try {
            // Load base ticket image
            const image = await Jimp.read(generatedTicketPath);

            // Load font (using Jimp's built-in fonts)
            const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
            const smallFont = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);

            // Print Text on Image
            image.print(font, 50, 50, name.toUpperCase());
            image.print(smallFont, 50, 90, event_name);
            image.print(smallFont, 50, 115, `College: ${college}`);
            image.print(smallFont, 50, 140, `ID: ${uniqueId}`);

            // Generate QR Code as Buffer - Enriched with Location & Time
            const metadata = eventMetadata[event_name] || { venue: 'Main Auditorium', time: '11:00 AM' };
            const qrText = `CARAXES 2026 VIP PASS\n` +
                `Attendee: ${name.toUpperCase()}\n` +
                `Event: ${event_name}\n` +
                `Venue: ${metadata.venue}\n` +
                `Time: ${metadata.time}\n` +
                `Ticket ID: ${uniqueId}`;

            const qrBuffer = await QRCode.toBuffer(qrText, {
                errorCorrectionLevel: 'H',
                margin: 1,
                width: 150,
                color: {
                    dark: '#00f2fe',  // Primary theme color
                    light: '#000000'
                }
            });
            const qrImage = await Jimp.read(qrBuffer);

            // Overlay QR code onto the ticket (example coordinates: bottom-right)
            // Assuming ticket is at least 600x300. Adjust based on generated AI ticket dimensions.
            const width = image.bitmap.width;
            const height = image.bitmap.height;
            image.composite(qrImage, width - 180, height - 180);

            // Save the unique ticket
            await image.writeAsync(ticketPath);
            generatedTicketPath = ticketPath;
        } catch (imgError) {
            console.error('Failed to generate unique ticket image:', imgError);
            // Will gracefully fallback to the generic ticket
        }

        // Send Email Confirmation
        try {
            const mailOptions = {
                from: `"Caraxes 2026 Symposium" <${process.env.SMTP_USER}>`,
                to: email,
                subject: `Registration Confirmed: ${event_name} @ Caraxes 2026`,
                html: `
                    <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #e0e0e0; max-width: 600px; margin: 0 auto; background: #0b0f19; padding: 20px; border-radius: 12px; border: 1px solid #1f2937;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h2 style="color: #00f2fe; margin-bottom: 5px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">CARAXES 2026</h2>
                            <p style="color: #a0aec0; margin-top: 5px; font-size: 0.9rem;">THE ULTIMATE TECH SYMPOSIUM</p>
                        </div>
                        <img src="cid:ticket_img" alt="VIP Pass" style="width: 100%; max-width: 500px; height: auto; display: block; margin: 0 auto 20px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,242,254,0.3);" />
                        <p>Hi <strong style="color: #fff;">${name}</strong>,</p>
                        <p>Your registration for <strong>${event_name}</strong> has been successfully processed. Prepare to ignite innovation.</p>
                        <div style="background-color: rgba(255,255,255,0.03); padding: 15px; border-left: 4px solid #00f2fe; margin: 20px 0; border-radius: 4px;">
                            <h3 style="margin-top: 0; color: #00f2fe; font-size: 1.1rem; text-transform: uppercase;">Mission Details</h3>
                            <ul style="list-style-type: none; padding-left: 0; color: #cbd5e1;">
                                <li style="margin-bottom: 8px;"><strong>Event:</strong> ${event_name}</li>
                                <li style="margin-bottom: 8px;"><strong>Identity:</strong> ${name} from ${college}</li>
                                ${team_name ? `<li style="margin-bottom: 8px;"><strong>Squad:</strong> ${team_name}</li>` : ''}
                            </ul>
                        </div>
                        <p style="color: #94a3b8; font-size: 0.9em; text-align: center; margin-top: 30px;">
                            Please present this digital ticket at the registration desk upon arrival to claim your kit.
                        </p>
                        <hr style="border: none; border-top: 1px solid #1f2937; margin: 20px 0;" />
                        <p style="text-align: center; color: #64748b; font-size: 0.85rem;">
                            See you on the other side,<br><strong style="color: #00f2fe; font-size: 1rem;">The Caraxes 2026 Core Committee</strong>
                        </p>
                    </div>
                `,
                attachments: [
                    {
                        filename: `Caraxes_2026_Ticket_${name.replace(/\s+/g, '_')}.png`,
                        path: generatedTicketPath,
                        cid: 'ticket_img' // same cid value as in the html img src
                    }
                ]
            };

            if (process.env.SMTP_USER && process.env.SMTP_PASS) {
                await transporter.sendMail(mailOptions);
            } else {
                console.warn("SMTP credentials not provided. Email wasn't sent.");
            }
        } catch (emailError) {
            console.error('Failed to send email:', emailError);
            // We don't want to fail the registration if email fails, so we log it and continue
        } finally {
            // Cleanup temp ticket
            if (generatedTicketPath !== path.join(__dirname, 'assets', 'caraxes_ticket.png')) {
                setTimeout(() => {
                    fs.unlink(generatedTicketPath, (err) => {
                        if (err) console.error("Failed to delete temp ticket:", err);
                    });
                }, 5000); // 5 seconds wait to ensure mail is sent
            }
        }

        // Insert into database
        const query = `
            INSERT INTO registrations 
            (name, college, department, year, phone, email, event_name, team_name, team_members)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await db.query(query, [
            name, college, department, year, phone, email,
            event_name, team_name || null, team_members || null
        ]);

        res.status(201).json({
            success: true,
            message: '🎉 Successfully Registered for Caraxes 2026! Confirmation details sent via email.'
        });

        // ----------------------------------------------------
        // Trigger Google Sheets Webhook (Non-blocking)
        // ----------------------------------------------------
        if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
            try {
                // Send data to Google Apps Script Webhook
                await axios.post(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
                    name, college, department, year, phone, email, event_name,
                    team_name: team_name || "",
                    team_members: team_members || "",
                    timestamp: new Date().toISOString()
                });
                console.log(`Successfully backed up ${email} registration to Google Sheets.`);
            } catch (sheetErr) {
                console.error("Failed to save to Google Sheets:", sheetErr.message);
            }
        }

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error. Please try again later.' });
    }
});

// Start Server
if (!process.env.VERCEL_ENV) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Open http://localhost:${PORT} to view the Website`);
    });
}
module.exports = app;
