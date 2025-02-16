const express = require('express');
const router = express.Router();

const validateRoute = require('../../middleware/dynamicValidationMiddleware');
const { createDailyTaskValidation, getDailyTasksValidation } = require('../../validator/pillar/spiritual/daily_task/dailyTaskValidation');
const { createDailyTask, getDailyTasks } = require('../../controllers/daily_task/dailyTask');
const { updateDailyTaskRefValidation } = require('../../validator/pillar/spiritual/daily_task/dailyTaskRefValidation');
const { updateDailyTaskProgressValidation } = require('../../validator/pillar/spiritual/daily_task/dailyTaskProgressValidation');
const { updateDailyTaskRef } = require('../../controllers/daily_task/dailyTaskRef');
const { updateDailyTaskProgress } = require('../../controllers/daily_task/dailyTaskProgress');

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

router.put(
  '/ref/:id',
  validateRoute(updateDailyTaskRefValidation),
  updateDailyTaskRef
)

router.put(
  '/progress/:id',
  validateRoute(updateDailyTaskProgressValidation),
  updateDailyTaskProgress
)

module.exports = router;