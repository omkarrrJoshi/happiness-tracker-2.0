const { DAILY_TASK_REF } = require("../../constants/tables");

class DailyTaskRef {
  constructor({ 
    user_id, 
    name, 
    pillar, 
    type, 
    target, 
    link, 
    description, 
    start_date, 
    end_date 
  }) {
    this.user_id = user_id;
    this.name = name;
    this.pillar = pillar;
    this.type = type;
    this.target = target;
    this.link = link || null;
    this.description = description || null;
    this.start_date = start_date;
    this.end_date = end_date || null;
    this.created_at = new Date();
    this.updated_at = new Date();
    this.deleted_at = null;
  }

  // Save a new daily_task_ref record
  async save(pool) {
    try {
      const query = `
        INSERT INTO ${DAILY_TASK_REF} (
          user_id, name, pillar, type, target, link, description, start_date, end_date, created_at, updated_at, deleted_at
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW(), $10)
        RETURNING *;
      `;

      const values = [
        this.user_id, this.name, this.pillar, this.type, this.target, 
        this.link, this.description, this.start_date, this.end_date, this.deleted_at
      ];

      const { rows } = await pool.query(query, values);
      return rows[0]; // Return inserted row
    } catch (error) {
      console.error("Database Insert Error (DailyTaskRef):", error);
      throw error;
    }
  }

  // Find by ID
  static async findById(pool, id) {
    try {
      const query = `SELECT * FROM ${DAILY_TASK_REF} WHERE id = $1`;
      const { rows } = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error("Database Query Error (findById - DailyTaskRef):", error);
      throw error;
    }
  }

  // Find all tasks for a user
  static async findByUserId(pool, userId) {
    try {
      const query = `SELECT * FROM ${DAILY_TASK_REF} WHERE user_id = $1 ORDER BY created_at DESC`;
      const { rows } = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      console.error("Database Query Error (findByUserId - DailyTaskRef):", error);
      throw error;
    }
  }

  // Update an existing record
  async update(pool) {
    try {
      const query = `
        UPDATE daily_task_ref
        SET name = $1, pillar = $2, type = $3, target = $4, link = $5, 
            description = $6, start_date = $7, end_date = $8, updated_at = NOW()
        WHERE id = $9
        RETURNING *;
      `;
      const values = [
        this.name, this.pillar, this.type, this.target, this.link, 
        this.description, this.start_date, this.end_date, this.id
      ];

      const { rows } = await pool.query(query, values);
      return rows[0] || null;
    } catch (error) {
      console.error("Database Update Error (DailyTaskRef):", error);
      throw error;
    }
  }

  // Soft delete (sets deleted_at timestamp)
  static async softDelete(pool, id) {
    try {
      const query = `UPDATE ${DAILY_TASK_REF} SET deleted_at = NOW() WHERE id = $1 RETURNING *`;
      const { rows } = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error("Database Soft Delete Error (DailyTaskRef):", error);
      throw error;
    }
  }

  // Hard delete (permanent)
  static async deleteById(pool, id) {
    try {
      const query = `DELETE FROM ${DAILY_TASK_REF} WHERE id = $1 RETURNING *`;
      const { rows } = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error("Database Delete Error (DailyTaskRef):", error);
      throw error;
    }
  }
}

module.exports = DailyTaskRef;
