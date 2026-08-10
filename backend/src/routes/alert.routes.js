const express = require("express");

const router = express.Router();

const {
  createAlert,
  getAllAlerts,
  getAlertById,
  getAlertsByResident,
  updateAlert,
  deleteAlert,
} = require("../controllers/alert.controller");

const { authenticate } = require("../middleware/auth.middleware");

router.post("/", authenticate, createAlert);

router.get("/", authenticate, getAllAlerts);

router.get(
  "/resident/:residentId",
  authenticate,
  getAlertsByResident
);

router.get("/:id", authenticate, getAlertById);

router.put("/:id", authenticate, updateAlert);

router.delete("/:id", authenticate, deleteAlert);

module.exports = router;