const connectDB = require("../config/database");

const connection = connectDB();

// Create profil_lulusan table if it doesn't exist
const createTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS profil_lulusan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_pl VARCHAR(10) NOT NULL,
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
const ProfilLulusan = {
  getAll: (callback) => {
    connection.query("SELECT * FROM profil_lulusan ORDER BY kode_pl", callback);
  },

  create: (profilData, callback) => {
    connection.query(
      "INSERT INTO profil_lulusan (kode_pl, deskripsi, referensi) VALUES (?, ?, ?)",
      [profilData.kode_pl, profilData.deskripsi, profilData.referensi],
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

  update: (id, profilData, callback) => {
    connection.query(
      "UPDATE profil_lulusan SET kode_pl = ?, deskripsi = ?, referensi = ? WHERE id = ?",
      [profilData.kode_pl, profilData.deskripsi, profilData.referensi, id],
      callback
    );
  },

  delete: (id, callback) => {
    connection.query("DELETE FROM profil_lulusan WHERE id = ?", [id], callback);
  },
};

module.exports = ProfilLulusan;
