const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const Buffer = require("safe-buffer").Buffer;
const connectDB = require("./config/db");
const { verifyToken, verifyUser } = require("./middlewares/auth.middleware");
dotenv.config(); // Load config

const PORT = process.env.PORT || 3000;

async function main() {
  await connectDB(); // Connect to the database

  // Middlewares
  app.use(express.json()); // Parse JSON bodies
  app.use(cors({ origin: "http://localhost:5173" })); // Allow CORS for local development

  // Routes
  const tasksRoutes = require("./routes/tasks.route");
  const userRoutes = require("./routes/user.route");
  const authRoutes = require("./routes/auth.route");

  app.use("/api/task", verifyToken, tasksRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/user", verifyToken, userRoutes);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
main();
