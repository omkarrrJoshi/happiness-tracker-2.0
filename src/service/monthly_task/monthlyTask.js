const { pool } = require("../../utils/db");
const { MONTHLY_TASK_REF, MONTHLY_TASK_PROGRESS } = require("../../constants/tables");
const MonthlyTaskRef = require("../../models/monthly_task/MonthlyTaskRef");
const { MonthlyTaskProgress } = require("../../models/monthly_task/MonthlyTaskProgress");

const createMonthlyTaskService = async (req) => {
  try{
    const body = req.body;
    const startMonth = body.start_month;
    const startYear = body.start_year;
    const endMonth = body.end_month;
    const endYear = body.end_year;

    //start date is the first day of the start month
    const startDate = new Date(startYear, startMonth - 1, 1);
    console.log('startDate', startDate);
    //end date is the last day of the end month
    let endDate = null;
    if(endMonth && endYear){
      endDate = new Date(endYear, endMonth, 0);
    }

    if(endDate && startDate > endDate){
      return {
        success: false,
        message: "Start date must be before end date",
        status: 400
      }
    }

    const checkQuery = `SELECT * FROM ${MONTHLY_TASK_REF} WHERE name = $1 AND user_id = $2`;
    const checkResult = await pool.query(checkQuery, [body.name, body.user_id]);
    if(checkResult.rows.length > 0){
      for(const result of checkResult.rows){
        const checkStartDate = result.start_date;
        const checkEndDate = result.end_date;
        if(checkEndDate === null){
          if(!endDate || startDate >= checkStartDate ||  endDate >= checkStartDate){
            return {
              success: false,
              message: "A task with the same name already exists for this user, starting from " + checkStartDate + " and continuing indefinitely.",
              status: 400
            }
          }
        }else{
          if(
            startDate >= checkStartDate && startDate <= checkEndDate ||
            (endDate && endDate >= checkStartDate && endDate <= checkEndDate) ||
            (startDate <= checkStartDate && (!endDate || endDate >= checkEndDate))
          ){
            return {
              success: false,
              message: "A task with the same name already exists for this user, starting from " + checkStartDate + " and ending on " + checkEndDate + ".",
              status: 400
            }
          }
        }
      }
    }

    const monthlyTaskRef = new MonthlyTaskRef({
      user_id: body.user_id,
      name: body.name,
      pillar: body.pillar,
      type: body.type,
      target: body.target,
      link: body.link,
      description: body.description,
      image_url: body.image_url,
      start_date: startDate,
      end_date: endDate,
    });
    const monthlyTaskRefData = await monthlyTaskRef.save(pool);
    if(!monthlyTaskRefData){
      return {
        success: false,
        message: "Failed to save monthly task reference",
        status: 500
      }
    }

    return {
      success: true,
      data: monthlyTaskRefData,
      message: "Monthly task reference created successfully"
    }
        
    
  }catch(error){
    console.error('error in createMonthlyTaskService:', error)
    return {
      success: false,
      message: error.message,
      status: 500
    }
  }
}

const getMonthlyTasksProgressesService = async (req) => {
  try{
    const user_id = req.headers.user_id;
    const month = req.query.month;
    const year = req.query.year;
    const pillar = req.query.pillar;

    // console.log(user_id, month, year);
    const date = new Date(year, month - 1, 15);

    //get all monthly task ref with start date <= date and end date >= date
    const monthlyTaskRefs = await MonthlyTaskRef.findByUserIdAndDate(pool, user_id, date, pillar);
    if(monthlyTaskRefs.length === 0){
      return {
        success: true,
        data: [],
        message: "No monthly task references found for this user and month",
        status: 200
      }
    }

    const monthlyTaskProgressesResponse = []
    for(const monthlyTaskRef of monthlyTaskRefs){
      const maxDateResponse = await MonthlyTaskProgress.findMaxDateByTaskRefId(pool, monthlyTaskRef.id);
      const maxDate = maxDateResponse.max_date;
      let startDate = monthlyTaskRef.start_date;
      let currentDate = date;
      let monthlyTaskProgress = null;
      console.log('maxDate', maxDate, 'currentDate', currentDate);
      if(!maxDate){
        monthlyTaskProgress = await addMonthlyTaskProgress(monthlyTaskRef, startDate, currentDate);
      }else if(maxDate < currentDate){
        const nextDate = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 1);
        monthlyTaskProgress = await addMonthlyTaskProgress(monthlyTaskRef, nextDate, currentDate);
      }else{
        monthlyTaskProgress = await MonthlyTaskProgress.findByTaskRefIdAndDate(pool, monthlyTaskRef.id, currentDate);
      }

      monthlyTaskProgressResponse = {
        ref_id: monthlyTaskRef.id,
        progress_id: monthlyTaskProgress.id,
        name: monthlyTaskRef.name,
        pillar: monthlyTaskRef.pillar,
        start_date: monthlyTaskRef.start_date,
        end_date: monthlyTaskRef.end_date,
        progress: monthlyTaskProgress.progress,
        target: monthlyTaskProgress.target,
        date: monthlyTaskProgress.date,
        type: monthlyTaskRef.type,
      }
      monthlyTaskProgressesResponse.push(monthlyTaskProgressResponse);
    }

    return {
      success: true,
      data: monthlyTaskProgressesResponse,
      message: "Monthly task progresses fetched successfully",
      status: 200
    }
  }catch(error){
    console.error('error in getMonthlyTaskProgressesService:', error)
    return {
      success: false,
      message: error.message,
      status: 500
    }
  }
}

async function addMonthlyTaskProgress(monthlyTaskRef, startDate, currentDate){
  let monthlyTaskProgress = null;
  startDate = get15thDateOfMonth(startDate);
  currentDate = get15thDateOfMonth(currentDate);

  console.log(startDate, currentDate);

  while(startDate <= currentDate){
    monthlyTaskProgress = new MonthlyTaskProgress({
      task_ref_id: monthlyTaskRef.id,
      date: startDate,
      progress: 0,
      target: monthlyTaskRef.target,
    })
    await monthlyTaskProgress.createMonthlyTaskProgress(pool);
    startDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 15);
  }

  if(!monthlyTaskProgress){
    throw new Error("Something went wrong, monthly task progress is null");
  }

  return monthlyTaskProgress;
}
  

function get15thDateOfMonth(date){
  return new Date(date.getFullYear(), date.getMonth(), 15);
}

module.exports = {
  createMonthlyTaskService,
  getMonthlyTasksProgressesService
}