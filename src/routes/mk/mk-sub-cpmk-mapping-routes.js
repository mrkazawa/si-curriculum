const express = require("express");
const router = express.Router();
const mkSubCpmkMappingController = require("../../controllers/mk/mk-sub-cpmk-mapping-controller");

// Mapping routes
router.get("/", mkSubCpmkMappingController.renderMappingTable);
router.post("/update", mkSubCpmkMappingController.updateMapping);

module.exports = router;
