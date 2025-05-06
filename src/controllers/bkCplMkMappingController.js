const BkCplMkMappingModel = require("../models/bkCplMkMappingModel");

exports.renderMappingTable = (req, res) => {
  // Get all BKs
  BkCplMkMappingModel.getAllBk((bkErr, bks) => {
    if (bkErr) {
      console.error("Error fetching BKs:", bkErr);
      return res.status(500).send("Error fetching BKs");
    }

    // Get all CPLs
    BkCplMkMappingModel.getAllCpl((cplErr, cpls) => {
      if (cplErr) {
        console.error("Error fetching CPLs:", cplErr);
        return res.status(500).send("Error fetching CPLs");
      }

      // Get the mapping data
      BkCplMkMappingModel.getMappingData((mappingErr, mappings) => {
        if (mappingErr) {
          console.error("Error fetching mappings:", mappingErr);
          return res.status(500).send("Error fetching mappings");
        }

        // Create a mapping structure for easy lookup
        const mappingLookup = {};

        mappings.forEach((mapping) => {
          if (!mappingLookup[mapping.kode_bk]) {
            mappingLookup[mapping.kode_bk] = {};
          }
          mappingLookup[mapping.kode_bk][mapping.kode_cpl] =
            mapping.kode_mks || "";
        });

        res.render("bk-cpl-mk-mapping/index", {
          bks: bks,
          cpls: cpls,
          mappingLookup: mappingLookup,
          title: "BK-CPL-MK Mapping",
        });
      });
    });
  });
};
