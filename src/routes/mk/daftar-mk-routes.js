// filepath: c:\Users\mrkazawa\my-codes\si-curriculum\src\routes\mk\daftar-mk-routes.js
const express = require("express");
const router = express.Router();
const daftarMkController = require("../../controllers/mk/daftar-mk-controller");

// Get next MK code for auto-generation
router.get("/next-code", daftarMkController.getNextCode);

// MK routes
router.get("/form", daftarMkController.renderForm);
router.get("/", daftarMkController.renderTable);
router.post("/", daftarMkController.createMK);
router.get("/delete/:id", daftarMkController.deleteMK);

// Edit routes
router.get("/edit/:id", daftarMkController.renderEditForm);
router.post("/update/:id", daftarMkController.updateMK);

// API route for prerequisites
router.get("/prerequisites/:semester", daftarMkController.getPrerequisites);

// Visualization route
router.get("/visualization", daftarMkController.renderVisualization);

module.exports = router;
