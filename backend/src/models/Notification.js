const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "ALERT",
        "TASK",
        "MEDICATION",
        "INCIDENT",
        "SHIFT",
        "SYSTEM",
        "OTHER",
      ],
      default: "SYSTEM",
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
    },

    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    relatedModel: {
      type: String,
      enum: [
        "Alert",
        "Task",
        "Medication",
        "Incident",
        "Shift",
        "Resident",
      ],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);