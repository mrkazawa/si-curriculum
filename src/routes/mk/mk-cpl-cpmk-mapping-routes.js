const express = require("express");
const router = express.Router();
const mkCplCpmkMappingController = require("../../controllers/mk/mk-cpl-cpmk-mapping-controller");

// Mapping routes
router.get("/", mkCplCpmkMappingController.renderMappingTable);

module.exports = router;
