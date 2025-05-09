const express = require("express");
const router = express.Router();
const cplCpmkSemesterMkMappingController = require("../../controllers/cpl/cpl-cpmk-semester-mk-mapping-controller");

// Mapping routes
router.get("/", cplCpmkSemesterMkMappingController.renderMappingTable);

module.exports = router;
