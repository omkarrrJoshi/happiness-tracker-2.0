const { createTaskChapterService, getTaskChaptersService, updateTaskChapterProgressService } = require("../../service/task_chapter/taskChapter");
const { failureResponse, successResponse } = require("../../utils/responseHandler");

const createTaskChapter = async (req, res) => {
  try{
    const response = await createTaskChapterService(req);
    if(response.success){
      successResponse(res, response.data, response.message);
    }else{
      failureResponse(res, response.message, response.status, response.errors);
    }
  }catch(error){
    console.error('error in createTaskChapter controller:', error)
    failureResponse(res, error.message, 500, error);
  }
}

const getTaskChapters = async (req, res) => {
  try{
    const response = await getTaskChaptersService(req);
    if(response.success){
      successResponse(res, response.data, response.message);
    }else{
      failureResponse(res, response.message, response.status, response.errors);
    }
  }catch(error){
    console.error('error in getTaskChapters controller:', error)
    failureResponse(res, error.message, 500, error);
  }
}

const updateTaskChapterProgress = async (req, res) => {
  try{
    const response = await updateTaskChapterProgressService(req);
    if(response.success){
      successResponse(res, response.data, response.message);
    }else{
      failureResponse(res, response.message, response.status, response.errors);
    }
  }catch(error){
    console.error('error in updateTaskChapterProgress controller:', error)
    failureResponse(res, error.message, 500, error);
  }
}

module.exports = { createTaskChapter, getTaskChapters, updateTaskChapterProgress };