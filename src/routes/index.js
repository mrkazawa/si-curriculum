const profilController = require("../controllers/profilController");

const setRoutes = (app) => {
  // Home route
  app.get("/", (req, res) => {
    res.render("index", {
      title: "Program Accreditation System",
      message: "Welcome to Curriculum App",
    });
  });

  // Profil Lulusan routes
  app.get("/profil-lulusan/form", profilController.renderForm);
  app.get("/profil-lulusan/table", profilController.renderTable);
  app.post("/profil-lulusan", profilController.createProfil);
  app.get("/profil-lulusan/delete/:id", profilController.deleteProfile);

  // New edit routes
  app.get("/profil-lulusan/edit/:id", profilController.renderEditForm);
  app.post("/profil-lulusan/update/:id", profilController.updateProfile);
};

module.exports = setRoutes;
