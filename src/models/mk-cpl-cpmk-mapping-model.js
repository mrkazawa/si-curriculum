const connectDB = require("../config/database");

const connection = connectDB();

// Model functions for mapping operations
const MkCplCpmkMappingModel = {
  // Get all MKs with details
  getAllMk: (callback) => {
    connection.query(
      "SELECT kode_mk, nama_mk FROM mata_kuliah ORDER BY kode_mk",
      callback
    );
  },

  // Get all CPLs with details
  getAllCpl: (callback) => {
    connection.query(
      "SELECT kode_cpl, deskripsi FROM capaian_pembelajaran_lulusan ORDER BY kode_cpl",
      callback
    );
  },

  // Get all CPMKs with details
  getAllCpmk: (callback) => {
    connection.query(
      "SELECT kode_cpmk, deskripsi, kode_cpl FROM capaian_pembelajaran_mk ORDER BY kode_cpl, kode_cpmk",
      callback
    );
  },

  // Get all MK-CPMK mappings
  getMkCpmkMappings: (callback) => {
    connection.query(
      "SELECT kode_mk, kode_cpmk FROM mk_cpmk_mapping ORDER BY kode_mk, kode_cpmk",
      callback
    );
  },
};

module.exports = MkCplCpmkMappingModel;
