const { Mongoose, default: mongoose } = require("mongoose");
const Task = require("../models/task.model");

async function getTasksCount(req, res) {
  try {
    const count = await Task.countDocuments({ user: req.userId });
    res.json({ count });
  } catch (err) {
    console.log(
      "task.controller, gettasksCount. Error while getting tasks count",
      err
    );
    res.status(500).json({ message: err.message });
  }
}

async function getTasks(req, res) {
  const { title } = req.query || "";

  const criteriaObj = {
    title: { $regex: new RegExp(title, "i") },
    user: req.userId,
  };

  let page = parseInt(req.query.page) || 1;
  if (page < 1) {
    page = 1;
  }

  try {
    const tasks = await Task.find(criteriaObj)
      .skip((page - 1) * 9)
      .limit(9);
    res.json(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}
async function getTaskById(req, res) {
  console.log(req.params);
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid task ID format" });
  }

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (err) {
    console.log(
      `task.controller, getTaskById. Error while getting task with id: ${id}`,
      err
    );
    res.status(500).json({ message: err.message });
  }
}

async function deleteTask(req, res) {
  const { id } = req.params;
  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      console.log(`task.controller, deleteTask. task not found with id: ${id}`);
      return res.status(404).json({ message: "task not found" });
    }
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.log(
      `task.controller, deleteTask. Error while deleting task with id: ${id}`
    );
    res.status(500).json({ message: err.message });
  }
}
async function createTodo(todoArr) {}

async function createTask(req, res) {
  const taskToAdd = req.body;
  taskToAdd.user = req.userId;
  const newTask = new Task(taskToAdd);

  try {
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.log(
      `task.controller, createTask. Error while creating task: ${err.message}`
    );
    if (err.name === "ValidationError") {
      console.log(`task.conteoller, createTask. ${err.message}`);
      res.status(400).json({ message: err });
    } else {
      console.log(`task.conteoller, createTask. ${err.message}`);
      res.status(500).json({ message: "Server error while creating task" });
    }
  }
}

async function updateTask(req, res) {
  const { id } = req.params;
  const {
    title,
    description,
    body,
    todoList = [],
    isPinned = false,
  } = req.body;
  const user = req.userId;

  try {
    const updateTask = await Task.findByIdAndUpdate(
      id,
      { title, description, body, todoList, isPinned },
      { new: true, runValidators: true }
    );

    if (!updateTask) {
      console.log(`task.controller, updateTask. task not found with id: ${id}`);
      return res.status(404).json({ message: "task not found" });
    }
    res.json(updateTask);
  } catch (err) {
    console.log(
      `task.controller, updateTask. Error while updating task with id: ${id}`,
      err
    );

    if (err.name === "ValidationError") {
      // Mongoose validation error
      console.log(`task.controller, updateTask. ${err.message}`);
      res.status(400).json({ message: err.message });
    } else {
      // Other types of errors
      console.log(`task.controller, updateTask. ${err.message}`);
      res.status(500).json({ message: "Server error while updating task" });
    }
  }
}

module.exports = {
  getTaskById,
  getTasks,
  deleteTask,
  createTask,
  updateTask,
  getTasksCount,
};
