const DailyTaskTrackerRepository = require("../../repositories/daily_task/dailyTaskTracker");
const pool = require("../../utils/db"); // Database connection
const {toISTDate, convertToIST, getDayOfWeekByDate} = require("../../utils/utils")
const trackerRepo = new DailyTaskTrackerRepository(pool);

const getDailyTaskTrackingService = async (req) => {
  try {
    const user_id = req.headers["user-id"];
    const { type, start_date, end_date, ref_id } = req.query;
    const summary = {
      total_progress: 0,
      total_target: 0
    }

    const resultData = await trackerRepo.getTracking(user_id, type, start_date, end_date, ref_id);
    const endDate = toISTDate(end_date);
    resultData.rows.forEach(result =>{
      const target = result['target'];
      let total_progress = parseInt(result['total_progress']);
      let total_target = parseInt(result['total_target']);
      const maxDate = convertToIST(result['max_date'])
      const nextAssumeDate = maxDate; // Clone the date
      nextAssumeDate.setDate(maxDate.getDate() + 1);
      while(nextAssumeDate <= endDate){
        const index = getDayOfWeekByDate(nextAssumeDate)['index'];
        total_target += target[index];
        nextAssumeDate.setDate(nextAssumeDate.getDate() + 1);
      }
      summary['total_progress'] = summary['total_progress'] + total_progress;
      summary['total_target'] = summary['total_target'] + total_target;
    })
    
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
