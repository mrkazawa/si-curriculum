// filepath: c:\Users\mrkazawa\my-codes\si-curriculum\src\controllers\cpmk\sub-cpmk-controller.js
const SubCpmkModel = require("../../models/sub-cpmk-model");
const CpmkModel = require("../../models/cpmk-model");

// Helper function to render form with error
const renderFormWithError = (
  res,
  view,
  errorMessage,
  formData = {},
  cpmks = []
) => {
  res.render(view, {
    error: errorMessage,
    formData: formData,
    cpmks: cpmks,
  });
};

// Render the form for adding a new Sub-CPMK
exports.renderForm = (req, res) => {
  // Get all CPMKs to populate the dropdown
  CpmkModel.getAll((err, cpmks) => {
    if (err) {
      console.error("Error fetching CPMKs:", err);
      return res.status(500).send("Error fetching CPMKs");
    }

    res.render("cpmk/sub-cpmk/create", { cpmks: cpmks });
  });
};

// Render the table with all Sub-CPMKs
exports.renderTable = (req, res) => {
  SubCpmkModel.getAll((err, results) => {
    if (err) {
      console.error("Error fetching Sub-CPMKs:", err);
      return res.status(500).send("Error fetching Sub-CPMKs");
    }
    res.render("cpmk/sub-cpmk/index", { subCpmks: results });
  });
};

// Create a new Sub-CPMK
exports.createSubCPMK = (req, res) => {
  const { kode_sub_cpmk, deskripsi, kode_cpmk } = req.body;

  // Validate input
  if (!kode_sub_cpmk || !deskripsi || !kode_cpmk) {
    CpmkModel.getAll((err, cpmks) => {
      if (err) {
        console.error("Error fetching CPMKs:", err);
        return res.status(500).send("Error fetching CPMKs");
      }

      return renderFormWithError(
        res,
        "cpmk/sub-cpmk/create",
        "All fields are required",
        { kode_sub_cpmk, deskripsi, kode_cpmk },
        cpmks
      );
    });
    return;
  }

  SubCpmkModel.create(
    { kode_sub_cpmk, deskripsi, kode_cpmk },
    (err, result) => {
      if (err) {
        console.error("Error creating Sub-CPMK:", err);

        CpmkModel.getAll((cpmkErr, cpmks) => {
          if (cpmkErr) {
            console.error("Error fetching CPMKs:", cpmkErr);
            return res.status(500).send("Error fetching CPMKs");
          }

          // Check if it's a duplicate entry error
          if (err.code === "ER_DUP_ENTRY") {
            return renderFormWithError(
              res,
              "cpmk/sub-cpmk/create",
              "Kode Sub-CPMK already exists. Please use a unique code.",
              { kode_sub_cpmk, deskripsi, kode_cpmk },
              cpmks
            );
          }

          return renderFormWithError(
            res,
            "cpmk/sub-cpmk/create",
            "Error creating Sub-CPMK",
            { kode_sub_cpmk, deskripsi, kode_cpmk },
            cpmks
          );
        });

        return;
      }

      res.redirect("/cpmk/sub-cpmk");
    }
  );
};

// Delete a Sub-CPMK
exports.deleteSubCPMK = (req, res) => {
  const id = req.params.id;

  SubCpmkModel.delete(id, (err) => {
    if (err) {
      console.error("Error deleting Sub-CPMK:", err);
      return res.status(500).send("Error deleting Sub-CPMK");
    }
    res.redirect("/cpmk/sub-cpmk");
  });
};

// Render form for editing a Sub-CPMK
exports.renderEditForm = (req, res) => {
  const id = req.params.id;

  // Get all CPMKs for the dropdown
  CpmkModel.getAll((cpmkErr, cpmks) => {
    if (cpmkErr) {
      console.error("Error fetching CPMKs:", cpmkErr);
      return res.status(500).send("Error fetching CPMKs");
    }

    SubCpmkModel.getWithCpmkDetails(id, (err, results) => {
      if (err) {
        console.error("Error fetching Sub-CPMK for edit:", err);
        return res.status(500).send("Error fetching Sub-CPMK");
      }

      if (results.length === 0) {
        return res.status(404).send("Sub-CPMK not found");
      }

      res.render("cpmk/sub-cpmk/edit", {
        subCpmk: results[0],
        cpmks: cpmks,
      });
    });
  });
};

