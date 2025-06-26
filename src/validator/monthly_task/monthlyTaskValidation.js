const { body, query, param, header } = require("express-validator");

const createMonthlyTaskValidation = [
  body("user_id").notEmpty().withMessage("User ID must be a valid string"),
  body("name").notEmpty().withMessage("Name is required"),
  body("pillar").notEmpty().withMessage("Pillar is required"),
  body("type").notEmpty().withMessage("Type is required"),
  body("target").notEmpty().withMessage("Target is required"),
  body("link").optional().isString().withMessage("link must be a string"),
  body("description").optional().isString().withMessage("Description must be a string"),
  body("start_month").isNumeric().withMessage("Start month must be a number")
  .toInt()
  .isInt({ min: 1, max: 12 }).withMessage("Start month must be between 1 and 12"),
  body("start_year").isNumeric().withMessage("Start year must be a number").toInt(),
  body("end_month").optional().isNumeric().withMessage("End month must be a number")
  .toInt()
  .isInt({ min: 1, max: 12 }).withMessage("End month must be between 1 and 12"),
  body("end_year").optional().isNumeric().withMessage("End year must be a number").toInt(),
  body("image_url").optional().isString().withMessage("image_url must be a string"),
]

const getMonthlyTasksProgressValidation = [
  header("user_id").notEmpty().withMessage("User ID must be a valid string"),
  query("month").isNumeric().withMessage("month must be a number")
  .toInt()
  .isInt({ min: 1, max: 12 }).withMessage("month must be between 1 and 12"),
  query("year").isNumeric().withMessage("year must be a number").toInt(),
  query("type").isString().withMessage("type must be a string"),
]

module.exports = {
  createMonthlyTaskValidation,
  getMonthlyTasksProgressValidation
}


