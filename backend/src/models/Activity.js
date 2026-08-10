const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
    },

    activityName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    activityType: {
      type: String,
      enum: [
        "EXERCISE",
        "SOCIAL",
        "RECREATIONAL",
        "THERAPY",
        "MEAL",
        "MEDICAL",
        "PERSONAL_CARE",
        "OTHER",
      ],
      default: "OTHER",
    },

    scheduledDate: {
      type: Date,
      required: true,
    },

    duration: {
      type: Number,
      default: 30,
      min: 1,
    },

    assignedCaregiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      default: "SCHEDULED",
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

module.exports = mongoose.model("Activity", activitySchema);