const express = require("express");

const router = express.Router();

const {
  createTask,
  getAllTasks,
  getTaskById,
  getTasksByResident,
  updateTask,
  deleteTask,
} = require("../controllers/task.controller");

const { authenticate } = require("../middleware/auth.middleware");

// Create task
router.post("/", authenticate, createTask);

// Get all tasks
router.get("/", authenticate, getAllTasks);

// Get tasks by resident
router.get(
  "/resident/:residentId",
  authenticate,
  getTasksByResident
);

// Get task by ID
router.get("/:id", authenticate, getTaskById);

// Update task
router.put("/:id", authenticate, updateTask);

// Delete task
router.delete("/:id", authenticate, deleteTask);

module.exports = router;