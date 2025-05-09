const MkSubCpmkMappingModel = require("../../models/mk-sub-cpmk-mapping-model");
const MkModel = require("../../models/mk-model");
const CplModel = require("../../models/cpl-model");
const CpmkModel = require("../../models/cpmk-model");
const SubCpmkModel = require("../../models/sub-cpmk-model");
const MkCpmkMappingModel = require("../../models/mk-cpmk-mapping-model");

exports.renderMappingTable = (req, res) => {
  // Get all MKs
  MkModel.getAll((mkErr, mks) => {
    if (mkErr) {
      console.error("Error fetching MKs:", mkErr);
      return res.status(500).send("Error fetching MKs");
    }

    // Get all CPMKs
    CpmkModel.getAll((cpmkErr, cpmks) => {
      if (cpmkErr) {
        console.error("Error fetching CPMKs:", cpmkErr);
        return res.status(500).send("Error fetching CPMKs");
      }

      // Get all Sub-CPMKs
      SubCpmkModel.getAll((subCpmkErr, subCpmks) => {
        if (subCpmkErr) {
          console.error("Error fetching Sub-CPMKs:", subCpmkErr);
          return res.status(500).send("Error fetching Sub-CPMKs");
        }

        // Get all MK-CPMK mappings to know which CPMKs are mapped to each MK
        MkCpmkMappingModel.getAllMkWithMappings((mkCpmkErr, mkCpmkMappings) => {
          if (mkCpmkErr) {
            console.error("Error fetching MK-CPMK mappings:", mkCpmkErr);
            return res.status(500).send("Error fetching MK-CPMK mappings");
          }

          // Get all MK-Sub-CPMK mappings
          MkSubCpmkMappingModel.getAllMkWithMappings(
            (mkSubCpmkErr, mkSubCpmkMappings) => {
              if (mkSubCpmkErr) {
                console.error(
                  "Error fetching MK-Sub-CPMK mappings:",
                  mkSubCpmkErr
                );
                return res
                  .status(500)
                  .send("Error fetching MK-Sub-CPMK mappings");
              }

              // Create a map of MK to mapped CPMKs
              const mkCpmkMap = {};
              mkCpmkMappings.forEach((mapping) => {
                const mappedCPMKs = mapping.mapped_cpmks
                  ? mapping.mapped_cpmks.split(",")
                  : [];
                mkCpmkMap[mapping.kode_mk] = mappedCPMKs;
              });

              // Create a map of MK to mapped Sub-CPMKs
              const mkSubCpmkMap = {};
              mkSubCpmkMappings.forEach((mapping) => {
                const mappedSubCPMKs = mapping.mapped_sub_cpmks
                  ? mapping.mapped_sub_cpmks.split(",")
                  : [];
                mkSubCpmkMap[mapping.kode_mk] = mappedSubCPMKs;
              });

              // Create map of CPMK to Sub-CPMKs
              const cpmkSubCpmkMap = {};
              subCpmks.forEach((subCpmk) => {
                if (!cpmkSubCpmkMap[subCpmk.kode_cpmk]) {
                  cpmkSubCpmkMap[subCpmk.kode_cpmk] = [];
                }
                cpmkSubCpmkMap[subCpmk.kode_cpmk].push({
                  id: subCpmk.id,
                  kode_sub_cpmk: subCpmk.kode_sub_cpmk,
                  deskripsi: subCpmk.deskripsi,
                  kode_cpmk: subCpmk.kode_cpmk,
                });
              });

              res.render("mk/mk-sub-cpmk-mapping/index", {
                mks: mks,
                cpmks: cpmks,
                subCpmks: subCpmks,
                mkCpmkMap: mkCpmkMap,
                mkSubCpmkMap: mkSubCpmkMap,
                cpmkSubCpmkMap: cpmkSubCpmkMap,
                title: "MK-Sub-CPMK Mapping",
              });
            }
          );
        });
      });
    });
  });
};

exports.updateMapping = (req, res) => {
  const { kode_mk, kode_sub_cpmk, isChecked } = req.body;

  if (isChecked === "true") {
    // Create mapping
    MkSubCpmkMappingModel.createMapping(kode_mk, kode_sub_cpmk, (err) => {
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
    MkSubCpmkMappingModel.deleteMapping(kode_mk, kode_sub_cpmk, (err) => {
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
