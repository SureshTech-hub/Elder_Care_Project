const mongoose = require("mongoose");
const CarePlan = require("../models/CarePlan");
const Resident = require("../models/Resident");
const User = require("../models/User");

// ================= CREATE CARE PLAN =================

exports.createCarePlan = async (req, res) => {
  try {
    const {
      resident,
      title,
      description,
      goals,
      interventions,
      startDate,
      endDate,
      reviewDate,
      status,
      priority,
      assignedCaregiver,
    } = req.body;

    if (!resident || !title || !description || !startDate) {
      return res.status(400).json({
        success: false,
        message:
          "resident, title, description and startDate are required.",
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

    if (
      assignedCaregiver &&
      !mongoose.Types.ObjectId.isValid(assignedCaregiver)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid caregiver ID.",
      });
    }

    if (assignedCaregiver) {
      const caregiverExists = await User.findById(assignedCaregiver);

      if (!caregiverExists) {
        return res.status(404).json({
          success: false,
          message: "Assigned caregiver not found.",
        });
      }
    }

    const carePlan = await CarePlan.create({
      resident,
      title,
      description,
      goals,
      interventions,
      startDate,
      endDate,
      reviewDate,
      status,
      priority,
      assignedCaregiver,
      createdBy: req.user._id,
    });

    const populatedCarePlan = await CarePlan.findById(carePlan._id)
      .populate("resident", "residentId firstName lastName roomNumber status")
      .populate("assignedCaregiver", "fullName email role")
      .populate("createdBy", "fullName email role");

    return res.status(201).json({
      success: true,
      message: "Care plan created successfully.",
      data: populatedCarePlan,
    });
  } catch (error) {
    console.error("Create Care Plan Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating care plan.",
    });
  }
};

// ================= GET ALL CARE PLANS =================

exports.getAllCarePlans = async (req, res) => {
  try {
    const carePlans = await CarePlan.find()
      .populate("resident", "residentId firstName lastName roomNumber status")
      .populate("assignedCaregiver", "fullName email role")
      .populate("createdBy", "fullName email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: carePlans.length,
      data: carePlans,
    });
  } catch (error) {
    console.error("Get Care Plans Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching care plans.",
    });
  }
};

// ================= GET CARE PLAN BY ID =================

exports.getCarePlanById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid care plan ID.",
      });
    }

    const carePlan = await CarePlan.findById(id)
      .populate("resident", "residentId firstName lastName roomNumber status")
      .populate("assignedCaregiver", "fullName email role")
      .populate("createdBy", "fullName email role");

    if (!carePlan) {
      return res.status(404).json({
        success: false,
        message: "Care plan not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: carePlan,
    });
  } catch (error) {
    console.error("Get Care Plan Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching care plan.",
    });
  }
};

// ================= GET CARE PLANS BY RESIDENT =================

exports.getCarePlansByResident = async (req, res) => {
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

    const carePlans = await CarePlan.find({
      resident: residentId,
    })
      .populate("resident", "residentId firstName lastName roomNumber status")
      .populate("assignedCaregiver", "fullName email role")
      .populate("createdBy", "fullName email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: carePlans.length,
      data: carePlans,
    });
  } catch (error) {
    console.error("Get Resident Care Plans Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching resident care plans.",
    });
  }
};

// ================= UPDATE CARE PLAN =================

exports.updateCarePlan = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid care plan ID.",
      });
    }

    const allowedFields = [
      "resident",
      "title",
      "description",
      "goals",
      "interventions",
      "startDate",
      "endDate",
      "reviewDate",
      "status",
      "priority",
      "assignedCaregiver",
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

    const carePlan = await CarePlan.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("resident", "residentId firstName lastName roomNumber status")
      .populate("assignedCaregiver", "fullName email role")
      .populate("createdBy", "fullName email role");

    if (!carePlan) {
      return res.status(404).json({
        success: false,
        message: "Care plan not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Care plan updated successfully.",
      data: carePlan,
    });
  } catch (error) {
    console.error("Update Care Plan Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating care plan.",
    });
  }
};

// ================= DELETE CARE PLAN =================

exports.deleteCarePlan = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid care plan ID.",
      });
    }

    const carePlan = await CarePlan.findByIdAndDelete(id);

    if (!carePlan) {
      return res.status(404).json({
        success: false,
        message: "Care plan not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Care plan deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Care Plan Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting care plan.",
    });
  }
};