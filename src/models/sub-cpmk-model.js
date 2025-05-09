// filepath: c:\Users\mrkazawa\my-codes\si-curriculum\src\models\sub-cpmk-model.js
const connectDB = require("../config/database");

const connection = connectDB();

// Create sub_capaian_pembelajaran_mk table if it doesn't exist
const createTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS sub_capaian_pembelajaran_mk (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_sub_cpmk VARCHAR(15) NOT NULL UNIQUE,
    deskripsi TEXT NOT NULL,
    kode_cpmk VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`;

  connection.query(sql, (err) => {
    if (err) {
      console.error("Error creating sub_capaian_pembelajaran_mk table:", err);
      return;
    }
    console.log("sub_capaian_pembelajaran_mk table is ready");
  });
};

// Initialize the table
createTable();

// Model functions for CRUD operations
const SubCpmkModel = {
  getAll: (callback) => {
    // Join with CPMK table to get CPMK details
    connection.query(
      `SELECT sub.*, cpmk.deskripsi as cpmk_deskripsi 
       FROM sub_capaian_pembelajaran_mk sub 
       LEFT JOIN capaian_pembelajaran_mk cpmk ON sub.kode_cpmk = cpmk.kode_cpmk 
       ORDER BY kode_sub_cpmk`,
      callback
    );
  },

  create: (subCpmkData, callback) => {
    connection.query(
      "INSERT INTO sub_capaian_pembelajaran_mk (kode_sub_cpmk, deskripsi, kode_cpmk) VALUES (?, ?, ?)",
      [subCpmkData.kode_sub_cpmk, subCpmkData.deskripsi, subCpmkData.kode_cpmk],
      callback
    );
  },

  getById: (id, callback) => {
    connection.query(
      "SELECT * FROM sub_capaian_pembelajaran_mk WHERE id = ?",
      [id],
      callback
    );
  },

  update: (id, subCpmkData, callback) => {
    connection.query(
      "UPDATE sub_capaian_pembelajaran_mk SET kode_sub_cpmk = ?, deskripsi = ?, kode_cpmk = ? WHERE id = ?",
      [
        subCpmkData.kode_sub_cpmk,
        subCpmkData.deskripsi,
        subCpmkData.kode_cpmk,
        id,
      ],
      callback
    );
  },

  delete: (id, callback) => {
    connection.query(
      "DELETE FROM sub_capaian_pembelajaran_mk WHERE id = ?",
      [id],
      callback
    );
  },

  // Count existing Sub-CPMKs for a specific CPMK
  countByCpmk: (kode_cpmk, callback) => {
    connection.query(
      "SELECT COUNT(*) as count FROM sub_capaian_pembelajaran_mk WHERE kode_cpmk = ?",
      [kode_cpmk],
      callback
    );
  },

  // Get Sub-CPMK with CPMK details for edit form
  getWithCpmkDetails: (id, callback) => {
    connection.query(
      `SELECT sub.*, cpmk.deskripsi as cpmk_deskripsi, cpmk.kode_cpmk 
       FROM sub_capaian_pembelajaran_mk sub 
       LEFT JOIN capaian_pembelajaran_mk cpmk ON sub.kode_cpmk = cpmk.kode_cpmk 
       WHERE sub.id = ?`,
      [id],
      callback
    );
  },
};

module.exports = SubCpmkModel;
