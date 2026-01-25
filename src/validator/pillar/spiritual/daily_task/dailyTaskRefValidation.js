const { body, param, header } = require("express-validator");

// Validation rules for updating a daily task (PUT)
const updateDailyTaskRefValidation = [
  param("id").isUUID().withMessage("Task ID must be a valid UUID"),
  header("user-id").notEmpty().withMessage("User ID must be a valid string"),
  body("name").optional().isString("Name must be valid string"),
  body("target")
    .optional()
    .isArray({ min: 7, max: 7 })
    .withMessage("Target must be an array of 7 integers")
    .custom((value) => {
      if (value && value.some((item) => !Number.isInteger(item))) {
        throw new Error("Each target value must be an integer");
      }
      return true;
    }),
  body("start_date").optional().isISO8601().withMessage("Start date must be a valid date"),
  body("end_date")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date"),
  body("link").optional().isString().withMessage("Link must be a string"),
  body("description").optional().isString().withMessage("Description must be a string"),
  body("image_url").optional().isString().withMessage("image_url must be a string"),
];

module.exports = {
  updateDailyTaskRefValidation
}