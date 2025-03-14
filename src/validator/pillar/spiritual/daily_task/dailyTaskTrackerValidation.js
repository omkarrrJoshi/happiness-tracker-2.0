const { query, header } = require("express-validator");

// Validation rules for querying tasks (GET)
const getDailyTaskTrackerValidation = [
  header("user-id").notEmpty().withMessage("User ID must be a valid string"),
  query("start_date").isISO8601().withMessage("start date must be a valid date"),
  query("start_date").isISO8601().withMessage("end date must be a valid date"),
  query("type").isString().withMessage("type must be a string"),
];

module.exports = {
  getDailyTaskTrackerValidation,
};