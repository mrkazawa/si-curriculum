const connectDB = require("../../config/database");

const connection = connectDB();

// Create capaian_pembelajaran_mk table if it doesn't exist
const createTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS capaian_pembelajaran_mk (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_cpmk VARCHAR(10) NOT NULL UNIQUE,
    deskripsi TEXT NOT NULL,
    kode_cpl VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`;

  connection.query(sql, (err) => {
    if (err) {
      console.error("Error creating capaian_pembelajaran_mk table:", err);
      return;
    }
    console.log("capaian_pembelajaran_mk table is ready");
  });
};

// Initialize the table
createTable();

// Model functions for CRUD operations
const DaftarCpmkModel = {
  getAll: (callback) => {
    // Join with CPL table to get CPL details
    connection.query(
      `SELECT cpmk.*, cpl.deskripsi as cpl_deskripsi 
       FROM capaian_pembelajaran_mk cpmk 
       LEFT JOIN capaian_pembelajaran_lulusan cpl ON cpmk.kode_cpl = cpl.kode_cpl 
       ORDER BY kode_cpmk`,
      callback
    );
  },

  create: (cpmkData, callback) => {
    connection.query(
      "INSERT INTO capaian_pembelajaran_mk (kode_cpmk, deskripsi, kode_cpl) VALUES (?, ?, ?)",
      [cpmkData.kode_cpmk, cpmkData.deskripsi, cpmkData.kode_cpl],
      callback
    );
  },

  getById: (id, callback) => {
    connection.query(
      "SELECT * FROM capaian_pembelajaran_mk WHERE id = ?",
      [id],
      callback
    );
  },

  update: (id, cpmkData, callback) => {
    connection.query(
      "UPDATE capaian_pembelajaran_mk SET kode_cpmk = ?, deskripsi = ?, kode_cpl = ? WHERE id = ?",
      [cpmkData.kode_cpmk, cpmkData.deskripsi, cpmkData.kode_cpl, id],
      callback
    );
  },

  delete: (id, callback) => {
    connection.query(
      "DELETE FROM capaian_pembelajaran_mk WHERE id = ?",
      [id],
      callback
    );
  },

  // Count existing CPMKs for a specific CPL
  countByCpl: (kode_cpl, callback) => {
    connection.query(
      "SELECT COUNT(*) as count FROM capaian_pembelajaran_mk WHERE kode_cpl = ?",
      [kode_cpl],
      callback
    );
  },
};

module.exports = DaftarCpmkModel;
