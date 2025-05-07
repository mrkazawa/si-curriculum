// filepath: c:\Users\mrkazawa\my-codes\si-curriculum\src\controllers\pl\daftar-pl-controller.js
const DaftarPlModel = require("../../models/pl/daftar-pl-model");

// Helper function to render form with error
const renderFormWithError = (res, view, errorMessage, formData = {}) => {
  res.render(view, {
    error: errorMessage,
    formData: formData,
  });
};

// Render the form for adding a new pl
exports.renderForm = (req, res) => {
  res.render("pl/daftar/create");
};

// Render the table with all profiles
exports.renderTable = (req, res) => {
  DaftarPlModel.getAll((err, results) => {
    if (err) {
      console.error("Error fetching PL records:", err);
      return res.status(500).send("Error fetching PL records");
    }
    res.render("pl/daftar/index", { profiles: results });
  });
};

// Create a new pl
exports.createPL = (req, res) => {
  const { kode_pl, deskripsi, referensi } = req.body;

  DaftarPlModel.create({ kode_pl, deskripsi, referensi }, (err, result) => {
    if (err) {
      console.error("Error creating PL:", err);
      // Check if it's a duplicate entry error
      if (err.code === "ER_DUP_ENTRY") {
        return renderFormWithError(
          res,
          "pl/daftar/create",
          "Kode PL already exists. Please use a unique code.",
          { kode_pl, deskripsi, referensi }
        );
      }
      return res.status(500).send("Error creating PL");
    }
    res.redirect("/pl/daftar");
  });
};

// Delete a pl
exports.deletePL = (req, res) => {
  const id = req.params.id;

  DaftarPlModel.delete(id, (err) => {
    if (err) {
      console.error("Error deleting PL:", err);
      return res.status(500).send("Error deleting PL");
    }
    res.redirect("/pl/daftar");
  });
};

// Render form for editing a pl
exports.renderEditForm = (req, res) => {
  const id = req.params.id;

  DaftarPlModel.getById(id, (err, results) => {
    if (err) {
      console.error("Error fetching PL for edit:", err);
      return res.status(500).send("Error fetching PL");
    }

    if (results.length === 0) {
      return res.status(404).send("PL not found");
    }

    res.render("pl/daftar/edit", { profile: results[0] });
  });
};

// Update a pl
exports.updatePL = (req, res) => {
  const id = req.params.id;
  const { kode_pl, deskripsi, referensi } = req.body;

  DaftarPlModel.update(id, { kode_pl, deskripsi, referensi }, (err) => {
    if (err) {
      console.error("Error updating PL:", err);
      // Check if it's a duplicate entry error
      if (err.code === "ER_DUP_ENTRY") {
        return renderFormWithError(
          res,
          "pl/daftar/edit",
          "Kode PL already exists. Please use a unique code.",
          { id, kode_pl, deskripsi, referensi }
        );
      }
      return res.status(500).send("Error updating PL");
    }
    res.redirect("/pl/daftar");
  });
};

// Get next code for PL
exports.getNextPlCode = (req, res) => {
  DaftarPlModel.getAll((err, results) => {
    if (err) {
      console.error("Error fetching PLs:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Extract the numeric parts of existing PL codes
    const codeNumbers = results.map((pl) => {
      const match = pl.kode_pl.match(/^PL(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    });

    // Find the maximum number
    const maxNumber = codeNumbers.length > 0 ? Math.max(...codeNumbers) : 0;

    // Create the next code (increment by 1)
    const nextNumber = maxNumber + 1;
    const nextCode = `PL${String(nextNumber).padStart(2, "0")}`;

    // Return the next code as JSON
    res.json({ nextCode: nextCode });
  });
};
