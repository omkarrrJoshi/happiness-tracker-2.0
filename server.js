const app = require("./src/app");

const config = require('./src/config/config')
const { testDbConnection } = require("./src/utils/db")

// Test database connection on startup
testDbConnection();

app.listen(config.port, () => {
  console.log(`Server running in ${config.env} mode at ${config.hostUrl} and port ${config.port}`);
});
