const { createDailyTaskService, getDailyTasksService } = require("../../service/daily_task/dailyTask");
const { failureResponse, successResponse } = require("../../utils/responseHandler")

const createDailyTask = async (req, res) => {
  try{
    const response = await createDailyTaskService(req);
    if(response.success){
      successResponse(res, response.data, 'shloka added successfully');
    }else{
      failureResponse(res, response.message, response.status, response.errors);
    }
  } catch (error) {
    console.error('error in createDailyTask controller:', error)
    failureResponse(res, error.message, 500, error);
  }
}

const getDailyTasks = async (req, res) => {
  try{
    const response = await getDailyTasksService(req);
    if(response.success){
      successResponse(res, response.data, 'shloka added successfully');
    }else{
      failureResponse(res, response.message, response.status, response.errors);
    } 
  }catch(error){
    console.error('error in getDailyTasks controller:', error)
    failureResponse(res, error.message, 500, error);
  }
}

module.exports = {
  createDailyTask,
  getDailyTasks,
}