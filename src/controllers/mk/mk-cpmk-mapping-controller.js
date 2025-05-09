const MkCpmkMappingModel = require("../../models/mk-cpmk-mapping-model");
const MkModel = require("../../models/mk-model");
const CplModel = require("../../models/cpl-model");
const CpmkModel = require("../../models/cpmk-model");
const MkCplMappingModel = require("../../models/mk-cpl-mapping-model");

exports.renderMappingTable = (req, res) => {
  // Get all MKs
  MkModel.getAll((mkErr, mks) => {
    if (mkErr) {
      console.error("Error fetching MKs:", mkErr);
      return res.status(500).send("Error fetching MKs");
    }

    // Get all CPLs
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

        // Get all MK-CPL mappings
        MkCplMappingModel.getAllMkWithMappings((mkCplErr, mkCplMappings) => {
          if (mkCplErr) {
            console.error("Error fetching MK-CPL mappings:", mkCplErr);
            return res.status(500).send("Error fetching MK-CPL mappings");
          }

          // Get all MK-CPMK mappings
          MkCpmkMappingModel.getAllMkWithMappings(
            (mkCpmkErr, mkCpmkMappings) => {
              if (mkCpmkErr) {
                console.error("Error fetching MK-CPMK mappings:", mkCpmkErr);
                return res.status(500).send("Error fetching MK-CPMK mappings");
              }

              // Create a map of MK to mapped CPLs
              const mkCplMap = {};
              mkCplMappings.forEach((mapping) => {
                const mappedCPLs = mapping.mapped_cpls
                  ? mapping.mapped_cpls.split(",")
                  : [];
                mkCplMap[mapping.kode_mk] = mappedCPLs;
              });

              // Create a map of MK to mapped CPMKs
              const mkCpmkMap = {};
              mkCpmkMappings.forEach((mapping) => {
                const mappedCPMKs = mapping.mapped_cpmks
                  ? mapping.mapped_cpmks.split(",")
                  : [];
                mkCpmkMap[mapping.kode_mk] = mappedCPMKs;
              });

              // Create map of CPL to CPMKs
              const cplCpmkMap = {};
              cpmks.forEach((cpmk) => {
                if (!cplCpmkMap[cpmk.kode_cpl]) {
                  cplCpmkMap[cpmk.kode_cpl] = [];
                }
                cplCpmkMap[cpmk.kode_cpl].push({
                  id: cpmk.id,
                  kode_cpmk: cpmk.kode_cpmk,
                  deskripsi: cpmk.deskripsi,
                  kode_cpl: cpmk.kode_cpl,
                });
              });

              res.render("mk/mk-cpmk-mapping/index", {
                mks: mks,
                cpls: cpls,
                cpmks: cpmks,
                mkCplMap: mkCplMap,
                mkCpmkMap: mkCpmkMap,
                cplCpmkMap: cplCpmkMap,
                title: "MK-CPMK Mapping",
              });
            }
          );
        });
      });
    });
  });
};

exports.updateMapping = (req, res) => {
  const { kode_mk, kode_cpmk, isChecked } = req.body;

  if (isChecked === "true") {
    // Create mapping
    MkCpmkMappingModel.createMapping(kode_mk, kode_cpmk, (err) => {
      if (err) {
        console.error("Error creating mapping:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error creating mapping" });
      }
      return res.json({ success: true });
    });
  } else {
    // Delete mapping
    MkCpmkMappingModel.deleteMapping(kode_mk, kode_cpmk, (err) => {
      if (err) {
        console.error("Error deleting mapping:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error deleting mapping" });
      }
      return res.json({ success: true });
    });
  }
};
