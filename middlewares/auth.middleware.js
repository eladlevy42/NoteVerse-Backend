const jwt = require("jsonwebtoken");
const Task = require("../models/task.model");
const { default: mongoose } = require("mongoose");

const { JWT_SECRET } = process.env;

function verifyToken(req, res, next) {
  // Get token from header, the client should be responsible for sending the token
  const token = req.header("Authorization").split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify token
    req.userId = decoded.userId; // Add userId to request object
    next(); // Call next middleware
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

async function verifyUser(req, res, next) {
  const { id: taskId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: "Invalid task ID format" });
  }
  const task = await Task.findById(taskId);
  if (!task) {
    return res.status(404).json({ error: "taskId not found" });
  } else if (task.user.toString() !== req.userId) {
    console.log(task.user._id);
    console.log(req.userId, task.user);
    return res.status(403).json({ error: "user not authorized" });
  }
  next();
}

module.exports = { verifyToken, verifyUser };
