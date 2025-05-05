const express = require("express");
const router = express.Router();
const mappingController = require("../controllers/mappingController");

// Mapping routes
router.get("/", mappingController.renderMappingTable);
router.post("/update", mappingController.updateMapping);

module.exports = router;
