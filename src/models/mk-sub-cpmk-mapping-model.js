const connectDB = require("../config/database");

const connection = connectDB();

// Create mapping table if it doesn't exist
const createTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS mk_sub_cpmk_mapping (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_mk VARCHAR(10) NOT NULL,
    kode_sub_cpmk VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_mapping (kode_mk, kode_sub_cpmk)
  )`;

  connection.query(sql, (err) => {
    if (err) {
      console.error("Error creating mk_sub_cpmk_mapping table:", err);
      return;
    }
    console.log("mk_sub_cpmk_mapping table is ready");
  });
};

// Initialize the table
createTable();

// Model functions for mapping operations
const MkSubCpmkMappingModel = {
  // Get all MKs with their mapped Sub-CPMKs
  getAllMkWithMappings: (callback) => {
    const query = `
      SELECT 
        mk.id AS mk_id,
        mk.kode_mk,
        mk.nama_mk,
        GROUP_CONCAT(DISTINCT mapping.kode_sub_cpmk ORDER BY mapping.kode_sub_cpmk) AS mapped_sub_cpmks
      FROM 
        mata_kuliah mk
      LEFT JOIN 
        mk_sub_cpmk_mapping mapping ON mk.kode_mk = mapping.kode_mk
      GROUP BY 
        mk.id, mk.kode_mk, mk.nama_mk
      ORDER BY 
        mk.kode_mk
    `;
    connection.query(query, callback);
  },

  // Get all Sub-CPMKs available for a specific set of CPMKs
  getSubCpmksByCpmks: (cpmkCodes, callback) => {
    if (!cpmkCodes || cpmkCodes.length === 0) {
      return callback(null, []);
    }

    const placeholders = cpmkCodes.map(() => "?").join(",");

    connection.query(
      `SELECT * FROM sub_capaian_pembelajaran_mk 
       WHERE kode_cpmk IN (${placeholders})
       ORDER BY kode_cpmk, kode_sub_cpmk`,
      cpmkCodes,
      callback
    );
  },

  // Get all Sub-CPMKs
  getAllSubCpmk: (callback) => {
    connection.query(
      `SELECT sub.id, sub.kode_sub_cpmk, sub.deskripsi, sub.kode_cpmk, cpmk.kode_cpl 
       FROM sub_capaian_pembelajaran_mk sub
       LEFT JOIN capaian_pembelajaran_mk cpmk ON sub.kode_cpmk = cpmk.kode_cpmk
       ORDER BY cpmk.kode_cpl, cpmk.kode_cpmk, sub.kode_sub_cpmk`,
      callback
    );
  },

  // Check if a specific mapping exists
  checkMapping: (kode_mk, kode_sub_cpmk, callback) => {
    connection.query(
      "SELECT id FROM mk_sub_cpmk_mapping WHERE kode_mk = ? AND kode_sub_cpmk = ?",
      [kode_mk, kode_sub_cpmk],
      callback
    );
  },

  // Create a mapping
  createMapping: (kode_mk, kode_sub_cpmk, callback) => {
    connection.query(
      "INSERT INTO mk_sub_cpmk_mapping (kode_mk, kode_sub_cpmk) VALUES (?, ?)",
      [kode_mk, kode_sub_cpmk],
      callback
    );
  },

  // Delete a mapping
  deleteMapping: (kode_mk, kode_sub_cpmk, callback) => {
    connection.query(
      "DELETE FROM mk_sub_cpmk_mapping WHERE kode_mk = ? AND kode_sub_cpmk = ?",
      [kode_mk, kode_sub_cpmk],
      callback
    );
  },
};

module.exports = MkSubCpmkMappingModel;
