const express = require("express");

const router = express.Router();

const {
  createIncident,
  getAllIncidents,
  getIncidentById,
  getIncidentsByResident,
  updateIncident,
  deleteIncident,
} = require("../controllers/incident.controller");

const { authenticate } = require("../middleware/auth.middleware");

// Create incident
router.post("/", authenticate, createIncident);

// Get all incidents
router.get("/", authenticate, getAllIncidents);

// Get incidents by resident
router.get(
  "/resident/:residentId",
  authenticate,
  getIncidentsByResident
);

// Get incident by ID
router.get("/:id", authenticate, getIncidentById);

// Update incident
router.put("/:id", authenticate, updateIncident);

// Delete incident
router.delete("/:id", authenticate, deleteIncident);

module.exports = router;