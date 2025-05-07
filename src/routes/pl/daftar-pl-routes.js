// filepath: c:\Users\mrkazawa\my-codes\si-curriculum\src\routes\pl\daftar-pl-routes.js
const express = require("express");
const router = express.Router();
const daftarPlController = require("../../controllers/pl/daftar-pl-controller");

// Get next code for PL
router.get("/next-code", daftarPlController.getNextPlCode);

// PL routes
router.get("/form", daftarPlController.renderForm);
router.get("/", daftarPlController.renderTable);
router.post("/", daftarPlController.createPL);
router.get("/delete/:id", daftarPlController.deletePL);

// Edit routes
router.get("/edit/:id", daftarPlController.renderEditForm);
router.post("/update/:id", daftarPlController.updatePL);

module.exports = router;
