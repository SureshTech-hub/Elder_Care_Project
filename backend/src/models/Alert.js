const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
    },

    alertType: {
      type: String,
      enum: [
        "FALL_RISK",
        "MEDICATION",
        "HEALTH",
        "MISSED_TASK",
        "INCIDENT",
        "EMERGENCY",
        "OTHER",
      ],
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

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "ACKNOWLEDGED", "RESOLVED", "DISMISSED"],
      default: "ACTIVE",
    },

    source: {
      type: String,
      enum: ["SYSTEM", "USER", "AI", "PREDICTION"],
      default: "SYSTEM",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    acknowledgedAt: {
      type: Date,
    },

    resolvedAt: {
      type: Date,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
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

module.exports = mongoose.model("Alert", alertSchema);