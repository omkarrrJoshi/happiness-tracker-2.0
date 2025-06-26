const { body, query, param, header } = require("express-validator");

const createTaskChapterValidation = [
  param("task_ref_id").notEmpty().withMessage("Task ref ID must be a valid string"),
  body("name").notEmpty().withMessage("Name is required"),
  body("link").optional().isString().withMessage("link must be a string"),
  body("description").optional().isString().withMessage("Description must be a string"),
  body("image_url").optional().isString().withMessage("image_url must be a string"),
]

const getTaskChaptersValidation = [
  param("task_ref_id").notEmpty().withMessage("Task ref ID must be a valid string"),
  query("task_progress_id").notEmpty().withMessage("Task progress ID must be a valid string"),
]

const updateTaskChapterProgressValidation = [
  param("task_ref_id").notEmpty().withMessage("Task ref ID must be a valid string"),
  param("task_chapter_progress_id").notEmpty().withMessage("Task chapter progress ID must be a valid string"),
  body("status").notEmpty().withMessage("Status must be a valid string"),
  body("task_progress_id").notEmpty().withMessage("Task progress ID must be a valid string"),
]

module.exports = {
  createTaskChapterValidation,
  getTaskChaptersValidation,
  updateTaskChapterProgressValidation
}

