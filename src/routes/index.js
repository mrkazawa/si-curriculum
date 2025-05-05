const plRoutes = require("./plRoutes");
const cplRoutes = require("./cplRoutes");
const cplPlMappingRoutes = require("./cplPlMappingRoutes");
const bkRoutes = require("./bkRoutes");
const bkCplMappingRoutes = require("./bkCplMappingRoutes");

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

  // Use the CPL-PL mapping routes
  app.use("/cpl-pl-mapping", cplPlMappingRoutes);

  // Use the BK routes
  app.use("/bk", bkRoutes);

  // Use the BK-CPL mapping routes
  app.use("/bk-cpl-mapping", bkCplMappingRoutes);
};

module.exports = setRoutes;
