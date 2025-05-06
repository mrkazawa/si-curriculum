const connectDB = require("../config/database");

const connection = connectDB();

// Create mapping table if it doesn't exist
const createTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS mk_bk_mapping (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_mk VARCHAR(10) NOT NULL,
    kode_bk VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_mapping (kode_mk, kode_bk)
  )`;

  connection.query(sql, (err) => {
    if (err) {
      console.error("Error creating mk_bk_mapping table:", err);
      return;
    }
    console.log("mk_bk_mapping table is ready");
  });
};

// Initialize the table
createTable();

// Model functions for mapping operations
const MkBkMappingModel = {
  // Get all MKs with their BK mappings
  getAllMkWithMappings: (callback) => {
    const query = `
      SELECT 
        mk.id AS mk_id,
        mk.kode_mk,
        GROUP_CONCAT(DISTINCT mapping.kode_bk ORDER BY mapping.kode_bk) AS mapped_bks
      FROM 
        mata_kuliah mk
      LEFT JOIN 
        mk_bk_mapping mapping ON mk.kode_mk = mapping.kode_mk
      GROUP BY 
        mk.id, mk.kode_mk
      ORDER BY 
        mk.kode_mk
    `;
    connection.query(query, callback);
  },

  // Get all BKs
  getAllBk: (callback) => {
    connection.query(
      "SELECT id, kode_bk FROM bahan_kajian ORDER BY kode_bk",
      callback
    );
  },

  // Check if a specific mapping exists
  checkMapping: (kode_mk, kode_bk, callback) => {
    connection.query(
      "SELECT id FROM mk_bk_mapping WHERE kode_mk = ? AND kode_bk = ?",
      [kode_mk, kode_bk],
      callback
    );
  },

  // Create a mapping
  createMapping: (kode_mk, kode_bk, callback) => {
    connection.query(
      "INSERT INTO mk_bk_mapping (kode_mk, kode_bk) VALUES (?, ?)",
      [kode_mk, kode_bk],
      callback
    );
  },

  // Delete a mapping
  deleteMapping: (kode_mk, kode_bk, callback) => {
    connection.query(
      "DELETE FROM mk_bk_mapping WHERE kode_mk = ? AND kode_bk = ?",
      [kode_mk, kode_bk],
      callback
    );
  },
};

module.exports = MkBkMappingModel;
