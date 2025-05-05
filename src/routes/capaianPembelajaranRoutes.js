const express = require("express");
const router = express.Router();
const capaianPembelajaranController = require("../controllers/capaianPembelajaranController");

// Capaian Pembelajaran Lulusan routes
router.get("/form", capaianPembelajaranController.renderForm);
router.get("/", capaianPembelajaranController.renderTable);
router.post("/", capaianPembelajaranController.createCPL);
router.get("/delete/:id", capaianPembelajaranController.deleteCPL);

// Edit routes
router.get("/edit/:id", capaianPembelajaranController.renderEditForm);
router.post("/update/:id", capaianPembelajaranController.updateCPL);

module.exports = router;
