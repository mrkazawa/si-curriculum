const CapaianPembelajaran = require("../models/capaianPembelajaranModel");

// Helper function to render form with error
const renderFormWithError = (res, view, errorMessage, formData = {}) => {
  res.render(view, {
    error: errorMessage,
    formData: formData,
  });
};

// Render the form for adding a new CPL
exports.renderForm = (req, res) => {
  res.render("capaian-pembelajaran/create");
};

// Render the table with all CPLs
exports.renderTable = (req, res) => {
  CapaianPembelajaran.getAll((err, results) => {
    if (err) {
      console.error("Error fetching CPLs:", err);
      return res.status(500).send("Error fetching CPLs");
    }
    res.render("capaian-pembelajaran/index", { cpls: results });
  });
};

// Create a new CPL
exports.createCPL = (req, res) => {
  const { kode_cpl, deskripsi, referensi } = req.body;

  CapaianPembelajaran.create(
    { kode_cpl, deskripsi, referensi },
    (err, result) => {
      if (err) {
        console.error("Error creating CPL:", err);
        // Check if it's a duplicate entry error
        if (err.code === "ER_DUP_ENTRY") {
          return renderFormWithError(
            res,
            "capaian-pembelajaran/create",
            "Kode CPL already exists. Please use a unique code.",
            { kode_cpl, deskripsi, referensi }
          );
        }
        return res.status(500).send("Error creating CPL");
      }
      res.redirect("/capaian-pembelajaran");
    }
  );
};

// Delete a CPL
exports.deleteCPL = (req, res) => {
  const id = req.params.id;

  CapaianPembelajaran.delete(id, (err) => {
    if (err) {
      console.error("Error deleting CPL:", err);
      return res.status(500).send("Error deleting CPL");
    }
    res.redirect("/capaian-pembelajaran");
  });
};

// Render form for editing a CPL
exports.renderEditForm = (req, res) => {
  const id = req.params.id;

  CapaianPembelajaran.getById(id, (err, results) => {
    if (err) {
      console.error("Error fetching CPL for edit:", err);
      return res.status(500).send("Error fetching CPL");
    }

    if (results.length === 0) {
      return res.status(404).send("CPL not found");
    }

    res.render("capaian-pembelajaran/edit", { cpl: results[0] });
  });
};

// Update a CPL
exports.updateCPL = (req, res) => {
  const id = req.params.id;
  const { kode_cpl, deskripsi, referensi } = req.body;

  CapaianPembelajaran.update(id, { kode_cpl, deskripsi, referensi }, (err) => {
    if (err) {
      console.error("Error updating CPL:", err);
      // Check if it's a duplicate entry error
      if (err.code === "ER_DUP_ENTRY") {
        return renderFormWithError(
          res,
          "capaian-pembelajaran/edit",
          "Kode CPL already exists. Please use a unique code.",
          { id, kode_cpl, deskripsi, referensi }
        );
      }
      return res.status(500).send("Error updating CPL");
    }
    res.redirect("/capaian-pembelajaran");
  });
};
