const db = require('./db');

async function viewUsers() {
    try {
        const [rows] = await db.query('SELECT * FROM registrations ORDER BY timestamp DESC');

        console.log('\n--- 📋 REGISTERED USERS FOR CARAXES 2026 ---\n');
        if (rows.length === 0) {
            console.log('No users have registered yet.');
        } else {
            console.table(rows);
        }
        console.log('\n----------------------------------------\n');

    } catch (error) {
        console.error("Error fetching users:", error.message);
    } finally {
        // Since we use a pool, we don't strictly need to close here 
        // if the process is going to exit.
        process.exit();
    }
}

viewUsers();
