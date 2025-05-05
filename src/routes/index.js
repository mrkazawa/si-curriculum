const profilLulusanRoutes = require("./profilLulusanRoutes");

const setRoutes = (app) => {
  // Home route
  app.get("/", (req, res) => {
    res.render("index", {
      title: "Program Accreditation System",
      message: "Welcome to Curriculum App",
    });
  });

  // Use the Profil Lulusan routes
  app.use("/profil-lulusan", profilLulusanRoutes);
};

module.exports = setRoutes;
