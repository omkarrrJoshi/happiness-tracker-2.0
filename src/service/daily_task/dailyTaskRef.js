const { pool } = require("../../utils/db");

const updateDailyTaskRefService = async (req) => {
  try {
    const { id } = req.params;
    const { user_id } = req.query;
    const { name, target, start_date, end_date, link, description } = req.body;

    // 1. Fetch the existing daily task reference
    const checkQuery = `
      SELECT * FROM ${DAILY_TASK_REF} 
      WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
    `;
    const checkResult = await pool.query(checkQuery, [id, user_id]);

    if (checkResult.rows.length === 0) {
      throw new Error("Task reference not found or already deleted.");
    }

    // 2. Merge incoming values with existing ones
    const existingData = checkResult.rows[0];

    const updatedData = {
      name: name ?? existingData.name,
      target: target ?? existingData.target,
      start_date: start_date ?? existingData.start_date,
      end_date: end_date ?? existingData.end_date,
      link: link ?? existingData.link,
      description: description ?? existingData.description,
    };

    // 3. Validate that `end_date` is not before `start_date`
    if (updatedData.end_date != null && new Date(updatedData.end_date) < new Date(updatedData.start_date)) {
      throw new Error("End date cannot be earlier than start date.");
    }

    // 4. Perform the update
    const updateQuery = `
      UPDATE daily_task_ref 
      SET name = $1, target = $2, start_date = $3, end_date = $4, 
          link = $5, description = $6, updated_at = NOW()
      WHERE id = $7 AND user_id = $8
      RETURNING *;
    `;
    
    const updateValues = [
      updatedData.name,
      updatedData.target,
      updatedData.start_date,
      updatedData.end_date,
      updatedData.link,
      updatedData.description,
      id,
      user_id,
    ];

    const updateResult = await pool.query(updateQuery, updateValues);

    if (updateResult.rowCount === 0) {
      throw new Error("Failed to update daily task reference.");
    }

    return {
      success: true,
      message: "Task reference updated successfully",
      data: updateResult.rows[0],
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      status: 500,
      errors: [error],
    };
  }
};

module.exports = {
  updateDailyTaskRefService,
}