const connectDB = require("../config/database");

const connection = connectDB();

// Create mapping table if it doesn't exist
const createTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS cpl_pl_mapping (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_cpl VARCHAR(10) NOT NULL,
    kode_pl VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_mapping (kode_cpl, kode_pl)
  )`;

  connection.query(sql, (err) => {
    if (err) {
      console.error("Error creating cpl_pl_mapping table:", err);
      return;
    }
    console.log("cpl_pl_mapping table is ready");
  });
};

// Initialize the table
createTable();

// Model functions for mapping operations
const MappingModel = {
  // Get all CPLs with their PL mappings
  getAllCplWithMappings: (callback) => {
    const query = `
      SELECT 
        cpl.id AS cpl_id,
        cpl.kode_cpl,
        cpl.deskripsi,
        GROUP_CONCAT(DISTINCT mapping.kode_pl ORDER BY mapping.kode_pl) AS mapped_pls
      FROM 
        capaian_pembelajaran_lulusan cpl
      LEFT JOIN 
        cpl_pl_mapping mapping ON cpl.kode_cpl = mapping.kode_cpl
      GROUP BY 
        cpl.id, cpl.kode_cpl, cpl.deskripsi
      ORDER BY 
        cpl.kode_cpl
    `;
    connection.query(query, callback);
  },

  // Get all PLs
  getAllPl: (callback) => {
    connection.query(
      "SELECT id, kode_pl FROM profil_lulusan ORDER BY kode_pl",
      callback
    );
  },

  // Check if a specific mapping exists
  checkMapping: (kode_cpl, kode_pl, callback) => {
    connection.query(
      "SELECT id FROM cpl_pl_mapping WHERE kode_cpl = ? AND kode_pl = ?",
      [kode_cpl, kode_pl],
      callback
    );
  },

  // Create a mapping
  createMapping: (kode_cpl, kode_pl, callback) => {
    connection.query(
      "INSERT INTO cpl_pl_mapping (kode_cpl, kode_pl) VALUES (?, ?)",
      [kode_cpl, kode_pl],
      callback
    );
  },

  // Delete a mapping
  deleteMapping: (kode_cpl, kode_pl, callback) => {
    connection.query(
      "DELETE FROM cpl_pl_mapping WHERE kode_cpl = ? AND kode_pl = ?",
      [kode_cpl, kode_pl],
      callback
    );
  },
};

module.exports = MappingModel;
