const { body } = require("express-validator");

const registerValidator = [
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

const loginValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required."),
];

module.exports = {
  registerValidator,
  loginValidator,
};