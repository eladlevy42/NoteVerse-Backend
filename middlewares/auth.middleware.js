const jwt = require("jsonwebtoken");
const Task = require("../models/task.model");
const { default: mongoose } = require("mongoose");
const { jwtDecode } = require("jwt-decode");
const User = require("../models/user.model");
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
    return res.status(403).json({ error: "user not authorized" });
  }
  next();
}

async function verifyGoogle(req, res, next) {
  const { credential } = req.body;

  let credentialDecoded;

  try {
    credentialDecoded = jwtDecode(credential);
    req.credentialDecoded = credentialDecoded; // Attach the decoded credentials to the request
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  try {
    const { email } = credentialDecoded;
    let user = await User.findOne({ email });

    if (user) {
      req.user = user; // Attach the existing user to the request
      return next(); // Proceed to the sign-in logic
    }

    // User does not exist, generate a unique username
    let username = email.split("@")[0];

    while (true) {
      const checkUser = await User.findOne({ username });
      if (!checkUser) {
        break;
      } else {
        username = username + Math.floor(Math.random() * 10);
      }
    }

    req.username = username; // Attach the unique username to the request
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  next();
}
module.exports = { verifyToken, verifyUser, verifyGoogle };
