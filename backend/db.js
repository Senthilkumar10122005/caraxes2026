const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const os = require('os');
const fs = require('fs');

let dbPromise;

async function getDb() {
    if (!dbPromise) {
        const dbPath = process.env.VERCEL_ENV ? path.join(os.tmpdir(), 'database.sqlite') : path.join(__dirname, 'database.sqlite');
        const isNewDb = process.env.VERCEL_ENV && !fs.existsSync(dbPath);

        dbPromise = open({
            filename: dbPath,
            driver: sqlite3.Database
        }).then(async (db) => {
            // Auto-initialize tables if running serverless on Vercel
            if (isNewDb || process.env.VERCEL_ENV) {
                await db.exec(`
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
                `);
            }
            return db;
        });
    }
    return dbPromise;
}

const dbWrapper = {
    getConnection: async () => {
        const db = await getDb();
        return { release: () => { } };
    },
    query: async (sql, params = []) => {
        const db = await getDb();
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
            const rows = await db.all(sql, params);
            return [rows, []];
        } else {
            const result = await db.run(sql, params);
            return [result, []];
        }
    }
};

// Try to connect to verify
getDb()
    .then(() => console.log('Successfully connected to the SQLite Database.'))
    .catch(err => console.error('Error connecting to the SQLite Database:', err));

module.exports = dbWrapper;
