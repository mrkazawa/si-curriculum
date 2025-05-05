const connectDB = require("../config/database");

const connection = connectDB();

// Create capaian_pembelajaran_lulusan table if it doesn't exist
const createTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS capaian_pembelajaran_lulusan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_cpl VARCHAR(10) NOT NULL UNIQUE,
    deskripsi TEXT NOT NULL,
    referensi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`;

  connection.query(sql, (err) => {
    if (err) {
      console.error("Error creating capaian_pembelajaran_lulusan table:", err);
      return;
    }
    console.log("capaian_pembelajaran_lulusan table is ready");
  });
};

// Initialize the table
createTable();

// Model functions for CRUD operations
const CapaianPembelajaran = {
  getAll: (callback) => {
    connection.query(
      "SELECT * FROM capaian_pembelajaran_lulusan ORDER BY kode_cpl",
      callback
    );
  },

  create: (cplData, callback) => {
    connection.query(
      "INSERT INTO capaian_pembelajaran_lulusan (kode_cpl, deskripsi, referensi) VALUES (?, ?, ?)",
      [cplData.kode_cpl, cplData.deskripsi, cplData.referensi],
      callback
    );
  },

  getById: (id, callback) => {
    connection.query(
      "SELECT * FROM capaian_pembelajaran_lulusan WHERE id = ?",
      [id],
      callback
    );
  },

  update: (id, cplData, callback) => {
    connection.query(
      "UPDATE capaian_pembelajaran_lulusan SET kode_cpl = ?, deskripsi = ?, referensi = ? WHERE id = ?",
      [cplData.kode_cpl, cplData.deskripsi, cplData.referensi, id],
      callback
    );
  },

  delete: (id, callback) => {
    connection.query(
      "DELETE FROM capaian_pembelajaran_lulusan WHERE id = ?",
      [id],
      callback
    );
  },
};

module.exports = CapaianPembelajaran;
