// filepath: c:\Users\mrkazawa\my-codes\si-curriculum\src\routes\bk\daftar-bk-routes.js
const express = require("express");
const router = express.Router();
const daftarBkController = require("../../controllers/bk/daftar-bk-controller");

// BK routes
router.get("/form", daftarBkController.renderForm);
router.get("/", daftarBkController.renderTable);
router.post("/", daftarBkController.createBK);
router.get("/delete/:id", daftarBkController.deleteBK);

// Edit routes
router.get("/edit/:id", daftarBkController.renderEditForm);
router.post("/update/:id", daftarBkController.updateBK);

module.exports = router;
