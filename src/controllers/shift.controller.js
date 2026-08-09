const mongoose = require("mongoose");
const Shift = require("../models/Shift");
const Resident = require("../models/Resident");
const User = require("../models/User");

// ================= CREATE SHIFT =================

exports.createShift = async (req, res) => {
  try {
    const {
      caregiver,
      shiftDate,
      shiftType,
      startTime,
      endTime,
      assignedResidents,
      status,
      notes,
    } = req.body;

    if (
      !caregiver ||
      !shiftDate ||
      !shiftType ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        success: false,
        message:
          "caregiver, shiftDate, shiftType, startTime and endTime are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(caregiver)) {
      return res.status(400).json({
        success: false,
        message: "Invalid caregiver ID.",
      });
    }

    const caregiverExists = await User.findById(caregiver);

    if (!caregiverExists) {
      return res.status(404).json({
        success: false,
        message: "Caregiver not found.",
      });
    }

    if (assignedResidents && !Array.isArray(assignedResidents)) {
      return res.status(400).json({
        success: false,
        message: "assignedResidents must be an array.",
      });
    }

    if (assignedResidents) {
      for (const residentId of assignedResidents) {
        if (!mongoose.Types.ObjectId.isValid(residentId)) {
          return res.status(400).json({
            success: false,
            message: `Invalid resident ID: ${residentId}`,
          });
        }

        const residentExists = await Resident.findById(residentId);

        if (!residentExists) {
          return res.status(404).json({
            success: false,
            message: `Resident not found: ${residentId}`,
          });
        }
      }
    }

    const shift = await Shift.create({
      caregiver,
      shiftDate,
      shiftType,
      startTime,
      endTime,
      assignedResidents,
      status,
      notes,
      createdBy: req.user._id,
    });

    const populatedShift = await Shift.findById(shift._id)
      .populate("caregiver", "fullName email role")
      .populate(
        "assignedResidents",
        "residentId firstName lastName roomNumber status"
      )
      .populate("createdBy", "fullName email role");

    return res.status(201).json({
      success: true,
      message: "Shift created successfully.",
      data: populatedShift,
    });
  } catch (error) {
    console.error("Create Shift Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating shift.",
    });
  }
};

// ================= GET ALL SHIFTS =================

exports.getAllShifts = async (req, res) => {
  try {
    const shifts = await Shift.find()
      .populate("caregiver", "fullName email role")
      .populate(
        "assignedResidents",
        "residentId firstName lastName roomNumber status"
      )
      .populate("createdBy", "fullName email role")
      .sort({ shiftDate: -1 });

    return res.status(200).json({
      success: true,
      count: shifts.length,
      data: shifts,
    });
  } catch (error) {
    console.error("Get Shifts Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching shifts.",
    });
  }
};

// ================= GET SHIFT BY ID =================

exports.getShiftById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shift ID.",
      });
    }

    const shift = await Shift.findById(id)
      .populate("caregiver", "fullName email role")
      .populate(
        "assignedResidents",
        "residentId firstName lastName roomNumber status"
      )
      .populate("createdBy", "fullName email role");

    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "Shift not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: shift,
    });
  } catch (error) {
    console.error("Get Shift Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching shift.",
    });
  }
};

// ================= GET SHIFTS BY CAREGIVER =================

exports.getShiftsByCaregiver = async (req, res) => {
  try {
    const { caregiverId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(caregiverId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid caregiver ID.",
      });
    }

    const caregiverExists = await User.findById(caregiverId);

    if (!caregiverExists) {
      return res.status(404).json({
        success: false,
        message: "Caregiver not found.",
      });
    }

    const shifts = await Shift.find({
      caregiver: caregiverId,
    })
      .populate("caregiver", "fullName email role")
      .populate(
        "assignedResidents",
        "residentId firstName lastName roomNumber status"
      )
      .populate("createdBy", "fullName email role")
      .sort({ shiftDate: -1 });

    return res.status(200).json({
      success: true,
      count: shifts.length,
      data: shifts,
    });
  } catch (error) {
    console.error("Get Caregiver Shifts Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching caregiver shifts.",
    });
  }
};

// ================= UPDATE SHIFT =================

exports.updateShift = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shift ID.",
      });
    }

    const allowedFields = [
      "caregiver",
      "shiftDate",
      "shiftType",
      "startTime",
      "endTime",
      "assignedResidents",
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

    if (updateData.caregiver) {
      if (!mongoose.Types.ObjectId.isValid(updateData.caregiver)) {
        return res.status(400).json({
          success: false,
          message: "Invalid caregiver ID.",
        });
      }

      const caregiverExists = await User.findById(updateData.caregiver);

      if (!caregiverExists) {
        return res.status(404).json({
          success: false,
          message: "Caregiver not found.",
        });
      }
    }

    if (updateData.assignedResidents) {
      if (!Array.isArray(updateData.assignedResidents)) {
        return res.status(400).json({
          success: false,
          message: "assignedResidents must be an array.",
        });
      }

      for (const residentId of updateData.assignedResidents) {
        if (!mongoose.Types.ObjectId.isValid(residentId)) {
          return res.status(400).json({
            success: false,
            message: `Invalid resident ID: ${residentId}`,
          });
        }

        const residentExists = await Resident.findById(residentId);

        if (!residentExists) {
          return res.status(404).json({
            success: false,
            message: `Resident not found: ${residentId}`,
          });
        }
      }
    }

    const shift = await Shift.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("caregiver", "fullName email role")
      .populate(
        "assignedResidents",
        "residentId firstName lastName roomNumber status"
      )
      .populate("createdBy", "fullName email role");

    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "Shift not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Shift updated successfully.",
      data: shift,
    });
  } catch (error) {
    console.error("Update Shift Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating shift.",
    });
  }
};

// ================= DELETE SHIFT =================

exports.deleteShift = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shift ID.",
      });
    }

    const shift = await Shift.findByIdAndDelete(id);

    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "Shift not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Shift deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Shift Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting shift.",
    });
  }
};