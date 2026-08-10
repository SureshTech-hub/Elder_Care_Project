const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema(
  {
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
    },

    medicationName: {
      type: String,
      required: true,
      trim: true,
    },

    dosage: {
      type: String,
      required: true,
      trim: true,
    },

    frequency: {
      type: String,
      required: true,
      trim: true,
    },

    route: {
      type: String,
      enum: [
        "ORAL",
        "TOPICAL",
        "INJECTION",
        "INHALATION",
        "OPHTHALMIC",
        "OTIC",
        "NASAL",
        "OTHER",
      ],
      default: "ORAL",
    },

    instructions: {
      type: String,
      trim: true,
      default: "",
    },

    schedule: {
      type: [String],
      default: [],
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
    },

    prescribedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "DISCONTINUED", "ON_HOLD"],
      default: "ACTIVE",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
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

module.exports = mongoose.model("Medication", medicationSchema);