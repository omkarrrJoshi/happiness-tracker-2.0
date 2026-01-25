const express = require("express");
const router = express.Router();
const dailyTaskRoutes = require("./dailyTaskRoutes"); // Import the v1 routes
const monthlyTaskRoutes = require("./monthlyTaskRoutes");
// Register all the versioned routes under /v1
router.use("/daily-task", dailyTaskRoutes);
router.use("/monthly-task", monthlyTaskRoutes);

module.exports = router;
