const { body } = require("express-validator");

const createUserValidator = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required."),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required.")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),

  body("role")
    .optional()
    .isIn(["ADMIN", "MANAGER", "ANALYST", "FIELD_STAFF"])
    .withMessage("Invalid role."),

  body("phone")
    .optional()
    .trim(),
];

const updateUserValidator = [
  body("fullName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Full name cannot be empty."),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Valid email is required.")
    .normalizeEmail(),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),

  body("role")
    .optional()
    .isIn(["ADMIN", "MANAGER", "ANALYST", "FIELD_STAFF"])
    .withMessage("Invalid role."),

  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Invalid status."),
];

module.exports = {
  createUserValidator,
  updateUserValidator,
};