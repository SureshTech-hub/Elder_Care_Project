const mongoose = require("mongoose");

const anomalySchema = new mongoose.Schema(
  {
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
    },

    metric: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: Number,
      required: true,
    },

    baseline: {
      type: Number,
      required: true,
    },

    deviation: {
      type: Number,
      required: true,
    },

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },

    description: {
      type: String,
      default: "",
    },

    detectedAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["OPEN", "REVIEWED", "RESOLVED"],
      default: "OPEN",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Anomaly", anomalySchema);