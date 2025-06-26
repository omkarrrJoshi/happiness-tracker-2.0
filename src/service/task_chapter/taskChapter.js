const { pool } = require("../../utils/db");
const { MONTHLY_TASK_REF, TASK_CHAPTER_REF, TASK_CHAPTER_PROGRESS } = require("../../constants/tables");
const TaskChapterRef = require("../../models/task_chapter/taskChapterRef");
const TaskChapterProgress = require("../../models/task_chapter/taskChapterProgress");
const { MonthlyTaskProgress } = require("../../models/monthly_task/MonthlyTaskProgress");

const createTaskChapterService = async (req) => {
  const { name, link, description, image_url } = req.body;
  const task_ref_id = req.params.task_ref_id;

  //check if task reference exists
  const checkTaskRefQuery = `SELECT * FROM ${MONTHLY_TASK_REF} WHERE id = $1`;
  const checkTaskRefResult = await pool.query(checkTaskRefQuery, [task_ref_id]);
  if(checkTaskRefResult.rows.length === 0){
    return {
      success: false,
      message: "Task reference not found",
      status: 404
    }
  }

  //check if chapter name already exists
  const checkChapterNameQuery = `SELECT * FROM ${TASK_CHAPTER_REF} WHERE name = $1 AND task_ref_id = $2`;
  const checkChapterNameResult = await pool.query(checkChapterNameQuery, [name, task_ref_id]);
  if(checkChapterNameResult.rows.length > 0){
    return {
      success: false,
      message: `Chapter name: ${name} already exists for ${checkTaskRefResult.rows[0].name}`,
      status: 400
    }
  }
  const target = checkTaskRefResult.rows[0].target;
  const taskChapterRef = new TaskChapterRef({
    task_ref_id,
    name,
    target,
    link,
    description,
    image_url
  });

  const taskChapterRefData = await taskChapterRef.save(pool);
  if(!taskChapterRefData){
    return {
      success: false,
      message: "Failed to save task chapter reference",
      status: 500
    }
  }

  return {
    success: true,
    data: taskChapterRefData,
    message: "Task chapter reference created successfully"
  }
}

const getTaskChaptersService = async (req) => {
  //get task ref id from path params and task progress id from query params
  const {task_ref_id} = req.params;
  const {task_progress_id} = req.query;

  //get all chapters
  const getChaptersQuery = `SELECT * FROM ${TASK_CHAPTER_REF} WHERE task_ref_id = $1`;
  const getChaptersResult = await pool.query(getChaptersQuery, [task_ref_id]);
  if(getChaptersResult.rows.length === 0){
    return {
      success: true,
      data: [],
      message: "No chapters found, please create a chapter first",
      status: 200
    }
  }

  //check if chapter progress exists
  const checkChapterProgressQuery = `SELECT * FROM ${TASK_CHAPTER_PROGRESS} WHERE task_progress_id = $1`;
  const checkChapterProgressResult = await pool.query(checkChapterProgressQuery, [task_progress_id]);
  
  // if not exist create chapters progress
  let chaptersProgressResponse = [];

  if(checkChapterProgressResult.rows.length === 0){
    for(const chapter of getChaptersResult.rows){
      const createChapterProgress = await createTaskChapterProgress(chapter.id, task_progress_id, chapter.target);
      for(const chapterProgress of createChapterProgress){
        chaptersProgressResponse.push(
          generateTaskChapterProgressResponse(chapter, chapterProgress)
        );
      }
    }
  }else{
    chaptersProgress = checkChapterProgressResult.rows;
    //loop over chapter ref and find the chapter progress and append to the chaptersProgress array
    for(const chapter of getChaptersResult.rows){
      const filteredChapterProgress = chaptersProgress.filter(chapterProgress => chapterProgress.task_chapter_ref_id === chapter.id);
      if(filteredChapterProgress.length > 0){
        for(const chapterProgress of filteredChapterProgress){
          chaptersProgressResponse.push(
            generateTaskChapterProgressResponse(chapter, chapterProgress)
          );
        }
      }else{
        const createChapterProgress = await createTaskChapterProgress(chapter.id, task_progress_id, chapter.target);
        for(const chapterProgress of createChapterProgress){
          chaptersProgressResponse.push(
            generateTaskChapterProgressResponse(chapter, chapterProgress)
          );
        }
      }
    }
  }

  let incompleteIterations = 0;

  // group the chapters according to the interation, and give the iteration as the key
  // if all chapters are completed, then the status of the iteration should be true
  const groupedChaptersProgressResponse = chaptersProgressResponse.reduce((acc, chapter) => {
    if(!acc[chapter.iteration]){
      acc[chapter.iteration] = {
        status: true,
        data: []
      }
    }
    if( acc[chapter.iteration].status === true && chapter.status === false){
      acc[chapter.iteration].status = false;
      incompleteIterations++;
    }
    acc[chapter.iteration].data.push(chapter);
    return acc;
  }, {});

  // for each iteration, the chapters should be sorted by the status of the chapter progress
  // if status is true, then the chapter progress should be the last one
  // if status is same, then the chapter progress should be sorted by iteration ascending
  for(const key in groupedChaptersProgressResponse){
    groupedChaptersProgressResponse[key].data.sort((a, b) => {
      if(a.status === b.status){
        return a.iteration - b.iteration;
      }
      return a.status ? 1 : -1;
    });
  }

  const completedIterations = Object.keys(groupedChaptersProgressResponse).length - incompleteIterations;
  console.log('total iterations', Object.keys(groupedChaptersProgressResponse).length);
  console.log('incomplete iterations', incompleteIterations);
  console.log('completed iterations', completedIterations);
  const updateTaskProgress = await MonthlyTaskProgress.update(pool, task_progress_id, completedIterations);
  let message = "Chapters progress retrieved successfully";
  if(!updateTaskProgress){
    message += "\nFailed to update task progress, contact developer";
  }
  
  //return all chapter progress
  return {
    success: true,
    data: groupedChaptersProgressResponse,
    message: message
  }
}

