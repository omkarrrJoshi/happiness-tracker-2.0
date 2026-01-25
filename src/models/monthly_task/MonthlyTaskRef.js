const { MONTHLY_TASK_REF } = require("../../constants/tables");
const db = require("../../utils/db");

class MonthlyTaskRef {
  constructor({
    user_id,
    name,
    pillar,
    type,
    target,
    link,
    description,
    image_url,
    start_date,
    end_date,
  }) {
    this.user_id = user_id;
    this.name = name;
    this.pillar = pillar;
    this.type = type;
    this.target = target;
    this.link = link;
    this.description = description;
    this.image_url = image_url;
    this.start_date = start_date;
    this.end_date = end_date;
  }

  async save(pool) {
    try {
      const query = `
        INSERT INTO ${MONTHLY_TASK_REF} (
          user_id, name, pillar, type, target, link, description, image_url, start_date, end_date, deleted_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;
      `;

      const values = [
        this.user_id, this.name, this.pillar, this.type, this.target, this.link, this.description, this.image_url, this.start_date, this.end_date, this.deleted_at
      ];
      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("Database Insert Error (MonthlyTaskRef):", error);
      throw error;
    }
  }

  static async findById(pool, id) {
    try {
      const query = `
        SELECT * FROM ${MONTHLY_TASK_REF} WHERE id = $1;
      `;

      const { rows } = await db.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error("Database Query Error (findById - MonthlyTaskRef):", error);
      throw error;
    }
  }

  static async findByUserId(pool, userId) {
    try {
      const query = `
        SELECT * FROM ${MONTHLY_TASK_REF} WHERE user_id = $1 ORDER BY created_at DESC;
      `;

      const { rows } = await db.query(query, [userId]);
      return rows;
    } catch (error) {
      console.error("Database Query Error (findByUserId - MonthlyTaskRef):", error);
      throw error;
    }
  }

  static async findByUserIdAndDate(pool, userId, date, pillar) {
    console.log(userId, date, pillar);
    try {
      const query = `
        SELECT * FROM ${MONTHLY_TASK_REF} WHERE user_id = $1 AND pillar = $2 AND start_date <= $3 AND (end_date >= $3 OR end_date IS NULL) ORDER BY created_at DESC;
      `;

      const { rows } = await pool.query(query, [userId, pillar, date]);
      return rows;
    } catch (error) {
      console.error("Database Query Error (findByUserIdAndDate - MonthlyTaskRef):", error);
      throw error;
    }
  }

  async update(pool) {
    try {
      const query = `
        UPDATE ${MONTHLY_TASK_REF}
        SET name = $1, pillar = $2, type = $3, target = $4, link = $5, description = $6, image_url = $7, start_month = $8, end_month = $9, updated_at = NOW()
        WHERE id = $10
        RETURNING *;
      `;

      const values = [
        this.name, this.pillar, this.type, this.target, this.link, this.description, this.image_url, this.start_month, this.end_month, this.id
      ];

      const { rows } = await db.query(query, values);
      return rows[0] || null;
    } catch (error) {
      console.error("Database Update Error (MonthlyTaskRef):", error);
      throw error;
    }
  }

  static async softDelete(pool, id) {
    try {
      const query = `UPDATE ${MONTHLY_TASK_REF} SET deleted_at = NOW() WHERE id = $1 RETURNING *`;
      const { rows } = await db.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error("Database Soft Delete Error (MonthlyTaskRef):", error);
      throw error;
    } 
  }

  static async deleteById(pool, id) {
    try {
      const query = `DELETE FROM ${MONTHLY_TASK_REF} WHERE id = $1 RETURNING *`;
      const { rows } = await db.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error("Database Delete Error (MonthlyTaskRef):", error);
      throw error;
    }
  }
}

module.exports = MonthlyTaskRef;
