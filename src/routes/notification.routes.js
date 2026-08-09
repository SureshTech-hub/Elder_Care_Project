const express = require("express");

const router = express.Router();

const {
  createNotification,
  getMyNotifications,
  getAllNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notification.controller");

const { authenticate } = require("../middleware/auth.middleware");

// Create notification
router.post("/", authenticate, createNotification);

// My notifications
router.get("/my", authenticate, getMyNotifications);

// Mark all my notifications as read
router.put("/my/read-all", authenticate, markAllAsRead);

// Get all notifications
router.get("/", authenticate, getAllNotifications);

// Get notification by ID
router.get("/:id", authenticate, getNotificationById);

// Mark notification as read
router.put("/:id/read", authenticate, markAsRead);

// Delete notification
router.delete("/:id", authenticate, deleteNotification);

module.exports = router;