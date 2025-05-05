const ProfilLulusan = require("../models/profilLulusanModel");

// Helper function to render form with error
const renderFormWithError = (res, view, errorMessage, formData = {}) => {
  res.render(view, {
    error: errorMessage,
    formData: formData,
  });
};

// Render the form for adding a new profile
exports.renderForm = (req, res) => {
  res.render("profil-lulusan/create");
};

// Render the table with all profiles
exports.renderTable = (req, res) => {
  ProfilLulusan.getAll((err, results) => {
    if (err) {
      console.error("Error fetching profiles:", err);
      return res.status(500).send("Error fetching profiles");
    }
    res.render("profil-lulusan/index", { profiles: results });
  });
};

// Create a new profile
exports.createProfil = (req, res) => {
  const { kode_pl, deskripsi, referensi } = req.body;

  ProfilLulusan.create({ kode_pl, deskripsi, referensi }, (err, result) => {
    if (err) {
      console.error("Error creating profile:", err);
      // Check if it's a duplicate entry error
      if (err.code === "ER_DUP_ENTRY") {
        return renderFormWithError(
          res,
          "profil-lulusan/create",
          "Kode PL already exists. Please use a unique code.",
          { kode_pl, deskripsi, referensi }
        );
      }
      return res.status(500).send("Error creating profile");
    }
    res.redirect("/profil-lulusan");
  });
};

// Delete a profile
exports.deleteProfile = (req, res) => {
  const id = req.params.id;

  ProfilLulusan.delete(id, (err) => {
    if (err) {
      console.error("Error deleting profile:", err);
      return res.status(500).send("Error deleting profile");
    }
    res.redirect("/profil-lulusan");
  });
};

// Render form for editing a profile
exports.renderEditForm = (req, res) => {
  const id = req.params.id;

  ProfilLulusan.getById(id, (err, results) => {
    if (err) {
      console.error("Error fetching profile for edit:", err);
      return res.status(500).send("Error fetching profile");
    }

    if (results.length === 0) {
      return res.status(404).send("Profile not found");
    }

    res.render("profil-lulusan/edit", { profile: results[0] });
  });
};

// Update a profile
exports.updateProfile = (req, res) => {
  const id = req.params.id;
  const { kode_pl, deskripsi, referensi } = req.body;

  ProfilLulusan.update(id, { kode_pl, deskripsi, referensi }, (err) => {
    if (err) {
      console.error("Error updating profile:", err);
      // Check if it's a duplicate entry error
      if (err.code === "ER_DUP_ENTRY") {
        return renderFormWithError(
          res,
          "profil-lulusan/edit",
          "Kode PL already exists. Please use a unique code.",
          { id, kode_pl, deskripsi, referensi }
        );
      }
      return res.status(500).send("Error updating profile");
    }
    res.redirect("/profil-lulusan");
  });
};
