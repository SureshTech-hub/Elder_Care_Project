const mongoose = require("mongoose");
const Incident = require("../models/Incident");
const Resident = require("../models/Resident");
const User = require("../models/User");

// ================= CREATE INCIDENT =================

exports.createIncident = async (req, res) => {
  try {
    const {
      resident,
      incidentType,
      title,
      description,
      incidentDate,
      severity,
      location,
      assignedTo,
      status,
      actionTaken,
      notes,
    } = req.body;

    if (
      !resident ||
      !incidentType ||
      !title ||
      !description ||
      !incidentDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "resident, incidentType, title, description and incidentDate are required.",
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

    const incident = await Incident.create({
      resident,
      incidentType,
      title,
      description,
      incidentDate,
      severity,
      location,
      reportedBy: req.user._id,
      assignedTo,
      status,
      actionTaken,
      notes,
    });

    const populatedIncident = await Incident.findById(incident._id)
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("reportedBy", "fullName email role")
      .populate("assignedTo", "fullName email role");

    return res.status(201).json({
      success: true,
      message: "Incident reported successfully.",
      data: populatedIncident,
    });
  } catch (error) {
    console.error("Create Incident Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating incident.",
    });
  }
};

// ================= GET ALL INCIDENTS =================

exports.getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find()
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("reportedBy", "fullName email role")
      .populate("assignedTo", "fullName email role")
      .sort({ incidentDate: -1 });

    return res.status(200).json({
      success: true,
      count: incidents.length,
      data: incidents,
    });
  } catch (error) {
    console.error("Get Incidents Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching incidents.",
    });
  }
};

// ================= GET INCIDENT BY ID =================

exports.getIncidentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid incident ID.",
      });
    }

    const incident = await Incident.findById(id)
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("reportedBy", "fullName email role")
      .populate("assignedTo", "fullName email role");

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    console.error("Get Incident Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching incident.",
    });
  }
};

// ================= GET INCIDENTS BY RESIDENT =================

exports.getIncidentsByResident = async (req, res) => {
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

    const incidents = await Incident.find({
      resident: residentId,
    })
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("reportedBy", "fullName email role")
      .populate("assignedTo", "fullName email role")
      .sort({ incidentDate: -1 });

    return res.status(200).json({
      success: true,
      count: incidents.length,
      data: incidents,
    });
  } catch (error) {
    console.error("Get Resident Incidents Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching resident incidents.",
    });
  }
};

// ================= UPDATE INCIDENT =================

exports.updateIncident = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid incident ID.",
      });
    }

    const allowedFields = [
      "resident",
      "incidentType",
      "title",
      "description",
      "incidentDate",
      "severity",
      "location",
      "assignedTo",
      "status",
      "actionTaken",
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

    if (
      updateData.status === "RESOLVED" ||
      updateData.status === "CLOSED"
    ) {
      updateData.resolvedAt = new Date();
    }

    const incident = await Incident.findByIdAndUpdate(
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
      .populate("reportedBy", "fullName email role")
      .populate("assignedTo", "fullName email role");

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Incident updated successfully.",
      data: incident,
    });
  } catch (error) {
    console.error("Update Incident Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating incident.",
    });
  }
};

// ================= DELETE INCIDENT =================

exports.deleteIncident = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid incident ID.",
      });
    }

    const incident = await Incident.findByIdAndDelete(id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Incident deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Incident Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting incident.",
    });
  }
};