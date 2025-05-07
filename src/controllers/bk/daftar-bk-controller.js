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

// Get next BK code for auto-generation
exports.getNextCode = (req, res) => {
  BkModel.getNextCode((err, nextCode) => {
    if (err) {
      console.error("Error getting next BK code:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ nextCode: nextCode });
  });
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

  // Validate input
  if (!kode_bk || !bahan_kajian || !deskripsi || !kompetensi) {
    return renderFormWithError(
      res,
      "bk/daftar/create",
      "All fields except referensi are required",
      { kode_bk, bahan_kajian, deskripsi, kompetensi, referensi }
    );
  }

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

  // Validate input
  if (!bahan_kajian || !deskripsi || !kompetensi) {
    return renderFormWithError(
      res,
      "bk/daftar/edit",
      "All fields except referensi are required",
      { id, kode_bk, bahan_kajian, deskripsi, kompetensi, referensi }
    );
  }

  // Get the original BK to preserve the kode_bk (since it should not be edited)
  BkModel.getById(id, (getErr, results) => {
    if (getErr || results.length === 0) {
      console.error("Error fetching original BK:", getErr);
      return res.status(500).send("Error fetching BK data");
    }

    const originalKodeBk = results[0].kode_bk;

    BkModel.update(
      id,
      {
        kode_bk: originalKodeBk, // Use the original, not the submitted one
        bahan_kajian,
        deskripsi,
        kompetensi,
        referensi,
      },
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
  });
};
