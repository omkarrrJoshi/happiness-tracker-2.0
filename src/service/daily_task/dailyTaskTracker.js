const DailyTaskTrackerRepository = require("../../repositories/daily_task/dailyTaskTracker");
const pool = require("../../utils/db"); // Database connection

const trackerRepo = new DailyTaskTrackerRepository(pool);

const getDailyTaskTrackingService = async (req) => {
  try {
    const user_id = req.headers["user-id"];
    const { type, start_date, end_date } = req.query;
    
    const summary = await trackerRepo.getTracking(user_id, type, start_date, end_date);
    
    return {
      success: true,
      data: summary,
      message: `summary fetched successfully for ${type}, from ${start_date} to ${end_date}`
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
  getDailyTaskTrackingService,
}
