const db = require('./db');
const axios = require('axios');

async function syncToSheets() {
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (!webhookUrl) {
        console.error('\n❌ ERROR: GOOGLE_SHEETS_WEBHOOK_URL is not defined in backend/.env');
        console.log('Please follow the instructions to set up your Google Apps Script and add the URL to your .env file.\n');
        process.exit(1);
    }

    try {
        console.log('Fetching registrations from MySQL...');

        const [rows] = await db.query('SELECT * FROM registrations ORDER BY timestamp ASC');

        if (rows.length === 0) {
            console.log('No registrations found to sync.');
            await db.close();
            return;
        }

        console.log(`\nFound ${rows.length} registrations. Starting sync to Google Sheets...\n`);

        let successCount = 0;
        let failCount = 0;

        for (const row of rows) {
            try {
                process.stdout.write(`Syncing [${row.email}]... `);

                const response = await axios.post(webhookUrl, {
                    name: row.name,
                    college: row.college,
                    department: row.department,
                    year: row.year,
                    phone: row.phone,
                    email: row.email,
                    event_name: row.event_name,
                    team_name: row.team_name || "",
                    team_members: row.team_members || "",
                    timestamp: row.timestamp
                });

                if (response.data && response.data.status === 'exists') {
                    console.log('🟡 Skipped (Already exists)');
                } else {
                    console.log('✅ Success');
                    successCount++;
                }
            } catch (error) {
                console.log(`❌ Failed (${error.message})`);
                failCount++;
            }
        }

        console.log('\n--- SYNC SUMMARY ---');
        console.log(`Total Records: ${rows.length}`);
        console.log(`Successfully Synced: ${successCount}`);
        console.log(`Failed: ${failCount}`);
        console.log('--------------------\n');

    } catch (error) {
        console.error("Critical error during sync:", error.message);
    } finally {
        process.exit();
    }
}

syncToSheets();
