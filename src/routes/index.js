const express = require("express");
const { successResponse } = require("../utils/responseHandler");

const router = express.Router();

router.get("/health", (req, res) => {
    return successResponse(res, { uptime: process.uptime() }, "Server is running...");
});

module.exports = router;
