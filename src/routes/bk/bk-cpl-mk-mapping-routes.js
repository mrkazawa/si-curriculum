const express = require("express");
const router = express.Router();
const bkCplMkMappingController = require("../../controllers/bk/bk-cpl-mk-mapping-controller");

// Mapping routes
router.get("/", bkCplMkMappingController.renderMappingTable);

module.exports = router;
