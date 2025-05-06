const express = require("express");
const router = express.Router();
const cplSemesterMkMappingController = require("../controllers/cplSemesterMkMappingController");

// Mapping routes
router.get("/", cplSemesterMkMappingController.renderMappingTable);

module.exports = router;
