class TaskChapterRef {
  constructor({
    task_ref_id,
    name,
    target,
    link,
    description,
    image_url
  }) {
    this.task_ref_id = task_ref_id;
    this.name = name;
    this.target = target;
    this.link = link;
    this.description = description;
    this.image_url = image_url;
  }

  async save(pool) {
    const query = `
      INSERT INTO task_chapter_ref (task_ref_id, name, target, link, description, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      this.task_ref_id,
      this.name,
      this.target,
      this.link,
      this.description,
      this.image_url
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findById(pool, id) {
    const query = `
      SELECT * FROM task_chapter_ref WHERE id = $1;
    `;
  }

  static async findByTaskRefId(pool, task_ref_id) {
    const query = `
      SELECT * FROM task_chapter_ref WHERE task_ref_id = $1;
    `;
    const { rows } = await pool.query(query, [task_ref_id]);
    return rows;
  }

  async update(pool) {
    const query = `
      UPDATE task_chapter_ref SET name = $1, link = $2, description = $3, image_url = $4 WHERE id = $5;
    `;
    const values = [
      this.name,
      this.link,
      this.description,
      this.image_url,
      this.id
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async softDelete(pool, id) {
    const query = `
      UPDATE task_chapter_ref SET deleted_at = NOW() WHERE id = $1;
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async deleteById(pool, id) {
    const query = `
      DELETE FROM task_chapter_ref WHERE id = $1;
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = TaskChapterRef;
