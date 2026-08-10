const mongoose = require("mongoose");

const aiReviewSchema = new mongoose.Schema(
  {
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
    },

    input: {
      type: String,
      required: true,
    },

    response: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "GENERAL",
        "HEALTH",
        "CARE_PLAN",
        "MEDICATION",
        "INCIDENT",
        "RISK",
      ],
      default: "GENERAL",
    },

    model: {
      type: String,
      default: "gemini",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AIReview", aiReviewSchema);