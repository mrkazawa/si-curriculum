const CplSemesterMkModel = require("../models/cplSemesterMkModel");
const CplModel = require("../models/cplModel");

exports.renderMappingTable = (req, res) => {
  // Get all CPLs
  CplModel.getAll((cplErr, cpls) => {
    if (cplErr) {
      console.error("Error fetching CPLs:", cplErr);
      return res.status(500).send("Error fetching CPLs");
    }

    // Get the mapping data
    CplSemesterMkModel.getMappingData((mappingErr, mappings) => {
      if (mappingErr) {
        console.error("Error fetching mappings:", mappingErr);
        return res.status(500).send("Error fetching mappings");
      }

      // Create a mapping structure for easy lookup
      const mappingLookup = {};
      const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

      // Initialize the lookup structure
      cpls.forEach((cpl) => {
        mappingLookup[cpl.kode_cpl] = {};
        semesters.forEach((sem) => {
          mappingLookup[cpl.kode_cpl][sem] = "";
        });
      });

      // Fill in the mapping data
      mappings.forEach((mapping) => {
        if (mapping.kode_cpl && mapping.semester) {
          mappingLookup[mapping.kode_cpl][mapping.semester] =
            mapping.kode_mks || "";
        }
      });

      res.render("cpl-semester-mk-mapping/index", {
        cpls: cpls,
        semesters: semesters,
        mappingLookup: mappingLookup,
        title: "CPL-Semester-MK Mapping",
      });
    });
  });
};
