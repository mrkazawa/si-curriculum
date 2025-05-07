// Use new structured routes
const daftarCplRoutes = require("./cpl/daftar-cpl-routes");
const daftarCpmkRoutes = require("./cpmk/daftar-cpmk-routes");
const daftarPlRoutes = require("./pl/daftar-pl-routes");
const cplPlMappingRoutes = require("./cplPlMappingRoutes");
const bkRoutes = require("./bkRoutes");
const bkCplMappingRoutes = require("./bkCplMappingRoutes");
const mkRoutes = require("./mkRoutes");
const mkBkMappingRoutes = require("./mkBkMappingRoutes");
const mkCplMappingRoutes = require("./mkCplMappingRoutes");
const bkCplMkMappingRoutes = require("./bkCplMkMappingRoutes");
const cplSemesterMkMappingRoutes = require("./cplSemesterMkMappingRoutes");

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

  // Use the new PL routes with updated path structure
  app.use("/pl/daftar", daftarPlRoutes);

  // Use the new CPL routes with updated path structure
  app.use("/cpl/daftar", daftarCplRoutes);

  // Use the CPMK routes with updated path structure
  app.use("/cpmk/daftar", daftarCpmkRoutes);

  // Use the CPL-PL mapping routes
  app.use("/cpl-pl-mapping", cplPlMappingRoutes);

  // Use the BK routes
  app.use("/bk", bkRoutes);

  // Use the BK-CPL mapping routes
  app.use("/bk-cpl-mapping", bkCplMappingRoutes);

  // Use the MK routes
  app.use("/mk", mkRoutes);

  // Use the MK-BK mapping routes
  app.use("/mk-bk-mapping", mkBkMappingRoutes);

  // Use the MK-CPL mapping routes
  app.use("/mk-cpl-mapping", mkCplMappingRoutes);

  // Add BK-CPL-MK mapping routes
  app.use("/bk-cpl-mk-mapping", bkCplMkMappingRoutes);

  // Add CPL-Semester-MK mapping routes
  app.use("/cpl-semester-mk-mapping", cplSemesterMkMappingRoutes);
};

module.exports = setRoutes;
