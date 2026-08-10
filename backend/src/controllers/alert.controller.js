const mongoose = require("mongoose");
const Alert = require("../models/Alert");
const Resident = require("../models/Resident");
const User = require("../models/User");

// ================= CREATE ALERT =================

exports.createAlert = async (req, res) => {
  try {
    const {
      resident,
      alertType,
      title,
      message,
      severity,
      status,
      source,
      assignedTo,
      metadata,
    } = req.body;

    if (!resident || !alertType || !title || !message) {
      return res.status(400).json({
        success: false,
        message:
          "resident, alertType, title and message are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(resident)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resident ID.",
      });
    }

    const residentExists = await Resident.findById(resident);

    if (!residentExists) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    if (assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        return res.status(400).json({
          success: false,
          message: "Invalid assigned user ID.",
        });
      }

      const userExists = await User.findById(assignedTo);

      if (!userExists) {
        return res.status(404).json({
          success: false,
          message: "Assigned user not found.",
        });
      }
    }

    const alert = await Alert.create({
      resident,
      alertType,
      title,
      message,
      severity,
      status,
      source,
      assignedTo,
      metadata,
      createdBy: req.user._id,
    });

    const populatedAlert = await Alert.findById(alert._id)
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("assignedTo", "fullName email role")
      .populate("createdBy", "fullName email role");

    return res.status(201).json({
      success: true,
      message: "Alert created successfully.",
      data: populatedAlert,
    });
  } catch (error) {
    console.error("Create Alert Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating alert.",
    });
  }
};

// ================= GET ALL ALERTS =================

exports.getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("assignedTo", "fullName email role")
      .populate("acknowledgedBy", "fullName email role")
      .populate("createdBy", "fullName email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    console.error("Get Alerts Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching alerts.",
    });
  }
};

// ================= GET ALERT BY ID =================

exports.getAlertById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid alert ID.",
      });
    }

    const alert = await Alert.findById(id)
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("assignedTo", "fullName email role")
      .populate("acknowledgedBy", "fullName email role")
      .populate("createdBy", "fullName email role");

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: alert,
    });
  } catch (error) {
    console.error("Get Alert Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching alert.",
    });
  }
};

// ================= GET ALERTS BY RESIDENT =================

exports.getAlertsByResident = async (req, res) => {
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

    const alerts = await Alert.find({
      resident: residentId,
    })
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("assignedTo", "fullName email role")
      .populate("acknowledgedBy", "fullName email role")
      .populate("createdBy", "fullName email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    console.error("Get Resident Alerts Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching resident alerts.",
    });
  }
};

// ================= UPDATE ALERT =================

exports.updateAlert = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid alert ID.",
      });
    }

    const allowedFields = [
      "resident",
      "alertType",
      "title",
      "message",
      "severity",
      "status",
      "source",
      "assignedTo",
      "metadata",
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

    if (updateData.assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(updateData.assignedTo)) {
        return res.status(400).json({
          success: false,
          message: "Invalid assigned user ID.",
        });
      }

      const userExists = await User.findById(updateData.assignedTo);

      if (!userExists) {
        return res.status(404).json({
          success: false,
          message: "Assigned user not found.",
        });
      }
    }

    if (updateData.status === "ACKNOWLEDGED") {
      updateData.acknowledgedBy = req.user._id;
      updateData.acknowledgedAt = new Date();
    }

    if (
      updateData.status === "RESOLVED" ||
      updateData.status === "DISMISSED"
    ) {
      updateData.resolvedAt = new Date();
    }

    const alert = await Alert.findByIdAndUpdate(
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
      .populate("assignedTo", "fullName email role")
      .populate("acknowledgedBy", "fullName email role")
      .populate("createdBy", "fullName email role");

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Alert updated successfully.",
      data: alert,
    });
  } catch (error) {
    console.error("Update Alert Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating alert.",
    });
  }
};

// ================= DELETE ALERT =================

exports.deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid alert ID.",
      });
    }

    const alert = await Alert.findByIdAndDelete(id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Alert deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Alert Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting alert.",
    });
  }
};