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

async function getUserTasks(req, res) {
  const user = req.userId;
  let page = parseInt(req.query.page) || 1;
  if (page < 1) {
    page = 1;
  }
  try {
    const tasks = await Task.find({ user })
      .skip((page - 1) * 9)
      .limit(9);
    res.status(200).json(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err.message });
  }
}

module.exports = { getUser };
