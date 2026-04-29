const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'apna_counsellor.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Counselings Table
    db.run(`CREATE TABLE IF NOT EXISTS counselings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL, -- Engineering / Medical
        region TEXT NOT NULL,   -- India / Abroad
        exam TEXT,
        official_url TEXT,
        description TEXT
    )`);

    // Colleges Table
    db.run(`CREATE TABLE IF NOT EXISTS colleges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        counseling_id INTEGER,
        name TEXT NOT NULL,
        location TEXT,
        type TEXT, -- Government / Private
        fees TEXT,
        placement_stats TEXT,
        FOREIGN KEY(counseling_id) REFERENCES counselings(id)
    )`);

    // Ranks / Cut-offs Table
    db.run(`CREATE TABLE IF NOT EXISTS ranks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        college_id INTEGER,
        course_name TEXT,
        category TEXT, -- General, OBC, SC, ST, etc.
        year INTEGER,
        opening_rank INTEGER,
        closing_rank INTEGER,
        FOREIGN KEY(college_id) REFERENCES colleges(id)
    )`);

    // Processes / Procedures Table
    db.run(`CREATE TABLE IF NOT EXISTS processes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        counseling_id INTEGER,
        step_number INTEGER,
        title TEXT,
        details TEXT,
        FOREIGN KEY(counseling_id) REFERENCES counselings(id)
    )`);

    console.log("Database initialized successfully at " + dbPath);
});

db.close();
