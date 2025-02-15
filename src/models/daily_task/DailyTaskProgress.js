const { DAILY_TASK_PROGRESS } = require("../../constants/tables");

class DailyTaskProgress {
  constructor(data) {
    this.id = data.id;
    this.daily_task_ref_id = data.daily_task_ref_id;
    this.user_id = data.user_id;
    this.daily_progress = data.daily_progress;
    this.daily_target = data.daily_target;
    this.date = data.date;
    this.created_at = new Date();
    this.updated_at = new Date();
    this.deleted_at = null;
  }

  async save(pool) {
    try {
      const query = `
        INSERT INTO ${DAILY_TASK_PROGRESS} (daily_task_ref_id, user_id, daily_progress, daily_target, date, created_at, updated_at, deleted_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), $6)
        RETURNING *;
      `;
      const values = [
        this.daily_task_ref_id, this.user_id, this.daily_progress, this.daily_target, 
        this.date, this.deleted_at
      ];

      const { rows } = await pool.query(query, values);
      return rows[0]; // Return inserted row
    } catch (error) {
      console.error("Database Insert Error (DailyTaskProgress):", error);
      throw error;
    }
  }

  static async findById(pool, id) {
    try {
      const query = `SELECT * FROM ${DAILY_TASK_PROGRESS} WHERE id = $1`;
      const { rows } = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error("Database Query Error (findById - DailyTaskProgress):", error);
      throw error;
    }
  }

  static async findByTaskRefId(pool, taskRefId) {
    try {
      const query = `SELECT * FROM ${DAILY_TASK_PROGRESS} WHERE daily_task_ref_id = $1 ORDER BY date DESC`;
      const { rows } = await pool.query(query, [taskRefId]);
      return rows;
    } catch (error) {
      console.error("Database Query Error (findByTaskRefId - DailyTaskProgress):", error);
      throw error;
    }
  }

  async update(pool) {
    try {
      const query = `
        UPDATE ${DAILY_TASK_PROGRESS}
        SET daily_progress = $1, daily_target = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING *;
      `;
      const values = [
        this.daily_progress, this.daily_target, this.id
      ];

      const { rows } = await pool.query(query, values);
      return rows[0] || null;
    } catch (error) {
      console.error("Database Update Error (DailyTaskProgress):", error);
      throw error;
    }
  }

  static async deleteById(pool, id) {
    try {
      const query = `DELETE FROM ${DAILY_TASK_PROGRESS} WHERE id = $1 RETURNING *`;
      const { rows } = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error("Database Delete Error (DailyTaskProgress):", error);
      throw error;
    }
  }
}

module.exports = DailyTaskProgress;
