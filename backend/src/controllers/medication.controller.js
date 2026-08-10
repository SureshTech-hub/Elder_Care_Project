const mongoose = require("mongoose");
const Medication = require("../models/Medication");
const Resident = require("../models/Resident");
const User = require("../models/User");

// ================= CREATE MEDICATION =================

exports.createMedication = async (req, res) => {
  try {
    const {
      resident,
      medicationName,
      dosage,
      frequency,
      route,
      instructions,
      schedule,
      startDate,
      endDate,
      prescribedBy,
      status,
      notes,
    } = req.body;

    if (
      !resident ||
      !medicationName ||
      !dosage ||
      !frequency ||
      !startDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "resident, medicationName, dosage, frequency and startDate are required.",
      });
    }

    // Validate resident ID
    if (!mongoose.Types.ObjectId.isValid(resident)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resident ID.",
      });
    }

    // Check resident exists
    const residentExists = await Resident.findById(resident);

    if (!residentExists) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    // Validate prescribedBy if provided
    if (prescribedBy) {
      if (!mongoose.Types.ObjectId.isValid(prescribedBy)) {
        return res.status(400).json({
          success: false,
          message: "Invalid prescriber ID.",
        });
      }

      const prescriberExists = await User.findById(prescribedBy);

      if (!prescriberExists) {
        return res.status(404).json({
          success: false,
          message: "Prescriber not found.",
        });
      }
    }

    const medication = await Medication.create({
      resident,
      medicationName,
      dosage,
      frequency,
      route,
      instructions,
      schedule,
      startDate,
      endDate,
      prescribedBy,
      status,
      notes,
      createdBy: req.user._id,
    });

    const populatedMedication = await Medication.findById(medication._id)
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("prescribedBy", "fullName email role")
      .populate("createdBy", "fullName email role");

    return res.status(201).json({
      success: true,
      message: "Medication created successfully.",
      data: populatedMedication,
    });
  } catch (error) {
    console.error("Create Medication Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating medication.",
    });
  }
};

// ================= GET ALL MEDICATIONS =================

exports.getAllMedications = async (req, res) => {
  try {
    const medications = await Medication.find()
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("prescribedBy", "fullName email role")
      .populate("createdBy", "fullName email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: medications.length,
      data: medications,
    });
  } catch (error) {
    console.error("Get Medications Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching medications.",
    });
  }
};

// ================= GET MEDICATION BY ID =================

exports.getMedicationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid medication ID.",
      });
    }

    const medication = await Medication.findById(id)
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("prescribedBy", "fullName email role")
      .populate("createdBy", "fullName email role");

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: "Medication not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: medication,
    });
  } catch (error) {
    console.error("Get Medication Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching medication.",
    });
  }
};

// ================= GET MEDICATIONS BY RESIDENT =================

exports.getMedicationsByResident = async (req, res) => {
  try {
    const { residentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(residentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resident ID.",
      });
    }

    const residentExists = await Resident.findById(residentId);

    if (!residentExists) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    const medications = await Medication.find({
      resident: residentId,
    })
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("prescribedBy", "fullName email role")
      .populate("createdBy", "fullName email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: medications.length,
      data: medications,
    });
  } catch (error) {
    console.error("Get Resident Medications Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching resident medications.",
    });
  }
};

// ================= UPDATE MEDICATION =================

exports.updateMedication = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid medication ID.",
      });
    }

    const allowedFields = [
      "resident",
      "medicationName",
      "dosage",
      "frequency",
      "route",
      "instructions",
      "schedule",
      "startDate",
      "endDate",
      "prescribedBy",
      "status",
      "notes",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    // Validate resident if being updated
    if (updateData.resident) {
      if (!mongoose.Types.ObjectId.isValid(updateData.resident)) {
        return res.status(400).json({
          success: false,
          message: "Invalid resident ID.",
        });
      }

      const residentExists = await Resident.findById(updateData.resident);

      if (!residentExists) {
        return res.status(404).json({
          success: false,
          message: "Resident not found.",
        });
      }
    }

    // Validate prescriber if being updated
    if (updateData.prescribedBy) {
      if (!mongoose.Types.ObjectId.isValid(updateData.prescribedBy)) {
        return res.status(400).json({
          success: false,
          message: "Invalid prescriber ID.",
        });
      }

      const prescriberExists = await User.findById(
        updateData.prescribedBy
      );

      if (!prescriberExists) {
        return res.status(404).json({
          success: false,
          message: "Prescriber not found.",
        });
      }
    }

    const medication = await Medication.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("prescribedBy", "fullName email role")
      .populate("createdBy", "fullName email role");

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: "Medication not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Medication updated successfully.",
      data: medication,
    });
  } catch (error) {
    console.error("Update Medication Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating medication.",
    });
  }
};

// ================= DELETE MEDICATION =================

exports.deleteMedication = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid medication ID.",
      });
    }

    const medication = await Medication.findByIdAndDelete(id);

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: "Medication not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Medication deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Medication Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting medication.",
    });
  }
};