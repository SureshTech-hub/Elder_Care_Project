const express = require("express");

const router = express.Router();

const {
  createShift,
  getAllShifts,
  getShiftById,
  getShiftsByCaregiver,
  updateShift,
  deleteShift,
} = require("../controllers/shift.controller");

const { authenticate } = require("../middleware/auth.middleware");

// Create shift
router.post("/", authenticate, createShift);

// Get all shifts
router.get("/", authenticate, getAllShifts);

// Get shifts by caregiver
router.get(
  "/caregiver/:caregiverId",
  authenticate,
  getShiftsByCaregiver
);

// Get shift by ID
router.get("/:id", authenticate, getShiftById);

// Update shift
router.put("/:id", authenticate, updateShift);

// Delete shift
router.delete("/:id", authenticate, deleteShift);

module.exports = router;