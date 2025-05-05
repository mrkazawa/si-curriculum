const express = require("express");
const router = express.Router();
const cplPlMappingController = require("../controllers/cplPlMappingController");

// Mapping routes
router.get("/", cplPlMappingController.renderMappingTable);
router.post("/update", cplPlMappingController.updateMapping);

module.exports = router;
