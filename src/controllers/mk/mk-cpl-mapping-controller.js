const MkCplMappingModel = require("../../models/mk-cpl-mapping-model");
const MkModel = require("../../models/mk-model");
const CplModel = require("../../models/cpl-model");

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

      // Get all mappings
      MkCplMappingModel.getAllMkWithMappings((mappingErr, mappings) => {
        if (mappingErr) {
          console.error("Error fetching mappings:", mappingErr);
          return res.status(500).send("Error fetching mappings");
        }

        // Create a map of MK to mapped CPLs
        const mkMappings = {};
        mappings.forEach((mapping) => {
          const mappedCPLs = mapping.mapped_cpls
            ? mapping.mapped_cpls.split(",")
            : [];
          mkMappings[mapping.kode_mk] = mappedCPLs;
        });

        res.render("mk/mk-cpl-mapping/index", {
          mks: mks,
          cpls: cpls,
          mkMappings: mkMappings,
          title: "MK-CPL Mapping",
        });
      });
    });
  });
};

exports.updateMapping = (req, res) => {
  const { kode_mk, kode_cpl, isChecked } = req.body;

  if (isChecked === "true") {
    // Create mapping
    MkCplMappingModel.createMapping(kode_mk, kode_cpl, (err) => {
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
    MkCplMappingModel.deleteMapping(kode_mk, kode_cpl, (err) => {
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
