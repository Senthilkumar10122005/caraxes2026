const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

let dbPromise;

async function getDb() {
    if (!dbPromise) {
        dbPromise = open({
            filename: path.join(__dirname, 'database.sqlite'),
            driver: sqlite3.Database
        });
    }
    return dbPromise;
}

const dbWrapper = {
    // Mocking mysql2 promise pool interface
    getConnection: async () => {
        const db = await getDb();
        return {
            release: () => { }
        };
    },
    query: async (sql, params = []) => {
        const db = await getDb();

        // SQLite uses ? just like MySQL, so queries should be compatible.
        // If it's a SELECT, we return [rows, []] to match mysql2 [rows, fields]
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
            const rows = await db.all(sql, params);
            return [rows, []];
        } else {
            // INSERT, UPDATE, DELETE
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
