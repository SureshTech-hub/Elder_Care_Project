const express = require("express");

const router = express.Router();

const {
  createActivity,
  getAllActivities,
  getActivityById,
  getActivitiesByResident,
  updateActivity,
  deleteActivity,
} = require("../controllers/activity.controller");

const { authenticate } = require("../middleware/auth.middleware");

// Create activity
router.post("/", authenticate, createActivity);

// Get all activities
router.get("/", authenticate, getAllActivities);

// IMPORTANT: Keep this BEFORE /:id
router.get(
  "/resident/:residentId",
  authenticate,
  getActivitiesByResident
);

// Get activity by ID
router.get("/:id", authenticate, getActivityById);

// Update activity
router.put("/:id", authenticate, updateActivity);

// Delete activity
router.delete("/:id", authenticate, deleteActivity);

module.exports = router;