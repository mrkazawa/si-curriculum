// Use new structured routes
const daftarCplRoutes = require("./cpl/daftar-cpl-routes");
const daftarCpmkRoutes = require("./cpmk/daftar-cpmk-routes");
const daftarPlRoutes = require("./pl/daftar-pl-routes");
const daftarBkRoutes = require("./bk/daftar-bk-routes");
const daftarMkRoutes = require("./mk/daftar-mk-routes");
const cplPlMappingRoutes = require("./cpl/cpl-pl-mapping-routes");
const cplSemesterMkMappingRoutes = require("./cpl/cpl-semester-mk-mapping-routes");
const bkCplMappingRoutes = require("./bk/bk-cpl-mapping-routes");
const bkCplMkMappingRoutes = require("./bk/bk-cpl-mk-mapping-routes");
const mkBkMappingRoutes = require("./mk/mk-bk-mapping-routes");
const mkCplMappingRoutes = require("./mk/mk-cpl-mapping-routes");

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

  // Use the CPL-PL mapping routes with updated path structure
  app.use("/cpl/cpl-pl-mapping", cplPlMappingRoutes);

  // Use the CPL-Semester-MK mapping routes with updated path structure
  app.use("/cpl/cpl-semester-mk-mapping", cplSemesterMkMappingRoutes);

  // Use the CPMK routes with updated path structure
  app.use("/cpmk/daftar", daftarCpmkRoutes);

  // Use the BK routes with updated path structure
  app.use("/bk/daftar", daftarBkRoutes);

  // Use the BK-CPL mapping routes with updated path structure
  app.use("/bk/bk-cpl-mapping", bkCplMappingRoutes);

  // Use the BK-CPL-MK mapping routes with updated path structure
  app.use("/bk/bk-cpl-mk-mapping", bkCplMkMappingRoutes);

  // Use the new MK routes with updated path structure
  app.use("/mk/daftar", daftarMkRoutes);

  // Use the MK-BK mapping routes with updated path structure
  app.use("/mk/mk-bk-mapping", mkBkMappingRoutes);

  // Use the MK-CPL mapping routes with updated path structure
  app.use("/mk/mk-cpl-mapping", mkCplMappingRoutes);

  // Legacy route for backwards compatibility - should redirect to the new path
  app.use("/cpl-semester-mk-mapping", (req, res) => {
    res.redirect("/cpl/cpl-semester-mk-mapping");
  });
};

module.exports = setRoutes;
