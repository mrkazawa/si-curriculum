const connectDB = require("../config/database");

const connection = connectDB();

// Model functions for mapping operations
const CplSemesterMkModel = {
  // Get all CPLs
  getAllCpl: (callback) => {
    connection.query(
      "SELECT kode_cpl FROM capaian_pembelajaran_lulusan ORDER BY kode_cpl",
      callback
    );
  },

  // Get the mapping data for CPL-Semester-MK
  getMappingData: (callback) => {
    const mappingQuery = `
      SELECT 
        cpl.kode_cpl, 
        mk.semester,
        GROUP_CONCAT(mk.kode_mk ORDER BY mk.kode_mk SEPARATOR ', ') AS kode_mks
      FROM 
        capaian_pembelajaran_lulusan cpl
      LEFT JOIN 
        mk_cpl_mapping map ON cpl.kode_cpl = map.kode_cpl
      LEFT JOIN 
        mata_kuliah mk ON mk.kode_mk = map.kode_mk
      GROUP BY 
        cpl.kode_cpl, mk.semester
      ORDER BY 
        cpl.kode_cpl, mk.semester
    `;

    connection.query(mappingQuery, callback);
  },
};

module.exports = CplSemesterMkModel;
