const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'apna_counsellor.db');
const db = new sqlite3.Database(dbPath);

const counselings = [
    { name: 'JoSAA', category: 'Engineering', region: 'India', exam: 'JEE Main / Advanced', official_url: 'https://josaa.nic.in', description: 'Joint Seat Allocation Authority for IITs, NITs, IIITs and GFTIs.' },
    { name: 'CSAB', category: 'Engineering', region: 'India', exam: 'JEE Main', official_url: 'https://csab.nic.in', description: 'Central Seat Allocation Board for vacant seats in NITs, IIITs, and GFTIs.' },
    { name: 'MCC', category: 'Medical', region: 'India', exam: 'NEET UG', official_url: 'https://mcc.nic.in', description: 'Medical Counselling Committee for 15% AIQ and Central Universities.' },
    { name: 'WBJEEB', category: 'Engineering', region: 'India', exam: 'WBJEE', official_url: 'https://wbjeeb.nic.in', description: 'West Bengal Joint Entrance Examinations Board.' },
    { name: 'MHT-CET', category: 'Engineering', region: 'India', exam: 'MHT-CET', official_url: 'https://mahacet.org', description: 'Maharashtra State Common Entrance Test Cell.' },
    { name: 'Common App', category: 'Engineering/Medical', region: 'Abroad', exam: 'SAT/ACT', official_url: 'https://commonapp.org', description: 'Undergraduate admissions to US universities.' },
    { name: 'UCAS', category: 'Engineering/Medical', region: 'Abroad', exam: 'IELTS/UCAT', official_url: 'https://ucas.com', description: 'Admissions to UK universities.' }
];

db.serialize(() => {
    const stmt = db.prepare(`INSERT INTO counselings (name, category, region, exam, official_url, description) VALUES (?, ?, ?, ?, ?, ?)`);
    counselings.forEach(c => {
        stmt.run(c.name, c.category, c.region, c.exam, c.official_url, c.description);
    });
    stmt.finalize();
    console.log("Seed data inserted successfully.");
});

db.close();
