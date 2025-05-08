const express = require("express");
const router = express.Router();
const bkCplMappingController = require("../../controllers/bk/bk-cpl-mapping-controller");

// Mapping routes
router.get("/", bkCplMappingController.renderMappingTable);
router.post("/update", bkCplMappingController.updateMapping);

module.exports = router;
