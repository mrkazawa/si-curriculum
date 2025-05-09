const CplCpmkSemesterMkMappingModel = require("../../models/cpl-cpmk-semester-mk-mapping-model");
const CplModel = require("../../models/cpl-model");
const CpmkModel = require("../../models/cpmk-model");

exports.renderMappingTable = (req, res) => {
  // Get all CPLs with full information including descriptions
  CplModel.getAll((cplErr, cpls) => {
    if (cplErr) {
      console.error("Error fetching CPLs:", cplErr);
      return res.status(500).send("Error fetching CPLs");
    }

    // Get all CPMKs
    CpmkModel.getAll((cpmkErr, cpmks) => {
      if (cpmkErr) {
        console.error("Error fetching CPMKs:", cpmkErr);
        return res.status(500).send("Error fetching CPMKs");
      }

      // Get the mapping data
      CplCpmkSemesterMkMappingModel.getMappingData((mappingErr, mappings) => {
        if (mappingErr) {
          console.error("Error fetching mappings:", mappingErr);
          return res.status(500).send("Error fetching mappings");
        }

        // Create a structured mapping for the view
        const cplCpmkMap = {};
        const semesters = [1, 2, 3, 4, 5, 6, 7, 8]; // Fixed semesters

        // Initialize the map structure
        cpls.forEach((cpl) => {
          cplCpmkMap[cpl.kode_cpl] = {
            cpl: cpl,
            cpmks: {},
          };
        });

        // Group CPMKs by CPL
        cpmks.forEach((cpmk) => {
          if (cplCpmkMap[cpmk.kode_cpl]) {
            cplCpmkMap[cpmk.kode_cpl].cpmks[cpmk.kode_cpmk] = {
              cpmk: cpmk,
              semesterMks: {},
            };

            // Initialize semester arrays for each CPMK
            semesters.forEach((sem) => {
              cplCpmkMap[cpmk.kode_cpl].cpmks[cpmk.kode_cpmk].semesterMks[sem] =
                [];
            });
          }
        });

        // Fill in MK data for each CPMK and semester
        mappings.forEach((mapping) => {
          if (
            mapping.kode_cpl &&
            mapping.kode_cpmk &&
            mapping.semester &&
            mapping.kode_mk
          ) {
            if (
              cplCpmkMap[mapping.kode_cpl]?.cpmks[mapping.kode_cpmk]
                ?.semesterMks[mapping.semester]
            ) {
              cplCpmkMap[mapping.kode_cpl].cpmks[mapping.kode_cpmk].semesterMks[
                mapping.semester
              ].push({
                kode_mk: mapping.kode_mk,
                nama_mk: mapping.nama_mk,
              });
            }
          }
        });

        res.render("cpl/cpl-cpmk-semester-mk-mapping/index", {
          cpls: cpls,
          cplCpmkMap: cplCpmkMap,
          semesters: semesters,
          title: "CPL-CPMK-Semester-MK Mapping",
        });
      });
    });
  });
};
