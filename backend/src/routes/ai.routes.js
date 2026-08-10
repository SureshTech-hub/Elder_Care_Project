const express = require("express");

const router = express.Router();

const {
  generateReview,
  getAIReviews,
  getAIReviewById,
} = require("../controllers/ai.controller");

const { authenticate } = require("../middleware/auth.middleware");

router.post("/review", authenticate, generateReview);

router.get("/reviews", authenticate, getAIReviews);

router.get("/reviews/:id", authenticate, getAIReviewById);

module.exports = router;