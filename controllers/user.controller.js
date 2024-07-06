const User = require("../models/user.model");
const Task = require("../models/task.model");

async function getUser(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ error: "no mathcing user" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err.message });
  }
}

module.exports = { getUser };
