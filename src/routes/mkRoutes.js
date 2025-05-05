const express = require("express");
const router = express.Router();
const mkController = require("../controllers/mkController");

// MK routes
router.get("/form", mkController.renderForm);
router.get("/", mkController.renderTable);
router.post("/", mkController.createMK);
router.get("/delete/:id", mkController.deleteMK);

// Edit routes
router.get("/edit/:id", mkController.renderEditForm);
router.post("/update/:id", mkController.updateMK);

module.exports = router;
