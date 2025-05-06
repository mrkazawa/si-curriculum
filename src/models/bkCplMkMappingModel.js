const connectDB = require("../config/database");

const connection = connectDB();

// Model functions for mapping operations
const BkCplMkMappingModel = {
  // Get all BKs
  getAllBk: (callback) => {
    connection.query(
      "SELECT kode_bk FROM bahan_kajian ORDER BY kode_bk",
      callback
    );
  },

  // Get all CPLs
  getAllCpl: (callback) => {
    connection.query(
      "SELECT kode_cpl FROM capaian_pembelajaran_lulusan ORDER BY kode_cpl",
      callback
    );
  },

  // Get the mapping data
  getMappingData: (callback) => {
    const mappingQuery = `
      SELECT 
        bk.kode_bk, 
        cpl.kode_cpl, 
        GROUP_CONCAT(mk.kode_mk ORDER BY mk.kode_mk SEPARATOR ', ') AS kode_mks
      FROM 
        bahan_kajian bk
      CROSS JOIN 
        capaian_pembelajaran_lulusan cpl
      LEFT JOIN 
        mk_bk_mapping bk_map ON bk.kode_bk = bk_map.kode_bk
      LEFT JOIN 
        mk_cpl_mapping cpl_map ON cpl.kode_cpl = cpl_map.kode_cpl
      LEFT JOIN 
        mata_kuliah mk ON mk.kode_mk = bk_map.kode_mk AND mk.kode_mk = cpl_map.kode_mk
      GROUP BY 
        bk.kode_bk, cpl.kode_cpl
      ORDER BY 
        bk.kode_bk, cpl.kode_cpl
    `;

    connection.query(mappingQuery, callback);
  },
};

module.exports = BkCplMkMappingModel;
