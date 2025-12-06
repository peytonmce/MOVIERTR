import {DatabaseSync} from 'node:sqlite';
const db = new DatabaseSync(':memory:');

db.exec(`
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
`);

db.exec(`
    CREATE TABLE movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        moviename TEXT,
        rating INTEGER,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
`);

export default db;