const express = require("express");
const { verifyUser } = require("../middlewares/auth.middleware");
const {
  getTaskById,
  getTasks,
  deleteTask,
  createTask,
  updateTask,
  getTasksCount,
} = require("../controllers/task.controller");

const router = express.Router();

router.get("/", getTasks);
router.get("/count", getTasksCount);
router.post("/", createTask);
router.delete("/:id", deleteTask);
router.put("/:id", updateTask);
router.get("/:id", verifyUser, getTaskById);
module.exports = router;
