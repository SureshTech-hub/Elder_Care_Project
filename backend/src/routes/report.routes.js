const express = require("express");

const router = express.Router();

const {
  getSummaryReport,
} = require("../controllers/report.controller");

const { authenticate } = require("../middleware/auth.middleware");

router.get("/summary", authenticate, getSummaryReport);

module.exports = router;