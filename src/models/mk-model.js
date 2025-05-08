// filepath: c:\Users\mrkazawa\my-codes\si-curriculum\src\models\mk-model.js
const connectDB = require("../config/database");

const connection = connectDB();

// Create mata_kuliah table if it doesn't exist
const createTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS mata_kuliah (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_mk VARCHAR(10) NOT NULL UNIQUE,
    nama_mk VARCHAR(255) NOT NULL,
    kompetensi ENUM('Utama', 'Pendukung') NOT NULL,
    jenis_mk ENUM('MK Wajib', 'MK Pilihan', 'MKWK') NOT NULL,
    sks INT NOT NULL,
    semester INT NOT NULL,
    prasyarat VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`;

  connection.query(sql, (err) => {
    if (err) {
      console.error("Error creating mata_kuliah table:", err);
      return;
    }
    console.log("mata_kuliah table is ready");
  });
};

// Initialize the table
createTable();

// Model functions for CRUD operations
const MkModel = {
  getAll: (callback) => {
    connection.query("SELECT * FROM mata_kuliah ORDER BY kode_mk", callback);
  },

  getAllBySemesterBelow: (semester, callback) => {
    connection.query(
      "SELECT kode_mk, nama_mk FROM mata_kuliah WHERE semester < ? ORDER BY semester, kode_mk",
      [semester],
      callback
    );
  },

  create: (mkData, callback) => {
    connection.query(
      "INSERT INTO mata_kuliah (kode_mk, nama_mk, kompetensi, jenis_mk, sks, semester, prasyarat) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        mkData.kode_mk,
        mkData.nama_mk,
        mkData.kompetensi,
        mkData.jenis_mk,
        mkData.sks,
        mkData.semester,
        mkData.prasyarat || null,
      ],
      callback
    );
  },

  getById: (id, callback) => {
    connection.query("SELECT * FROM mata_kuliah WHERE id = ?", [id], callback);
  },

  update: (id, mkData, callback) => {
    connection.query(
      "UPDATE mata_kuliah SET kode_mk = ?, nama_mk = ?, kompetensi = ?, jenis_mk = ?, sks = ?, semester = ?, prasyarat = ? WHERE id = ?",
      [
        mkData.kode_mk,
        mkData.nama_mk,
        mkData.kompetensi,
        mkData.jenis_mk,
        mkData.sks,
        mkData.semester,
        mkData.prasyarat || null,
        id,
      ],
      callback
    );
  },

  delete: (id, callback) => {
    connection.query("DELETE FROM mata_kuliah WHERE id = ?", [id], callback);
  },

  // Get the next MK code
  getNextCode: (callback) => {
    connection.query(
      "SELECT kode_mk FROM mata_kuliah ORDER BY kode_mk DESC LIMIT 1",
      (err, results) => {
        if (err) {
          return callback(err, null);
        }

        let nextCode = "MK01"; // Default if no MK exists yet

        if (results.length > 0) {
          // Extract the number from the last code (e.g., "MK04" -> "04")
          const lastCode = results[0].kode_mk;
          const lastNumber = parseInt(lastCode.substring(2));

          // Generate the next number with leading zero if needed
          const nextNumber = lastNumber + 1;
          nextCode = `MK${String(nextNumber).padStart(2, "0")}`;
        }

        callback(null, nextCode);
      }
    );
  },
};

module.exports = MkModel;