// Update a Sub-CPMK
exports.updateSubCPMK = (req, res) => {
  const id = req.params.id;
  const {
    kode_sub_cpmk,
    deskripsi,
    kode_cpmk,
    original_cpmk,
    original_sub_cpmk,
  } = req.body;

  // Check if CPMK changed
  const cpmkChanged = kode_cpmk !== original_cpmk;

  // Validate input
  if (!kode_sub_cpmk || !deskripsi || !kode_cpmk) {
    CpmkModel.getAll((err, cpmks) => {
      if (err) {
        console.error("Error fetching CPMKs:", err);
        return res.status(500).send("Error fetching CPMKs");
      }

      return renderFormWithError(
        res,
        "cpmk/sub-cpmk/edit",
        "All fields are required",
        { id, kode_sub_cpmk, deskripsi, kode_cpmk },
        cpmks
      );
    });
    return;
  }

  // If CPMK changed, create a new Sub-CPMK and delete the old one
  if (cpmkChanged) {
    // Create a new Sub-CPMK with the new CPMK
    SubCpmkModel.create(
      { kode_sub_cpmk, deskripsi, kode_cpmk },
      (createErr, createResult) => {
        if (createErr) {
          console.error("Error creating new Sub-CPMK:", createErr);

          CpmkModel.getAll((cpmkErr, cpmks) => {
            if (cpmkErr) {
              console.error("Error fetching CPMKs:", cpmkErr);
              return res.status(500).send("Error fetching CPMKs");
            }

            return renderFormWithError(
              res,
              "cpmk/sub-cpmk/edit",
              "Error creating new Sub-CPMK",
              { id, kode_sub_cpmk, deskripsi, kode_cpmk },
              cpmks
            );
          });

          return;
        }

        // Delete the old Sub-CPMK
        SubCpmkModel.delete(id, (deleteErr) => {
          if (deleteErr) {
            console.error("Error deleting old Sub-CPMK:", deleteErr);
            // Even if delete fails, still redirect as the new one was created
          }

          // Redirect to the Sub-CPMK list
          res.redirect("/cpmk/sub-cpmk");
        });
      }
    );
  } else {
    // If CPMK didn't change, just update the Sub-CPMK normally
    SubCpmkModel.update(id, { kode_sub_cpmk, deskripsi, kode_cpmk }, (err) => {
      if (err) {
        console.error("Error updating Sub-CPMK:", err);

        CpmkModel.getAll((cpmkErr, cpmks) => {
          if (cpmkErr) {
            console.error("Error fetching CPMKs:", cpmkErr);
            return res.status(500).send("Error fetching CPMKs");
          }

          // Check if it's a duplicate entry error
          if (err.code === "ER_DUP_ENTRY") {
            return renderFormWithError(
              res,
              "cpmk/sub-cpmk/edit",
              "Kode Sub-CPMK already exists. Please use a unique code.",
              { id, kode_sub_cpmk, deskripsi, kode_cpmk },
              cpmks
            );
          }

          return renderFormWithError(
            res,
            "cpmk/sub-cpmk/edit",
            "Error updating Sub-CPMK",
            { id, kode_sub_cpmk, deskripsi, kode_cpmk },
            cpmks
          );
        });

        return;
      }

      res.redirect("/cpmk/sub-cpmk");
    });
  }
};

// Get next number for a specific CPMK's Sub-CPMK
exports.getNextSubCpmkNumber = (req, res) => {
  const kode_cpmk = req.params.kode_cpmk;

  // Call the model method to get the count
  SubCpmkModel.countByCpmk(kode_cpmk, (err, results) => {
    if (err) {
      console.error("Error counting Sub-CPMKs:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Calculate the next number (count + 1)
    const nextNumber = results[0].count + 1;

    // Return the next number as JSON
    res.json({ nextNumber: nextNumber });
  });
};
