const express = require('express');
const router = express.Router();

const validateRoute = require('../../middleware/dynamicValidationMiddleware');
const { createMonthlyTaskValidation, getMonthlyTasksProgressValidation } = require('../../validator/monthly_task/monthlyTaskValidation');
const { createMonthlyTask, getMonthlyTasksProgress } = require('../../controllers/monthly_task/monthlyTask');
const taskChapterRoutes = require('./taskChapterRoutes');

router.post(
  '/',
  validateRoute(createMonthlyTaskValidation),
  createMonthlyTask
)

router.get(
  '/',
  validateRoute(getMonthlyTasksProgressValidation),
  getMonthlyTasksProgress
)

router.use('', taskChapterRoutes);
module.exports = router;
