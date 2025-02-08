const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const routes = require("./routes/index");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api", routes);

module.exports = app;
