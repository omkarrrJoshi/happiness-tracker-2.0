const { Pool } = require("pg");
const config = require("../config/config");
const { LOCAL } = require("../constants/constant");

// Create a new PostgreSQL connection pool
const pool = new Pool({
    connectionString: config.databaseUrl,
    ssl: config.env !== LOCAL ? { rejectUnauthorized: false } : false, 
});

// Automatically log a success message when the connection is established
pool.connect()
    .then(client => {
        console.log("🟢 Database connection successful!");
        client.release(); // Release the client back to the pool
    })
    .catch(error => {
        console.error("🔴 Database connection error:", error);
        process.exit(1); // Exit if connection fails
    });


// Function to test the database connection
const testDbConnection = async () => {
    try {
        const client = await pool.connect();
        console.log("Testing for connection to database done successfully");
        client.release();
    } catch (error) {
        console.error("🔴 Error connecting to PostgreSQL database:", error);
        process.exit(1); // Exit the process on failure
    }
};

// Reusable query function
const query = async (text, params) => {
  try {
      const result = await pool.query(text, params);
      return result.rows; // Return only the rows
  } catch (error) {
      console.error("❌ Database Query Error:", error);
      throw error; // Rethrow the error for better debugging
  }
};

// Export the pool and test function
module.exports = { pool, testDbConnection, query };
