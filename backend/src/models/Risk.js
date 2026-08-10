const mongoose = require("mongoose");

const riskSchema = new mongoose.Schema(
  {
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
    },

    riskType: {
      type: String,
      enum: [
        "FALL_RISK",
        "HEALTH_RISK",
        "MEDICATION_RISK",
        "HOSPITALIZATION",
        "OVERALL",
      ],
      required: true,
    },

    score: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      required: true,
    },

    factors: {
      type: [String],
      default: [],
    },

    recommendations: {
      type: [String],
      default: [],
    },

    calculatedAt: {
      type: Date,
      default: Date.now,
    },

    modelVersion: {
      type: String,
      default: "rules-v1",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Risk", riskSchema);