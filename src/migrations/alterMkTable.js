const connectDB = require("../config/database");

const connection = connectDB();

// Function to add the missing columns to mata_kuliah table
const alterTable = () => {
  console.log("Checking for needed column alterations in mata_kuliah table...");

  // First check if jenis_mk column exists
  connection.query(
    "SHOW COLUMNS FROM mata_kuliah LIKE 'jenis_mk'",
    (err, results) => {
      if (err) {
        console.error("Error checking jenis_mk column:", err);
        return;
      }

      // Add jenis_mk column if it doesn't exist
      if (results.length === 0) {
        console.log("Adding jenis_mk column...");
        connection.query(
          "ALTER TABLE mata_kuliah ADD COLUMN jenis_mk ENUM('MK Wajib', 'MK Pilihan', 'MKWK') NOT NULL DEFAULT 'MK Wajib'",
          (err) => {
            if (err) {
              console.error("Error adding jenis_mk column:", err);
            } else {
              console.log("jenis_mk column added successfully");
            }
          }
        );
      } else {
        console.log("jenis_mk column already exists");
      }
    }
  );

  // Next check if prasyarat column exists
  connection.query(
    "SHOW COLUMNS FROM mata_kuliah LIKE 'prasyarat'",
    (err, results) => {
      if (err) {
        console.error("Error checking prasyarat column:", err);
        return;
      }

      // Add prasyarat column if it doesn't exist
      if (results.length === 0) {
        console.log("Adding prasyarat column...");
        connection.query(
          "ALTER TABLE mata_kuliah ADD COLUMN prasyarat VARCHAR(255)",
          (err) => {
            if (err) {
              console.error("Error adding prasyarat column:", err);
            } else {
              console.log("prasyarat column added successfully");
            }
          }
        );
      } else {
        console.log("prasyarat column already exists");
      }
    }
  );
};

// Run the alterations
alterTable();

// Disconnect after a delay to ensure alterations complete
setTimeout(() => {
  console.log("Database alterations completed");
  connection.end();
}, 3000);
