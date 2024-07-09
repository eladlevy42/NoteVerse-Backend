const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config(); // Load config
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json()); // Parse JSON bodies
app.use(cors({ origin: "http://localhost:5173" })); // Allow CORS for local development

// Database connection
connectDB();

// Route imports
const tasksRoutes = require("./routes/tasks.route");
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const googleRoutes = require("./routes/google.route");
const { verifyToken } = require("./middlewares/auth.middleware");

// Apply routes
app.use("/api/task", verifyToken, tasksRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", verifyToken, userRoutes);
app.use("/api/google", googleRoutes);
app.use(express.static("public"));

// Catch-all route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
