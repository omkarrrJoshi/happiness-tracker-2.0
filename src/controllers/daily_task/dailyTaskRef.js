const { updateDailyTaskRefService } = require("../../service/daily_task/dailyTaskRef");
const { failureResponse, successResponse } = require("../../utils/responseHandler")

const updateDailyTaskRef = async (req, res) => {
  try{
    const response = await updateDailyTaskRefService(req);
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
  updateDailyTaskRef
}