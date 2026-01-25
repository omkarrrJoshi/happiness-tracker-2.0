require("dotenv").config();

const config = {
    env: process.env.NODE_ENV || 'local',
    port: process.env.PORT || 5000,
    databaseUrl: process.env.DATABASE_URL,
    hostUrl: process.env.HOST_URL,
};

module.exports = config;
