const PlModel = require("../models/plModel");

// Helper function to render form with error
const renderFormWithError = (res, view, errorMessage, formData = {}) => {
  res.render(view, {
    error: errorMessage,
    formData: formData,
  });
};

// Render the form for adding a new pl
exports.renderForm = (req, res) => {
  res.render("pl/create");
};

// Render the table with all profiles
exports.renderTable = (req, res) => {
  PlModel.getAll((err, results) => {
    if (err) {
      console.error("Error fetching PL records:", err);
      return res.status(500).send("Error fetching PL records");
    }
    res.render("pl/index", { profiles: results });
  });
};

// Create a new pl
exports.createPL = (req, res) => {
  const { kode_pl, deskripsi, referensi } = req.body;

  PlModel.create({ kode_pl, deskripsi, referensi }, (err, result) => {
    if (err) {
      console.error("Error creating PL:", err);
      // Check if it's a duplicate entry error
      if (err.code === "ER_DUP_ENTRY") {
        return renderFormWithError(
          res,
          "pl/create",
          "Kode PL already exists. Please use a unique code.",
          { kode_pl, deskripsi, referensi }
        );
      }
      return res.status(500).send("Error creating PL");
    }
    res.redirect("/pl");
  });
};

// Delete a pl
exports.deletePL = (req, res) => {
  const id = req.params.id;

  PlModel.delete(id, (err) => {
    if (err) {
      console.error("Error deleting PL:", err);
      return res.status(500).send("Error deleting PL");
    }
    res.redirect("/pl");
  });
};

// Render form for editing a pl
exports.renderEditForm = (req, res) => {
  const id = req.params.id;

  PlModel.getById(id, (err, results) => {
    if (err) {
      console.error("Error fetching PL for edit:", err);
      return res.status(500).send("Error fetching PL");
    }

    if (results.length === 0) {
      return res.status(404).send("PL not found");
    }

    res.render("pl/edit", { profile: results[0] });
  });
};

// Update a pl
exports.updatePL = (req, res) => {
  const id = req.params.id;
  const { kode_pl, deskripsi, referensi } = req.body;

  PlModel.update(id, { kode_pl, deskripsi, referensi }, (err) => {
    if (err) {
      console.error("Error updating PL:", err);
      // Check if it's a duplicate entry error
      if (err.code === "ER_DUP_ENTRY") {
        return renderFormWithError(
          res,
          "pl/edit",
          "Kode PL already exists. Please use a unique code.",
          { id, kode_pl, deskripsi, referensi }
        );
      }
      return res.status(500).send("Error updating PL");
    }
    res.redirect("/pl");
  });
};
