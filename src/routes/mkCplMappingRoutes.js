const express = require("express");
const router = express.Router();
const mkCplMappingController = require("../controllers/mkCplMappingController");

// Mapping routes
router.get("/", mkCplMappingController.renderMappingTable);
router.post("/update", mkCplMappingController.updateMapping);

module.exports = router;
