const express = require("express");
const router = express.Router();
const profilLulusanController = require("../controllers/profilLulusanController");

// Profil Lulusan routes
router.get("/form", profilLulusanController.renderForm);
router.get("/", profilLulusanController.renderTable);
router.post("/", profilLulusanController.createProfil);
router.get("/delete/:id", profilLulusanController.deleteProfile);

// Edit routes
router.get("/edit/:id", profilLulusanController.renderEditForm);
router.post("/update/:id", profilLulusanController.updateProfile);

module.exports = router;
