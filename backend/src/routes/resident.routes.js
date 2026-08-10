const express = require("express");

const router = express.Router();

const {
  createResident,
  getAllResidents,
  getResidentById,
  updateResident,
  deleteResident,
} = require("../controllers/resident.controller");

const { authenticate } = require("../middleware/auth.middleware");

// Create Resident
router.post("/", authenticate, createResident);

// Get All Residents
router.get("/", authenticate, getAllResidents);

// Get Resident By ID
router.get("/:id", authenticate, getResidentById);

// Update Resident
router.put("/:id", authenticate, updateResident);

// Delete Resident
router.delete("/:id", authenticate, deleteResident);

module.exports = router;