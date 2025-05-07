// filepath: c:\Users\mrkazawa\my-codes\si-curriculum\src\controllers\bk\daftar-bk-controller.js
const BkModel = require("../../models/bk-model");

// Helper function to render form with error
const renderFormWithError = (res, view, errorMessage, formData = {}) => {
  res.render(view, {
    error: errorMessage,
    formData: formData,
  });
};

// Render the form for adding a new BK
exports.renderForm = (req, res) => {
  res.render("bk/daftar/create");
};

// Render the table with all BKs
exports.renderTable = (req, res) => {
  BkModel.getAll((err, results) => {
    if (err) {
      console.error("Error fetching BKs:", err);
      return res.status(500).send("Error fetching BKs");
    }
    res.render("bk/daftar/index", { bahanKajians: results });
  });
};

// Create a new BK
exports.createBK = (req, res) => {
  const { kode_bk, bahan_kajian, deskripsi, kompetensi, referensi } = req.body;

  BkModel.create(
    { kode_bk, bahan_kajian, deskripsi, kompetensi, referensi },
    (err, result) => {
      if (err) {
        console.error("Error creating BK:", err);
        // Check if it's a duplicate entry error
        if (err.code === "ER_DUP_ENTRY") {
          return renderFormWithError(
            res,
            "bk/daftar/create",
            "Kode BK already exists. Please use a unique code.",
            { kode_bk, bahan_kajian, deskripsi, kompetensi, referensi }
          );
        }
        return res.status(500).send("Error creating BK");
      }
      res.redirect("/bk/daftar");
    }
  );
};

// Delete a BK
exports.deleteBK = (req, res) => {
  const id = req.params.id;

  BkModel.delete(id, (err) => {
    if (err) {
      console.error("Error deleting BK:", err);
      return res.status(500).send("Error deleting BK");
    }
    res.redirect("/bk/daftar");
  });
};

// Render form for editing a BK
exports.renderEditForm = (req, res) => {
  const id = req.params.id;

  BkModel.getById(id, (err, results) => {
    if (err) {
      console.error("Error fetching BK for edit:", err);
      return res.status(500).send("Error fetching BK");
    }

    if (results.length === 0) {
      return res.status(404).send("BK not found");
    }

    res.render("bk/daftar/edit", { bk: results[0] });
  });
};

// Update a BK
exports.updateBK = (req, res) => {
  const id = req.params.id;
  const { kode_bk, bahan_kajian, deskripsi, kompetensi, referensi } = req.body;

  BkModel.update(
    id,
    { kode_bk, bahan_kajian, deskripsi, kompetensi, referensi },
    (err) => {
      if (err) {
        console.error("Error updating BK:", err);
        // Check if it's a duplicate entry error
        if (err.code === "ER_DUP_ENTRY") {
          return renderFormWithError(
            res,
            "bk/daftar/edit",
            "Kode BK already exists. Please use a unique code.",
            { id, kode_bk, bahan_kajian, deskripsi, kompetensi, referensi }
          );
        }
        return res.status(500).send("Error updating BK");
      }
      res.redirect("/bk/daftar");
    }
  );
};
