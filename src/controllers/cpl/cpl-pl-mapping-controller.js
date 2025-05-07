const CplPlMappingModel = require("../../models/cpl-pl-mapping-model");
const CplModel = require("../../models/cpl-model");
const PlModel = require("../../models/pl-model");

exports.renderMappingTable = (req, res) => {
  // Get all CPLs
  CplModel.getAll((cplErr, cpls) => {
    if (cplErr) {
      console.error("Error fetching CPLs:", cplErr);
      return res.status(500).send("Error fetching CPLs");
    }

    // Get all PLs using the new model
    PlModel.getAll((plErr, pls) => {
      if (plErr) {
        console.error("Error fetching PLs:", plErr);
        return res.status(500).send("Error fetching PLs");
      }

      // Get all mappings
      CplPlMappingModel.getAllCplWithMappings((mappingErr, mappings) => {
        if (mappingErr) {
          console.error("Error fetching mappings:", mappingErr);
          return res.status(500).send("Error fetching mappings");
        }

        // Create a map of CPL to mapped PLs
        const cplMappings = {};
        mappings.forEach((mapping) => {
          const mappedPLs = mapping.mapped_pls
            ? mapping.mapped_pls.split(",")
            : [];
          cplMappings[mapping.kode_cpl] = mappedPLs;
        });

        res.render("cpl/cpl-pl-mapping/index", {
          cpls: cpls,
          pls: pls,
          cplMappings: cplMappings,
          title: "CPL-PL Mapping",
        });
      });
    });
  });
};

exports.updateMapping = (req, res) => {
  const { kode_cpl, kode_pl, isChecked } = req.body;

  if (isChecked === "true") {
    // Create mapping
    CplPlMappingModel.createMapping(kode_cpl, kode_pl, (err) => {
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
    CplPlMappingModel.deleteMapping(kode_cpl, kode_pl, (err) => {
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
