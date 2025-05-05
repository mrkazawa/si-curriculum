const express = require("express");
const router = express.Router();
const plController = require("../controllers/plController");

// PL routes
router.get("/form", plController.renderForm);
router.get("/", plController.renderTable);
router.post("/", plController.createPL);
router.get("/delete/:id", plController.deletePL);

// Edit routes
router.get("/edit/:id", plController.renderEditForm);
router.post("/update/:id", plController.updatePL);

module.exports = router;
