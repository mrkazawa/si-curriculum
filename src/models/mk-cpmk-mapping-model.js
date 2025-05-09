const connectDB = require("../config/database");

const connection = connectDB();

// Create mapping table if it doesn't exist
const createTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS mk_cpmk_mapping (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_mk VARCHAR(10) NOT NULL,
    kode_cpmk VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_mapping (kode_mk, kode_cpmk)
  )`;

  connection.query(sql, (err) => {
    if (err) {
      console.error("Error creating mk_cpmk_mapping table:", err);
      return;
    }
    console.log("mk_cpmk_mapping table is ready");
  });
};

// Initialize the table
createTable();

// Model functions for mapping operations
const MkCpmkMappingModel = {
  // Get all MKs with their mapped CPMKs
  getAllMkWithMappings: (callback) => {
    const query = `
      SELECT 
        mk.id AS mk_id,
        mk.kode_mk,
        mk.nama_mk,
        GROUP_CONCAT(DISTINCT mapping.kode_cpmk ORDER BY mapping.kode_cpmk) AS mapped_cpmks
      FROM 
        mata_kuliah mk
      LEFT JOIN 
        mk_cpmk_mapping mapping ON mk.kode_mk = mapping.kode_mk
      GROUP BY 
        mk.id, mk.kode_mk, mk.nama_mk
      ORDER BY 
        mk.kode_mk
    `;
    connection.query(query, callback);
  },

  // Get all CPMKs for specific CPLs
  getCpmksByCpls: (cplCodes, callback) => {
    if (!cplCodes || cplCodes.length === 0) {
      return callback(null, []);
    }

    const placeholders = cplCodes.map(() => "?").join(",");

    connection.query(
      `SELECT * FROM capaian_pembelajaran_mk 
       WHERE kode_cpl IN (${placeholders})
       ORDER BY kode_cpl, kode_cpmk`,
      cplCodes,
      callback
    );
  },

  // Get all CPMKs
  getAllCpmk: (callback) => {
    connection.query(
      "SELECT id, kode_cpmk, deskripsi, kode_cpl FROM capaian_pembelajaran_mk ORDER BY kode_cpl, kode_cpmk",
      callback
    );
  },

  // Check if a specific mapping exists
  checkMapping: (kode_mk, kode_cpmk, callback) => {
    connection.query(
      "SELECT id FROM mk_cpmk_mapping WHERE kode_mk = ? AND kode_cpmk = ?",
      [kode_mk, kode_cpmk],
      callback
    );
  },

  // Create a mapping
  createMapping: (kode_mk, kode_cpmk, callback) => {
    connection.query(
      "INSERT INTO mk_cpmk_mapping (kode_mk, kode_cpmk) VALUES (?, ?)",
      [kode_mk, kode_cpmk],
      callback
    );
  },

  // Delete a mapping
  deleteMapping: (kode_mk, kode_cpmk, callback) => {
    connection.query(
      "DELETE FROM mk_cpmk_mapping WHERE kode_mk = ? AND kode_cpmk = ?",
      [kode_mk, kode_cpmk],
      callback
    );
  },
};

module.exports = MkCpmkMappingModel;
