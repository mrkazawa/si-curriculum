const express = require("express");
const path = require("path");
const connectDB = require("./config/database"); // Import database connection
const setRoutes = require("./routes/index");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database connection
connectDB();

// Run migrations to ensure all tables are up-to-date
require("./migrations/alterMkTable");

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Set up express-ejs-layouts
app.use(expressLayouts);
app.set("layout", "layouts/main");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Initialize routes
setRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
