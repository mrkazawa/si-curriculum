const connectDB = require("../config/database");

const connection = connectDB();

// Create profil_lulusan table if it doesn't exist
// Note: We're keeping the DB table name the same to avoid migration issues
const createTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS profil_lulusan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_pl VARCHAR(10) NOT NULL UNIQUE,
    deskripsi TEXT NOT NULL,
    referensi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`;

  connection.query(sql, (err) => {
    if (err) {
      console.error("Error creating profil_lulusan table:", err);
      return;
    }
    console.log("profil_lulusan table is ready");
  });
};

// Initialize the table
createTable();

// Model functions for CRUD operations
const PlModel = {
  getAll: (callback) => {
    connection.query("SELECT * FROM profil_lulusan ORDER BY kode_pl", callback);
  },

  create: (plData, callback) => {
    connection.query(
      "INSERT INTO profil_lulusan (kode_pl, deskripsi, referensi) VALUES (?, ?, ?)",
      [plData.kode_pl, plData.deskripsi, plData.referensi],
      callback
    );
  },

  getById: (id, callback) => {
    connection.query(
      "SELECT * FROM profil_lulusan WHERE id = ?",
      [id],
      callback
    );
  },

  update: (id, plData, callback) => {
    connection.query(
      "UPDATE profil_lulusan SET kode_pl = ?, deskripsi = ?, referensi = ? WHERE id = ?",
      [plData.kode_pl, plData.deskripsi, plData.referensi, id],
      callback
    );
  },

  delete: (id, callback) => {
    connection.query("DELETE FROM profil_lulusan WHERE id = ?", [id], callback);
  },
};

module.exports = PlModel;
