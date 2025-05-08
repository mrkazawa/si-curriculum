const BkCplMkMappingModel = require("../../models/bk-cpl-mk-mapping-model");
const BkModel = require("../../models/bk-model");
const CplModel = require("../../models/cpl-model");

exports.renderMappingTable = (req, res) => {
  // Get all BKs
  BkModel.getAll((bkErr, bks) => {
    if (bkErr) {
      console.error("Error fetching BKs:", bkErr);
      return res.status(500).send("Error fetching BKs");
    }

    // Get all CPLs with full information including descriptions
    CplModel.getAll((cplErr, cpls) => {
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

          // Parse the combined mk_data into an array of objects with kode_mk and nama_mk
          const mkList = [];
          if (mapping.mk_data) {
            const mkDataArray = mapping.mk_data.split("||");
            mkDataArray.forEach((mkData) => {
              const [kode_mk, nama_mk] = mkData.split(":");
              if (kode_mk && nama_mk) {
                mkList.push({ kode_mk, nama_mk });
              }
            });
          }

          mappingLookup[mapping.kode_bk][mapping.kode_cpl] = mkList;
        });

        res.render("bk/bk-cpl-mk-mapping/index", {
          bks: bks,
          cpls: cpls,
          mappingLookup: mappingLookup,
          title: "BK-CPL-MK Mapping",
        });
      });
    });
  });
};
