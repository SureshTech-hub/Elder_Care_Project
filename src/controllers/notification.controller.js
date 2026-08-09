const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const User = require("../models/User");

// ================= CREATE NOTIFICATION =================

exports.createNotification = async (req, res) => {
  try {
    const {
      recipient,
      title,
      message,
      type,
      priority,
      relatedId,
      relatedModel,
    } = req.body;

    if (!recipient || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "recipient, title and message are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(recipient)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recipient ID.",
      });
    }

    const userExists = await User.findById(recipient);

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "Recipient user not found.",
      });
    }

    if (relatedId && !mongoose.Types.ObjectId.isValid(relatedId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid related ID.",
      });
    }

    const notification = await Notification.create({
      recipient,
      title,
      message,
      type,
      priority,
      relatedId,
      relatedModel,
      createdBy: req.user._id,
    });

    const populatedNotification =
      await Notification.findById(notification._id)
        .populate("recipient", "fullName email role")
        .populate("createdBy", "fullName email role");

    return res.status(201).json({
      success: true,
      message: "Notification created successfully.",
      data: populatedNotification,
    });
  } catch (error) {
    console.error("Create Notification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating notification.",
    });
  }
};

// ================= GET MY NOTIFICATIONS =================

exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
    })
      .populate("recipient", "fullName email role")
      .populate("createdBy", "fullName email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error("Get My Notifications Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching notifications.",
    });
  }
};

// ================= GET ALL NOTIFICATIONS =================

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("recipient", "fullName email role")
      .populate("createdBy", "fullName email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error("Get Notifications Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching notifications.",
    });
  }
};

// ================= GET NOTIFICATION BY ID =================

exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID.",
      });
    }

    const notification = await Notification.findById(id)
      .populate("recipient", "fullName email role")
      .populate("createdBy", "fullName email role");

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error("Get Notification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching notification.",
    });
  }
};

// ================= MARK AS READ =================

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID.",
      });
    }

    const notification = await Notification.findOneAndUpdate(
      {
        _id: id,
        recipient: req.user._id,
      },
      {
        isRead: true,
        readAt: new Date(),
      },
      {
        new: true,
      }
    )
      .populate("recipient", "fullName email role")
      .populate("createdBy", "fullName email role");

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      data: notification,
    });
  } catch (error) {
    console.error("Mark Notification Read Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating notification.",
    });
  }
};

// ================= MARK ALL AS READ =================

exports.markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      {
        recipient: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Mark All Notifications Read Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating notifications.",
    });
  }
};

// ================= DELETE NOTIFICATION =================

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID.",
      });
    }

    const notification = await Notification.findOneAndDelete({
      _id: id,
      recipient: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Notification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting notification.",
    });
  }
};