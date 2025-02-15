const { updateDailyTaskProgressService } = require("../../service/daily_task/dailyTaskProgress");
const { failureResponse, successResponse } = require("../../utils/responseHandler")

const updateDailyTaskProgress = async (req, res) => {
  try{
    const response = await updateDailyTaskProgressService(req);
    if(response.success){
      successResponse(res, response.data, response.message);
    }else{
      failureResponse(res, response.message, response.status, response.errors);
    }
  } catch (error) {
    console.error('error in updateDailyTaskProgress controller:', error)
    failureResponse(res, error.message, 500, error);
  }
}

module.exports = {
  updateDailyTaskProgress
}