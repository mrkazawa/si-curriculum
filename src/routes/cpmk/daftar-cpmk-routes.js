// filepath: c:\Users\mrkazawa\my-codes\si-curriculum\src\routes\cpmk\daftar-cpmk-routes.js
const express = require("express");
const router = express.Router();
const daftarCpmkController = require("../../controllers/cpmk/daftar-cpmk-controller");

// Get next number for CPMK generation
router.get("/next-number/:kode_cpl", daftarCpmkController.getNextCpmkNumber);

// CPMK routes
router.get("/form", daftarCpmkController.renderForm);
router.get("/", daftarCpmkController.renderTable);
router.post("/", daftarCpmkController.createCPMK);
router.get("/delete/:id", daftarCpmkController.deleteCPMK);

// Edit routes
router.get("/edit/:id", daftarCpmkController.renderEditForm);
router.post("/update/:id", daftarCpmkController.updateCPMK);

module.exports = router;
