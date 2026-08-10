const { body } = require("express-validator");

const createIncidentValidator = [
  body("resident")
    .notEmpty()
    .withMessage("Resident is required."),

  body("incidentType")
    .trim()
    .notEmpty()
    .withMessage("Incident type is required."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Incident description is required."),

  body("severity")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
    .withMessage("Invalid severity."),
];

const updateIncidentValidator = [
  body("incidentType")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Incident type cannot be empty."),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty."),

  body("severity")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
    .withMessage("Invalid severity."),
];

module.exports = {
  createIncidentValidator,
  updateIncidentValidator,
};