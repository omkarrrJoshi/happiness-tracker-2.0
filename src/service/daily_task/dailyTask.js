const { DAILY_TASK_REF, DAILY_TASK_PROGRESS } = require("../../constants/tables");
const DailyTaskProgress = require("../../models/daily_task/DailyTaskProgress");
const DailyTaskRef = require("../../models/daily_task/DailyTaskRef");
const DailyTaskResponse = require("../../models/daily_task/DailyTaskResponse");
const { pool } = require("../../utils/db");
const { getDayOfWeek } = require("../../utils/utils");

const createDailyTaskService = async (req) => {
  try {
    const body = req.body;

    // 🔹 Check if task already exists
    const checkQuery = `SELECT * FROM ${DAILY_TASK_REF} WHERE name = $1 AND user_id = $2`;
    const checkResult = await pool.query(checkQuery, [body.name, body.user_id]);

    if (checkResult.rows.length > 0) {
      throw new Error("Task with the same name already exists for this user.");
    }

    // 🔹 Create Daily Task Ref
    const dailyTaskRef = new DailyTaskRef(body);
    const dailyTaskRefData = await dailyTaskRef.save(pool);
    if (!dailyTaskRefData) {
      throw new Error("Failed to save daily task reference");
    }

    // 🔹 Check if task starts in the future
    const givenDate = new Date(body.date);
    const givenStartDate = new Date(body.start_date);

    if (givenDate < givenStartDate) {
      return {
        success: true,
        data: { ...dailyTaskRefData, future: true }
      };
    }

    // 🔹 Create Daily Task Progress
    const dailyTaskProgressData = await createDailyTaskProgress(dailyTaskRefData, body.date);

    // 🔹 Construct Response
    const responseData = new DailyTaskResponse({
      ...dailyTaskRefData,
      ...dailyTaskProgressData,
    });

    return {
      success: true,
      data: responseData,
    };
  } catch ( error) {
    return {
      success: false,
      message: error.message,
      status: 500,
      errors: [error],
    };
  }
};

const getDailyTasksService = async (req) => {
  try {
    const { user_id, date, type } = req.query;
    const givenDate = new Date(date);

    // 🔹 Fetch Daily Task References
    const refQuery = `
      SELECT * FROM ${DAILY_TASK_REF} 
      WHERE user_id = $1 AND type = $2 
      AND start_date <= $3 
      AND (end_date IS NULL OR end_date >= $3)
    `;
    const refResult = await pool.query(refQuery, [user_id, type, givenDate]);
    const taskRefs = refResult.rows;

    if (taskRefs.length === 0) {
      return { success: true, data: [] };
    }

    let responseTasks = [];

    for (const taskRef of taskRefs) {
      // 🔹 Check if progress exists
      const progressQuery = `
        SELECT * FROM ${DAILY_TASK_PROGRESS} 
        WHERE daily_task_ref_id = $1 AND date = $2
      `;
      const progressResult = await pool.query(progressQuery, [taskRef.id, givenDate]);
      let taskProgress = progressResult.rows[0];

      // 🔹 If no progress exists, create a new one
      if (!taskProgress) {
        taskProgress = await createDailyTaskProgress(taskRef, givenDate);
      }

      // 🔹 Construct response object
      const taskResponse = new DailyTaskResponse({
        ...taskRef,
        ...taskProgress,
      });

      responseTasks.push(taskResponse);
    }

    return { success: true, data: responseTasks };

  } catch (error) {
    return {
      success: false,
      message: error.message,
      status: 500,
      errors: [error],
    };
  }
};


const createDailyTaskProgress = async (dailyTaskRefData, date) => {
  try {
    const day = getDayOfWeek(date); // Get the day index (e.g., Monday -> 1)
    const dailyTarget = dailyTaskRefData.target[day.index]; // Extract target for that day

    const dailyTaskProgressBody = {
      daily_task_ref_id: dailyTaskRefData.id,
      daily_progress: 0,
      daily_target: dailyTarget,
      date: date,
    };

    const dailyTaskProgress = new DailyTaskProgress(dailyTaskProgressBody);
    const dailyTaskProgressData = await dailyTaskProgress.save(pool);

    if (!dailyTaskProgressData) {
      throw new Error("Failed to save daily task progress");
    }

    return dailyTaskProgressData;
  } catch (error) {
    throw new Error(`Error creating daily task progress: ${error.message}`);
  }
};


module.exports = {
  createDailyTaskService,
  getDailyTasksService
}