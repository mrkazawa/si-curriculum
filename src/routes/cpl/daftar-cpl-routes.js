// filepath: c:\Users\mrkazawa\my-codes\si-curriculum\src\routes\cpl\daftar-cpl-routes.js
const express = require("express");
const router = express.Router();
const daftarCplController = require("../../controllers/cpl/daftar-cpl-controller");

// CPL routes
router.get("/form", daftarCplController.renderForm);
router.get("/", daftarCplController.renderTable);
router.post("/", daftarCplController.createCPL);
router.get("/delete/:id", daftarCplController.deleteCPL);

// Edit routes
router.get("/edit/:id", daftarCplController.renderEditForm);
router.post("/update/:id", daftarCplController.updateCPL);

module.exports = router;
