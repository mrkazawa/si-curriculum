const express = require("express");
const router = express.Router();
const bkController = require("../controllers/bkController");

// BK routes
router.get("/form", bkController.renderForm);
router.get("/", bkController.renderTable);
router.post("/", bkController.createBK);
router.get("/delete/:id", bkController.deleteBK);

// Edit routes
router.get("/edit/:id", bkController.renderEditForm);
router.post("/update/:id", bkController.updateBK);

module.exports = router;
