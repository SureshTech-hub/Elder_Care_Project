const mongoose = require("mongoose");
const Prediction = require("../models/Prediction");
const Resident = require("../models/Resident");

exports.createPrediction = async (req, res) => {
  try {
    const {
      resident,
      predictionType,
      riskLevel,
      probability,
      score,
      explanation,
      recommendations,
      inputData,
      modelVersion,
    } = req.body;

    if (!resident || !predictionType || !riskLevel) {
      return res.status(400).json({
        success: false,
        message:
          "resident, predictionType and riskLevel are required.",
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

    const prediction = await Prediction.create({
      resident,
      predictionType,
      riskLevel,
      probability,
      score,
      explanation,
      recommendations,
      inputData,
      modelVersion,
    });

    const result = await Prediction.findById(prediction._id)
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("reviewedBy", "fullName email role");

    res.status(201).json({
      success: true,
      message: "Prediction created successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Create Prediction Error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating prediction.",
    });
  }
};

exports.getAllPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find()
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("reviewedBy", "fullName email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: predictions.length,
      data: predictions,
    });
  } catch (error) {
    console.error("Get Predictions Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching predictions.",
    });
  }
};

exports.getPredictionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid prediction ID.",
      });
    }

    const prediction = await Prediction.findById(id)
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("reviewedBy", "fullName email role");

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: "Prediction not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: prediction,
    });
  } catch (error) {
    console.error("Get Prediction Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching prediction.",
    });
  }
};

exports.getPredictionsByResident = async (req, res) => {
  try {
    const { residentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(residentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resident ID.",
      });
    }

    const predictions = await Prediction.find({
      resident: residentId,
    })
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: predictions.length,
      data: predictions,
    });
  } catch (error) {
    console.error("Resident Predictions Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching resident predictions.",
    });
  }
};

exports.updatePrediction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid prediction ID.",
      });
    }

    const prediction = await Prediction.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("reviewedBy", "fullName email role");

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: "Prediction not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Prediction updated successfully.",
      data: prediction,
    });
  } catch (error) {
    console.error("Update Prediction Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating prediction.",
    });
  }
};

exports.deletePrediction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid prediction ID.",
      });
    }

    const prediction = await Prediction.findByIdAndDelete(id);

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: "Prediction not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Prediction deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Prediction Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while deleting prediction.",
    });
  }
};