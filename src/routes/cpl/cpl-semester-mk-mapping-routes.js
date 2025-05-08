const express = require("express");
const router = express.Router();
const cplSemesterMkMappingController = require("../../controllers/cpl/cpl-semester-mk-mapping-controller");

// Mapping routes
router.get("/", cplSemesterMkMappingController.renderMappingTable);

module.exports = router;
