const BaseAgent = require('./BaseAgent');

class PredictorAgent extends BaseAgent {
    constructor() {
        super('Rank & College Predictor', null);
    }

    async predict(rank, category, counselingName) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT c.name as college, r.course_name, r.closing_rank, co.name as counseling
                FROM ranks r
                JOIN colleges c ON r.college_id = c.id
                JOIN counselings co ON c.counseling_id = co.id
                WHERE r.category = ? AND r.closing_rank >= ?
                ${counselingName ? 'AND co.name = ?' : ''}
                ORDER BY r.closing_rank ASC
                LIMIT 20
            `;
            
            const params = counselingName ? [category, rank, counselingName] : [category, rank];
            
            this.db.all(query, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
}

module.exports = PredictorAgent;
