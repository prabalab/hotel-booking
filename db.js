const { Pool } = require("pg");

// Configure PostgreSQL connection
const pool = new Pool({
  user: "mithun",      // Replace with your PostgreSQL username
  host: "dpg-cu8uf0popnds73amc970-a",      // Replace with your PostgreSQL host
  database: "mypostdb_qous",    // Replace with your PostgreSQL database name
  password: "L5IrwOllQmpL2yioNJHZiyRnGRVI1TNU",  // Replace with your PostgreSQL password
  port: 5432,             // Default PostgreSQL port
});

// Create the hotel_bookings table if it doesn't exist
const createTableQuery = `
CREATE TABLE IF NOT EXISTS hotel_bookings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    room_number INT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

async function setupDatabase() {
  try {
    await pool.query(createTableQuery);
    console.log("Table 'hotel_bookings' created successfully.");
  } catch (error) {
    console.error("Error creating table:", error.message);
  }
}

// Run the setupDatabase function
setupDatabase();

// Export the pool for use in other files
module.exports = pool;
