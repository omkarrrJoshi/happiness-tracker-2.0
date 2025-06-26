const { createMonthlyTaskService, getMonthlyTasksProgressesService } = require("../../service/monthly_task/monthlyTask");
const { failureResponse, successResponse } = require("../../utils/responseHandler")

const createMonthlyTask = async (req, res) => {
  try{
    const response = await createMonthlyTaskService(req);
    if(response.success){
      successResponse(res, response.data, response.message);
    }else{
      failureResponse(res, response.message, response.status, response.errors);
    }
  }catch(error){
    console.error('error in createMonthlyTask controller:', error)
    failureResponse(res, error.message, 500, error);
  }
}

const getMonthlyTasksProgress = async (req, res) => {
  try{
    const response = await getMonthlyTasksProgressesService(req);
    if(response.success){
      successResponse(res, response.data, response.message);
    }else{
      failureResponse(res, response.message, response.status, response.errors);
    }
  }catch(error){
    console.error('error in getMonthlyTasks controller:', error)
    failureResponse(res, error.message, 500, error);
  }
}

module.exports = {
  createMonthlyTask,
  getMonthlyTasksProgress
}