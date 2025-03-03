const { body, param, header } = require("express-validator");

// Validation rules for updating a daily task (PUT)
const updateDailyTaskProgressValidation = [
  param("id").isUUID().withMessage("Task ID must be a valid UUID"),
  header("user-id").notEmpty().withMessage("User ID must be a valid string"),
  body("daily_target").optional().isNumeric().withMessage("Daily target should be a number"),
  body("daily_progress").optional().isNumeric().withMessage("Daily progress should be a number"),
];

module.exports = {
  updateDailyTaskProgressValidation
};