const updateTaskChapterProgressService = async (req) => {
  const {task_chapter_progress_id} = req.params;
  const {status, task_progress_id} = req.body;

  //update chapter progress status from function exist in models/task_chapter_progress.js
  const updateChapterProgress = await TaskChapterProgress.updateStatus(pool, task_chapter_progress_id, status);
  if(!updateChapterProgress){
    return {
      success: false,
      message: "Failed to update chapter progress, contact developer",
      status: 500
    }
  }

  return {
    success: true,
    data: {
      task_chapter_progress_id: task_chapter_progress_id,
      status: status
    },
    message: "Chapter progress updated successfully"
  }
}

const createTaskChapterProgress = async (chapter_ref_id, task_progress_id, target) => {
  let iteration = 1;
  let chaptersProgress = [];
  while(iteration <= target){
    const createChapterProgress = new TaskChapterProgress({
      task_progress_id,
      task_chapter_ref_id: chapter_ref_id,
      iteration
    });
    const createChapterProgressResult = await createChapterProgress.save(pool);
    chaptersProgress.push(createChapterProgressResult);
    iteration++;
  }
  return chaptersProgress;
}

const generateTaskChapterProgressResponse = (chapterRef, chapterProgress) => {
  return {
    id: chapterProgress.id,
    task_chapter_ref_id: chapterRef.id,
    status: chapterProgress.status,
    name: chapterRef.name,
    iteration: chapterProgress.iteration,
    link: chapterRef.link,
    description: chapterRef.description,
    image_url: chapterRef.image_url,
    created_at: chapterProgress.created_at,
    updated_at: chapterProgress.updated_at,
    deleted_at: chapterProgress.deleted_at,
    chapter_created_at: chapterRef.created_at,
  }
}

const getTaskProgress = async (task_progress_id) => {
  //get the count of incomplete chapters from iterations for the task progress
  const getIncompleteIterationsQuery = 
    `SELECT 
      iteration, 
      count(*) FILTER (WHERE status = false) as remaining_chapters 
    FROM 
      ${TASK_CHAPTER_PROGRESS} 
    WHERE 
      task_progress_id = $1 
      AND deleted_at IS NULL
    GROUP BY iteration`;
  const getIncompleteIterationsResult = await pool.query(getIncompleteIterationsQuery, [task_progress_id]);
  const incompleteIterations = getIncompleteIterationsResult.rows;
  
  let completedIterations = 0;
  for(const iteration of incompleteIterations){
    if(iteration.remaining_chapters === '0'){
      completedIterations++;
    }
  }
  return completedIterations;
}

module.exports = {
  createTaskChapterService,
  getTaskChaptersService,
  updateTaskChapterProgressService
}
