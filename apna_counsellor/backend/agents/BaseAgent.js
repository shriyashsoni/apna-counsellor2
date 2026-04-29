const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../db/apna_counsellor.db');

class BaseAgent {
    constructor(name, counselingId) {
        this.name = name;
        this.counselingId = counselingId;
        this.db = new sqlite3.Database(dbPath);
    }

    async getCounselingInfo() {
        return new Promise((resolve, reject) => {
            this.db.get("SELECT * FROM counselings WHERE id = ?", [this.counselingId], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    async getColleges() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM colleges WHERE counseling_id = ?", [this.counselingId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    async getRanks(collegeId) {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM ranks WHERE college_id = ?", [collegeId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // This would be integrated with puter.ai.chat in the frontend or a backend adapter
    async generateResponse(userPrompt, context) {
        const systemPrompt = `You are the ${this.name} Assistant. 
        Your goal is to help users with counseling processes, rank prediction, and college selection.
        Context: ${JSON.stringify(context)}
        User Query: ${userPrompt}`;
        
        // In a real implementation, we would call Puter AI here.
        return `Response from ${this.name} based on provided data.`;
    }
}

module.exports = BaseAgent;
