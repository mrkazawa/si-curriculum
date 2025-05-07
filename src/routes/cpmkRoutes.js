const express = require("express");
const router = express.Router();
const cpmkController = require("../controllers/cpmkController");

// Get next number for CPMK generation
router.get("/next-number/:kode_cpl", cpmkController.getNextCpmkNumber);

// CPMK routes
router.get("/form", cpmkController.renderForm);
router.get("/", cpmkController.renderTable);
router.post("/", cpmkController.createCPMK);
router.get("/delete/:id", cpmkController.deleteCPMK);

// Edit routes
router.get("/edit/:id", cpmkController.renderEditForm);
router.post("/update/:id", cpmkController.updateCPMK);

module.exports = router;
