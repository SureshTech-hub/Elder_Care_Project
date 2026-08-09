const express = require("express");

const router = express.Router();

const {
  createMedication,
  getAllMedications,
  getMedicationById,
  getMedicationsByResident,
  updateMedication,
  deleteMedication,
} = require("../controllers/medication.controller");

const { authenticate } = require("../middleware/auth.middleware");

// Create medication
router.post("/", authenticate, createMedication);

// Get all medications
router.get("/", authenticate, getAllMedications);

// Get medications for a specific resident
router.get(
  "/resident/:residentId",
  authenticate,
  getMedicationsByResident
);

// Get medication by ID
router.get("/:id", authenticate, getMedicationById);

// Update medication
router.put("/:id", authenticate, updateMedication);

// Delete medication
router.delete("/:id", authenticate, deleteMedication);

module.exports = router;