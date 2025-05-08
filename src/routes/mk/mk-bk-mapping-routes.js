const express = require("express");
const router = express.Router();
const mkBkMappingController = require("../../controllers/mk/mk-bk-mapping-controller");

// Mapping routes
router.get("/", mkBkMappingController.renderMappingTable);
router.post("/update", mkBkMappingController.updateMapping);

module.exports = router;
