const connectDB = require("../config/database");

const connection = connectDB();

// Create mapping table if it doesn't exist
const createTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS mk_cpl_mapping (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_mk VARCHAR(10) NOT NULL,
    kode_cpl VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_mapping (kode_mk, kode_cpl)
  )`;

  connection.query(sql, (err) => {
    if (err) {
      console.error("Error creating mk_cpl_mapping table:", err);
      return;
    }
    console.log("mk_cpl_mapping table is ready");
  });
};

// Initialize the table
createTable();

// Model functions for mapping operations
const MkCplMappingModel = {
  // Get all MKs with their CPL mappings
  getAllMkWithMappings: (callback) => {
    const query = `
      SELECT 
        mk.id AS mk_id,
        mk.kode_mk,
        GROUP_CONCAT(DISTINCT mapping.kode_cpl ORDER BY mapping.kode_cpl) AS mapped_cpls
      FROM 
        mata_kuliah mk
      LEFT JOIN 
        mk_cpl_mapping mapping ON mk.kode_mk = mapping.kode_mk
      GROUP BY 
        mk.id, mk.kode_mk
      ORDER BY 
        mk.kode_mk
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
  checkMapping: (kode_mk, kode_cpl, callback) => {
    connection.query(
      "SELECT id FROM mk_cpl_mapping WHERE kode_mk = ? AND kode_cpl = ?",
      [kode_mk, kode_cpl],
      callback
    );
  },

  // Create a mapping
  createMapping: (kode_mk, kode_cpl, callback) => {
    connection.query(
      "INSERT INTO mk_cpl_mapping (kode_mk, kode_cpl) VALUES (?, ?)",
      [kode_mk, kode_cpl],
      callback
    );
  },

  // Delete a mapping
  deleteMapping: (kode_mk, kode_cpl, callback) => {
    connection.query(
      "DELETE FROM mk_cpl_mapping WHERE kode_mk = ? AND kode_cpl = ?",
      [kode_mk, kode_cpl],
      callback
    );
  },
};

module.exports = MkCplMappingModel;
