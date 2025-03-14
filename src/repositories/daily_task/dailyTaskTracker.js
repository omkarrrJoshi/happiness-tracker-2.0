const { DAILY_TASK_PROGRESS, DAILY_TASK_REF } = require("../../constants/tables");

class DailyTaskTrackerRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async getTracking(user_id, type, startDate, endDate) {
    try {
      const query = `
        SELECT 
          SUM(p.daily_progress) AS total_progress, 
          SUM(p.daily_target) AS total_target
        FROM ${DAILY_TASK_PROGRESS} AS p
        JOIN ${DAILY_TASK_REF} AS r ON p.daily_task_ref_id = r.id
        WHERE 
          r.user_id = $1 
          AND r.type = $2
          AND p.date > $3
          AND p.date < $4
        GROUP BY r.user_id
      `;

      const values = [user_id, type, startDate, endDate];
      const result = await this.pool.query(query, values);
      console.log(result)
      return result[0] || { total_progress: 0, total_target: 0 }; // Return default if no data found
    } catch (error) {
      console.error("Error fetching progress summary:", error);
      throw error;
    }
  }
}

module.exports = DailyTaskTrackerRepository;
