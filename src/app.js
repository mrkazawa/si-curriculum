const express = require("express");
const path = require("path");
const connectDB = require("./config/database"); // Import database connection
const setRoutes = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database connection
connectDB();

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Initialize routes
setRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
