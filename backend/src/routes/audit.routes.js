const express = require("express");

const router = express.Router();

const {
  getAllAuditLogs,
  getMyAuditLogs,
} = require("../controllers/audit.controller");

const { authenticate } = require("../middleware/auth.middleware");

router.get("/", authenticate, getAllAuditLogs);

router.get("/my", authenticate, getMyAuditLogs);

module.exports = router;