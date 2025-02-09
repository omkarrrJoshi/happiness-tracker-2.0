const express = require('express');
const router = express.Router();

const validateRoute = require('../../middleware/dynamicValidationMiddleware');
const { createDailyTaskValidation, getDailyTasksValidation } = require('../../validator/pillar/spiritual/daily_task/dailyTaskValidation');
const { createDailyTask, getDailyTasks } = require('../../controllers/daily_task/dailyTask');

router.post(
  '/',
  validateRoute(createDailyTaskValidation),
  createDailyTask
)

router.get(
  '/',
  validateRoute(getDailyTasksValidation),
  getDailyTasks
)

module.exports = router;