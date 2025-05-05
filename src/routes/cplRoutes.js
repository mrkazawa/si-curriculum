const express = require("express");
const router = express.Router();
const cplController = require("../controllers/cplController");

// CPL routes
router.get("/form", cplController.renderForm);
router.get("/", cplController.renderTable);
router.post("/", cplController.createCPL);
router.get("/delete/:id", cplController.deleteCPL);

// Edit routes
router.get("/edit/:id", cplController.renderEditForm);
router.post("/update/:id", cplController.updateCPL);

module.exports = router;
