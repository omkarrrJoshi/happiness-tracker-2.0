const db = require("../../utils/db");

class MonthlyTaskProgress {
  constructor({
    task_ref_id,
    progress,
    target,
    date
  }) {
    this.task_ref_id = task_ref_id;
    this.progress = progress;
    this.target = target;
    this.date = date;
  }

  async createMonthlyTaskProgress(pool) {
    try {
      const query = `
        INSERT INTO monthly_task_progress (task_ref_id, progress, target, date)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const result = await db.query(query, [this.task_ref_id, this.progress, this.target, this.date]);
      return result.rows[0];
    } catch (error) {
      console.error("Database Insert Error (MonthlyTaskProgress):", error);
      throw error;
    }
  }
  
  static async findByTaskRefId(pool, task_ref_id) {
    try {
      const query = `
        SELECT * FROM monthly_task_progress WHERE task_ref_id = $1;
      `;
      const result = await db.query(query, [task_ref_id]);
      return result.rows;
    } catch (error) {
      console.error("Database SelectBy TaskRefId Error (MonthlyTaskProgress):", error);
      throw error;
    }
  }

  static async findByTaskRefIdAndDate(pool, task_ref_id, date) {
    try {
      const query = `
        SELECT * FROM monthly_task_progress WHERE task_ref_id = $1 AND date = $2;
      `;
      const result = await db.query(query, [task_ref_id, date]);
      return result.rows[0];
    } catch (error) {
      console.error("Database SelectBy TaskRefIdAndDate Error (MonthlyTaskProgress):", error);
      throw error;
    }
  }


  static async findMaxDateByTaskRefId(pool, task_ref_id) {
    try {
      const query = `
        SELECT MAX(date) as max_date FROM monthly_task_progress WHERE task_ref_id = $1;
      `;
      const result = await db.query(query, [task_ref_id]);
      return result.rows[0];
    } catch (error) {
      console.error("Database SelectMaxMonthByTaskRefId Error (MonthlyTaskProgress):", error);
      throw error;
    }
  }

  static async update(pool, id, progress) {
    try {
      const query = `
        UPDATE monthly_task_progress SET progress = $1 WHERE id = $2;
      `;
      const result = await db.query(query, [progress, id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error("Database Update Error (MonthlyTaskProgress):", error);
      throw error;
    }
  }

  static async softDelete(pool, id) {
    try {
      const query = `
        UPDATE monthly_task_progress SET deleted_at = NOW() WHERE id = $1;
      `;
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("Database SoftDelete Error (MonthlyTaskProgress):", error);
      throw error;
    }
  }
}

module.exports = {
  MonthlyTaskProgress
};
