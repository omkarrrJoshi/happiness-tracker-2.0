const express = require("express");
const router = express.Router();
const dailyTaskRoutes = require("./dailyTaskRoutes"); // Import the v1 routes

// Register all the versioned routes under /v1
router.use("/daily-task", dailyTaskRoutes);

module.exports = router;
