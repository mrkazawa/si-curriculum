const connectDB = require("../config/database");

const connection = connectDB();

// Create mata_kuliah table if it doesn't exist
const createTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS mata_kuliah (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_mk VARCHAR(10) NOT NULL UNIQUE,
    nama_mk VARCHAR(255) NOT NULL,
    kompetensi ENUM('Utama', 'Pendukung') NOT NULL,
    sks INT NOT NULL,
    semester INT NOT NULL,
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

  create: (mkData, callback) => {
    connection.query(
      "INSERT INTO mata_kuliah (kode_mk, nama_mk, kompetensi, sks, semester) VALUES (?, ?, ?, ?, ?)",
      [
        mkData.kode_mk,
        mkData.nama_mk,
        mkData.kompetensi,
        mkData.sks,
        mkData.semester,
      ],
      callback
    );
  },

  getById: (id, callback) => {
    connection.query("SELECT * FROM mata_kuliah WHERE id = ?", [id], callback);
  },

  update: (id, mkData, callback) => {
    connection.query(
      "UPDATE mata_kuliah SET kode_mk = ?, nama_mk = ?, kompetensi = ?, sks = ?, semester = ? WHERE id = ?",
      [
        mkData.kode_mk,
        mkData.nama_mk,
        mkData.kompetensi,
        mkData.sks,
        mkData.semester,
        id,
      ],
      callback
    );
  },

  delete: (id, callback) => {
    connection.query("DELETE FROM mata_kuliah WHERE id = ?", [id], callback);
  },
};

module.exports = MkModel;
