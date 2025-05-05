const ProfilLulusan = require("../models/profil");

const profilController = {
  renderForm: (req, res) => {
    res.render("profil-form");
  },

  renderTable: (req, res) => {
    ProfilLulusan.getAll((err, results) => {
      if (err) {
        console.error("Error fetching profil lulusan:", err);
        return res.status(500).send("Error fetching data");
      }

      res.render("profil-table", {
        profiles: results,
        title: "Profil Lulusan (PL)",
      });
    });
  },

  createProfil: (req, res) => {
    const { kode_pl, deskripsi, referensi } = req.body;

    if (!kode_pl || !deskripsi || !referensi) {
      return res.status(400).send("All fields are required");
    }

    const profilData = { kode_pl, deskripsi, referensi };

    ProfilLulusan.create(profilData, (err, result) => {
      if (err) {
        console.error("Error creating profil lulusan:", err);
        return res.status(500).send("Error saving data");
      }

      res.redirect("/profil-lulusan/table");
    });
  },

  deleteProfile: (req, res) => {
    const id = req.params.id;

    ProfilLulusan.delete(id, (err, result) => {
      if (err) {
        console.error("Error deleting profil lulusan:", err);
        return res.status(500).send("Error deleting data");
      }

      res.redirect("/profil-lulusan/table");
    });
  },
};

module.exports = profilController;
