const CpmkModel = require("../models/cpmkModel");
const CplModel = require("../models/cplModel");

// Helper function to render form with error
const renderFormWithError = (
  res,
  view,
  errorMessage,
  formData = {},
  cpls = []
) => {
  res.render(view, {
    error: errorMessage,
    formData: formData,
    cpls: cpls,
  });
};

// Render the form for adding a new CPMK
exports.renderForm = (req, res) => {
  // Get all CPLs to populate the dropdown
  CplModel.getAll((err, cpls) => {
    if (err) {
      console.error("Error fetching CPLs:", err);
      return res.status(500).send("Error fetching CPLs");
    }

    res.render("cpmk/create", { cpls: cpls });
  });
};

// Render the table with all CPMKs
exports.renderTable = (req, res) => {
  CpmkModel.getAll((err, results) => {
    if (err) {
      console.error("Error fetching CPMKs:", err);
      return res.status(500).send("Error fetching CPMKs");
    }
    res.render("cpmk/index", { cpmks: results });
  });
};

// Create a new CPMK
exports.createCPMK = (req, res) => {
  const { kode_cpmk, deskripsi, kode_cpl } = req.body;

  // Validate input
  if (!kode_cpmk || !deskripsi || !kode_cpl) {
    CplModel.getAll((err, cpls) => {
      if (err) {
        console.error("Error fetching CPLs:", err);
        return res.status(500).send("Error fetching CPLs");
      }

      return renderFormWithError(
        res,
        "cpmk/create",
        "All fields are required",
        { kode_cpmk, deskripsi, kode_cpl },
        cpls
      );
    });
    return;
  }

  CpmkModel.create({ kode_cpmk, deskripsi, kode_cpl }, (err, result) => {
    if (err) {
      console.error("Error creating CPMK:", err);

      CplModel.getAll((cplErr, cpls) => {
        if (cplErr) {
          console.error("Error fetching CPLs:", cplErr);
          return res.status(500).send("Error fetching CPLs");
        }

        // Check if it's a duplicate entry error
        if (err.code === "ER_DUP_ENTRY") {
          return renderFormWithError(
            res,
            "cpmk/create",
            "Kode CPMK already exists. Please use a unique code.",
            { kode_cpmk, deskripsi, kode_cpl },
            cpls
          );
        }

        return renderFormWithError(
          res,
          "cpmk/create",
          "Error creating CPMK",
          { kode_cpmk, deskripsi, kode_cpl },
          cpls
        );
      });

      return;
    }

    res.redirect("/cpmk");
  });
};

// Delete a CPMK
exports.deleteCPMK = (req, res) => {
  const id = req.params.id;

  CpmkModel.delete(id, (err) => {
    if (err) {
      console.error("Error deleting CPMK:", err);
      return res.status(500).send("Error deleting CPMK");
    }
    res.redirect("/cpmk");
  });
};

// Render form for editing a CPMK
exports.renderEditForm = (req, res) => {
  const id = req.params.id;

  // Get all CPLs for the dropdown
  CplModel.getAll((cplErr, cpls) => {
    if (cplErr) {
      console.error("Error fetching CPLs:", cplErr);
      return res.status(500).send("Error fetching CPLs");
    }

    CpmkModel.getById(id, (err, results) => {
      if (err) {
        console.error("Error fetching CPMK for edit:", err);
        return res.status(500).send("Error fetching CPMK");
      }

      if (results.length === 0) {
        return res.status(404).send("CPMK not found");
      }

      res.render("cpmk/edit", { cpmk: results[0], cpls: cpls });
    });
  });
};

// Update a CPMK
exports.updateCPMK = (req, res) => {
  const id = req.params.id;
  const { kode_cpmk, deskripsi, kode_cpl, original_cpl, original_cpmk } =
    req.body;

  // Check if CPL changed
  const cplChanged = kode_cpl !== original_cpl;

  // Validate input
  if (!kode_cpmk || !deskripsi || !kode_cpl) {
    CplModel.getAll((err, cpls) => {
      if (err) {
        console.error("Error fetching CPLs:", err);
        return res.status(500).send("Error fetching CPLs");
      }

      return renderFormWithError(
        res,
        "cpmk/edit",
        "All fields are required",
        { id, kode_cpmk, deskripsi, kode_cpl },
        cpls
      );
    });
    return;
  }

  // If CPL changed, create a new CPMK and delete the old one
  if (cplChanged) {
    // Create a new CPMK with the new CPL
    CpmkModel.create(
      { kode_cpmk, deskripsi, kode_cpl },
      (createErr, createResult) => {
        if (createErr) {
          console.error("Error creating new CPMK:", createErr);

          CplModel.getAll((cplErr, cpls) => {
            if (cplErr) {
              console.error("Error fetching CPLs:", cplErr);
              return res.status(500).send("Error fetching CPLs");
            }

            return renderFormWithError(
              res,
              "cpmk/edit",
              "Error creating new CPMK",
              { id, kode_cpmk, deskripsi, kode_cpl },
              cpls
            );
          });

          return;
        }

        // Delete the old CPMK
        CpmkModel.delete(id, (deleteErr) => {
          if (deleteErr) {
            console.error("Error deleting old CPMK:", deleteErr);
            // Even if delete fails, still redirect as the new one was created
          }

          // Redirect to the CPMK list
          res.redirect("/cpmk");
        });
      }
    );
  } else {
    // If CPL didn't change, just update the CPMK normally
    CpmkModel.update(id, { kode_cpmk, deskripsi, kode_cpl }, (err) => {
      if (err) {
        console.error("Error updating CPMK:", err);

        CplModel.getAll((cplErr, cpls) => {
          if (cplErr) {
            console.error("Error fetching CPLs:", cplErr);
            return res.status(500).send("Error fetching CPLs");
          }

          // Check if it's a duplicate entry error
          if (err.code === "ER_DUP_ENTRY") {
            return renderFormWithError(
              res,
              "cpmk/edit",
              "Kode CPMK already exists. Please use a unique code.",
              { id, kode_cpmk, deskripsi, kode_cpl },
              cpls
            );
          }

          return renderFormWithError(
            res,
            "cpmk/edit",
            "Error updating CPMK",
            { id, kode_cpmk, deskripsi, kode_cpl },
            cpls
          );
        });

        return;
      }

      res.redirect("/cpmk");
    });
  }
};

// Add this function to the controller

// Get next number for a specific CPL's CPMK
exports.getNextCpmkNumber = (req, res) => {
  const kode_cpl = req.params.kode_cpl;

  // Call the model method to get the count
  CpmkModel.countByCpl(kode_cpl, (err, results) => {
    if (err) {
      console.error("Error counting CPMKs:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Calculate the next number (count + 1)
    const nextNumber = results[0].count + 1;

    // Return the next number as JSON
    res.json({ nextNumber: nextNumber });
  });
};
