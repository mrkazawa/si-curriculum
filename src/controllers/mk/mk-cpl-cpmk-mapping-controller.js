const MkCplCpmkMappingModel = require("../../models/mk-cpl-cpmk-mapping-model");
const MkModel = require("../../models/mk-model");
const CplModel = require("../../models/cpl-model");
const CpmkModel = require("../../models/cpmk-model");

exports.renderMappingTable = (req, res) => {
  // Get all MKs
  MkModel.getAll((mkErr, mks) => {
    if (mkErr) {
      console.error("Error fetching MKs:", mkErr);
      return res.status(500).send("Error fetching MKs");
    }

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

        // Get all MK-CPMK mappings
        MkCplCpmkMappingModel.getMkCpmkMappings((mappingErr, mappings) => {
          if (mappingErr) {
            console.error("Error fetching MK-CPMK mappings:", mappingErr);
            return res.status(500).send("Error fetching MK-CPMK mappings");
          }

          // Group CPMKs by CPL
          const cplCpmkMap = {};
          cpls.forEach((cpl) => {
            cplCpmkMap[cpl.kode_cpl] = {
              cpl: cpl,
              cpmks: [],
            };
          });

          // Add CPMKs to their respective CPLs
          cpmks.forEach((cpmk) => {
            if (cplCpmkMap[cpmk.kode_cpl]) {
              cplCpmkMap[cpmk.kode_cpl].cpmks.push({
                kode_cpmk: cpmk.kode_cpmk,
                deskripsi: cpmk.deskripsi,
              });
            }
          });

          // Create a mapping of MK to CPMKs
          const mkCpmkMap = {};
          mappings.forEach((mapping) => {
            if (!mkCpmkMap[mapping.kode_mk]) {
              mkCpmkMap[mapping.kode_mk] = [];
            }
            mkCpmkMap[mapping.kode_mk].push(mapping.kode_cpmk);
          });

          res.render("mk/mk-cpl-cpmk-mapping/index", {
            mks: mks,
            cpls: cpls,
            cplCpmkMap: cplCpmkMap,
            mkCpmkMap: mkCpmkMap,
            title: "MK-CPL-CPMK Mapping",
          });
        });
      });
    });
  });
};
