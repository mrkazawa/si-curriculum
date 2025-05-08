const MkBkMappingModel = require("../models/mkBkMappingModel");
const MkModel = require("../models/mk-model");
const BkModel = require("../models/bk-model");

exports.renderMappingTable = (req, res) => {
  // Get all MKs
  MkModel.getAll((mkErr, mks) => {
    if (mkErr) {
      console.error("Error fetching MKs:", mkErr);
      return res.status(500).send("Error fetching MKs");
    }

    // Get all BKs
    BkModel.getAll((bkErr, bks) => {
      if (bkErr) {
        console.error("Error fetching BKs:", bkErr);
        return res.status(500).send("Error fetching BKs");
      }

      // Get all mappings
      MkBkMappingModel.getAllMkWithMappings((mappingErr, mappings) => {
        if (mappingErr) {
          console.error("Error fetching mappings:", mappingErr);
          return res.status(500).send("Error fetching mappings");
        }

        // Create a map of MK to mapped BKs
        const mkMappings = {};
        mappings.forEach((mapping) => {
          const mappedBKs = mapping.mapped_bks
            ? mapping.mapped_bks.split(",")
            : [];
          mkMappings[mapping.kode_mk] = mappedBKs;
        });

        res.render("mk-bk-mapping/index", {
          mks: mks,
          bks: bks,
          mkMappings: mkMappings,
          title: "MK-BK Mapping",
        });
      });
    });
  });
};

exports.updateMapping = (req, res) => {
  const { kode_mk, kode_bk, isChecked } = req.body;

  if (isChecked === "true") {
    // Create mapping
    MkBkMappingModel.createMapping(kode_mk, kode_bk, (err) => {
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
    MkBkMappingModel.deleteMapping(kode_mk, kode_bk, (err) => {
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
