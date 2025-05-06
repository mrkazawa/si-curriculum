const express = require("express");
const router = express.Router();
const bkCplMkMappingController = require("../controllers/bkCplMkMappingController");

// Mapping routes
router.get("/", bkCplMkMappingController.renderMappingTable);

module.exports = router;
