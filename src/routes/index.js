const profilLulusanRoutes = require("./profilLulusanRoutes");
const cplRoutes = require("./cplRoutes");

const setRoutes = (app) => {
  // Middleware to make path available to all views
  app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
  });

  // Home route
  app.get("/", (req, res) => {
    res.render("index", {
      title: "Program Accreditation System",
      message: "Welcome to Curriculum App",
    });
  });

  // Use the Profil Lulusan routes
  app.use("/profil-lulusan", profilLulusanRoutes);

  // Use the CPL routes
  app.use("/cpl", cplRoutes);
};

module.exports = setRoutes;
