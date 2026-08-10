const mongoose = require("mongoose");

const residentSchema = new mongoose.Schema(
  {
    residentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    age: {
      type: Number,
      required: true,
      min: 0,
    },

    dateOfBirth: {
      type: Date,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    emergencyContactName: {
      type: String,
      required: true,
      trim: true,
    },

    emergencyContactPhone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    bloodGroup: {
      type: String,
      trim: true,
      default: "",
    },

    medicalConditions: {
      type: [String],
      default: [],
    },

    allergies: {
      type: [String],
      default: [],
    },

    roomNumber: {
      type: String,
      trim: true,
      default: "",
    },

    admissionDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "DISCHARGED"],
      default: "ACTIVE",
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

module.exports = mongoose.model("Resident", residentSchema);