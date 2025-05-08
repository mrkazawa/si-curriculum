const connectDB = require("../config/database");

const connection = connectDB();

// Create mapping table if it doesn't exist
const createTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS bk_cpl_mapping (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_bk VARCHAR(10) NOT NULL,
    kode_cpl VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_mapping (kode_bk, kode_cpl)
  )`;

  connection.query(sql, (err) => {
    if (err) {
      console.error("Error creating bk_cpl_mapping table:", err);
      return;
    }
    console.log("bk_cpl_mapping table is ready");
  });
};

// Initialize the table
createTable();

// Model functions for mapping operations
const BkCplMappingModel = {
  // Get all BKs with their CPL mappings
  getAllBkWithMappings: (callback) => {
    const query = `
      SELECT 
        bk.id AS bk_id,
        bk.kode_bk,
        bk.bahan_kajian,
        GROUP_CONCAT(DISTINCT mapping.kode_cpl ORDER BY mapping.kode_cpl) AS mapped_cpls
      FROM 
        bahan_kajian bk
      LEFT JOIN 
        bk_cpl_mapping mapping ON bk.kode_bk = mapping.kode_bk
      GROUP BY 
        bk.id, bk.kode_bk, bk.bahan_kajian
      ORDER BY 
        bk.kode_bk
    `;
    connection.query(query, callback);
  },

  // Get all CPLs
  getAllCpl: (callback) => {
    connection.query(
      "SELECT id, kode_cpl FROM capaian_pembelajaran_lulusan ORDER BY kode_cpl",
      callback
    );
  },

  // Check if a specific mapping exists
  checkMapping: (kode_bk, kode_cpl, callback) => {
    connection.query(
      "SELECT id FROM bk_cpl_mapping WHERE kode_bk = ? AND kode_cpl = ?",
      [kode_bk, kode_cpl],
      callback
    );
  },

  // Create a mapping
  createMapping: (kode_bk, kode_cpl, callback) => {
    connection.query(
      "INSERT INTO bk_cpl_mapping (kode_bk, kode_cpl) VALUES (?, ?)",
      [kode_bk, kode_cpl],
      callback
    );
  },

  // Delete a mapping
  deleteMapping: (kode_bk, kode_cpl, callback) => {
    connection.query(
      "DELETE FROM bk_cpl_mapping WHERE kode_bk = ? AND kode_cpl = ?",
      [kode_bk, kode_cpl],
      callback
    );
  },
};

module.exports = BkCplMappingModel;
