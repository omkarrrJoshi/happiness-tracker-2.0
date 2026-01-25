const { TASK_CHAPTER_PROGRESS } = require("../../constants/tables");

class TaskChapterProgress {
  constructor({
    task_progress_id,
    task_chapter_ref_id,
    iteration,
  }) {
    this.task_progress_id = task_progress_id;
    this.task_chapter_ref_id = task_chapter_ref_id;
    this.iteration = iteration;
  }

  async save(pool) {
    const query = `
      INSERT INTO ${TASK_CHAPTER_PROGRESS} (task_progress_id, task_chapter_ref_id, iteration)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [
      this.task_progress_id,
      this.task_chapter_ref_id,
      this.iteration
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByTaskProgressId(pool, task_progress_id) {
    const query = `
      SELECT * FROM ${TASK_CHAPTER_PROGRESS} WHERE task_progress_id = $1;
    `;
    const { rows } = await pool.query(query, [task_progress_id]);
    return rows;
  }

  static async findByTaskChapterRefId(pool, task_chapter_ref_id) {
    const query = `
      SELECT * FROM ${TASK_CHAPTER_PROGRESS} WHERE task_chapter_ref_id = $1;
    `;
    const { rows } = await pool.query(query, [task_chapter_ref_id]);
    return rows;
  }

  static async updateStatus(pool, task_chapter_progress_id, status) {
    const query = `
      UPDATE ${TASK_CHAPTER_PROGRESS} SET status = $1 WHERE id = $2;
    `;
    const values = [
      status,
      task_chapter_progress_id
    ];
    const result  = await pool.query(query, values);
    return result.rowCount > 0;
  }

  static async delete(pool, task_chapter_ref_id) {
    const query = `
      DELETE FROM ${TASK_CHAPTER_PROGRESS} WHERE task_chapter_ref_id = $1;
    `;
    const { rows } = await pool.query(query, [task_chapter_ref_id]);
    return rows[0];
  }
}

module.exports = TaskChapterProgress;