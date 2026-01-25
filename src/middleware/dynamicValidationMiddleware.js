const { validationResult } = require("express-validator");
const { failureResponse } = require("../utils/responseHandler");

// Function to handle validation dynamically for a route
const validateRoute = (validationRules) => {
  return [
    validationRules, // Apply the validation rules passed as an argument
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return failureResponse(res, 'validation failure', 400, errors);
      }
      next();
    },
  ];
};

module.exports = validateRoute;
