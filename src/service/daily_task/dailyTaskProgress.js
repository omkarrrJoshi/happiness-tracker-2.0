const { pool } = require("../../utils/db");
const DailyTaskProgress = require("../../models/daily_task/DailyTaskProgress");

const updateDailyTaskProgressService = async (req) => {
  try {
    const { id } = req.params;
    const { user_id } = req.query;
    const { daily_target, daily_progress } = req.body;

    const dailyTaskProgressData = await DailyTaskProgress.findById(pool, id)
    dailyTaskProgressData.daily_progress = daily_progress ??  dailyTaskProgressData.daily_progress;
    dailyTaskProgressData.daily_target = daily_target ??  dailyTaskProgressData.daily_target;

    const dailyTaskProgress = new DailyTaskProgress(dailyTaskProgressData);
    updatedDailyTaskProgress =  await dailyTaskProgress.update(pool);

    return {
      success: true,
      message: "Task progress updated successfully",
      data: updatedDailyTaskProgress,
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
  updateDailyTaskProgressService,
}