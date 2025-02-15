const { body, query, param } = require("express-validator");

// Validation rules for creating a new daily task (POST)
const createDailyTaskValidation = [
  body("user_id").isUUID().withMessage("User ID must be a valid UUID"),
  body("name").notEmpty().withMessage("Name is required"),
  body("type").notEmpty().withMessage("Type is required"),
  body("target")
    .isArray({ min: 7, max: 7 })
    .withMessage("Target must be an array of 7 integers")
    .custom((value) => {
      if (value.some((item) => !Number.isInteger(item))) {
        throw new Error("Each target value must be an integer");
      }
      return true;
    }),
  body("date").isISO8601().withMessage("date must be a valid date"),
  body("link").optional().isString().withMessage("link must be a string"),
  body("start_date").isISO8601().withMessage("Start date must be a valid date"),
  body("end_date").optional().isISO8601().withMessage("End date must be a valid date"),
  body("description").optional().isString().withMessage("Description must be a string"),
];

// Validation rules for querying tasks (GET)
const getDailyTasksValidation = [
  query("user_id").isUUID().withMessage("User ID must be a valid UUID"),
  query("date").isISO8601().withMessage("date must be a valid date"),
  query("type").isString().withMessage("type must be a string"),
];

// Validation rules for deleting a task (DELETE)
const deleteDailyTaskValidation = [
  param("id").isUUID().withMessage("Task ID must be a valid UUID"),
];

module.exports = {
  createDailyTaskValidation,
  getDailyTasksValidation,
  deleteDailyTaskValidation,
};