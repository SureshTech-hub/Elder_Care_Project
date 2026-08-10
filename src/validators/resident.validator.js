const { body } = require("express-validator");

const createResidentValidator = [
  body("residentId")
    .trim()
    .notEmpty()
    .withMessage("Resident ID is required."),

  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required."),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required."),

  body("roomNumber")
    .trim()
    .notEmpty()
    .withMessage("Room number is required."),
];

const updateResidentValidator = [
  body("firstName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("First name cannot be empty."),

  body("lastName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Last name cannot be empty."),

  body("roomNumber")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Room number cannot be empty."),
];

module.exports = {
  createResidentValidator,
  updateResidentValidator,
};