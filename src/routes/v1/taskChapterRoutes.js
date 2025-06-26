const express = require('express');
const router = express.Router();

const validateRoute = require('../../middleware/dynamicValidationMiddleware');
const { createTaskChapterValidation, getTaskChaptersValidation, updateTaskChapterProgressValidation } = require('../../validator/task_chapter/taskChapterValidation');
const { createTaskChapter, getTaskChapters, updateTaskChapterProgress } = require('../../controllers/task_chapter/taskChapter');

router.post(
  '/:task_ref_id/chapters',
  validateRoute(createTaskChapterValidation),
  createTaskChapter
)

router.get(
  '/:task_ref_id/chapters',
  validateRoute(getTaskChaptersValidation),
  getTaskChapters
)

router.put(
  '/:task_ref_id/chapters/:task_chapter_progress_id',
  validateRoute(updateTaskChapterProgressValidation),
  updateTaskChapterProgress
)

module.exports = router;
