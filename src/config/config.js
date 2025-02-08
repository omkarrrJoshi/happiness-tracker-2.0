require("dotenv").config();

const config = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    databaseUrl: process.env.DATABASE_URL,
    hostUrl: process.env.HOST_URL,
};

module.exports = config;