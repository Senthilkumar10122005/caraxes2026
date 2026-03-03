const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function viewUsers() {
    try {
        const db = await open({
            filename: path.join(__dirname, 'database.sqlite'),
            driver: sqlite3.Database
        });

        const rows = await db.all('SELECT * FROM registrations ORDER BY timestamp DESC');

        console.log('\n--- 📋 REGISTERED USERS FOR CARAXES 2026 ---\n');
        if (rows.length === 0) {
            console.log('No users have registered yet.');
        } else {
            console.table(rows);
        }
        console.log('\n----------------------------------------\n');

        await db.close();
    } catch (error) {
        console.error("Error fetching users:", error.message);
    }
}

viewUsers();
