const BaseAgent = require('./BaseAgent');

class JosaaAgent extends BaseAgent {
    constructor() {
        super('JoSAA (IIT/NIT/IIIT)', 1); // ID 1 is JoSAA from seed
    }

    async predictCollege(rank, category) {
        // Simple prediction logic: find colleges where closing_rank > user rank
        return new Promise((resolve, reject) => {
            const query = `
                SELECT c.name, r.course_name, r.closing_rank 
                FROM colleges c 
                JOIN ranks r ON c.id = r.college_id 
                WHERE c.counseling_id = ? AND r.category = ? AND r.closing_rank >= ?
                ORDER BY r.closing_rank ASC
            `;
            this.db.all(query, [this.counselingId, category, rank], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
}

module.exports = JosaaAgent;
