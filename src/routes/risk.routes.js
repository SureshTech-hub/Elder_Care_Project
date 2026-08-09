const express = require("express");

const router = express.Router();

const {
  calculateRisk,
  getAllRisks,
  getResidentRisks,
} = require("../controllers/risk.controller");

const { authenticate } = require("../middleware/auth.middleware");

router.get("/", authenticate, getAllRisks);

router.post(
  "/resident/:residentId/calculate",
  authenticate,
  calculateRisk
);

router.get(
  "/resident/:residentId",
  authenticate,
  getResidentRisks
);

module.exports = router;