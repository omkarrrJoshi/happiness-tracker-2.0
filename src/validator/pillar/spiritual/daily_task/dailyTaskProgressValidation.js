const { body, query, param } = require("express-validator");

// Validation rules for updating a daily task (PUT)
const updateDailyTaskProgressValidation = [
  param("id").isUUID().withMessage("Task ID must be a valid UUID"),
  query("user_id").isUUID().withMessage("User ID must be a valid UUID"),
  body("daily_target").optional().isNumeric("daily target should be number"),
  body("daily_progress").optional().isNumeric("daily progrss should be number")
];

module.exports = {
  updateDailyTaskProgressValidation
}