const { getDailyTaskTrackingService } = require("../../service/daily_task/dailyTaskTracker");
const { failureResponse, successResponse } = require("../../utils/responseHandler");

const getDailyTaskTracking = async(req, res) => {
  try{
    const response = await getDailyTaskTrackingService(req);
    if(response.success){
      successResponse(res, response.data, response.message);
    }else{
      failureResponse(res, response.message, response.status, response.errors);
    }
  } catch (error) {
    console.error('error in udapetDailyTaskRef controller:', error)
    failureResponse(res, error.message, 500, error);
  }
}

module.exports = {
  getDailyTaskTracking,
}