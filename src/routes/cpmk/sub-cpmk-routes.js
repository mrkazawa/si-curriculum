// filepath: c:\Users\mrkazawa\my-codes\si-curriculum\src\routes\cpmk\sub-cpmk-routes.js
const express = require("express");
const router = express.Router();
const subCpmkController = require("../../controllers/cpmk/sub-cpmk-controller");

// Get next number for Sub-CPMK generation
router.get("/next-number/:kode_cpmk", subCpmkController.getNextSubCpmkNumber);

// Sub-CPMK routes
router.get("/form", subCpmkController.renderForm);
router.get("/", subCpmkController.renderTable);
router.post("/", subCpmkController.createSubCPMK);
router.get("/delete/:id", subCpmkController.deleteSubCPMK);

// Edit routes
router.get("/edit/:id", subCpmkController.renderEditForm);
router.post("/update/:id", subCpmkController.updateSubCPMK);

module.exports = router;
