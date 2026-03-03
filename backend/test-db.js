const mysql = require('mysql2/promise');

const passwords = ['', 'root', 'password', 'admin', '1234', '123456', '12345678', 'mysql'];

async function testPasswords() {
    console.log("Testing common MySQL passwords...");
    for (const pwd of passwords) {
        try {
            const connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: pwd
            });
            console.log(`\nSUCCESS! The password is: "${pwd}"`);
            await connection.end();
            return;
        } catch (err) {
            process.stdout.write('.');
        }
    }
    console.log("\nFailed to find password amongst common defaults.");
}

testPasswords();
