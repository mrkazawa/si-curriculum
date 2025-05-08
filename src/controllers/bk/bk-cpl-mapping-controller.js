const BkCplMappingModel = require("../../models/bk-cpl-mapping-model");
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

      // Get all mappings
      BkCplMappingModel.getAllBkWithMappings((mappingErr, mappings) => {
        if (mappingErr) {
          console.error("Error fetching mappings:", mappingErr);
          return res.status(500).send("Error fetching mappings");
        }

        // Create a map of BK to mapped CPLs
        const bkMappings = {};
        mappings.forEach((mapping) => {
          const mappedCPLs = mapping.mapped_cpls
            ? mapping.mapped_cpls.split(",")
            : [];
          bkMappings[mapping.kode_bk] = mappedCPLs;
        });

        res.render("bk/bk-cpl-mapping/index", {
          bks: bks,
          cpls: cpls,
          bkMappings: bkMappings,
          title: "BK-CPL Mapping",
        });
      });
    });
  });
};

exports.updateMapping = (req, res) => {
  const { kode_bk, kode_cpl, isChecked } = req.body;

  if (isChecked === "true") {
    // Create mapping
    BkCplMappingModel.createMapping(kode_bk, kode_cpl, (err) => {
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
    BkCplMappingModel.deleteMapping(kode_bk, kode_cpl, (err) => {
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
