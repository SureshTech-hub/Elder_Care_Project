const { body } = require("express-validator");

const createTaskValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Task title is required."),

  body("description")
    .optional()
    .trim(),

  body("resident")
    .notEmpty()
    .withMessage("Resident is required."),

  body("assignedTo")
    .notEmpty()
    .withMessage("Assigned user is required."),

  body("priority")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH", "URGENT"])
    .withMessage("Invalid priority."),

  body("status")
    .optional()
    .isIn(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
    .withMessage("Invalid task status."),
];

const updateTaskValidator = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Task title cannot be empty."),

  body("priority")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH", "URGENT"])
    .withMessage("Invalid priority."),

  body("status")
    .optional()
    .isIn(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
    .withMessage("Invalid task status."),
];

module.exports = {
  createTaskValidator,
  updateTaskValidator,
};