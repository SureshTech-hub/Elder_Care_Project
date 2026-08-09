const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema(
  {
    caregiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shiftDate: {
      type: Date,
      required: true,
    },

    shiftType: {
      type: String,
      enum: ["MORNING", "AFTERNOON", "NIGHT", "CUSTOM"],
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    assignedResidents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resident",
      },
    ],

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

module.exports = mongoose.model("Shift", shiftSchema);