// filepath: c:\Users\mrkazawa\my-codes\si-curriculum\src\models\bk-model.js
const connectDB = require("../config/database");

const connection = connectDB();

// Create bahan_kajian table if it doesn't exist
const createTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS bahan_kajian (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_bk VARCHAR(10) NOT NULL UNIQUE,
    bahan_kajian VARCHAR(255) NOT NULL,
    deskripsi TEXT NOT NULL,
    kompetensi ENUM('Utama', 'Umum', 'Pendukung') NOT NULL,
    referensi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`;

  connection.query(sql, (err) => {
    if (err) {
      console.error("Error creating bahan_kajian table:", err);
      return;
    }
    console.log("bahan_kajian table is ready");
  });
};

// Initialize the table
createTable();

// Model functions for CRUD operations
const BkModel = {
  getAll: (callback) => {
    connection.query("SELECT * FROM bahan_kajian ORDER BY kode_bk", callback);
  },

  create: (bkData, callback) => {
    connection.query(
      "INSERT INTO bahan_kajian (kode_bk, bahan_kajian, deskripsi, kompetensi, referensi) VALUES (?, ?, ?, ?, ?)",
      [
        bkData.kode_bk,
        bkData.bahan_kajian,
        bkData.deskripsi,
        bkData.kompetensi,
        bkData.referensi,
      ],
      callback
    );
  },

  getById: (id, callback) => {
    connection.query("SELECT * FROM bahan_kajian WHERE id = ?", [id], callback);
  },

  update: (id, bkData, callback) => {
    connection.query(
      "UPDATE bahan_kajian SET kode_bk = ?, bahan_kajian = ?, deskripsi = ?, kompetensi = ?, referensi = ? WHERE id = ?",
      [
        bkData.kode_bk,
        bkData.bahan_kajian,
        bkData.deskripsi,
        bkData.kompetensi,
        bkData.referensi,
        id,
      ],
      callback
    );
  },

  delete: (id, callback) => {
    connection.query("DELETE FROM bahan_kajian WHERE id = ?", [id], callback);
  },
};

module.exports = BkModel;
