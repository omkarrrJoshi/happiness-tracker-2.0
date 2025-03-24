const { DAILY_TASK_PROGRESS, DAILY_TASK_REF } = require("../../constants/tables");

class DailyTaskTrackerRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async getTracking(user_id, type, startDate, endDate) {
    try {
      const query = `
        select 
        r.id, max(p.date) as max_date, r.target, sum(p.daily_progress) as total_progress, sum(p.daily_target) as total_target
        from daily_task_progress as p
        join daily_task_ref as r on p.daily_task_ref_id = r.id
        where 
        r.user_id = $1 AND
        r.type = $2 AND
        p.date >= $3 AND
        p.date <= $4 
        group by r.id, r.target;
      `

      const values = [user_id, type, startDate, endDate];
      const result = await this.pool.query(query, values);
      return result;
    } catch (error) {
      console.error("Error fetching progress summary:", error);
      throw error;
    }
  }
}

module.exports = DailyTaskTrackerRepository;
