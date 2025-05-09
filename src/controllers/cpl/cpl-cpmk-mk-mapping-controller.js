const CplCpmkMkMappingModel = require("../../models/cpl-cpmk-mk-mapping-model");
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
      CplCpmkMkMappingModel.getMappingData((mappingErr, mappings) => {
        if (mappingErr) {
          console.error("Error fetching mappings:", mappingErr);
          return res.status(500).send("Error fetching mappings");
        }

        // Create a mapping structure for easy lookup
        const mappingLookup = {};

        // Initialize the structure with all CPLs
        cpls.forEach((cpl) => {
          if (!mappingLookup[cpl.kode_cpl]) {
            mappingLookup[cpl.kode_cpl] = {};
          }
        });

        // Fill the structure with CPMK and MK data
        mappings.forEach((mapping) => {
          if (!mappingLookup[mapping.kode_cpl]) {
            mappingLookup[mapping.kode_cpl] = {};
          }

          // Parse the mk_data into an array of objects with kode_mk and nama_mk
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

          mappingLookup[mapping.kode_cpl][mapping.kode_cpmk] = {
            deskripsi: mapping.deskripsi_cpmk,
            mataKuliah: mkList,
          };
        });

        res.render("cpl/cpl-cpmk-mk-mapping/index", {
          cpls: cpls,
          cpmks: cpmks,
          mappingLookup: mappingLookup,
          title: "CPL-CPMK-MK Mapping",
        });
      });
    });
  });
};
