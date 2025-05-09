const express = require("express");
const router = express.Router();
const cplCpmkMkMappingController = require("../../controllers/cpl/cpl-cpmk-mk-mapping-controller");

// Mapping routes
router.get("/", cplCpmkMkMappingController.renderMappingTable);

module.exports = router;
