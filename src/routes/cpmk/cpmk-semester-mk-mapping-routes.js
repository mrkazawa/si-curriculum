const express = require("express");
const router = express.Router();
const cpmkSemesterMkMappingController = require("../../controllers/cpmk/cpmk-semester-mk-mapping-controller");

// Mapping routes
router.get("/", cpmkSemesterMkMappingController.renderMappingTable);

module.exports = router;
