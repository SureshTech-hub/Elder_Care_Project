const mongoose = require("mongoose");
const Activity = require("../models/Activity");
const Resident = require("../models/Resident");
const User = require("../models/User");

// ================= CREATE ACTIVITY =================

exports.createActivity = async (req, res) => {
  try {
    const {
      resident,
      activityName,
      description,
      activityType,
      scheduledDate,
      duration,
      assignedCaregiver,
      status,
      notes,
    } = req.body;

    if (!resident || !activityName || !scheduledDate) {
      return res.status(400).json({
        success: false,
        message:
          "resident, activityName and scheduledDate are required.",
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

    if (assignedCaregiver) {
      if (!mongoose.Types.ObjectId.isValid(assignedCaregiver)) {
        return res.status(400).json({
          success: false,
          message: "Invalid caregiver ID.",
        });
      }

      const caregiverExists = await User.findById(assignedCaregiver);

      if (!caregiverExists) {
        return res.status(404).json({
          success: false,
          message: "Assigned caregiver not found.",
        });
      }
    }

    const activity = await Activity.create({
      resident,
      activityName,
      description,
      activityType,
      scheduledDate,
      duration,
      assignedCaregiver,
      status,
      notes,
      createdBy: req.user._id,
    });

    const populatedActivity = await Activity.findById(activity._id)
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("assignedCaregiver", "fullName email role")
      .populate("createdBy", "fullName email role");

    return res.status(201).json({
      success: true,
      message: "Activity created successfully.",
      data: populatedActivity,
    });
  } catch (error) {
    console.error("Create Activity Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating activity.",
    });
  }
};

// ================= GET ALL ACTIVITIES =================

exports.getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("assignedCaregiver", "fullName email role")
      .populate("createdBy", "fullName email role")
      .sort({ scheduledDate: 1 });

    return res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    console.error("Get Activities Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching activities.",
    });
  }
};

// ================= GET ACTIVITY BY ID =================

exports.getActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid activity ID.",
      });
    }

    const activity = await Activity.findById(id)
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("assignedCaregiver", "fullName email role")
      .populate("createdBy", "fullName email role");

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error("Get Activity Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching activity.",
    });
  }
};

// ================= GET ACTIVITIES BY RESIDENT =================

exports.getActivitiesByResident = async (req, res) => {
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

    const activities = await Activity.find({
      resident: residentId,
    })
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("assignedCaregiver", "fullName email role")
      .populate("createdBy", "fullName email role")
      .sort({ scheduledDate: 1 });

    return res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    console.error("Get Resident Activities Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching resident activities.",
    });
  }
};

// ================= UPDATE ACTIVITY =================

exports.updateActivity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid activity ID.",
      });
    }

    const allowedFields = [
      "resident",
      "activityName",
      "description",
      "activityType",
      "scheduledDate",
      "duration",
      "assignedCaregiver",
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

    if (updateData.assignedCaregiver) {
      if (!mongoose.Types.ObjectId.isValid(updateData.assignedCaregiver)) {
        return res.status(400).json({
          success: false,
          message: "Invalid caregiver ID.",
        });
      }

      const caregiverExists = await User.findById(
        updateData.assignedCaregiver
      );

      if (!caregiverExists) {
        return res.status(404).json({
          success: false,
          message: "Assigned caregiver not found.",
        });
      }
    }

    const activity = await Activity.findByIdAndUpdate(
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
      .populate("assignedCaregiver", "fullName email role")
      .populate("createdBy", "fullName email role");

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Activity updated successfully.",
      data: activity,
    });
  } catch (error) {
    console.error("Update Activity Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating activity.",
    });
  }
};

// ================= DELETE ACTIVITY =================

exports.deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid activity ID.",
      });
    }

    const activity = await Activity.findByIdAndDelete(id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Activity deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Activity Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting activity.",
    });
  }
};