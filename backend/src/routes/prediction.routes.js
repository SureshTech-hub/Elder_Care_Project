const express = require("express");

const router = express.Router();

const {
  createPrediction,
  getAllPredictions,
  getPredictionById,
  getPredictionsByResident,
  updatePrediction,
  deletePrediction,
} = require("../controllers/prediction.controller");

const { authenticate } = require("../middleware/auth.middleware");

router.post("/", authenticate, createPrediction);

router.get("/", authenticate, getAllPredictions);

router.get(
  "/resident/:residentId",
  authenticate,
  getPredictionsByResident
);

router.get("/:id", authenticate, getPredictionById);

router.put("/:id", authenticate, updatePrediction);

router.delete("/:id", authenticate, deletePrediction);

module.exports = router;