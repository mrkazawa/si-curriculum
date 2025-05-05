const plRoutes = require("./plRoutes");
const cplRoutes = require("./cplRoutes");
const mappingRoutes = require("./mappingRoutes");

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

  // Use the PL routes
  app.use("/pl", plRoutes);

  // Use the CPL routes
  app.use("/cpl", cplRoutes);

  // Use the mapping routes
  app.use("/mapping", mappingRoutes);
};

module.exports = setRoutes;
