const express = require("express");

const router = express.Router();

const {
  createCarePlan,
  getAllCarePlans,
  getCarePlanById,
  getCarePlansByResident,
  updateCarePlan,
  deleteCarePlan,
} = require("../controllers/carePlan.controller");

const { authenticate } = require("../middleware/auth.middleware");

// Create care plan
router.post("/", authenticate, createCarePlan);

// Get all care plans
router.get("/", authenticate, getAllCarePlans);

// Get care plans for a specific resident
router.get(
  "/resident/:residentId",
  authenticate,
  getCarePlansByResident
);

// Get care plan by ID
router.get("/:id", authenticate, getCarePlanById);

// Update care plan
router.put("/:id", authenticate, updateCarePlan);

// Delete care plan
router.delete("/:id", authenticate, deleteCarePlan);

module.exports = router;