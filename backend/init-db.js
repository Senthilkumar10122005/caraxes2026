const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function initialize() {
    try {
        console.log("Connecting to SQLite...");
        const db = await open({
            filename: path.join(__dirname, 'database.sqlite'),
            driver: sqlite3.Database
        });

        console.log("Creating `registrations` table...");
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS registrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                college TEXT NOT NULL,
                department TEXT NOT NULL,
                year TEXT NOT NULL,
                phone TEXT NOT NULL,
                email TEXT NOT NULL,
                event_name TEXT NOT NULL,
                team_name TEXT,
                team_members TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await db.exec(createTableQuery);

        console.log("Database and table initialized successfully!");
        await db.close();
    } catch (error) {
        console.error("Error initializing database:");
        console.error(error.message);
    }
}

initialize();
