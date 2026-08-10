const express = require("express");

const router = express.Router();

const {
  detectAnomalies,
  getAllAnomalies,
  getOpenAnomalies,
  updateAnomalyStatus,
} = require("../controllers/anomaly.controller");

const {
  authenticate,
} = require("../middleware/auth.middleware");

router.post(
  "/detect",
  authenticate,
  detectAnomalies
);

router.get(
  "/",
  authenticate,
  getAllAnomalies
);

router.get(
  "/open",
  authenticate,
  getOpenAnomalies
);

router.put(
  "/:id/status",
  authenticate,
  updateAnomalyStatus
);

module.exports = router;