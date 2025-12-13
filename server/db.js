const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'tasks.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      status TEXT,
      tags TEXT,
      dueDate TEXT,
      createdAt INTEGER
    )`, (err) => {
            if (err) {
                console.error('Error creating table', err.message);
            }
        });
    }
});

module.exports = db;
