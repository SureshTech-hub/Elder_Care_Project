const mongoose = require("mongoose");
const Resident = require("../models/Resident");

// ================= CREATE RESIDENT =================

exports.createResident = async (req, res) => {
  try {
    const {
      residentId,
      firstName,
      lastName,
      gender,
      age,
      dateOfBirth,
      phone,
      emergencyContactName,
      emergencyContactPhone,
      address,
      bloodGroup,
      medicalConditions,
      allergies,
      roomNumber,
      admissionDate,
      status,
    } = req.body;

    if (
      !residentId ||
      !firstName ||
      !lastName ||
      !gender ||
      age === undefined ||
      !emergencyContactName ||
      !emergencyContactPhone
    ) {
      return res.status(400).json({
        success: false,
        message:
          "residentId, firstName, lastName, gender, age, emergencyContactName and emergencyContactPhone are required.",
      });
    }

    const existingResident = await Resident.findOne({ residentId });

    if (existingResident) {
      return res.status(409).json({
        success: false,
        message: "Resident ID already exists.",
      });
    }

    const resident = await Resident.create({
      residentId,
      firstName,
      lastName,
      gender,
      age,
      dateOfBirth,
      phone,
      emergencyContactName,
      emergencyContactPhone,
      address,
      bloodGroup,
      medicalConditions,
      allergies,
      roomNumber,
      admissionDate,
      status,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Resident created successfully.",
      data: resident,
    });
  } catch (error) {
    console.error("Create Resident Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating resident.",
    });
  }
};

// ================= GET ALL RESIDENTS =================

exports.getAllResidents = async (req, res) => {
  try {
    const residents = await Resident.find()
      .populate("createdBy", "fullName email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: residents.length,
      data: residents,
    });
  } catch (error) {
    console.error("Get Residents Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching residents.",
    });
  }
};

// ================= GET RESIDENT BY ID =================

exports.getResidentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resident ID.",
      });
    }

    const resident = await Resident.findById(id).populate(
      "createdBy",
      "fullName email role"
    );

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: resident,
    });
  } catch (error) {
    console.error("Get Resident Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching resident.",
    });
  }
};

// ================= UPDATE RESIDENT =================

exports.updateResident = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resident ID.",
      });
    }

    const allowedFields = [
      "residentId",
      "firstName",
      "lastName",
      "gender",
      "age",
      "dateOfBirth",
      "phone",
      "emergencyContactName",
      "emergencyContactPhone",
      "address",
      "bloodGroup",
      "medicalConditions",
      "allergies",
      "roomNumber",
      "admissionDate",
      "status",
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

    if (updateData.residentId) {
      const existingResident = await Resident.findOne({
        residentId: updateData.residentId,
        _id: { $ne: id },
      });

      if (existingResident) {
        return res.status(409).json({
          success: false,
          message: "Resident ID already exists.",
        });
      }
    }

    const resident = await Resident.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "fullName email role");

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resident updated successfully.",
      data: resident,
    });
  } catch (error) {
    console.error("Update Resident Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating resident.",
    });
  }
};

// ================= DELETE RESIDENT =================

exports.deleteResident = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resident ID.",
      });
    }

    const resident = await Resident.findByIdAndDelete(id);

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resident deleted successfully.",
      data: resident,
    });
  } catch (error) {
    console.error("Delete Resident Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting resident.",
    });
  }
};