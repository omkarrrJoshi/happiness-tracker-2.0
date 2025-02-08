const successResponse = (res, data, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data
  });
};

const failureResponse = (res, errorMessage = "Something went wrong", statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
      success: false,
      statusCode,
      message: errorMessage,
      errors
  });
};

module.exports = { successResponse, failureResponse };