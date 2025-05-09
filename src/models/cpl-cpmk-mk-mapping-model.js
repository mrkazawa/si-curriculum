const connectDB = require("../config/database");

const connection = connectDB();

// Model functions for mapping operations
const CplCpmkMkMappingModel = {
  // Get all CPLs with details
  getAllCpl: (callback) => {
    connection.query(
      "SELECT kode_cpl, deskripsi FROM capaian_pembelajaran_lulusan ORDER BY kode_cpl",
      callback
    );
  },

  // Get the mapping data for CPL-CPMK-MK
  getMappingData: (callback) => {
    const mappingQuery = `
      SELECT 
        cpl.kode_cpl, 
        cpmk.kode_cpmk,
        cpmk.deskripsi as deskripsi_cpmk,
        GROUP_CONCAT(
          CONCAT(mk.kode_mk, ':', mk.nama_mk)
          ORDER BY mk.kode_mk SEPARATOR '||'
        ) AS mk_data
      FROM 
        capaian_pembelajaran_lulusan cpl
      LEFT JOIN 
        capaian_pembelajaran_mk cpmk ON cpl.kode_cpl = cpmk.kode_cpl
      LEFT JOIN 
        mk_cpmk_mapping map ON cpmk.kode_cpmk = map.kode_cpmk
      LEFT JOIN 
        mata_kuliah mk ON mk.kode_mk = map.kode_mk
      GROUP BY 
        cpl.kode_cpl, cpmk.kode_cpmk, cpmk.deskripsi
      ORDER BY 
        cpl.kode_cpl, cpmk.kode_cpmk
    `;

    connection.query(mappingQuery, callback);
  },
};

module.exports = CplCpmkMkMappingModel;
