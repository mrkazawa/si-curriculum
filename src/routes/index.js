const profilController = require("../controllers/profilController");

const setRoutes = (app) => {
  // Home route
  app.get("/", (req, res) => {
    res.send("Welcome to Program Accreditation System");
  });

  // Profil Lulusan routes
  app.get("/profil-lulusan/form", profilController.renderForm);
  app.get("/profil-lulusan/table", profilController.renderTable);
  app.post("/profil-lulusan", profilController.createProfil);
  app.get("/profil-lulusan/delete/:id", profilController.deleteProfile);
};

module.exports = setRoutes;
