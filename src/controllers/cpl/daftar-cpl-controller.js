// filepath: c:\Users\mrkazawa\my-codes\si-curriculum\src\controllers\cpl\daftar-cpl-controller.js
const DaftarCplModel = require("../../models/cpl-model");

// Helper function to render form with error
const renderFormWithError = (res, view, errorMessage, formData = {}) => {
  res.render(view, {
    error: errorMessage,
    formData: formData,
  });
};

// Render the form for adding a new CPL
exports.renderForm = (req, res) => {
  res.render("cpl/daftar/create");
};

// Render the table with all CPLs
exports.renderTable = (req, res) => {
  DaftarCplModel.getAll((err, results) => {
    if (err) {
      console.error("Error fetching CPLs:", err);
      return res.status(500).send("Error fetching CPLs");
    }
    res.render("cpl/daftar/index", { cpls: results });
  });
};

// Create a new CPL
exports.createCPL = (req, res) => {
  const { kode_cpl, deskripsi, referensi } = req.body;

  DaftarCplModel.create({ kode_cpl, deskripsi, referensi }, (err, result) => {
    if (err) {
      console.error("Error creating CPL:", err);
      // Check if it's a duplicate entry error
      if (err.code === "ER_DUP_ENTRY") {
        return renderFormWithError(
          res,
          "cpl/daftar/create",
          "Kode CPL already exists. Please use a unique code.",
          { kode_cpl, deskripsi, referensi }
        );
      }
      return res.status(500).send("Error creating CPL");
    }
    res.redirect("/cpl/daftar");
  });
};

// Delete a CPL
exports.deleteCPL = (req, res) => {
  const id = req.params.id;

  DaftarCplModel.delete(id, (err) => {
    if (err) {
      console.error("Error deleting CPL:", err);
      return res.status(500).send("Error deleting CPL");
    }
    res.redirect("/cpl/daftar");
  });
};

// Render form for editing a CPL
exports.renderEditForm = (req, res) => {
  const id = req.params.id;

  DaftarCplModel.getById(id, (err, results) => {
    if (err) {
      console.error("Error fetching CPL for edit:", err);
      return res.status(500).send("Error fetching CPL");
    }

    if (results.length === 0) {
      return res.status(404).send("CPL not found");
    }

    res.render("cpl/daftar/edit", { cpl: results[0] });
  });
};

// Update a CPL
exports.updateCPL = (req, res) => {
  const id = req.params.id;
  const { kode_cpl, deskripsi, referensi } = req.body;

  DaftarCplModel.update(id, { kode_cpl, deskripsi, referensi }, (err) => {
    if (err) {
      console.error("Error updating CPL:", err);
      // Check if it's a duplicate entry error
      if (err.code === "ER_DUP_ENTRY") {
        return renderFormWithError(
          res,
          "cpl/daftar/edit",
          "Kode CPL already exists. Please use a unique code.",
          { id, kode_cpl, deskripsi, referensi }
        );
      }
      return res.status(500).send("Error updating CPL");
    }
    res.redirect("/cpl/daftar");
  });
};

// Get next code for CPL
exports.getNextCplCode = (req, res) => {
  DaftarCplModel.getAll((err, results) => {
    if (err) {
      console.error("Error fetching CPLs:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Extract the numeric parts of existing CPL codes
    const codeNumbers = results.map((cpl) => {
      const match = cpl.kode_cpl.match(/^CPL(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    });

    // Find the maximum number
    const maxNumber = codeNumbers.length > 0 ? Math.max(...codeNumbers) : 0;

    // Create the next code (increment by 1)
    const nextNumber = maxNumber + 1;
    const nextCode = `CPL${String(nextNumber).padStart(2, "0")}`;

    // Return the next code as JSON
    res.json({ nextCode: nextCode });
  });
};
