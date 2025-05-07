const express = require("express");
const router = express.Router();
const cplPlMappingController = require("../../controllers/cpl/cpl-pl-mapping-controller");

// Mapping routes
router.get("/", cplPlMappingController.renderMappingTable);
router.post("/update", cplPlMappingController.updateMapping);

module.exports = router;
