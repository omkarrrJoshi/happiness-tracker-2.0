const { DAILY_TASK_REF, DAILY_TASK_PROGRESS } = require("../../constants/tables");
const DailyTaskProgress = require("../../models/daily_task/DailyTaskProgress");
const DailyTaskRef = require("../../models/daily_task/DailyTaskRef");
const DailyTaskResponse = require("../../models/daily_task/DailyTaskResponse");
const { pool } = require("../../utils/db");
const { getDayOfWeek, toISTDate, convertToIST, stripTime } = require("../../utils/utils");

const createDailyTaskService = async (req) => {
  try {
    const body = req.body;

    const startDate = toISTDate(body.start_date);
    const endDate = body.end_date ? toISTDate(body.end_date) : null;

    // 🔹 Check if task already exists
    const checkQuery = `SELECT * FROM ${DAILY_TASK_REF} WHERE name = $1 AND user_id = $2`;
    const checkResult = await pool.query(checkQuery, [body.name, body.user_id]);
    if (checkResult.rows.length > 0) {
      for (const result of checkResult.rows) {
        const checkStartDate = convertToIST(result.start_date);
        const checkEndDate = result.end_date ? convertToIST(result.end_date) : null;
        if (checkEndDate === null) {
          // 🔹 If an **existing task is ongoing (no end date)**
          if (endDate === null || startDate <= checkStartDate || (endDate && endDate >= checkStartDate)) {
            console.error(`A task with the same name already exists for this user, starting from ${checkStartDate.toISOString().split("T")[0]} and continuing indefinitely.`)
            throw new Error(
              `A task with the same name already exists for this user, starting from ${checkStartDate.toISOString().split("T")[0]} and continuing indefinitely.`
            );
          }
        } else {
          // 🔹 If existing task has a **defined period**, check if the new task overlaps
          if (
            (startDate >= checkStartDate && startDate <= checkEndDate) || // New start is within existing period
            (endDate && endDate >= checkStartDate && endDate <= checkEndDate) || // New end is within existing period
            (startDate <= checkStartDate && (!endDate || endDate >= checkEndDate)) // New task fully covers existing task
          ) {
            throw new Error(
              `A task with the same name already exists for this user from ${checkStartDate.toISOString().split("T")[0]} to ${checkEndDate.toISOString().split("T")[0]}.`
            );
          }
        }
      }
    }

    body.start_date = startDate;
    body.end_date = endDate;

    // 🔹 Create Daily Task Ref
    const dailyTaskRef = new DailyTaskRef(body);
    const dailyTaskRefData = await dailyTaskRef.save(pool);
    if (!dailyTaskRefData) {
      throw new Error("Failed to save daily task reference");
    }

    // 🔹 Check if task starts in the future
    const givenDate = toISTDate(body.date);

    if (givenDate < body.start_date) {
      return {
        success: true,
        data: { ...dailyTaskRefData, future: true }
      };
    }

    // 🔹 Create Daily Task Progress
    const dailyTaskProgressData = await createDailyTaskProgress(dailyTaskRefData, givenDate, startDate, givenDate);

    // 🔹 Construct Response
    const responseData = new DailyTaskResponse(dailyTaskRefData, dailyTaskProgressData);

    return {
      success: true,
      data: responseData,
      message: `${body.type} added successfully`
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
    const user_id = req.headers["user-id"];
    const { date, type } = req.query;
    const givenDate = stripTime(toISTDate(date));

    // 🔹 Fetch Daily Task References
    const refQuery = `
      SELECT * FROM ${DAILY_TASK_REF} 
      WHERE user_id = $1 AND type = $2 
      AND start_date <= $3 
      AND (end_date IS NULL OR end_date >= $3)
      AND deleted_at IS NULL
    `;
    const refResult = await pool.query(refQuery, [user_id, type, givenDate]);
    const taskRefs = refResult.rows;

    if (taskRefs.length === 0) {
      return { success: true, data: [] };
    }

    let responseTasks = [];

    for (const taskRef of taskRefs) {
      // select the max_date for which progress has created
      const maxDateProgressQuery = `
        SELECT MAX(date) as max_date FROM ${DAILY_TASK_PROGRESS} 
        WHERE daily_task_ref_id = $1 AND deleted_at IS NULL
        GROUP BY daily_task_ref_id
      `
      const result = await pool.query(maxDateProgressQuery, [taskRef.id]);
      let maxDateProgressResult = result.rows[0];
      let taskProgress = null;
      if(maxDateProgressResult){
        const maxDate = stripTime(maxDateProgressResult['max_date']);
        // const previousAddedDate = maxDate;
        // console.log("previousAddedDate:", previousAddedDate);
        console.log("maxDate:", maxDate, "givenDate:", givenDate);
        if(givenDate <= maxDate){
          const progressQuery = `
            SELECT * FROM ${DAILY_TASK_PROGRESS} 
            WHERE daily_task_ref_id = $1 AND date = $2 AND deleted_at IS NULL
          `;
          const progressResult = await pool.query(progressQuery, [taskRef.id, date]);
          taskProgress = progressResult.rows[0];
          if (!taskProgress) {
            throw new Error("Something went wrong contact developer");
          }
        }else{
          const startDate = maxDate; // Clone the date
          startDate.setDate(startDate.getDate() + 1);
          const endDate = givenDate;
          taskProgress = await createDailyTaskProgress(taskRef, givenDate, startDate, endDate)
        }
      }else{
        throw new Error("Something went wrong contact developer");
      }
      if(taskProgress === null | undefined){
        throw new Error("Something went wrong contact developer: taskProgress is null or undefined");
      }
      const taskResponse = new DailyTaskResponse(taskRef, taskProgress);
      responseTasks.push(taskResponse);
    }

    return { 
      success: true, 
      data: responseTasks, 
      message: `${type} fetched successfully for date ${date}` 
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


const createDailyTaskProgress = async (dailyTaskRefData, current_date, start_date, end_date) => {
  if(start_date === undefined && end_date === undefined){
    start_date = current_date;
    end_date = current_date;
  }
  let start = start_date; // Convert to Date object
  const end = end_date; // Convert to Date object
  const currentDate = current_date;
  let currentDateProgressData = null;
  while (start <= end) {
    try {
      const formattedDate = start.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      const day = getDayOfWeek(formattedDate); // Get the day index (e.g., Monday -> 1)
      const dailyTarget = dailyTaskRefData.target[day.index]; // Extract target for that day
      const dailyTaskProgressBody = {
        daily_task_ref_id: dailyTaskRefData.id,
        user_id: dailyTaskRefData.user_id,
        daily_progress: 0,
        daily_target: dailyTarget,
        date: formattedDate,
      };

      const dailyTaskProgress = new DailyTaskProgress(dailyTaskProgressBody);
      const dailyTaskProgressData = await dailyTaskProgress.save(pool);

      if (!dailyTaskProgressData) {
        throw new Error("Failed to save daily task progress");
      }
      if (currentDate.toISOString() === start.toISOString()) {
        currentDateProgressData = dailyTaskProgressData
      }
      // Move to the next date
      start.setDate(start.getDate() + 1);

    } catch (error) {
      throw new Error(`Error creating daily task progress: ${error.message}`);
    }
  }

  if(currentDateProgressData){
    return currentDateProgressData;
  }
};

module.exports = {
  createDailyTaskService,
  getDailyTasksService
}