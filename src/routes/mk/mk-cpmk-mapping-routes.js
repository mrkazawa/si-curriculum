const express = require("express");
const router = express.Router();
const mkCpmkMappingController = require("../../controllers/mk/mk-cpmk-mapping-controller");

// Mapping routes
router.get("/", mkCpmkMappingController.renderMappingTable);
router.post("/update", mkCpmkMappingController.updateMapping);

module.exports = router;
