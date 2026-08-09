const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
    },

    predictionType: {
      type: String,
      enum: [
        "FALL_RISK",
        "HEALTH_RISK",
        "MEDICATION_RISK",
        "HOSPITALIZATION",
        "OTHER",
      ],
      required: true,
    },

    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      required: true,
    },

    probability: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },

    score: {
      type: Number,
      default: 0,
    },

    explanation: {
      type: String,
      default: "",
    },

    recommendations: {
      type: [String],
      default: [],
    },

    inputData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    modelVersion: {
      type: String,
      default: "v1",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "REVIEWED", "DISMISSED"],
      default: "ACTIVE",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Prediction", predictionSchema);